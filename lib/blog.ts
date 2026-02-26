export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  tags: string[];
  relatedTool?: string;
  content: string; // HTML content
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "json-formatting-best-practices",
    title: "JSON Formatting Best Practices for Developers",
    description: "Learn how to format, validate, and work with JSON data efficiently. Covers indentation styles, common pitfalls, JSON Path queries, and productivity tips.",
    date: "2026-02-20",
    readTime: "12 min",
    tags: ["JSON", "formatting", "best-practices", "JSON-Path"],
    relatedTool: "jsonFormatter",
    content: `
<p>JSON (JavaScript Object Notation) is the lingua franca of data exchange in modern web development. Whether you're debugging API responses, configuring applications, or working with databases, properly formatted JSON is essential for readability and maintainability.</p>

<p>In this comprehensive guide, we'll cover everything from basic formatting conventions to advanced techniques like JSON Path queries and schema validation — all the knowledge you need to work with JSON like a pro.</p>

<h2>Why Formatting Matters</h2>
<p>Minified JSON is great for network transfer — it reduces payload size by removing whitespace. A 100KB formatted JSON file might shrink to 60KB when minified. But when you need to read or debug it, proper formatting is crucial. A well-formatted JSON document with consistent indentation makes it easy to:</p>
<ul>
<li>Spot missing brackets, braces, or commas at a glance</li>
<li>Navigate deeply nested structures without getting lost</li>
<li>Compare changes between versions in code review</li>
<li>Share readable snippets with team members in pull requests</li>
<li>Identify data types and structure patterns quickly</li>
</ul>

<p>Many production bugs trace back to malformed JSON — a missing comma, an extra bracket, or an unquoted key. Good formatting habits prevent these issues before they reach production.</p>

<h2>Indentation: 2 Spaces vs 4 Spaces vs Tabs</h2>
<p>The three most common indentation styles each have their advocates:</p>

<h3>2 Spaces</h3>
<p>Used by Google, Airbnb, and many JavaScript/TypeScript projects. The compact style keeps deeply nested structures visible without excessive horizontal scrolling. Most npm packages use 2-space indentation in their configuration files.</p>

<h3>4 Spaces</h3>
<p>Popular in the Python community and many enterprise Java projects. The wider indentation makes nesting levels more visually distinct, which helps when working with complex data structures that go 5+ levels deep.</p>

<h3>Tabs</h3>
<p>Less common in JSON specifically, but preferred by some developers for accessibility reasons — users can configure their editor to display tabs at any width they prefer. This is especially helpful for developers with visual impairments who may need wider indentation.</p>

<p>There is no universally "right" answer. Consistency within your project is what matters most. Pick a style, document it in your project's contributing guide, and enforce it with a linter like ESLint or Prettier.</p>

<h2>Common JSON Pitfalls</h2>
<p>Even experienced developers stumble on these JSON quirks, especially when switching between JavaScript object syntax and strict JSON:</p>

<h3>Trailing Commas</h3>
<p>Unlike JavaScript, JSON does not allow trailing commas. <code>{"a": 1, "b": 2,}</code> is invalid and will cause a parse error. This is the single most common JSON syntax error. Many formatters can detect and fix this automatically.</p>

<h3>Single Quotes</h3>
<p>JSON requires double quotes for all strings. <code>{'key': 'value'}</code> is invalid. This trips up developers who copy object literals from JavaScript code, where single quotes are common.</p>

<h3>Comments</h3>
<p>Standard JSON (RFC 8259) does not support comments of any kind — no <code>//</code>, no <code>/* */</code>. If you need comments in configuration files, consider JSONC (JSON with Comments, used by VS Code), JSON5, or YAML instead.</p>

<h3>Unquoted Keys</h3>
<p>All keys must be double-quoted: <code>{"key": "value"}</code>, not <code>{key: "value"}</code>. JavaScript allows unquoted keys in objects, but JSON does not.</p>

<h3>Special Values</h3>
<p>JSON does not support <code>undefined</code>, <code>NaN</code>, <code>Infinity</code>, or <code>-Infinity</code>. Dates must be represented as strings (typically ISO 8601 format). Functions and symbols cannot be serialized. When using <code>JSON.stringify()</code> in JavaScript, properties with <code>undefined</code> values are silently dropped.</p>

<h3>Number Precision</h3>
<p>JSON numbers follow IEEE 754 double-precision floating point. Integers larger than <code>2^53 - 1</code> (9,007,199,254,740,991) lose precision. This commonly affects database IDs — Twitter famously switched to string IDs because of this issue. If you work with large numbers, represent them as strings.</p>

<h2>JSON Path: Querying Nested Data</h2>
<p>When working with large, deeply nested JSON documents, manually navigating to the data you need is tedious. JSON Path provides a query language for extracting specific values — think of it as XPath for JSON.</p>

<h3>Basic Syntax</h3>
<p>JSON Path expressions start with <code>$</code> (the root object) and use dot notation or bracket notation to traverse the structure:</p>
<ul>
<li><code>$.name</code> — Access the top-level "name" property</li>
<li><code>$.users[0]</code> — Access the first element of the "users" array</li>
<li><code>$.users[*].email</code> — Get the "email" field from every user (wildcard)</li>
<li><code>$.config['api-key']</code> — Bracket notation for keys with special characters</li>
<li><code>$.data.items[2].tags[0]</code> — Deep nested access combining dots, arrays, and indices</li>
</ul>

<h3>Practical Use Cases</h3>
<p>JSON Path is invaluable when working with API responses. Imagine you receive a large response from a REST API with hundreds of fields, but you only need the user's email addresses. Instead of scanning through the entire document, a simple <code>$.data.users[*].email</code> query extracts exactly what you need.</p>

<p>It is also useful for configuration validation — quickly checking whether specific nested keys exist and have the expected values, without writing custom parsing code.</p>

<h2>JSON ↔ YAML Conversion</h2>
<p>YAML is a superset of JSON that's popular for configuration files (Kubernetes, Docker Compose, GitHub Actions, CI/CD pipelines). Understanding the relationship between JSON and YAML helps when working across different tooling ecosystems.</p>

<h3>When to Use YAML Over JSON</h3>
<ul>
<li>Human-edited configuration files where readability matters</li>
<li>Files that benefit from comments (YAML supports <code>#</code> comments)</li>
<li>Deeply nested configs where JSON braces become hard to track</li>
<li>Multi-line strings (YAML's <code>|</code> and <code>&gt;</code> operators handle these elegantly)</li>
</ul>

<h3>When to Stick With JSON</h3>
<ul>
<li>API request/response payloads (JSON is the universal standard)</li>
<li>Data interchange between services</li>
<li>Files generated and consumed by machines</li>
<li>When you need strict, unambiguous parsing (YAML's implicit typing can surprise you — <code>yes</code>, <code>no</code>, <code>on</code>, <code>off</code> are parsed as booleans)</li>
</ul>

<h2>JSON ↔ CSV Conversion</h2>
<p>Converting between JSON arrays and CSV is a frequent task when moving data between web APIs and spreadsheet tools like Excel or Google Sheets. Flat JSON arrays convert cleanly, but nested objects require flattening — either by dot-notation keys (<code>address.city</code>) or by serializing nested values as strings.</p>

<p>When converting CSV to JSON, pay attention to data types: CSV treats everything as strings, so you may need to cast numbers and booleans after parsing.</p>

<h2>Working With Large JSON Files</h2>
<p>JSON files from API dumps or data exports can be hundreds of megabytes. Here are strategies for handling them:</p>
<ul>
<li><strong>Stream parsing:</strong> Instead of loading the entire file into memory, use a streaming parser that processes tokens one at a time. In Node.js, libraries like <code>JSONStream</code> or <code>stream-json</code> handle this.</li>
<li><strong>Selective extraction:</strong> Use JSON Path queries to pull out only the fields you need, avoiding the overhead of parsing the entire structure.</li>
<li><strong>Validation first:</strong> Before attempting to work with a large file, validate its syntax. A syntax error at the end of a 500MB file wastes time if you only discover it after processing everything.</li>
<li><strong>Tree view navigation:</strong> A collapsible tree viewer lets you explore structure without rendering the entire document at once.</li>
</ul>

<h2>JSON Schema Validation</h2>
<p>For production applications, validating JSON structure against a schema prevents runtime errors. JSON Schema defines the expected structure, types, required fields, and constraints. Tools like <code>ajv</code> (JavaScript) or <code>jsonschema</code> (Python) can validate at runtime, while IDE extensions provide inline feedback during development.</p>

<p>Key schema features include type checking, required field validation, enum constraints, pattern matching for strings, and conditional schemas. Investing in schema validation pays off quickly — it catches malformed data at system boundaries before it causes downstream issues.</p>

<h2>Try It Yourself</h2>
<p>Use our <a href="/json-formatter">JSON Formatter</a> to format, validate, minify, convert to YAML/CSV, explore with the tree viewer, and query your data with JSON Path — all without sending data to any server. Your data stays in your browser, always.</p>
`,
  },
  {
    slug: "regex-cheat-sheet-2026",
    title: "The Ultimate Regex Cheat Sheet for 2026",
    description: "A comprehensive regular expression reference with examples. Covers character classes, quantifiers, lookaheads, named groups, replace mode, and practical patterns.",
    date: "2026-02-18",
    readTime: "14 min",
    tags: ["regex", "cheat-sheet", "reference", "replace"],
    relatedTool: "regexTester",
    content: `
<p>Regular expressions are powerful pattern-matching tools used across every major programming language. Whether you're validating user input, parsing log files, or performing search-and-replace operations, regex is an essential skill for any developer.</p>

<p>This cheat sheet covers everything from basic syntax to advanced features like lookaheads, named groups, and the replace pattern — all with practical examples you can test immediately.</p>

<h2>Character Classes</h2>
<p>Character classes define which characters can appear at a specific position in the match:</p>
<ul>
<li><code>.</code> — Any character except newline (use <code>s</code> flag to include newlines)</li>
<li><code>\\d</code> — Digit (0-9), equivalent to <code>[0-9]</code></li>
<li><code>\\D</code> — Non-digit, equivalent to <code>[^0-9]</code></li>
<li><code>\\w</code> — Word character (a-z, A-Z, 0-9, _), equivalent to <code>[a-zA-Z0-9_]</code></li>
<li><code>\\W</code> — Non-word character</li>
<li><code>\\s</code> — Whitespace (space, tab, newline, carriage return)</li>
<li><code>\\S</code> — Non-whitespace</li>
<li><code>[abc]</code> — Character set: matches a, b, or c</li>
<li><code>[^abc]</code> — Negated set: matches anything except a, b, or c</li>
<li><code>[a-z]</code> — Range: any lowercase letter</li>
<li><code>[a-zA-Z0-9]</code> — Combined ranges: any alphanumeric character</li>
</ul>

<h2>Quantifiers</h2>
<p>Quantifiers specify how many times the preceding element should occur:</p>
<ul>
<li><code>*</code> — 0 or more (greedy)</li>
<li><code>+</code> — 1 or more (greedy)</li>
<li><code>?</code> — 0 or 1 (optional)</li>
<li><code>{3}</code> — Exactly 3 times</li>
<li><code>{3,}</code> — 3 or more times</li>
<li><code>{3,5}</code> — Between 3 and 5 times</li>
<li><code>*?</code> — 0 or more (lazy/non-greedy)</li>
<li><code>+?</code> — 1 or more (lazy/non-greedy)</li>
</ul>

<h3>Greedy vs Lazy</h3>
<p>By default, quantifiers are greedy — they match as many characters as possible. Adding <code>?</code> after a quantifier makes it lazy, matching as few characters as possible. This distinction matters when parsing structured text:</p>
<p>Given the string <code>&lt;div&gt;hello&lt;/div&gt;&lt;div&gt;world&lt;/div&gt;</code>, the pattern <code>&lt;div&gt;.*&lt;/div&gt;</code> (greedy) matches the entire string, while <code>&lt;div&gt;.*?&lt;/div&gt;</code> (lazy) matches only <code>&lt;div&gt;hello&lt;/div&gt;</code>.</p>

<h2>Anchors</h2>
<p>Anchors match positions in the string rather than characters:</p>
<ul>
<li><code>^</code> — Start of string (or start of line with <code>m</code> flag)</li>
<li><code>$</code> — End of string (or end of line with <code>m</code> flag)</li>
<li><code>\\b</code> — Word boundary (between <code>\\w</code> and <code>\\W</code>)</li>
<li><code>\\B</code> — Non-word boundary</li>
</ul>

<p>Word boundaries are particularly useful for matching whole words. The pattern <code>\\bcat\\b</code> matches "cat" in "the cat sat" but not in "concatenate" or "category".</p>

<h2>Flags (Modifiers)</h2>
<p>Flags change how the regex engine interprets the pattern:</p>
<ul>
<li><code>g</code> — Global: find all matches, not just the first</li>
<li><code>i</code> — Case-insensitive: <code>/hello/i</code> matches "Hello", "HELLO", "hElLo"</li>
<li><code>m</code> — Multiline: <code>^</code> and <code>$</code> match start/end of each line, not just the string</li>
<li><code>s</code> — Dotall: makes <code>.</code> match newline characters too</li>
<li><code>u</code> — Unicode: enables full Unicode support (important for emoji and CJK characters)</li>
</ul>

<p>You can combine flags: <code>/pattern/gim</code> applies global, case-insensitive, and multiline at once.</p>

<h2>Groups and Capturing</h2>
<p>Groups let you treat multiple characters as a single unit, and capturing groups extract matched text for later use:</p>
<ul>
<li><code>(abc)</code> — Capture group: matches "abc" and stores the match</li>
<li><code>(?:abc)</code> — Non-capturing group: matches "abc" but doesn't store it</li>
<li><code>(?&lt;name&gt;abc)</code> — Named capture group: stores the match with a name</li>
<li><code>\\1</code> — Backreference: matches the same text as capture group 1</li>
<li><code>(a|b)</code> — Alternation: matches "a" or "b"</li>
</ul>

<h3>Named Groups in Practice</h3>
<p>Named groups make regex patterns self-documenting. Instead of remembering that group 3 is the year and group 1 is the month, you write:</p>
<p><code>(?&lt;year&gt;\\d{4})-(?&lt;month&gt;\\d{2})-(?&lt;day&gt;\\d{2})</code></p>
<p>This pattern matches dates like "2026-02-18" and lets you access the parts by name in your code.</p>

<h2>Lookaheads and Lookbehinds</h2>
<p>Lookarounds assert that a pattern exists ahead of or behind the current position without including it in the match:</p>
<ul>
<li><code>(?=abc)</code> — Positive lookahead: next characters must be "abc"</li>
<li><code>(?!abc)</code> — Negative lookahead: next characters must NOT be "abc"</li>
<li><code>(?&lt;=abc)</code> — Positive lookbehind: preceding characters must be "abc"</li>
<li><code>(?&lt;!abc)</code> — Negative lookbehind: preceding characters must NOT be "abc"</li>
</ul>

<h3>Password Validation Example</h3>
<p>Lookaheads are commonly used for password validation where multiple conditions must be met simultaneously:</p>
<p><code>^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&amp;])[A-Za-z\\d@$!%*?&amp;]{8,}$</code></p>
<p>This pattern requires at least one lowercase letter, one uppercase letter, one digit, one special character, and a minimum length of 8.</p>

<h2>Regex Replace Mode</h2>
<p>Beyond matching, regex is powerful for search-and-replace operations. The replacement string can reference captured groups to rearrange or transform matched text:</p>

<h3>Basic Group References</h3>
<ul>
<li><code>$1</code>, <code>$2</code>, ... — Reference numbered capture groups</li>
<li><code>$&lt;name&gt;</code> — Reference named capture groups</li>
<li><code>$&amp;</code> — The entire match</li>
<li><code>$$</code> — A literal dollar sign</li>
</ul>

<h3>Practical Replace Examples</h3>
<p><strong>Reformatting dates</strong> from MM/DD/YYYY to YYYY-MM-DD:</p>
<p>Pattern: <code>(\\d{2})/(\\d{2})/(\\d{4})</code></p>
<p>Replace: <code>$3-$1-$2</code></p>
<p>Input: <code>02/18/2026</code> → Output: <code>2026-02-18</code></p>

<p><strong>Adding HTML tags</strong> around email addresses:</p>
<p>Pattern: <code>([\\w.+-]+@[\\w.-]+\\.\\w{2,})</code></p>
<p>Replace: <code>&lt;a href="mailto:$1"&gt;$1&lt;/a&gt;</code></p>

<p><strong>Converting camelCase to snake_case:</strong></p>
<p>Pattern: <code>([a-z])([A-Z])</code></p>
<p>Replace: <code>$1_$2</code> (then lowercase the result)</p>

<h2>Common Real-World Patterns</h2>

<h3>Email Validation</h3>
<p><code>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}</code></p>
<p>Covers most valid email addresses. Note that fully RFC 5322 compliant email validation is notoriously complex — for production use, send a confirmation email instead of trying to validate with regex alone.</p>

<h3>URL Extraction</h3>
<p><code>https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\w.,@?^=%&amp;:/~+#-]*</code></p>
<p>Matches HTTP and HTTPS URLs. For more robust URL parsing, use the built-in <code>URL</code> constructor in JavaScript.</p>

<h3>IP Address (IPv4)</h3>
<p><code>\\b(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\b</code></p>
<p>This pattern validates that each octet is between 0 and 255, unlike the simpler <code>\\d{1,3}</code> version which would accept invalid values like 999.</p>

<h3>Log Parsing</h3>
<p><code>^(?&lt;ip&gt;[\\d.]+)\\s.*?\\[(?&lt;date&gt;[^\\]]+)\\]\\s"(?&lt;method&gt;\\w+)\\s(?&lt;path&gt;[^"]+)"\\s(?&lt;status&gt;\\d{3})</code></p>
<p>Parses Apache/Nginx combined log format, extracting IP, date, HTTP method, path, and status code into named groups.</p>

<h3>Extracting Numbers From Text</h3>
<p><code>-?\\d+(?:\\.\\d+)?(?:[eE][+-]?\\d+)?</code></p>
<p>Matches integers, decimals, negative numbers, and scientific notation.</p>

<h2>Performance Tips</h2>
<p>Regex can be slow if patterns are poorly written. Keep these tips in mind:</p>
<ul>
<li><strong>Avoid catastrophic backtracking:</strong> Patterns like <code>(a+)+</code> can take exponential time on certain inputs. Use atomic groups or possessive quantifiers where supported.</li>
<li><strong>Be specific:</strong> <code>[a-zA-Z0-9]</code> is faster than <code>.*</code> because the engine doesn't need to backtrack as much.</li>
<li><strong>Anchor when possible:</strong> Using <code>^</code> and <code>$</code> tells the engine exactly where to start and stop, reducing unnecessary scanning.</li>
<li><strong>Compile once, use many:</strong> In languages like Python and Java, compile your regex pattern into a reusable object instead of recompiling on every call.</li>
<li><strong>Use non-capturing groups:</strong> If you don't need to extract the match, use <code>(?:...)</code> instead of <code>(...)</code> to avoid the overhead of storing captures.</li>
</ul>

<h2>Debugging Regular Expressions</h2>
<p>When a regex doesn't behave as expected, break it down step by step. Start with the simplest version that matches part of your target, then add complexity incrementally. Testing with multiple inputs — including edge cases like empty strings, special characters, and extremely long strings — reveals issues early.</p>

<p>Visual regex testers that highlight matches in real-time are invaluable for this iterative debugging process.</p>

<h2>Try It Yourself</h2>
<p>Practice these patterns with our <a href="/regex-tester">Regex Tester</a> — see matches highlighted in real-time as you type, test your replace patterns with group references, and experiment with different flags. Your patterns stay in your browser, never sent to any server.</p>
`,
  },
  {
    slug: "understanding-jwt-tokens",
    title: "Understanding JWT Tokens: A Developer's Guide",
    description: "Everything you need to know about JSON Web Tokens — structure, claims, HMAC signature verification, token storage strategies, and security best practices.",
    date: "2026-02-15",
    readTime: "13 min",
    tags: ["JWT", "authentication", "security", "HMAC"],
    relatedTool: "jwtDecoder",
    content: `
<p>JSON Web Tokens (JWT) are the standard for authentication and authorization in modern web applications. Whether you're building a single-page app, a mobile backend, or a microservices architecture, understanding JWT structure and security is essential for every developer.</p>

<p>This guide covers everything from the basics of JWT structure to advanced topics like signature verification, token storage strategies, and common security pitfalls.</p>

<h2>JWT Structure: The Three Parts</h2>
<p>A JWT consists of three Base64URL-encoded parts separated by dots: <code>header.payload.signature</code></p>

<h3>Header</h3>
<p>The header specifies the signing algorithm and token type:</p>
<p><code>{"alg": "HS256", "typ": "JWT"}</code></p>
<p>Common algorithms include HS256 (HMAC with SHA-256), RS256 (RSA with SHA-256), and ES256 (ECDSA with P-256). The choice of algorithm has significant security implications — more on this below.</p>

<h3>Payload (Claims)</h3>
<p>The payload contains claims — statements about the user and metadata. Claims are categorized into three types:</p>
<ul>
<li><strong>Registered claims:</strong> Standardized fields defined in RFC 7519</li>
<li><strong>Public claims:</strong> Custom fields registered with IANA or using collision-resistant names</li>
<li><strong>Private claims:</strong> Custom fields agreed upon by the parties using the token</li>
</ul>

<h3>Signature</h3>
<p>The signature ensures the token hasn't been tampered with. It's created by signing the encoded header and payload with a secret key (HMAC) or private key (RSA/ECDSA).</p>

<h2>Standard Claims Reference</h2>
<p>These registered claims are commonly used in JWTs:</p>
<ul>
<li><code>iss</code> (Issuer) — Who created the token (e.g., your auth server's URL)</li>
<li><code>sub</code> (Subject) — Who the token is about (typically the user ID)</li>
<li><code>aud</code> (Audience) — Who the token is intended for (e.g., your API's URL)</li>
<li><code>exp</code> (Expiration Time) — Unix timestamp when the token expires</li>
<li><code>nbf</code> (Not Before) — Token is not valid before this timestamp</li>
<li><code>iat</code> (Issued At) — When the token was created</li>
<li><code>jti</code> (JWT ID) — Unique identifier for the token (useful for revocation)</li>
</ul>

<p>All time-based claims use Unix timestamps (seconds since January 1, 1970 UTC). A common mistake is using milliseconds — JavaScript's <code>Date.now()</code> returns milliseconds, so divide by 1000.</p>

<h2>HMAC vs RSA: Choosing the Right Algorithm</h2>
<p>The two most common JWT signing approaches have different security models:</p>

<h3>HMAC (HS256/HS384/HS512)</h3>
<p>Symmetric algorithm — the same secret key is used for both signing and verification. Simple to implement and fast. Best suited for:</p>
<ul>
<li>Monolithic applications where the same server signs and verifies tokens</li>
<li>Internal services that share a secret key securely</li>
<li>Development and testing environments</li>
</ul>

<p>The signing process: <code>HMAC-SHA256(base64url(header) + "." + base64url(payload), secret)</code></p>

<h3>RSA (RS256/RS384/RS512)</h3>
<p>Asymmetric algorithm — a private key signs, and a public key verifies. More complex but offers better security guarantees for distributed systems:</p>
<ul>
<li>The auth server keeps the private key; other services only need the public key</li>
<li>Compromising a verification service doesn't expose the signing key</li>
<li>Public keys can be distributed via JWKS (JSON Web Key Set) endpoints</li>
</ul>

<p>RSA is the standard choice for microservices architectures and OAuth 2.0 identity providers.</p>

<h2>Signature Verification Explained</h2>
<p>Verifying a JWT signature is a critical security step that ensures the token hasn't been modified since it was issued. Here's the process step by step:</p>

<ol>
<li>Split the JWT into its three parts at the dot separators</li>
<li>Read the <code>alg</code> field from the decoded header to determine the algorithm</li>
<li>Reconstruct the signing input: <code>base64url(header) + "." + base64url(payload)</code></li>
<li>Compute the expected signature using the same algorithm and key</li>
<li>Compare the computed signature with the token's signature using a timing-safe comparison</li>
</ol>

<p>For HMAC verification, you need the original secret key. For RSA verification, you need the corresponding public key. If the signatures match, the token is authentic and hasn't been tampered with.</p>

<p>Important: Always verify the algorithm in the header matches what you expect. Never trust the <code>alg</code> claim blindly — this prevents the "none" algorithm attack.</p>

<h2>Token Storage Strategies</h2>
<p>Where you store JWTs on the client side has major security implications:</p>

<h3>HttpOnly Cookies</h3>
<p>The most secure option for web applications. HttpOnly cookies cannot be accessed by JavaScript, protecting against XSS attacks. Combined with the <code>Secure</code> flag (HTTPS only) and <code>SameSite=Strict</code> (CSRF protection), this is the recommended approach.</p>
<ul>
<li>Pros: immune to XSS, automatic inclusion in requests, server-controlled expiration</li>
<li>Cons: requires CSRF protection (SameSite helps), limited to same-origin or configured domains</li>
</ul>

<h3>localStorage</h3>
<p>Convenient and commonly used, but vulnerable to XSS attacks. Any JavaScript running on the page (including injected scripts from third-party libraries or XSS vulnerabilities) can read the token.</p>
<ul>
<li>Pros: simple to implement, works with any API</li>
<li>Cons: vulnerable to XSS, persists after browser close, manual cleanup required</li>
</ul>

<h3>sessionStorage</h3>
<p>Similar to localStorage but scoped to the browser tab. Data is cleared when the tab closes. Slightly better security posture than localStorage, but still vulnerable to XSS.</p>

<h3>In-Memory (JavaScript Variable)</h3>
<p>The most XSS-resistant browser storage option. Tokens exist only in a JavaScript variable and are lost when the page refreshes. Best used with refresh token rotation:</p>
<ul>
<li>Store the access token in memory (short-lived, 5-15 minutes)</li>
<li>Store the refresh token in an HttpOnly cookie</li>
<li>On page load, use the refresh token to get a new access token</li>
</ul>

<h2>Access Token and Refresh Token Pattern</h2>
<p>Short-lived access tokens combined with long-lived refresh tokens provide a balance between security and user experience:</p>

<ol>
<li>User logs in → server issues an access token (15 min) and refresh token (7 days)</li>
<li>Access token is used for API requests until it expires</li>
<li>When the access token expires, the refresh token is sent to get a new pair</li>
<li>If the refresh token is expired or revoked, the user must log in again</li>
</ol>

<p>Refresh token rotation adds another layer: each time a refresh token is used, it's invalidated and a new one is issued. If an attacker steals a refresh token and both the attacker and legitimate user try to use it, the server detects the reuse and invalidates the entire token family.</p>

<h2>Security Best Practices</h2>
<p>Follow these practices to keep your JWT implementation secure:</p>

<h3>Token Lifetime</h3>
<ul>
<li>Access tokens: 5-60 minutes (shorter is more secure)</li>
<li>Refresh tokens: 1-30 days (depending on security requirements)</li>
<li>Always check <code>exp</code> before accepting a token</li>
<li>Include <code>iat</code> to detect tokens issued before a security event</li>
</ul>

<h3>Claim Validation</h3>
<ul>
<li>Verify <code>iss</code> matches your expected issuer</li>
<li>Verify <code>aud</code> matches your service's identifier</li>
<li>Check <code>nbf</code> to ensure the token is active</li>
<li>Validate custom claims (roles, permissions) against your authorization rules</li>
</ul>

<h3>Payload Security</h3>
<ul>
<li>Never store sensitive data (passwords, credit cards, PII) in the payload — it's Base64-encoded, not encrypted</li>
<li>Keep payloads small — large tokens increase bandwidth and parsing overhead</li>
<li>Use encryption (JWE) if the payload must contain sensitive data</li>
</ul>

<h3>Common Attacks to Prevent</h3>
<ul>
<li><strong>Algorithm "none" attack:</strong> Attacker changes <code>alg</code> to "none" and removes the signature. Always validate algorithm on the server.</li>
<li><strong>Key confusion (HMAC/RSA):</strong> Attacker changes <code>alg</code> from RS256 to HS256 and signs with the public key. Whitelist allowed algorithms.</li>
<li><strong>Token injection:</strong> Attacker creates tokens with a guessed or leaked secret. Use strong, randomly generated secrets (256+ bits).</li>
<li><strong>Replay attacks:</strong> Stolen tokens can be reused. Short expiration times and token binding mitigate this.</li>
</ul>

<h2>Debugging JWT Issues</h2>
<p>When authentication fails, these are the most common causes:</p>
<ul>
<li><strong>Expired token:</strong> Check the <code>exp</code> claim against the current time. Clock skew between servers can cause false negatives — allow a small leeway (30-60 seconds).</li>
<li><strong>Wrong audience:</strong> The token was issued for a different service. Check the <code>aud</code> claim.</li>
<li><strong>Signature mismatch:</strong> The secret or key used for verification doesn't match the one used for signing. Common when rotating keys.</li>
<li><strong>Malformed token:</strong> The token doesn't have exactly three dot-separated parts, or the parts aren't valid Base64URL.</li>
</ul>

<h2>Try It Yourself</h2>
<p>Decode and inspect your JWT tokens safely with our <a href="/jwt-decoder">JWT Decoder</a> — paste any JWT to see its header, payload, and expiration status. You can also verify HMAC signatures by entering your secret key. Your token never leaves your browser.</p>
`,
  },
  {
    slug: "hash-algorithms-compared",
    title: "MD5 vs SHA-1 vs SHA-256: Which Hash Algorithm to Use?",
    description: "Compare MD5, SHA-1, SHA-256, and SHA-512 hash algorithms. Learn when to use each, why MD5 and SHA-1 are broken, file hashing, and HMAC authentication.",
    date: "2026-02-12",
    readTime: "11 min",
    tags: ["hashing", "security", "MD5", "SHA", "file-hash"],
    relatedTool: "hashGenerator",
    content: `
<p>Hash functions are fundamental to computer security — used for password storage, data integrity verification, digital signatures, and message authentication. But not all hash algorithms are created equal, and choosing the wrong one can leave your application vulnerable.</p>

<p>This guide covers the major hash algorithms, when to use each one, practical applications like file hashing and HMAC, and the real-world consequences of using broken algorithms.</p>

<h2>What Is a Hash Function?</h2>
<p>A cryptographic hash function takes an input of any size and produces a fixed-size output (the "hash" or "digest"). Good hash functions have these properties:</p>
<ul>
<li><strong>Deterministic:</strong> The same input always produces the same output</li>
<li><strong>Fast to compute:</strong> Generating the hash from input is efficient</li>
<li><strong>Pre-image resistant:</strong> Given a hash, it's computationally infeasible to find the input</li>
<li><strong>Collision resistant:</strong> It's infeasible to find two different inputs that produce the same hash</li>
<li><strong>Avalanche effect:</strong> A tiny change in input produces a completely different hash</li>
</ul>

<p>These properties make hash functions useful as digital fingerprints — you can verify data integrity without comparing the entire data, and you can store password hashes without storing the actual passwords.</p>

<h2>Algorithm Comparison</h2>
<table>
<thead><tr><th>Algorithm</th><th>Output Size</th><th>Security Status</th><th>Speed</th><th>Recommended Use</th></tr></thead>
<tbody>
<tr><td>MD5</td><td>128 bits (32 hex)</td><td>Broken</td><td>Fastest</td><td>Non-security checksums only</td></tr>
<tr><td>SHA-1</td><td>160 bits (40 hex)</td><td>Broken</td><td>Fast</td><td>Legacy compatibility only</td></tr>
<tr><td>SHA-256</td><td>256 bits (64 hex)</td><td>Secure</td><td>Moderate</td><td>General purpose (recommended)</td></tr>
<tr><td>SHA-384</td><td>384 bits (96 hex)</td><td>Secure</td><td>Moderate</td><td>High security applications</td></tr>
<tr><td>SHA-512</td><td>512 bits (128 hex)</td><td>Secure</td><td>Moderate*</td><td>Maximum security, 64-bit optimized</td></tr>
</tbody>
</table>
<p>*SHA-512 is actually faster than SHA-256 on 64-bit processors because it uses 64-bit operations natively.</p>

<h2>Why MD5 Is Broken</h2>
<p>MD5 was designed in 1991 by Ronald Rivest as an improvement over MD4. For over a decade, it was the go-to hash algorithm. Then the cracks started appearing:</p>
<ul>
<li><strong>2004:</strong> Chinese researchers demonstrated the first practical collision attack — finding two different inputs that produce the same MD5 hash</li>
<li><strong>2008:</strong> Researchers created a rogue SSL certificate authority using MD5 collisions</li>
<li><strong>2012:</strong> The Flame malware exploited MD5 collisions to fake Windows Update signatures</li>
</ul>

<p>Today, generating MD5 collisions takes seconds on a modern laptop. This means an attacker can create a malicious file with the same MD5 hash as a legitimate one — making MD5 worthless for security verification.</p>

<p>However, MD5 is still acceptable for non-adversarial checksums — detecting accidental data corruption during file transfers, for example. If nobody is actively trying to exploit the collision vulnerability, MD5's speed makes it practical for this purpose.</p>

<h2>Why SHA-1 Is Broken</h2>
<p>SHA-1 held up longer than MD5, but it too has fallen:</p>
<ul>
<li><strong>2005:</strong> Theoretical attacks reduced the cost of finding collisions below brute force</li>
<li><strong>2017:</strong> Google and CWI Amsterdam demonstrated the first practical SHA-1 collision (the SHAttered attack), producing two different PDF files with identical SHA-1 hashes</li>
<li><strong>2020:</strong> Researchers demonstrated chosen-prefix collisions, making attacks practical for real-world document forgery</li>
</ul>

<p>Major browsers stopped accepting SHA-1 SSL certificates in 2017. Git originally used SHA-1 for commit hashes and has been transitioning to SHA-256. If you're still using SHA-1 in any security context, migrate to SHA-256 immediately.</p>

<h2>SHA-256: The Current Standard</h2>
<p>SHA-256 is part of the SHA-2 family, designed by the NSA and published in 2001. It produces a 256-bit (32-byte) hash, represented as 64 hexadecimal characters. No practical attacks against SHA-256 have been demonstrated, and it's considered secure for all current applications.</p>

<p>SHA-256 is used in:</p>
<ul>
<li>TLS/SSL certificates (the backbone of HTTPS)</li>
<li>Bitcoin's proof-of-work algorithm</li>
<li>Code signing for software distribution</li>
<li>Data integrity verification in enterprise systems</li>
<li>JWT signature verification (HS256 = HMAC-SHA-256)</li>
</ul>

<h2>File Hashing: Practical Applications</h2>
<p>Hashing entire files is one of the most common real-world uses of hash algorithms. Practical applications include:</p>

<h3>Download Verification</h3>
<p>Software distributors publish hash values alongside downloads. After downloading a file, you compute its hash locally and compare it to the published value. If they match, the file hasn't been corrupted or tampered with during transfer. This is why you see SHA-256 checksums on Linux ISO download pages.</p>

<h3>Duplicate Detection</h3>
<p>Hash every file in a directory and compare hashes to find exact duplicates — regardless of filename. This is far more efficient than comparing file contents byte by byte, especially across large file collections.</p>

<h3>File Integrity Monitoring</h3>
<p>Security tools like AIDE and Tripwire hash system files and periodically re-check them. If a hash changes unexpectedly, it could indicate unauthorized modification — a sign of compromise.</p>

<h3>Digital Forensics</h3>
<p>In legal proceedings, file hashes prove that evidence hasn't been altered. Forensic investigators hash files at the time of collection and verify the hashes before presenting them in court.</p>

<h2>HMAC: Hash-Based Message Authentication</h2>
<p>HMAC (Hash-based Message Authentication Code) combines a hash function with a secret key to provide both data integrity and authentication. Unlike a plain hash, an HMAC proves that the message was created by someone who knows the secret key.</p>

<p>The formula: <code>HMAC(key, message) = Hash((key XOR opad) || Hash((key XOR ipad) || message))</code></p>

<p>Common uses of HMAC:</p>
<ul>
<li><strong>API authentication:</strong> Signing API requests so the server can verify the sender</li>
<li><strong>JWT signatures:</strong> HS256 tokens use HMAC-SHA-256</li>
<li><strong>Webhook verification:</strong> Services like GitHub and Stripe sign webhook payloads with HMAC so you can verify they're genuine</li>
<li><strong>Session tokens:</strong> Generating tamper-proof session identifiers</li>
</ul>

<h2>Password Hashing: A Special Case</h2>
<p>Raw hash algorithms (SHA-256, MD5, etc.) should NEVER be used directly for password storage. They're designed to be fast, which is the opposite of what you want for passwords — a fast algorithm means an attacker can try billions of guesses per second.</p>

<p>Instead, use purpose-built password hashing functions:</p>
<ul>
<li><strong>Argon2</strong> (recommended) — Winner of the 2015 Password Hashing Competition, configurable memory and CPU cost</li>
<li><strong>bcrypt</strong> — Battle-tested, widely supported, built-in salt and work factor</li>
<li><strong>scrypt</strong> — Memory-hard function that's expensive to parallelize on GPUs</li>
</ul>

<p>These functions are deliberately slow (configurable via cost factors) and include built-in salting to prevent rainbow table attacks.</p>

<h2>Choosing the Right Algorithm: Decision Guide</h2>

<h3>Use SHA-256 When:</h3>
<ul>
<li>You need a general-purpose secure hash</li>
<li>Verifying data integrity (file checksums, content hashing)</li>
<li>Creating digital signatures</li>
<li>HMAC-based authentication</li>
<li>You have no specific reason to use a different algorithm</li>
</ul>

<h3>Use SHA-512 When:</h3>
<ul>
<li>Maximum security margin is required</li>
<li>Running on 64-bit hardware (SHA-512 is faster than SHA-256 on 64-bit CPUs)</li>
<li>The extra hash length is acceptable for your use case</li>
</ul>

<h3>Use MD5 Only When:</h3>
<ul>
<li>Detecting accidental data corruption (not adversarial tampering)</li>
<li>Interoperating with legacy systems that require it</li>
<li>Non-security checksums where speed matters and the threat model doesn't include intentional manipulation</li>
</ul>

<h3>Never Use:</h3>
<ul>
<li>MD5 or SHA-1 for security-sensitive applications</li>
<li>Any raw hash for password storage (use Argon2/bcrypt/scrypt)</li>
<li>Custom or homegrown hash functions</li>
</ul>

<h2>Hash Output Formats</h2>
<p>Hash values are typically displayed in two formats:</p>
<ul>
<li><strong>Hexadecimal:</strong> The most common representation. SHA-256 produces 64 hex characters (e.g., <code>e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code> — the hash of an empty string).</li>
<li><strong>Base64:</strong> More compact (44 characters for SHA-256), commonly used in JWTs and HTTP headers.</li>
</ul>

<p>Both representations encode the same underlying binary data — they're just different ways of displaying it. Hex is easier to read and compare visually; Base64 is shorter and common in web protocols.</p>

<h2>Try It Yourself</h2>
<p>Generate hashes instantly with our <a href="/hash-generator">Hash Generator</a> — supports MD5, SHA-1, SHA-256, SHA-384, and SHA-512 for both text input and file uploads. Compare all algorithms side by side, all computed locally in your browser.</p>
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
}
