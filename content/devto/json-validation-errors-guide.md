---
title: "The Complete Guide to JSON Syntax Errors (With Examples and Fixes)"
published: false
description: "Seven common JSON syntax errors that trip up every developer, with clear before/after examples and JavaScript fixes for each one."
tags: javascript, webdev, beginners, tutorial
canonical_url: https://codeneat.dev/blog/fix-unexpected-token-json-parse-error
cover_image: https://codeneat.dev/api/og?title=The+Complete+Guide+to+JSON+Syntax+Errors
---

If you've ever stared at `Unexpected token ... in JSON at position ...` and had no idea what went wrong, this guide is for you.

JSON looks simple — and it is. But its strictness catches developers off guard constantly. Unlike JavaScript objects, JSON has zero tolerance for syntax shortcuts. One wrong character and the entire document fails to parse.

Here are the 7 most common JSON syntax errors, why they happen, and how to fix each one.

## Error 1: Trailing Commas

**The single most common JSON error.** You'll hit this one more than all others combined.

**Broken:**

```json
{
  "name": "Alice",
  "age": 30,
  "role": "developer",
}
```

**The error:**

```
SyntaxError: Unexpected token } in JSON at position 56
```

**Why it happens:** JavaScript objects and arrays happily accept trailing commas. JSON does not. When you copy an object literal from your code into a `.json` file or an API request body, that trailing comma comes along for the ride.

**Fixed:**

```json
{
  "name": "Alice",
  "age": 30,
  "role": "developer"
}
```

**JavaScript detection and fix:**

```javascript
// Quick fix: strip trailing commas before parsing
function removeTrailingCommas(jsonString) {
  return jsonString.replace(/,\s*([\]}])/g, '$1');
}

const cleaned = removeTrailingCommas('{"a": 1, "b": 2,}');
const parsed = JSON.parse(cleaned);
```

Arrays have the same issue:

```json
// BROKEN
["red", "green", "blue",]

// FIXED
["red", "green", "blue"]
```

## Error 2: Single Quotes Instead of Double Quotes

**Broken:**

```json
{
  'name': 'Alice',
  'active': true
}
```

**The error:**

```
SyntaxError: Unexpected token ' in JSON at position 4
```

**Why it happens:** JavaScript allows single quotes, backticks, and double quotes for strings. JSON only allows double quotes. Period. This is defined in [RFC 8259](https://tools.ietf.org/html/rfc8259) and there are no exceptions.

**Fixed:**

```json
{
  "name": "Alice",
  "active": true
}
```

**JavaScript detection and fix:**

```javascript
// Replace single-quoted keys and values with double quotes
// WARNING: This is a naive approach — use a proper parser for production
function singleToDoubleQuotes(str) {
  return str.replace(/'/g, '"');
}

// Better approach: use JSON5 for lenient parsing
// npm install json5
const JSON5 = require('json5');
const parsed = JSON5.parse("{'name': 'Alice'}");
// => { name: "Alice" }
```

## Error 3: Unquoted Keys

**Broken:**

```json
{
  name: "Alice",
  age: 30
}
```

**The error:**

```
SyntaxError: Unexpected token n in JSON at position 4
```

**Why it happens:** JavaScript object literals allow unquoted keys when the key is a valid identifier. JSON requires every key to be a double-quoted string — no exceptions, even for simple alphanumeric keys.

**Fixed:**

```json
{
  "name": "Alice",
  "age": 30
}
```

**JavaScript tip:** If you're generating JSON from code, always use `JSON.stringify()` rather than constructing strings manually. It handles quoting automatically:

```javascript
const obj = { name: "Alice", age: 30 };
const json = JSON.stringify(obj, null, 2);
// Produces valid JSON with double-quoted keys every time
```

## Error 4: Comments in JSON

**Broken:**

```json
{
  // Database settings
  "host": "localhost",
  "port": 5432, /* default PostgreSQL port */
  "database": "myapp"
}
```

**The error:**

```
SyntaxError: Unexpected token / in JSON at position 4
```

**Why it happens:** Standard JSON (RFC 8259) has no comment syntax at all. No `//`, no `/* */`, no `#`. This is an intentional design choice by Douglas Crockford — JSON is a data format, not a configuration language.

**Fixed (option A — remove comments):**

```json
{
  "host": "localhost",
  "port": 5432,
  "database": "myapp"
}
```

**Fixed (option B — use a format that supports comments):**

If you genuinely need comments in your config files, consider these alternatives:

- **JSONC** (JSON with Comments) — used by VS Code's `settings.json`, TypeScript's `tsconfig.json`
- **JSON5** — superset of JSON that supports comments, trailing commas, and more
- **YAML** — full comment support with `#`

**JavaScript strip-and-parse:**

```javascript
// Strip single-line and multi-line comments from a JSON string
function stripJsonComments(str) {
  return str
    .replace(/\/\/.*$/gm, '')        // Remove // comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove /* */ comments
    .replace(/,\s*([\]}])/g, '$1');   // Clean up any resulting trailing commas
}

const raw = `{
  // server config
  "host": "localhost",
  "port": 5432
}`;

const parsed = JSON.parse(stripJsonComments(raw));
```

## Error 5: undefined, NaN, and Infinity

**Broken:**

```json
{
  "name": "Alice",
  "middleName": undefined,
  "score": NaN,
  "limit": Infinity
}
```

**The error:**

```
SyntaxError: Unexpected token u in JSON at position 32
```

**Why it happens:** `undefined`, `NaN`, `Infinity`, and `-Infinity` are JavaScript-specific values. They have no representation in JSON. The only valid JSON values are: strings, numbers (finite), booleans (`true`/`false`), `null`, objects, and arrays.

**Fixed:**

```json
{
  "name": "Alice",
  "middleName": null,
  "score": null,
  "limit": null
}
```

**JavaScript handling with `JSON.stringify` replacer:**

```javascript
const data = {
  name: "Alice",
  middleName: undefined,
  score: NaN,
  limit: Infinity
};

// Default behavior: undefined properties are SILENTLY DROPPED
JSON.stringify(data);
// => '{"name":"Alice","score":null,"limit":null}'
// Note: middleName is gone entirely, NaN and Infinity become null

// Custom replacer for explicit control:
const safe = JSON.stringify(data, (key, value) => {
  if (value === undefined) return null;
  if (typeof value === 'number' && !isFinite(value)) return null;
  return value;
}, 2);
```

Watch out: `JSON.stringify()` silently drops `undefined` properties rather than converting them to `null`. This catches people off guard when they expect round-trip consistency.

## Error 6: BOM (Byte Order Mark) Characters

**Broken (invisible!):**

The JSON looks perfectly valid in your editor:

```json
{"name": "Alice", "age": 30}
```

But parsing fails with:

```
SyntaxError: Unexpected token ﻿ in JSON at position 0
```

**Why it happens:** Some text editors (notably older versions of Notepad on Windows, and some Excel CSV exports) prepend an invisible UTF-8 BOM character (`\uFEFF`) to files. It's invisible in most editors but causes `JSON.parse()` to choke because the first character isn't `{` or `[` — it's a zero-width no-break space.

**How to detect it:**

```javascript
const raw = fs.readFileSync('data.json', 'utf8');
console.log(raw.charCodeAt(0)); // 65279 = BOM is present
console.log(raw[0] === '\uFEFF'); // true
```

**JavaScript fix:**

```javascript
function stripBOM(str) {
  return str.charCodeAt(0) === 0xFEFF ? str.slice(1) : str;
}

const raw = fs.readFileSync('data.json', 'utf8');
const parsed = JSON.parse(stripBOM(raw));
```

**Prevention:** Configure your editor to save files without BOM. In VS Code, check the encoding indicator in the bottom status bar — it should say "UTF-8", not "UTF-8 with BOM".

## Error 7: Missing or Mismatched Brackets

**Broken:**

```json
{
  "users": [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25}
}
```

**The error:**

```
SyntaxError: Unexpected token } in JSON at position 79
```

**Why it happens:** The `users` array was opened with `[` but never closed with `]`. In deeply nested JSON documents — especially those with hundreds of lines — it's easy to lose track of bracket pairs. A single missing bracket or brace invalidates the entire document.

**Fixed:**

```json
{
  "users": [
    {"name": "Alice", "age": 30},
    {"name": "Bob", "age": 25}
  ]
}
```

**How to find the problem:**

The error position (`at position 79`) tells you where the parser gave up, but the actual mistake is usually earlier in the document. Here's a systematic approach:

```javascript
function findBracketMismatch(jsonString) {
  const stack = [];
  const pairs = { '{': '}', '[': ']' };

  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString[i];
    if (char === '{' || char === '[') {
      stack.push({ char, position: i });
    } else if (char === '}' || char === ']') {
      const last = stack.pop();
      if (!last) {
        console.log(`Extra closing '${char}' at position ${i}`);
        return;
      }
      if (pairs[last.char] !== char) {
        console.log(`Mismatch: '${last.char}' at ${last.position} closed by '${char}' at ${i}`);
        return;
      }
    }
  }

  if (stack.length > 0) {
    const unclosed = stack.pop();
    console.log(`Unclosed '${unclosed.char}' at position ${unclosed.position}`);
  }
}
```

## A Defensive Parsing Pattern

In production code, you should never call `JSON.parse()` without error handling. Here's a robust pattern:

```javascript
function safeJsonParse(raw) {
  // Step 1: Strip BOM if present
  const cleaned = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;

  // Step 2: Attempt parse
  try {
    return { data: JSON.parse(cleaned), error: null };
  } catch (err) {
    return {
      data: null,
      error: {
        message: err.message,
        // Extract position from error message
        position: parseInt(err.message.match(/position (\d+)/)?.[1] ?? '-1', 10),
      },
    };
  }
}

// Usage
const result = safeJsonParse(userInput);
if (result.error) {
  console.error(`Parse error at position ${result.error.position}: ${result.error.message}`);
} else {
  console.log(result.data);
}
```

## Quick Reference: JSON vs JavaScript Objects

| Feature | JavaScript Object | JSON |
|---|---|---|
| Trailing commas | Allowed | **Not allowed** |
| Single quotes | Allowed | **Not allowed** |
| Unquoted keys | Allowed (identifiers) | **Not allowed** |
| Comments | Allowed | **Not allowed** |
| `undefined` | Allowed | **Not allowed** |
| `NaN` / `Infinity` | Allowed | **Not allowed** |
| Functions as values | Allowed | **Not allowed** |
| Key order | Preserved (mostly) | Preserved (mostly) |

## Stop Guessing, Start Validating

The fastest way to debug JSON issues is to use a proper validator that pinpoints the exact error location and suggests fixes.

**Validate your JSON instantly at [codeneat.dev/json-formatter](https://codeneat.dev/json-formatter)** — it highlights syntax errors inline, shows the exact position of the problem, and runs entirely in your browser so your data stays private.
