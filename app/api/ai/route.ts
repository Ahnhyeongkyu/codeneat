import Anthropic from "@anthropic-ai/sdk";
import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rate-limit";
import { getRedis } from "@/lib/redis";
import { sha256 } from "@/lib/crypto";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const MAX_INPUT_CHARS = 5000;
const CACHE_TTL = 3600; // 1 hour

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
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

  base64Encoder: `You are a developer tools expert explaining Base64 encoded/decoded content.

Rules:
- Analyze the decoded content: identify its format (plain text, JSON, HTML, binary data, image data URI, etc.).
- Explain what the content likely represents and its typical use case.
- If the content appears to be from a known format (JWT payload, API key, certificate, etc.), mention it.
- Explain Base64 encoding characteristics: padding (=), URL-safe variants, size increase (~33%).
- Point out any issues: invalid characters, incorrect padding, corrupted data.
- Keep the response concise (under 250 words).
- Respond in English.`,

  urlEncoder: `You are a web developer expert explaining URL encoding and URL structures.

Rules:
- Analyze the URL or text: identify protocol, hostname, path, query parameters, fragment.
- Explain which characters are percent-encoded and why (reserved vs unreserved characters).
- Describe each query parameter and what it likely controls.
- Explain the difference between encodeURIComponent (component) and encodeURI (full URL) if relevant.
- Point out potential issues: double encoding, missing encoding, unsafe characters.
- If the URL appears to be from a known API or service, mention it.
- Keep the response concise (under 250 words).
- Respond in English.`,

  diffChecker: `You are a code review expert summarizing text differences.

Rules:
- Summarize the key differences between the original and modified text.
- Group related changes together (e.g., "variable renames", "added error handling", "removed comments").
- If the text appears to be code, identify the programming language and describe changes in context.
- Quantify changes: how many lines added, removed, modified.
- Point out potentially significant changes: logic changes, API modifications, security implications.
- If the changes appear to be a refactoring, describe the pattern.
- Keep the response concise (under 300 words).
- Respond in English.`,

  hashGenerator: `You are a cryptography and security expert explaining hash algorithms and results.

Rules:
- Explain the chosen hash algorithm: output size, security status, common use cases.
- For MD5/SHA-1: warn that they are cryptographically broken and explain why.
- For SHA-256/384/512: confirm they are secure and explain their use cases (TLS, Bitcoin, code signing, etc.).
- Explain the hash output: format (hex), length, uniqueness properties.
- Recommend the appropriate algorithm based on the use case (checksums, security, passwords).
- If the input appears to be a password, strongly recommend using bcrypt/Argon2 instead.
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
  base64Encoder: (input) =>
    `Analyze this Base64 content:\n\n\`\`\`\n${input}\n\`\`\``,
  urlEncoder: (input) =>
    `Analyze this URL or encoded text:\n\n\`\`\`\n${input}\n\`\`\``,
  diffChecker: (input) =>
    `Summarize the differences between these two texts:\n\n${input}`,
  hashGenerator: (input) =>
    `Explain this hash result:\n\n\`\`\`\n${input}\n\`\`\``,
};

// ---------------------------------------------------------------------------
// Locale-aware response language
// ---------------------------------------------------------------------------
const LOCALE_INSTRUCTIONS: Record<string, string> = {
  en: "Respond in English.",
  ko: "Respond in Korean (한국어로 응답하세요).",
  ja: "Respond in Japanese (日本語で回答してください).",
  zh: "Respond in Simplified Chinese (请用简体中文回答).",
  es: "Respond in Spanish (Responde en español).",
};

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI service not configured" }, { status: 503 });
  }

  let body: { tool: string; input: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { tool, input, locale } = body;

  if (!tool || !SYSTEM_PROMPTS[tool]) {
    return Response.json({ error: "Invalid tool" }, { status: 400 });
  }

  if (!input || typeof input !== "string" || !input.trim()) {
    return Response.json({ error: "Input is required" }, { status: 400 });
  }

  // Check Pro status from middleware-injected header
  const isPro = req.headers.get("x-codeneat-pro") === "true";

  const ip = getClientIp(req);
  const { allowed, remaining } = await checkRateLimit(ip, isPro);
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

  // --- Cache check ---
  const redis = getRedis();
  const lang = locale || "en";
  let cacheKey = "";

  if (redis) {
    const inputHash = await sha256(truncatedInput + lang);
    cacheKey = `cache:ai:${tool}:${inputHash}`;

    const cached = await redis.get<string>(cacheKey);
    if (cached) {
      return new Response(cached, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "X-RateLimit-Remaining": String(remaining),
          "X-Cache": "HIT",
        },
      });
    }
  }

  // --- Stream from Claude ---
  const anthropic = new Anthropic({ apiKey });
  const localeInstruction = LOCALE_INSTRUCTIONS[lang] || LOCALE_INSTRUCTIONS.en;
  const systemPrompt = SYSTEM_PROMPTS[tool].replace("Respond in English.", localeInstruction);

  try {
    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [
        { role: "user", content: USER_PROMPT_TEMPLATES[tool](truncatedInput) },
      ],
    });

    let accumulated = "";

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              accumulated += event.delta.text;
              controller.enqueue(new TextEncoder().encode(event.delta.text));
            }
          }
          controller.close();

          // Cache the complete response
          if (redis && cacheKey && accumulated) {
            await redis.set(cacheKey, accumulated, { ex: CACHE_TTL }).catch(() => {});
          }
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
        "X-Cache": "MISS",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
