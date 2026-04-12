---
title: I Built 8 Developer Tools That Never See Your Code
published: true
description: Most online developer tools send your input to external servers. I built privacy-first alternatives that run 100% in the browser.
tags: webdev, javascript, privacy, tools
cover_image:
---

# I Built 8 Developer Tools That Never See Your Code

## The Moment I Realized the Problem

A few months ago, I was debugging a production issue at midnight. I had a large JSON config file that was not parsing correctly. I did what every developer does — I opened the first Google result for "json formatter online" and pasted my config.

Then it hit me. That config contained database connection strings, API keys, and internal service URLs. I opened DevTools and checked the Network tab.

Sure enough: a POST request carrying my entire input to the site's server. The response came back with the formatted result. My production credentials had just traveled across the internet to a server I knew nothing about.

I checked three more popular formatting sites. Same pattern. Every one of them sent the input to their backend for processing.

## This Is Not a Theoretical Risk

Think about what developers paste into online tools on a daily basis:

- **JSON files** containing API keys, database credentials, and service configurations
- **Base64 strings** that encode authentication tokens and binary data
- **SQL queries** revealing table names, column structures, and business logic
- **JWTs** containing user identities, roles, and session data
- **Regex patterns** tested against real production data
- **Code diffs** showing proprietary source code changes

The leading online developer tool sites handle tens of millions of visits per month. That is an enormous volume of sensitive developer data flowing through third-party servers every day.

And here is the thing: **none of these operations require a server.** JSON formatting, Base64 encoding, URL encoding, regex matching, text diffing, JWT decoding, SQL formatting, hash generation — all of these can be done entirely in the browser with JavaScript. There is no technical reason for server-side processing.

## So I Built CodeNeat

[CodeNeat](https://codeneat.dev) is a set of 8 developer tools where every operation runs 100% in your browser. No data is ever sent to any server for processing.

### The 8 Tools

**1. [JSON Formatter & Viewer](https://codeneat.dev/json-formatter)**
Format, validate, minify, and explore JSON with syntax highlighting and an interactive tree view. Handles large files smoothly.

**2. [Base64 Encode/Decode](https://codeneat.dev/base64-encode-decode)**
Encode and decode Base64 strings with support for text and file input. Instant results with zero latency since there is no server round-trip.

**3. [URL Encode/Decode](https://codeneat.dev/url-encode-decode)**
Full Unicode support for URL component encoding and decoding. Safe for processing URLs that contain tokens and credentials.

**4. [Regex Tester](https://codeneat.dev/regex-tester)**
Real-time pattern matching with capture group highlighting, flag controls, and match explanations. Test against real data without it leaving your machine.

**5. [Diff Checker](https://codeneat.dev/diff-checker)**
Side-by-side text comparison with line-level highlighting. Compare config files, code changes, and credential-containing files privately.

**6. [JWT Decoder](https://codeneat.dev/jwt-decoder)**
Decode and inspect JWTs — header, payload, signature, and expiration time. Critical for tokens that contain user data and permissions.

**7. [SQL Formatter](https://codeneat.dev/sql-formatter)**
Beautify SQL queries with multi-dialect support. Your queries — which often reveal schema design and business logic — never leave the browser.

**8. [Hash Generator](https://codeneat.dev/hash-generator)**
Generate MD5, SHA-1, SHA-256, and SHA-512 hashes. All computation happens locally using the Web Crypto API.

## How It Works (The Technical Part)

The architecture is straightforward. Each tool's processing logic is a pure TypeScript function in the `lib/tools/` directory:

```typescript
// lib/tools/json.ts — simplified example
export function formatJson(input: string, indent: number = 2): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}
```

```typescript
// lib/tools/base64.ts — simplified example
export function encodeBase64(input: string): string {
  return btoa(unescape(encodeURIComponent(input)));
}

export function decodeBase64(input: string): string {
  return decodeURIComponent(escape(atob(input)));
}
```

These functions are imported directly into React client components and called on user input. There is no `fetch()`. No `XMLHttpRequest`. No `WebSocket`. No server endpoint that receives your data.

```typescript
// In the client component
import { formatJson } from '@/lib/tools/json';

function handleFormat() {
  try {
    const result = formatJson(input, indentSize);
    setOutput(result);
  } catch (e) {
    setError(e instanceof Error ? e.message : String(e));
  }
}
```

The separation is strict: the `lib/tools/` directory contains pure functions with zero imports from any networking or server module.

## How to Verify

You do not need to trust my word. Here is how to verify for yourself:

### Method 1: DevTools Network Tab
1. Open any tool on [codeneat.dev](https://codeneat.dev)
2. Open DevTools (F12) and go to the Network tab
3. Filter by "Fetch/XHR"
4. Use the tool — paste input, click format, encode, decode
5. Observe: zero processing requests

### Method 2: Offline Test
1. Load any tool page on CodeNeat
2. Disconnect from the internet (airplane mode or unplug)
3. Use the tool
4. It works. Because the processing never needed a server.

### Method 3: Read the Source
The entire codebase is open source:
[github.com/Ahnhyeongkyu/codeneat](https://github.com/Ahnhyeongkyu/codeneat)

Search for `fetch(` in the `lib/tools/` directory. You will find zero results.

## Why Not Just Use VS Code Extensions?

Valid question. VS Code extensions are also local. But there are situations where a browser tool is more practical:

- You are on a machine where you cannot install extensions (corporate laptop, shared workstation, CI terminal)
- You need to quickly check something without switching context from the browser
- You are reviewing code in a PR and need to decode a JWT or format JSON inline
- You want to share a tool with a non-VS Code user

CodeNeat fills the gap between "install a local tool" and "paste into a random website."

## The Stack

For those interested in the technical choices:

- **Framework:** Next.js 16 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **i18n:** next-intl (English, Korean, Japanese, Chinese, Spanish)
- **Deployment:** Vercel
- **License:** MIT

## What Is Next

I am building a Chrome extension that brings these tools into the browser toolbar. The core logic is already written as pure functions, so it ports directly. The extension will make it even faster to access these tools without navigating to a website.

## Try It

CodeNeat is free and requires no account. Open [codeneat.dev](https://codeneat.dev) and try any tool.

If you find it useful:
- [Star on GitHub](https://github.com/Ahnhyeongkyu/codeneat) to help others discover it
- Share it with developers on your team who handle sensitive data
- Open an issue if you find a bug or want to request a feature

Your code should stay yours. That is not a feature — it should be the default.
