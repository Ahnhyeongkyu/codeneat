export interface RegexMatch {
  match: string;
  index: number;
  length: number;
  groups: { name: string; value: string }[];
}

export interface RegexResult {
  matches: RegexMatch[];
  error: string | null;
}

const MAX_MATCHES = 1000;
const MATCH_TIMEOUT_MS = 3000;

export interface ReplaceResult {
  output: string;
  count: number;
  error: string | null;
}

export function replaceWithRegex(
  pattern: string,
  testString: string,
  flags: string,
  replacement: string
): ReplaceResult {
  if (!pattern || !testString) {
    return { output: "", count: 0, error: null };
  }
  try {
    const regex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
    let count = 0;
    const output = testString.replace(regex, (...args) => {
      count++;
      // Support $1, $2, named groups $<name> via native replace
      return replacement.replace(/\$(\d+)/g, (_, n) => args[Number(n)] ?? "")
        .replace(/\$<(\w+)>/g, (_, name) => {
          const groups = args[args.length - 1];
          return typeof groups === "object" && groups !== null ? (groups[name] ?? "") : "";
        });
    });
    return { output, count, error: null };
  } catch (e) {
    return { output: "", count: 0, error: e instanceof Error ? e.message : String(e) };
  }
}

export function testRegex(
  pattern: string,
  testString: string,
  flags: string = "g"
): RegexResult {
  if (!pattern || !testString) {
    return { matches: [], error: null };
  }

  try {
    const hasGlobal = flags.includes("g");
    const regex = new RegExp(pattern, hasGlobal ? flags : flags + "g");
    const matches: RegexMatch[] = [];
    const startTime = performance.now();

    let match: RegExpExecArray | null;
    while ((match = regex.exec(testString)) !== null) {
      // ReDoS protection: timeout after 3 seconds
      if (performance.now() - startTime > MATCH_TIMEOUT_MS) {
        return {
          matches,
          error: `Matching timed out after ${MATCH_TIMEOUT_MS / 1000}s. The pattern may be too complex (catastrophic backtracking).`,
        };
      }

      // Limit total matches to prevent memory issues
      if (matches.length >= MAX_MATCHES) {
        return {
          matches,
          error: `Stopped after ${MAX_MATCHES} matches. Use a more specific pattern.`,
        };
      }

      const groups: { name: string; value: string }[] = [];
      if (match.groups) {
        for (const [name, value] of Object.entries(match.groups)) {
          groups.push({ name, value: value ?? "" });
        }
      }
      // Capture numbered groups (1+)
      for (let i = 1; i < match.length; i++) {
        groups.push({ name: `Group ${i}`, value: match[i] ?? "" });
      }

      matches.push({
        match: match[0],
        index: match.index,
        length: match[0].length,
        groups,
      });

      if (match[0].length === 0) {
        regex.lastIndex++;
      }
    }

    return { matches, error: null };
  } catch (e) {
    return { matches: [], error: e instanceof Error ? e.message : String(e) };
  }
}

export const REGEX_CHEAT_SHEET = [
  { category: "Characters", items: [
    { pattern: ".", description: "Any character except newline" },
    { pattern: "\\d", description: "Digit (0-9)" },
    { pattern: "\\D", description: "Not a digit" },
    { pattern: "\\w", description: "Word character (a-z, A-Z, 0-9, _)" },
    { pattern: "\\W", description: "Not a word character" },
    { pattern: "\\s", description: "Whitespace" },
    { pattern: "\\S", description: "Not whitespace" },
  ]},
  { category: "Anchors", items: [
    { pattern: "^", description: "Start of string" },
    { pattern: "$", description: "End of string" },
    { pattern: "\\b", description: "Word boundary" },
  ]},
  { category: "Quantifiers", items: [
    { pattern: "*", description: "0 or more" },
    { pattern: "+", description: "1 or more" },
    { pattern: "?", description: "0 or 1" },
    { pattern: "{n}", description: "Exactly n" },
    { pattern: "{n,m}", description: "Between n and m" },
  ]},
  { category: "Groups", items: [
    { pattern: "(abc)", description: "Capture group" },
    { pattern: "(?:abc)", description: "Non-capture group" },
    { pattern: "(?<name>abc)", description: "Named group" },
    { pattern: "a|b", description: "Alternation (or)" },
  ]},
] as const;
