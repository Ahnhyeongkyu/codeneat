# CodeNeat — Marketing Copy

---

## Section 1: Hero

### Headline

**Your code is being sent to external servers right now.**

Every time you paste JSON into an online formatter, encode a string with Base64, or test a regex pattern — most tools silently transmit your data to their servers.

CodeNeat is different. Every tool runs 100% in your browser. Your code never leaves your machine. Not a single byte.

**8 developer tools. Zero server requests. Complete privacy.**

[Try CodeNeat now — no sign-up required](https://codeneat.dev)

---

## Section 2: The Problem

### Did you know?

Most online developer tools process your input on their servers. When you paste code into a typical JSON formatter or Base64 encoder, here is what actually happens:

1. Your input is sent via HTTP request to a remote server
2. The server processes it and sends the result back
3. Your data may be logged, cached, or stored — you have no way to verify

This means every time you format a JSON config file, you may be exposing:

- **API keys and secrets** embedded in configuration files
- **Database credentials** in connection strings
- **Authentication tokens** including JWTs with user data
- **Proprietary business logic** in SQL queries and code snippets
- **Internal URLs and endpoints** that reveal your infrastructure

Open your browser DevTools on any popular formatting site. Watch the Network tab. You will see POST requests carrying your entire input to external servers. Some tools even send data to third-party analytics services before you click a single button.

The market for online developer tools is massive — the leading sites attract tens of millions of monthly visitors. That volume of sensitive developer data flowing through third-party servers is a real risk, not a theoretical one.

**You would not paste your production database credentials into a random website's contact form. Why do it with a JSON formatter?**

---

## Section 3: The 8 Tools

Every tool below runs entirely in your browser using client-side JavaScript. Open DevTools, watch the Network tab — you will see zero requests to any processing server.

### JSON Formatter & Viewer
Format, validate, and explore JSON with syntax highlighting and tree view. Handles large files without sending a single character to any server.

### Base64 Encode/Decode
Encode and decode Base64 strings instantly. Supports text and file input. No server round-trip means no latency and no exposure.

### URL Encode/Decode
Encode and decode URL components with full Unicode support. Process sensitive URLs containing tokens and credentials safely.

### Regex Tester
Write, test, and debug regular expressions with real-time matching, capture group highlighting, and match explanations. Your test strings stay local.

### Diff Checker
Compare two blocks of text with a clear side-by-side diff view. Compare proprietary code, configs, or credentials without leaking them.

### JWT Decoder
Decode and inspect JSON Web Tokens — header, payload, and signature. See expiration times and claims without exposing the token to any external service.

### SQL Formatter
Format and beautify SQL queries with support for multiple dialects. Your database queries — which often contain table names, schemas, and business logic — never leave your browser.

### Hash Generator
Generate MD5, SHA-1, SHA-256, and SHA-512 hashes. Useful for integrity checks and password hashing verification, all computed locally.

---

## Section 4: Why Developers Trust CodeNeat

### Open Source
The entire codebase is public on GitHub. Read every line. Verify that no data leaves your browser. Fork it, audit it, contribute to it.
[github.com/Ahnhyeongkyu/codeneat](https://github.com/Ahnhyeongkyu/codeneat)

### No Account Required
No sign-up. No email. No tracking cookies for tool usage. Open the site and start working.

### Works Offline
Once loaded, every tool functions without an internet connection. Disconnect your WiFi and confirm for yourself.

### Modern Tech Stack
Built with Next.js, TypeScript, and Tailwind CSS. Fast load times, dark mode, responsive design, keyboard shortcuts. Tools that feel native.

### Free for Everyone
All 8 core tools are free with no usage limits. No freemium walls on basic functionality.

---

## Section 5: Get Started

### Try it now
No sign-up. No download. Just open [codeneat.dev](https://codeneat.dev) and start formatting.

### Star on GitHub
If you find CodeNeat useful, a star on GitHub helps other developers discover it.
[github.com/Ahnhyeongkyu/codeneat](https://github.com/Ahnhyeongkyu/codeneat)

### Share with your team
Know a developer who pastes API keys into online formatters? Send them CodeNeat. Privacy is a team concern.
