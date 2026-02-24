export interface JsonFormatResult {
  output: string;
  error: string | null;
}

export function formatJson(input: string, indent: number = 2): JsonFormatResult {
  try {
    if (!input.trim()) {
      return { output: "", error: null };
    }
    const parsed = JSON.parse(input);
    const output = JSON.stringify(parsed, null, indent);
    return { output, error: null };
  } catch (e) {
    return { output: "", error: (e as Error).message };
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
    return { output: "", error: (e as Error).message };
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
    return { valid: false, error: (e as Error).message };
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
    return { tree: null, error: (e as Error).message };
  }
}

function buildNode(key: string, value: unknown): JsonTreeNode {
  if (value === null) {
    return { type: "null", key };
  }
  if (Array.isArray(value)) {
    return {
      type: "array",
      key,
      length: value.length,
      children: value.map((item, i) => buildNode(String(i), item)),
    };
  }
  if (typeof value === "object") {
    return {
      type: "object",
      key,
      children: Object.entries(value as Record<string, unknown>).map(([k, v]) =>
        buildNode(k, v)
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
