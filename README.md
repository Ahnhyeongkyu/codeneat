# CodeNeat

**Free, fast, and private developer tools. Everything runs in your browser.**

[codeneat.dev](https://codeneat.dev)

---

## Why CodeNeat?

Most online dev tools send your code to a server. That means your API keys, credentials, and proprietary code could be exposed.

CodeNeat is different:

- **100% Client-Side** — All processing happens in your browser. Zero server requests.
- **No Sign-Up** — Just open and use. No accounts, no tracking.
- **Fast** — Instant results with no server round-trips. Works offline too.
- **Keyboard Shortcuts** — Ctrl+Enter to run any tool.

## Tools

| Tool | Description |
|------|-------------|
| [JSON Formatter](https://codeneat.dev/json-formatter) | Format, validate, and view JSON as tree |
| [Base64 Encode/Decode](https://codeneat.dev/base64-encode-decode) | Encode and decode Base64 with UTF-8 support |
| [URL Encode/Decode](https://codeneat.dev/url-encode-decode) | Percent-encode and decode URL components |
| [Regex Tester](https://codeneat.dev/regex-tester) | Real-time regex matching with cheat sheet |
| [Diff Checker](https://codeneat.dev/diff-checker) | Compare two texts with highlighted diff |
| [JWT Decoder](https://codeneat.dev/jwt-decoder) | Decode JWT tokens and check expiration |
| [SQL Formatter](https://codeneat.dev/sql-formatter) | Format SQL for 7 dialects (MySQL, PostgreSQL, SQLite, etc.) |
| [Hash Generator](https://codeneat.dev/hash-generator) | Generate SHA-1/256/384/512 hashes via Web Crypto API |

## Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router + Turbopack
- [TypeScript 5](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [next-intl](https://next-intl.dev/) — i18n ready
- Web Crypto API — for hash generation (no external crypto libraries)

## Getting Started

```bash
git clone https://github.com/Ahnhyeongkyu/codeneat.git
cd codeneat
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics 4 measurement ID | No |

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

[MIT](LICENSE)
