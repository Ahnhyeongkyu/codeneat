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
    description: "Learn how to format, validate, and work with JSON data efficiently. Covers indentation styles, common pitfalls, and productivity tips.",
    date: "2026-02-20",
    readTime: "5 min",
    tags: ["JSON", "formatting", "best-practices"],
    relatedTool: "jsonFormatter",
    content: `
<p>JSON (JavaScript Object Notation) is the lingua franca of data exchange in modern web development. Whether you're debugging API responses, configuring applications, or working with databases, properly formatted JSON is essential for readability and maintainability.</p>

<h2>Why Formatting Matters</h2>
<p>Minified JSON is great for network transfer — it reduces payload size. But when you need to read or debug it, proper formatting is crucial. A well-formatted JSON document with consistent indentation makes it easy to:</p>
<ul>
<li>Spot missing brackets or commas</li>
<li>Navigate nested structures</li>
<li>Compare changes between versions</li>
<li>Share snippets with team members</li>
</ul>

<h2>Indentation: 2 Spaces vs 4 Spaces vs Tabs</h2>
<p>The most common indentation styles are 2 spaces (used by Google, Airbnb) and 4 spaces (used by Python community). Tabs are less common in JSON but some developers prefer them for accessibility reasons. There's no "right" answer — consistency within your project is what matters.</p>

<h2>Common JSON Pitfalls</h2>
<ul>
<li><strong>Trailing commas:</strong> Unlike JavaScript, JSON does not allow trailing commas. <code>{"a": 1,}</code> is invalid.</li>
<li><strong>Single quotes:</strong> JSON requires double quotes for strings. <code>{'key': 'value'}</code> is invalid.</li>
<li><strong>Comments:</strong> Standard JSON doesn't support comments. Use JSONC or JSON5 if you need them.</li>
<li><strong>Unquoted keys:</strong> All keys must be quoted: <code>{"key": "value"}</code>, not <code>{key: "value"}</code>.</li>
</ul>

<h2>JSON ↔ YAML Conversion</h2>
<p>YAML is a superset of JSON that's popular for configuration files (Kubernetes, Docker Compose, GitHub Actions). Converting between JSON and YAML is a common task. YAML offers better readability for deeply nested configs, while JSON is better for data exchange.</p>

<h2>Try It Yourself</h2>
<p>Use our <a href="/json-formatter">JSON Formatter</a> to format, validate, convert to YAML/CSV, and explore your JSON data with the tree viewer — all without sending data to any server.</p>
`,
  },
  {
    slug: "regex-cheat-sheet-2026",
    title: "The Ultimate Regex Cheat Sheet for 2026",
    description: "A comprehensive regular expression reference with examples. Covers character classes, quantifiers, lookaheads, and named groups.",
    date: "2026-02-18",
    readTime: "7 min",
    tags: ["regex", "cheat-sheet", "reference"],
    relatedTool: "regexTester",
    content: `
<p>Regular expressions are powerful pattern-matching tools used across programming languages. This cheat sheet covers everything from basic syntax to advanced features you'll use daily.</p>

<h2>Character Classes</h2>
<ul>
<li><code>.</code> — Any character except newline</li>
<li><code>\\d</code> — Digit (0-9)</li>
<li><code>\\w</code> — Word character (a-z, A-Z, 0-9, _)</li>
<li><code>\\s</code> — Whitespace (space, tab, newline)</li>
<li><code>[abc]</code> — Character set: a, b, or c</li>
<li><code>[^abc]</code> — Negated set: not a, b, or c</li>
<li><code>[a-z]</code> — Range: lowercase letters</li>
</ul>

<h2>Quantifiers</h2>
<ul>
<li><code>*</code> — 0 or more</li>
<li><code>+</code> — 1 or more</li>
<li><code>?</code> — 0 or 1 (optional)</li>
<li><code>{3}</code> — Exactly 3</li>
<li><code>{3,}</code> — 3 or more</li>
<li><code>{3,5}</code> — Between 3 and 5</li>
</ul>

<h2>Anchors</h2>
<ul>
<li><code>^</code> — Start of string (or line with <code>m</code> flag)</li>
<li><code>$</code> — End of string (or line with <code>m</code> flag)</li>
<li><code>\\b</code> — Word boundary</li>
</ul>

<h2>Groups & Lookarounds</h2>
<ul>
<li><code>(abc)</code> — Capture group</li>
<li><code>(?:abc)</code> — Non-capturing group</li>
<li><code>(?&lt;name&gt;abc)</code> — Named capture group</li>
<li><code>(?=abc)</code> — Positive lookahead</li>
<li><code>(?!abc)</code> — Negative lookahead</li>
<li><code>(?&lt;=abc)</code> — Positive lookbehind</li>
</ul>

<h2>Common Patterns</h2>
<ul>
<li>Email: <code>[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}</code></li>
<li>URL: <code>https?:\\/\\/[\\w.-]+(?:\\.[\\w.-]+)+[\\w.,@?^=%&:/~+#-]*</code></li>
<li>IP Address: <code>\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\b</code></li>
<li>Phone: <code>\\+?\\d{1,3}[-.\\s]?\\(?\\d{1,4}\\)?[-.\\s]?\\d{1,4}[-.\\s]?\\d{1,9}</code></li>
</ul>

<p>Practice these patterns with our <a href="/regex-tester">Regex Tester</a> — see matches highlighted in real-time as you type.</p>
`,
  },
  {
    slug: "understanding-jwt-tokens",
    title: "Understanding JWT Tokens: A Developer's Guide",
    description: "Everything you need to know about JSON Web Tokens — structure, claims, expiration, and security best practices.",
    date: "2026-02-15",
    readTime: "6 min",
    tags: ["JWT", "authentication", "security"],
    relatedTool: "jwtDecoder",
    content: `
<p>JSON Web Tokens (JWT) are the standard for authentication in modern web applications. Understanding their structure is essential for debugging auth issues and building secure systems.</p>

<h2>JWT Structure</h2>
<p>A JWT consists of three Base64-encoded parts separated by dots:</p>
<ul>
<li><strong>Header:</strong> Algorithm and token type (<code>{"alg": "HS256", "typ": "JWT"}</code>)</li>
<li><strong>Payload:</strong> Claims — the actual data (user ID, roles, expiration)</li>
<li><strong>Signature:</strong> Cryptographic signature verifying the token hasn't been tampered with</li>
</ul>

<h2>Standard Claims</h2>
<ul>
<li><code>iss</code> — Issuer (who created the token)</li>
<li><code>sub</code> — Subject (who the token is about)</li>
<li><code>aud</code> — Audience (who the token is for)</li>
<li><code>exp</code> — Expiration time (Unix timestamp)</li>
<li><code>iat</code> — Issued at (when the token was created)</li>
<li><code>nbf</code> — Not before (token is not valid before this time)</li>
</ul>

<h2>Security Best Practices</h2>
<ul>
<li><strong>Always validate signatures</strong> on the server side</li>
<li><strong>Set short expiration times</strong> (15-60 minutes for access tokens)</li>
<li><strong>Use HTTPS</strong> to prevent token interception</li>
<li><strong>Don't store sensitive data</strong> in the payload — it's Base64, not encrypted</li>
<li><strong>Use refresh tokens</strong> for long-lived sessions</li>
<li><strong>Validate all claims</strong> including issuer and audience</li>
</ul>

<h2>Common Mistakes</h2>
<ul>
<li>Using <code>none</code> algorithm in production</li>
<li>Not checking expiration before accepting tokens</li>
<li>Storing JWTs in localStorage (vulnerable to XSS)</li>
<li>Using symmetric keys (HS256) in distributed systems</li>
</ul>

<p>Decode and inspect your JWT tokens safely with our <a href="/jwt-decoder">JWT Decoder</a> — your token never leaves your browser.</p>
`,
  },
  {
    slug: "hash-algorithms-compared",
    title: "MD5 vs SHA-1 vs SHA-256: Which Hash Algorithm to Use?",
    description: "Compare MD5, SHA-1, SHA-256, and SHA-512 hash algorithms. Learn when to use each and why MD5 and SHA-1 are considered broken.",
    date: "2026-02-12",
    readTime: "4 min",
    tags: ["hashing", "security", "MD5", "SHA"],
    relatedTool: "hashGenerator",
    content: `
<p>Hash functions are fundamental to computer security — used for password storage, data integrity verification, and digital signatures. But not all hash algorithms are created equal.</p>

<h2>Algorithm Comparison</h2>
<table>
<thead><tr><th>Algorithm</th><th>Output Size</th><th>Security</th><th>Use Case</th></tr></thead>
<tbody>
<tr><td>MD5</td><td>128 bits</td><td>Broken</td><td>Checksums only</td></tr>
<tr><td>SHA-1</td><td>160 bits</td><td>Broken</td><td>Legacy systems</td></tr>
<tr><td>SHA-256</td><td>256 bits</td><td>Secure</td><td>General purpose</td></tr>
<tr><td>SHA-384</td><td>384 bits</td><td>Secure</td><td>High security</td></tr>
<tr><td>SHA-512</td><td>512 bits</td><td>Secure</td><td>Maximum security</td></tr>
</tbody>
</table>

<h2>Why MD5 and SHA-1 Are Broken</h2>
<p>MD5 was cracked in 2004, and practical collision attacks have been demonstrated since 2012. SHA-1 was broken by Google in 2017 (SHAttered attack). "Broken" means attackers can find two different inputs that produce the same hash — making these algorithms unsafe for security purposes.</p>

<h2>When to Use What</h2>
<ul>
<li><strong>Password hashing:</strong> Use bcrypt, scrypt, or Argon2 — NOT raw SHA/MD5</li>
<li><strong>Data integrity:</strong> SHA-256 (fastest secure option)</li>
<li><strong>File checksums:</strong> SHA-256 or MD5 (MD5 is fine for non-adversarial checksums)</li>
<li><strong>Digital signatures:</strong> SHA-256 or SHA-512</li>
<li><strong>Blockchain:</strong> SHA-256 (Bitcoin) or Keccak-256 (Ethereum)</li>
</ul>

<p>Generate hashes instantly with our <a href="/hash-generator">Hash Generator</a> — supports MD5, SHA-1, SHA-256, SHA-384, and SHA-512.</p>
`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getAllPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
}
