import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Rate limiting (in-memory, resets on cold start — acceptable for MVP)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const DAILY_LIMIT = 10;
const MAX_INPUT_CHARS = 5000;

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: DAILY_LIMIT - entry.count };
}

// ---------------------------------------------------------------------------
// Tool-specific system prompts
// ---------------------------------------------------------------------------
const SYSTEM_PROMPTS: Record<string, string> = {
  jsonFormatter: `You are a senior software engineer explaining JSON data structures to developers.

Rules:
- Analyze the JSON structure: identify top-level keys, nesting depth, data types, and patterns.
- Explain what each key likely represents based on naming conventions.
- Point out any potential issues: missing fields, inconsistent types, unusual nesting.
- If the JSON appears to be from a known API (e.g., GitHub, Stripe, AWS), mention it.
- Keep the response concise (under 300 words).
- Use plain language. Avoid jargon unless the user's JSON is technical.
- Do not reproduce the input JSON. Refer to keys by name.
- Respond in English.`,

  regexTester: `You are a regex expert explaining regular expressions to developers.

Rules:
- Break down the regex into components: character classes, quantifiers, anchors, groups, lookaheads/lookbehinds.
- Explain what the overall pattern matches in plain English.
- Provide 2-3 example strings that would match and 1-2 that would not.
- Point out any potential issues: catastrophic backtracking, overly greedy patterns, missing anchors.
- If flags are relevant (g, i, m, s), explain their effect.
- Keep the response concise (under 250 words).
- Respond in English.`,

  sqlFormatter: `You are a database expert explaining SQL queries to developers.

Rules:
- Explain what the query does step by step: which tables, what joins, what filters, what aggregations.
- Identify the query type: SELECT, INSERT, UPDATE, DELETE, DDL, etc.
- Point out potential performance concerns: missing indexes, Cartesian joins, SELECT *, N+1 patterns.
- Suggest improvements if obvious (e.g., adding WHERE clause, using EXISTS instead of IN for large sets).
- Do not rewrite the query. Focus on explaining the existing logic.
- Keep the response concise (under 300 words).
- Respond in English.`,

  jwtDecoder: `You are a security engineer explaining JWT token claims to developers.

Rules:
- Explain each claim in the payload: what it means, what value it has, whether it is a standard (RFC 7519) or custom claim.
- Standard claims to explain: iss, sub, aud, exp, nbf, iat, jti.
- For exp/nbf/iat timestamps, explain the dates in human-readable format.
- Point out security implications: is the token expired? Is the algorithm weak (e.g., "none", HS256 with public key)?
- If the payload contains role/permission claims, explain what access they grant.
- Keep the response concise (under 250 words).
- Respond in English.`,
};

const USER_PROMPT_TEMPLATES: Record<string, (input: string) => string> = {
  jsonFormatter: (input) =>
    `Explain this JSON structure:\n\n\`\`\`json\n${input}\n\`\`\``,
  regexTester: (input) =>
    `Explain this regular expression:\n\n\`${input}\``,
  sqlFormatter: (input) =>
    `Explain this SQL query:\n\n\`\`\`sql\n${input}\n\`\`\``,
  jwtDecoder: (input) =>
    `Explain these JWT claims:\n\n\`\`\`json\n${input}\n\`\`\``,
};

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI service not configured" }, { status: 503 });
  }

  let body: { tool: string; input: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { tool, input } = body;

  if (!tool || !SYSTEM_PROMPTS[tool]) {
    return Response.json({ error: "Invalid tool" }, { status: 400 });
  }

  if (!input || typeof input !== "string" || !input.trim()) {
    return Response.json({ error: "Input is required" }, { status: 400 });
  }

  const ip = getClientIp(req);
  const { allowed, remaining } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Daily limit reached. Upgrade to Pro for unlimited access." },
      { status: 429 },
    );
  }

  const truncatedInput =
    input.length > MAX_INPUT_CHARS
      ? input.slice(0, MAX_INPUT_CHARS) + "\n\n[... truncated to 5000 characters]"
      : input;

  const anthropic = new Anthropic({ apiKey });

  try {
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPTS[tool],
      messages: [
        { role: "user", content: USER_PROMPT_TEMPLATES[tool](truncatedInput) },
      ],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-RateLimit-Remaining": String(remaining),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
