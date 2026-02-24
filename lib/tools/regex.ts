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

    let match: RegExpExecArray | null;
    while ((match = regex.exec(testString)) !== null) {
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
    return { matches: [], error: (e as Error).message };
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
