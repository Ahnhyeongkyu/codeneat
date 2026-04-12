# CodeNeat — Twitter/X Launch Content

---

## Single Launch Tweet (280 chars max)

```
Every time you paste code into an online JSON formatter, it gets sent to their server. I built CodeNeat — 8 developer tools that run 100% in your browser. Your code never leaves your machine. Free and open source. https://codeneat.dev
```

(267 characters)

---

## Launch Thread (10 tweets)

### Tweet 1 — Hook

```
Open your browser DevTools. Go to any online JSON formatter. Paste some text and watch the Network tab. You will see your input sent to an external server. Every. Single. Time. This is a thread about why that matters and what I built to fix it. (1/10)
```

[IMAGE: Screen recording or screenshot of DevTools Network tab showing POST requests on a popular formatter site, with the request payload visible]

### Tweet 2 — The Risk

```
Developers paste sensitive data into online tools daily: API keys in JSON configs, credentials in Base64 strings, business logic in SQL queries, auth tokens in JWT decoders. Most of these tools process your input on their servers. That data gets logged, cached, and stored. (2/10)
```

### Tweet 3 — The Scale

```
The top online developer tool sites get 20M+ monthly visits. That is millions of developers sending potentially sensitive code to third-party servers every month. Not a theoretical risk — a structural one baked into how these tools work. (3/10)
```

### Tweet 4 — The Solution

```
I built CodeNeat — 8 developer tools that process everything 100% in your browser. No fetch() calls. No server processing. No data transmission. Open DevTools on codeneat.dev and verify for yourself. Zero network requests for any tool operation. (4/10)
```

[IMAGE: Screenshot of CodeNeat homepage showing the tool grid with the privacy badge visible]

### Tweet 5 — JSON Formatter

```
The JSON Formatter handles large files with syntax highlighting, tree view, and validation. Format your production configs without worrying about embedded API keys reaching someone else's server. https://codeneat.dev/json-formatter (5/10)
```

[IMAGE: Screenshot of JSON Formatter with a sample JSON file being formatted, showing the tree view]

### Tweet 6 — JWT Decoder + Regex Tester

```
JWT Decoder: inspect tokens — header, payload, expiration — without sending the token anywhere. Regex Tester: real-time matching with capture groups. Your test strings containing real data stay on your machine. https://codeneat.dev/jwt-decoder (6/10)
```

[IMAGE: Split screenshot showing JWT Decoder with a decoded token and Regex Tester with highlighted matches]

### Tweet 7 — Diff Checker + SQL Formatter

```
Diff Checker: compare code side-by-side. Useful for reviewing config changes that contain secrets. SQL Formatter: beautify queries without exposing your schema and table names. Both 100% client-side. https://codeneat.dev/diff-checker (7/10)
```

### Tweet 8 — How It Works

```
The architecture is simple: all tool logic runs as pure JavaScript functions in the browser. No API endpoints for processing. No WebSocket connections. The only server requests are for page assets. Verify by reading the source — it is open source. (8/10)
```

### Tweet 9 — Open Source + Free

```
CodeNeat is open source (MIT) and free. No account required. Works offline after first load. Built with Next.js, TypeScript, and Tailwind CSS. Dark mode included. GitHub: https://github.com/Ahnhyeongkyu/codeneat (9/10)
```

[IMAGE: Screenshot of the GitHub repository page showing the README and star count]

### Tweet 10 — CTA

```
If you use online developer tools, try CodeNeat: https://codeneat.dev 8 tools. Zero server requests. Your code stays yours. If it is useful, a GitHub star helps others find it: https://github.com/Ahnhyeongkyu/codeneat (10/10)
```
