---
title: "Regex Lookahead and Lookbehind: Patterns Every Developer Should Know"
published: false
description: "Master regex lookaheads and lookbehinds with 5 practical examples you can use today — password validation, price extraction, log parsing, and more."
tags: regex, javascript, tutorial, webdev
canonical_url: https://codeneat.dev/blog/regex-lookahead-lookbehind-examples
cover_image: https://codeneat.dev/api/og?title=Regex+Lookahead+and+Lookbehind+Patterns
---

Lookaheads and lookbehinds are the regex features that separate "I know regex" from "I *know* regex." They let you match patterns based on what comes before or after — without including that context in the match itself.

Once you understand them, problems that seemed impossible with basic regex become straightforward. Let's break them down.

## What Are Lookaheads and Lookbehinds?

Think of regular expressions as a cursor moving through text. Normally, every part of your pattern consumes characters — the cursor advances as it matches. Lookaheads and lookbehinds are different: they **peek** at surrounding text without consuming it. The cursor looks, but doesn't move.

**An analogy:** Imagine you're searching a bookshelf for books with red covers. A normal regex is like pulling each book off the shelf to check it. A lookahead is like glancing at the next book without pulling it out. A lookbehind is like glancing at the previous book. You're gathering information, but you're not removing anything from the shelf.

This "zero-width" property is what makes them powerful. You can assert that certain text exists nearby without including it in your match result.

## The Four Types: A Syntax Reference

| Type | Syntax | Meaning |
|---|---|---|
| Positive Lookahead | `(?=...)` | What follows **must** match |
| Negative Lookahead | `(?!...)` | What follows **must not** match |
| Positive Lookbehind | `(?<=...)` | What precedes **must** match |
| Negative Lookbehind | `(?<!...)` | What precedes **must not** match |

The key to remembering the syntax:

- `=` means positive (it **does** match)
- `!` means negative (it **doesn't** match)
- `<` means look **behind** (to the left)
- No `<` means look **ahead** (to the right)

Now let's put them to work with five real-world examples.

## Example 1: Password Validation

**The problem:** Validate that a password contains at least one uppercase letter, one lowercase letter, one digit, and is at least 8 characters long.

Without lookaheads, you'd need to check each condition separately or write an absurdly complex alternation. With lookaheads, you can stack multiple conditions at the same position:

```javascript
const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

// Test cases
passwordRegex.test('MyPass1234');  // true — has upper, lower, digit, 8+ chars
passwordRegex.test('mypass1234');  // false — no uppercase
passwordRegex.test('MYPASS1234');  // false — no lowercase
passwordRegex.test('MyPassword');  // false — no digit
passwordRegex.test('Mp1');         // false — too short
```

**How it works, step by step:**

1. `^` — Start of string
2. `(?=.*[A-Z])` — Lookahead: somewhere ahead there's an uppercase letter. The cursor doesn't move.
3. `(?=.*[a-z])` — Lookahead: somewhere ahead there's a lowercase letter. Still at position 0.
4. `(?=.*\d)` — Lookahead: somewhere ahead there's a digit. Still at position 0.
5. `.{8,}$` — Now actually consume: match 8 or more of any character to the end.

All three lookaheads fire from the same starting position. They each independently scan the entire string for their condition. Only when all three succeed does the engine proceed to the actual match.

**Adding more rules** is trivial. Need a special character too?

```javascript
const strongPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{10,}$/;
```

## Example 2: Extract Prices Without Currency Symbols

**The problem:** You have text containing prices in various formats and you want to extract just the numeric values, without the currency symbol.

```javascript
const text = 'Products: $49.99, €120.00, £75.50, $1,299.00';

// Positive lookbehind: match numbers preceded by a currency symbol
const priceRegex = /(?<=[$€£])\d[\d,.]*\d/g;

const prices = text.match(priceRegex);
// => ['49.99', '120.00', '75.50', '1,299.00']
```

**How it works:**

- `(?<=[$€£])` — Lookbehind: the position must be preceded by `$`, `€`, or `£`. This symbol is NOT included in the match.
- `\d[\d,.]*\d` — Match digits, possibly with commas and decimal points in between.

The beauty here is that the currency symbols are used to locate the right numbers but aren't captured. Without a lookbehind, you'd need a capture group and an extra extraction step:

```javascript
// Without lookbehind (less clean)
const fallback = /[$€£](\d[\d,.]*\d)/g;
const matches = [...text.matchAll(fallback)].map(m => m[1]);
```

The lookbehind version is more direct and readable.

## Example 3: Match Words NOT Followed by Specific Text

**The problem:** In a codebase, find all uses of `import` that are NOT followed by `type` (you want value imports, not TypeScript type imports).

```javascript
const code = `
import React from 'react';
import type { FC } from 'react';
import { useState } from 'react';
import type { Props } from './types';
import axios from 'axios';
`;

const valueImports = /import(?!\s+type)\s+.+/g;
const matches = code.match(valueImports);
// => [
//   "import React from 'react';",
//   "import { useState } from 'react';",
//   "import axios from 'axios';"
// ]
```

**How it works:**

- `import` — Match the literal text "import"
- `(?!\s+type)` — Negative lookahead: what follows must NOT be whitespace + "type"
- `\s+.+` — Then consume the rest of the import statement

The negative lookahead acts as a filter. It says "yes, I found `import`, but only keep it if `type` doesn't come next."

**Another practical use — excluding test files:**

```javascript
// Match .js files that are NOT test files
const regex = /\w+(?!\.test)\.js/g;

'app.js utils.test.js config.js'.match(regex);
// => ['app.js', 'config.js']
```

## Example 4: Parse Structured Log Files

**The problem:** You're parsing log entries and need to extract the log level, but only from lines that contain an IP address (indicating network-related events).

Sample log:

```
2026-03-01 10:15:32 [ERROR] Connection timeout from 192.168.1.100
2026-03-01 10:15:33 [INFO] Cache cleared successfully
2026-03-01 10:15:34 [WARN] Rate limit approaching for 10.0.0.55
2026-03-01 10:15:35 [DEBUG] Query executed in 42ms
2026-03-01 10:15:36 [ERROR] SSL handshake failed from 172.16.0.200
```

```javascript
const logs = `2026-03-01 10:15:32 [ERROR] Connection timeout from 192.168.1.100
2026-03-01 10:15:33 [INFO] Cache cleared successfully
2026-03-01 10:15:34 [WARN] Rate limit approaching for 10.0.0.55
2026-03-01 10:15:35 [DEBUG] Query executed in 42ms
2026-03-01 10:15:36 [ERROR] SSL handshake failed from 172.16.0.200`;

// Positive lookahead: match log level only if an IP address appears later in the line
const networkLogs = /\[(ERROR|WARN|INFO|DEBUG)\](?=.*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/gm;

const matches = [...logs.matchAll(networkLogs)].map(m => m[1]);
// => ['ERROR', 'WARN', 'ERROR']
```

**How it works:**

- `\[(ERROR|WARN|INFO|DEBUG)\]` — Match the log level in brackets, capturing the level name
- `(?=.*\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})` — Lookahead: somewhere on this line, there's an IP address pattern

Lines without IP addresses (the INFO cache line and the DEBUG query line) are excluded. The lookahead lets you filter on content that appears much later in the line without having to match everything in between.

**Combining with lookbehind to extract the IP itself:**

```javascript
// Extract IPs that appear after the word "from"
const fromIPs = /(?<=from\s)\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g;
logs.match(fromIPs);
// => ['192.168.1.100', '172.16.0.200']
```

## Example 5: Email Username Extraction

**The problem:** Extract the username portion of email addresses (everything before the `@`) from a block of text.

```javascript
const text = `
Contact us:
  - Support: support@codeneat.dev
  - Sales: sales.team@codeneat.dev
  - Bug reports: bugs+tracker@codeneat.dev
`;

// Positive lookahead: match word characters (plus dots, hyphens, and +)
// that are followed by @
const usernameRegex = /[\w.+-]+(?=@)/g;

const usernames = text.match(usernameRegex);
// => ['support', 'sales.team', 'bugs+tracker']
```

**How it works:**

- `[\w.+-]+` — Match one or more word characters, dots, plus signs, or hyphens
- `(?=@)` — Lookahead: this match must be followed by `@`, but don't include `@` in the result

Without the lookahead, you'd match the `@` and then have to strip it:

```javascript
// Without lookahead
const fallback = /([\w.+-]+)@/g;
const matches = [...text.matchAll(fallback)].map(m => m[1]);
```

The lookahead version is cleaner because the match itself is exactly what you want.

**Extracting the domain instead (using lookbehind):**

```javascript
const domainRegex = /(?<=@)[\w.-]+/g;
text.match(domainRegex);
// => ['codeneat.dev', 'codeneat.dev', 'codeneat.dev']
```

## Browser and Engine Support

Lookaheads have been supported everywhere for decades. Lookbehinds are newer — here's the current status:

| Feature | Chrome | Firefox | Safari | Node.js | Edge |
|---|---|---|---|---|---|
| Positive Lookahead `(?=...)` | All versions | All versions | All versions | All versions | All versions |
| Negative Lookahead `(?!...)` | All versions | All versions | All versions | All versions | All versions |
| Positive Lookbehind `(?<=...)` | 62+ | 78+ | 16.4+ | 8.10+ | 79+ |
| Negative Lookbehind `(?<!...)` | 62+ | 78+ | 16.4+ | 8.10+ | 79+ |

**Key takeaway:** As of 2026, lookbehinds are safe to use in all modern browsers. The only concern is if you need to support Safari 16.3 or older (released early 2023). For server-side JavaScript (Node.js), lookbehinds have been available since Node 8.

If you need to support older environments, you can always rewrite lookbehinds using capture groups:

```javascript
// Lookbehind version (modern)
/(?<=\$)\d+/g

// Capture group equivalent (universal)
/\$(\d+)/g  // then use match[1]
```

## Common Pitfalls

**1. Variable-length lookbehinds:** JavaScript supports variable-length lookbehinds, but some regex engines (notably older Python `re` module) don't. If your pattern works in JS but fails elsewhere, this might be why.

**2. Performance with `.*` in lookaheads:** Patterns like `(?=.*something)` cause the engine to scan the entire remaining string. In tight loops or very long strings, stack multiple specific lookaheads rather than using greedy quantifiers.

**3. Forgetting that lookarounds are zero-width:** A common mistake is expecting `(?=foo)bar` to match "foobar". It won't — after the lookahead asserts "foo" is ahead, the cursor is still at the same position, and it tries to match "bar" starting where "foo" starts. You'd want `(?=foo)foobar` or just `foobar`.

## Test Your Patterns Live

Regex is a skill you build by doing. Reading about lookaheads is useful; writing and testing them is where the understanding clicks.

**Test these patterns live at [codeneat.dev/regex-tester](https://codeneat.dev/regex-tester)** — it provides real-time match highlighting, capture group visualization, and runs entirely in your browser so your test data stays private.

Paste any of the examples from this article and experiment. Change the patterns, try different inputs, and build intuition for how lookaheads and lookbehinds actually work.
