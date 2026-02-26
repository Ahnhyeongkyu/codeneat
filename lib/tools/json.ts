import * as yaml from "js-yaml";

export interface JsonFormatResult {
  output: string;
  error: string | null;
}

export function formatJson(input: string, indent: number | string = 2): JsonFormatResult {
  try {
    if (!input.trim()) {
      return { output: "", error: null };
    }
    const parsed = JSON.parse(input);
    const output = JSON.stringify(parsed, null, indent);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : String(e) };
  }
}

export function minifyJson(input: string): JsonFormatResult {
  try {
    if (!input.trim()) {
      return { output: "", error: null };
    }
    const parsed = JSON.parse(input);
    const output = JSON.stringify(parsed);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : String(e) };
  }
}

export function validateJson(input: string): { valid: boolean; error: string | null } {
  try {
    if (!input.trim()) {
      return { valid: false, error: null };
    }
    JSON.parse(input);
    return { valid: true, error: null };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : String(e) };
  }
}

export type JsonTreeNode =
  | { type: "object"; key: string; children: JsonTreeNode[] }
  | { type: "array"; key: string; length: number; children: JsonTreeNode[] }
  | { type: "string"; key: string; value: string }
  | { type: "number"; key: string; value: number }
  | { type: "boolean"; key: string; value: boolean }
  | { type: "null"; key: string };

export function buildJsonTree(input: string): { tree: JsonTreeNode | null; error: string | null } {
  try {
    if (!input.trim()) {
      return { tree: null, error: null };
    }
    const parsed = JSON.parse(input);
    const tree = buildNode("root", parsed);
    return { tree, error: null };
  } catch (e) {
    return { tree: null, error: e instanceof Error ? e.message : String(e) };
  }
}

const MAX_TREE_DEPTH = 50;

function buildNode(key: string, value: unknown, depth: number = 0): JsonTreeNode {
  if (depth > MAX_TREE_DEPTH) {
    return { type: "string", key, value: "[Max depth exceeded]" };
  }
  if (value === null) {
    return { type: "null", key };
  }
  if (Array.isArray(value)) {
    return {
      type: "array",
      key,
      length: value.length,
      children: value.map((item, i) => buildNode(String(i), item, depth + 1)),
    };
  }
  if (typeof value === "object") {
    return {
      type: "object",
      key,
      children: Object.entries(value as Record<string, unknown>).map(([k, v]) =>
        buildNode(k, v, depth + 1)
      ),
    };
  }
  if (typeof value === "string") {
    return { type: "string", key, value };
  }
  if (typeof value === "number") {
    return { type: "number", key, value };
  }
  if (typeof value === "boolean") {
    return { type: "boolean", key, value };
  }
  return { type: "null", key };
}

// --- Conversion functions ---

export function jsonToYaml(input: string): JsonFormatResult {
  try {
    if (!input.trim()) {
      return { output: "", error: null };
    }
    const parsed = JSON.parse(input);
    const output = yaml.dump(parsed, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      sortKeys: false,
    });
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : String(e) };
  }
}

export function yamlToJson(input: string, indent: number | string = 2): JsonFormatResult {
  try {
    if (!input.trim()) {
      return { output: "", error: null };
    }
    const parsed = yaml.load(input, { schema: yaml.JSON_SCHEMA });
    const output = JSON.stringify(parsed, null, indent);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : String(e) };
  }
}

export function jsonToCsv(input: string): JsonFormatResult {
  try {
    if (!input.trim()) {
      return { output: "", error: null };
    }
    const parsed = JSON.parse(input);

    // Must be an array of objects
    const arr = Array.isArray(parsed) ? parsed : [parsed];
    if (arr.length === 0) {
      return { output: "", error: null };
    }

    // Collect all unique keys as headers
    const headersSet = new Set<string>();
    for (const row of arr) {
      if (typeof row === "object" && row !== null && !Array.isArray(row)) {
        for (const key of Object.keys(row)) {
          headersSet.add(key);
        }
      }
    }
    const headers = Array.from(headersSet);
    if (headers.length === 0) {
      return { output: "", error: "JSON must contain objects with keys to convert to CSV." };
    }

    const escapeCsv = (val: unknown): string => {
      if (val === null || val === undefined) return "";
      const str = typeof val === "object" ? JSON.stringify(val) : String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const lines = [headers.map(escapeCsv).join(",")];
    for (const row of arr) {
      const vals = headers.map((h) =>
        escapeCsv(typeof row === "object" && row !== null ? (row as Record<string, unknown>)[h] : "")
      );
      lines.push(vals.join(","));
    }

    return { output: lines.join("\n"), error: null };
  } catch (e) {
    return { output: "", error: e instanceof Error ? e.message : String(e) };
  }
}

// --- Syntax highlighting ---

export interface HighlightToken {
  type: "key" | "string" | "number" | "boolean" | "null" | "brace" | "plain";
  text: string;
}

export function highlightJson(json: string): HighlightToken[] {
  const tokens: HighlightToken[] = [];
  // Regex to match JSON tokens
  const re = /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b|\b(true|false)\b|\b(null)\b|([{}[\],])/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(json)) !== null) {
    // Capture any whitespace/newlines between tokens
    if (match.index > lastIndex) {
      tokens.push({ type: "plain", text: json.slice(lastIndex, match.index) });
    }

    if (match[1]) {
      if (match[2]) {
        // Key + colon
        tokens.push({ type: "key", text: match[1] });
        tokens.push({ type: "plain", text: match[2] });
      } else {
        // String value
        tokens.push({ type: "string", text: match[1] });
      }
    } else if (match[3]) {
      tokens.push({ type: "number", text: match[3] });
    } else if (match[4]) {
      tokens.push({ type: "boolean", text: match[4] });
    } else if (match[5]) {
      tokens.push({ type: "null", text: match[5] });
    } else if (match[6]) {
      tokens.push({ type: "brace", text: match[6] });
    }

    lastIndex = match.index + match[0].length;
  }

  // Trailing whitespace
  if (lastIndex < json.length) {
    tokens.push({ type: "plain", text: json.slice(lastIndex) });
  }

  return tokens;
}

// --- JSON Path query ---

export interface JsonPathResult {
  output: string;
  matches: unknown[];
  error: string | null;
}

export function queryJsonPath(input: string, path: string): JsonPathResult {
  try {
    if (!input.trim() || !path.trim()) {
      return { output: "", matches: [], error: null };
    }

    const parsed = JSON.parse(input);
    const matches = evaluatePath(parsed, path.trim());
    const output = JSON.stringify(matches.length === 1 ? matches[0] : matches, null, 2);
    return { output, matches, error: null };
  } catch (e) {
    return { output: "", matches: [], error: e instanceof Error ? e.message : String(e) };
  }
}

function evaluatePath(root: unknown, path: string): unknown[] {
  // Remove leading $ or $.
  let expr = path;
  if (expr.startsWith("$.")) expr = expr.slice(2);
  else if (expr.startsWith("$")) expr = expr.slice(1);

  if (!expr) return [root];

  // Tokenize: split by . and [] notation
  const tokens: string[] = [];
  let i = 0;
  while (i < expr.length) {
    if (expr[i] === ".") {
      i++;
    } else if (expr[i] === "[") {
      const end = expr.indexOf("]", i);
      if (end === -1) throw new Error("Unclosed bracket in path");
      tokens.push(expr.slice(i + 1, end).replace(/['"]/g, ""));
      i = end + 1;
    } else {
      let end = i;
      while (end < expr.length && expr[end] !== "." && expr[end] !== "[") end++;
      tokens.push(expr.slice(i, end));
      i = end;
    }
  }

  let current: unknown[] = [root];
  for (const token of tokens) {
    const next: unknown[] = [];
    for (const item of current) {
      if (token === "*") {
        if (Array.isArray(item)) {
          next.push(...item);
        } else if (item !== null && typeof item === "object") {
          next.push(...Object.values(item as Record<string, unknown>));
        }
      } else if (Array.isArray(item)) {
        const idx = Number(token);
        if (!isNaN(idx) && idx >= 0 && idx < item.length) {
          next.push(item[idx]);
        }
      } else if (item !== null && typeof item === "object") {
        const obj = item as Record<string, unknown>;
        if (token in obj) {
          next.push(obj[token]);
        }
      }
    }
    current = next;
    if (current.length === 0) break;
  }

  return current;
}

export const JSON_SAMPLE = `{
  "name": "CodeNeat",
  "version": "1.0.0",
  "description": "Clean Up Your Code",
  "tools": [
    "JSON Formatter",
    "Base64 Encode/Decode",
    "URL Encode/Decode",
    "Regex Tester"
  ],
  "features": {
    "privacyFirst": true,
    "serverless": true,
    "darkMode": true
  },
  "stats": {
    "totalTools": 8,
    "price": 0
  }
}`;
