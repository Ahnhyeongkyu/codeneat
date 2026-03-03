<div align="center">

# CodeNeat

**Free, privacy-first developer tools. All processing happens in your browser.**

[![Live Site](https://img.shields.io/badge/site-codeneat.dev-059669?style=flat-square)](https://codeneat.dev)
[![Built with Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)](https://github.com/Ahnhyeongkyu/codeneat/pulls)

[Live Demo](https://codeneat.dev) · [Report Bug](https://github.com/Ahnhyeongkyu/codeneat/issues) · [Request Feature](https://github.com/Ahnhyeongkyu/codeneat/issues)

</div>

---

<!-- TODO: Add screenshot or demo GIF here -->
<!-- ![CodeNeat Screenshot](docs/screenshot.png) -->

## Why CodeNeat?

Most online dev tools send your code to a server — exposing API keys, credentials, and proprietary code. CodeNeat processes everything locally in your browser. Nothing leaves your machine.

## Features

- **8 developer tools** — JSON, Base64, URL, Regex, Diff, JWT, SQL, Hash
- **100% client-side** — zero server requests for tool processing, works offline
- **AI-powered explanations** — "Explain with AI" on all 8 tools (Claude Sonnet)
- **Dark mode** — system-aware with manual toggle
- **Keyboard shortcuts** — `Ctrl+Enter` to run any tool
- **5 languages** — English, Korean, Japanese, Chinese, Spanish
- **PWA support** — installable, works offline
- **SEO optimized** — 18 blog posts, JSON-LD structured data, full sitemap
- **Privacy-first** — no tracking, no data collection, client-side only

## Tools

| Tool | Description | Path |
|------|-------------|------|
| **JSON Formatter** | Format, validate, minify, and view JSON as a collapsible tree | `/json-formatter` |
| **Base64 Encode/Decode** | Encode and decode Base64 with full UTF-8 support | `/base64-encode-decode` |
| **URL Encode/Decode** | Percent-encode and decode URL components | `/url-encode-decode` |
| **Regex Tester** | Real-time regex matching with flag support and cheat sheet | `/regex-tester` |
| **Diff Checker** | Side-by-side text comparison with highlighted differences | `/diff-checker` |
| **JWT Decoder** | Decode JWT header and payload, check expiration status | `/jwt-decoder` |
| **SQL Formatter** | Format SQL queries for 7 dialects (MySQL, PostgreSQL, SQLite, etc.) | `/sql-formatter` |
| **Hash Generator** | Generate MD5, SHA-1, SHA-256, SHA-384, SHA-512 hashes via Web Crypto API | `/hash-generator` |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| i18n | [next-intl 4](https://next-intl.dev/) (5 locales) |
| AI | [Anthropic Claude Sonnet](https://www.anthropic.com/) |
| Rate Limiting & Cache | [Upstash Redis](https://upstash.com/) |
| Auth | JWT via [jose](https://github.com/panva/jose) |
| Deployment | [Vercel](https://vercel.com/) |

## Getting Started

```bash
git clone https://github.com/Ahnhyeongkyu/codeneat.git
cd codeneat
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file in the project root:

```env
# Required for AI features
ANTHROPIC_API_KEY=your_anthropic_api_key

# Optional — rate limiting & caching
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token

# Optional — Pro licensing
JWT_SECRET=your_jwt_secret
LEMONSQUEEZY_API_KEY=your_lemon_squeezy_key

# Optional — analytics
NEXT_PUBLIC_GA_ID=your_ga4_measurement_id
```

> All tools work without any environment variables. The AI "Explain" feature requires `ANTHROPIC_API_KEY`.

## Pro Plan

CodeNeat is free and open source. The optional Pro plan removes ads and unlocks unlimited AI explanations:

- **$4.99/month** or **$79 lifetime**
- Unlimited "Explain with AI" requests
- Ad-free experience
- Priority support

Learn more at [codeneat.dev/pricing](https://codeneat.dev/pricing).

## Project Structure

```
app/
  [locale]/              # i18n routing (en, ko, ja, zh, es)
    json-formatter/      # Tool pages
    ...
  api/                   # AI, auth, licensing API routes
components/
  ui/                    # shadcn/ui components
  layout/                # Header, Footer, ThemeToggle
  tool-layout.tsx        # Shared tool page layout
lib/
  tools/                 # Pure functions per tool (json.ts, base64.ts, ...)
messages/
  en.json                # English translations (source of truth)
  ko.json, ja.json, ...  # Other locales
```

## Contributing

Contributions are welcome! Whether it is a bug fix, new tool idea, translation improvement, or documentation update — feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

<div align="center">

**[codeneat.dev](https://codeneat.dev)** — Clean Up Your Code

</div>
