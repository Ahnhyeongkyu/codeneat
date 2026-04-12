# CodeNeat — Awesome List PR Templates

---

## PR for awesome-json

**PR Title:**
Add CodeNeat JSON Formatter — privacy-first, client-side

**PR Description:**

This PR adds CodeNeat JSON Formatter to the list.

CodeNeat is a free, open-source JSON formatter and viewer that processes everything 100% in the browser. Unlike most online JSON tools that send input to a server for processing, CodeNeat uses pure client-side JavaScript — no data ever leaves the user's machine.

Features: format, validate, minify, tree view, syntax highlighting. Built with Next.js and TypeScript.

- Website: https://codeneat.dev/json-formatter
- GitHub: https://github.com/Ahnhyeongkyu/codeneat (MIT license)
- Privacy: zero network requests for tool processing (verifiable via DevTools)

**Line to add:**

```markdown
* [CodeNeat JSON Formatter](https://codeneat.dev/json-formatter) - Privacy-first JSON formatter, validator, and viewer. 100% client-side processing — your data never leaves the browser. Open source.
```

**Why it fits:**
It is a JSON-specific tool that is free, open source, and actively maintained. The privacy-first approach (full client-side processing) differentiates it from other JSON tools in the list. Many existing entries in awesome-json are server-based tools.

---

## PR for awesome-regex

**PR Title:**
Add CodeNeat Regex Tester — client-side, privacy-first

**PR Description:**

Adding CodeNeat Regex Tester — a free online regex tool that runs entirely in the browser with no server-side processing.

Features: real-time matching, capture group highlighting, flag controls, and match explanations. Your test strings and patterns never leave your machine.

- Website: https://codeneat.dev/regex-tester
- GitHub: https://github.com/Ahnhyeongkyu/codeneat (MIT license)

**Line to add:**

```markdown
* [CodeNeat Regex Tester](https://codeneat.dev/regex-tester) - Privacy-first regex tester with real-time matching and capture group highlighting. 100% client-side. Open source.
```

---

## PR for awesome-devtools

**PR Title:**
Add CodeNeat — 8 privacy-first developer tools (client-side)

**PR Description:**

Adding CodeNeat, a collection of 8 developer tools that process everything in the browser with zero server requests.

Tools: JSON Formatter, Base64 Encode/Decode, URL Encode/Decode, Regex Tester, Diff Checker, JWT Decoder, SQL Formatter, Hash Generator.

The key differentiator is privacy: all processing is client-side. No data leaves the browser. Verifiable via DevTools Network tab. Free, open source, works offline.

- Website: https://codeneat.dev
- GitHub: https://github.com/Ahnhyeongkyu/codeneat (MIT license)

**Line to add:**

```markdown
* [CodeNeat](https://codeneat.dev) - 8 privacy-first developer tools (JSON Formatter, Base64, Regex, Diff, JWT, SQL, Hash). 100% client-side processing. Open source.
```

---

## PR for awesome-sql

**PR Title:**
Add CodeNeat SQL Formatter — client-side, privacy-first

**PR Description:**

Adding CodeNeat SQL Formatter — a free online SQL formatting tool that runs entirely in the browser. No SQL queries are sent to any server.

This matters for SQL specifically because queries often contain table names, column names, and business logic that reveal database architecture. Client-side processing ensures none of that data is exposed.

Features: multi-dialect support (MySQL, PostgreSQL, SQLite, etc.), customizable formatting options. Open source and free.

- Website: https://codeneat.dev/sql-formatter
- GitHub: https://github.com/Ahnhyeongkyu/codeneat (MIT license)

**Line to add:**

```markdown
* [CodeNeat SQL Formatter](https://codeneat.dev/sql-formatter) - Privacy-first SQL formatter with multi-dialect support. 100% client-side — your queries never leave the browser. Open source.
```

---

## General Tips for Submitting

1. Read the contributing guidelines of each repo before submitting
2. Follow the existing format exactly (alphabetical order, dash style, description length)
3. Ensure the link works and the repo has recent commits
4. One tool per PR — do not bundle multiple additions
5. Be concise in the PR description — maintainers review dozens of these
