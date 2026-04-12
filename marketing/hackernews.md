# CodeNeat — Hacker News Submission

---

## Show HN Post

**Title:** Show HN: CodeNeat – 8 Developer Tools That Process Everything in Your Browser

**URL:** https://codeneat.dev

**Body:**

I built CodeNeat because I got uncomfortable with how online developer tools handle data.

A few months ago I was debugging a production issue and pasted a JSON config file into an online formatter. Halfway through, I realized the config contained database credentials and API keys. I opened DevTools and watched the Network tab — sure enough, my entire input had been POST-ed to the site's server. I checked several other popular tools. Same pattern. The input gets sent to a remote server for processing, even for operations that are trivially done in the browser.

CodeNeat is a set of 8 developer tools (JSON Formatter, Base64 Encode/Decode, URL Encode/Decode, Regex Tester, Diff Checker, JWT Decoder, SQL Formatter, Hash Generator) where all processing happens client-side. There are no API calls for tool operations. No WebSocket connections. No data leaves the browser. You can verify this by opening DevTools on any tool page — the Network tab will show zero processing requests.

The tool logic lives in pure TypeScript functions under `lib/tools/`. The UI calls these functions directly. There is no server endpoint that receives user input. The only network requests are for static assets, fonts, and optional analytics.

It is free, open source (GitHub: https://github.com/Ahnhyeongkyu/codeneat), and works offline after the first page load. No account required.

I would appreciate feedback on the tools themselves, the UX, and whether the privacy-first approach resonates. Happy to answer questions about the architecture.

---

## First Comment (by maker)

**Text:**

Some technical details for those interested:

**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui. Deployed on Vercel.

**How privacy works:** Each tool's processing logic is a pure function in `lib/tools/` (e.g., `json.ts`, `base64.ts`). These functions are imported and called directly in client components. There is no `fetch()`, no `XMLHttpRequest`, no `WebSocket` — nothing that sends your input anywhere. The separation is strict: `lib/tools/` contains zero imports of any networking module.

To verify: open any tool page, open DevTools Network tab, filter by Fetch/XHR, and use the tool. You will see zero requests. Alternatively, disconnect from the internet after the page loads — every tool continues to work.

**What each tool does:**
- JSON Formatter: format, validate, tree view, minify, syntax highlighting
- Base64: encode/decode text and files
- URL Encode/Decode: full Unicode support
- Regex Tester: real-time matching, capture groups, flags
- Diff Checker: side-by-side comparison with line-level highlighting
- JWT Decoder: header/payload/signature inspection, expiration check
- SQL Formatter: multi-dialect support (MySQL, PostgreSQL, SQLite, etc.)
- Hash Generator: MD5, SHA-1, SHA-256, SHA-512

**What is next:** I am working on a Chrome extension that brings these tools into the browser toolbar for even faster access. The core logic is already written and portable.

**Known limitations:** The AI-powered explanation feature (optional, Pro tier) does make a server call to Claude — this is clearly labeled in the UI and is the only feature that contacts a server. All 8 core tools are fully client-side.

Would love to hear if there are other developer tools you wish had a privacy-first alternative.
