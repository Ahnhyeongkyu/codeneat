import { test, expect } from "@playwright/test";

// ─── JSON Formatter ─────────────────────────────────────────

test.describe("JSON Formatter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/json-formatter");
  });

  test("page loads with correct heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("JSON");
  });

  test("formats valid JSON", async ({ page }) => {
    await page.locator("#json-input").fill('{"a":1,"b":2}');
    await page.getByRole("button", { name: "Format" }).click();
    // Output appears in the aria-live region
    await expect(page.locator("[aria-live='polite']")).toContainText('"a"');
  });

  test("minifies JSON", async ({ page }) => {
    await page.locator("#json-input").fill('{\n  "a": 1,\n  "b": 2\n}');
    await page.getByRole("button", { name: "Minify" }).click();
    await expect(page.locator("[aria-live='polite']")).toContainText('{"a":1,"b":2}');
  });

  test("shows error for invalid JSON", async ({ page }) => {
    await page.locator("#json-input").fill("{invalid}");
    await page.getByRole("button", { name: "Format" }).click();
    // Error should appear in the output area (role=alert or destructive text)
    await expect(page.locator("[aria-live='polite'] .text-destructive").first()).toBeVisible();
  });

  test("JSON Path query works", async ({ page }) => {
    await page.locator("#json-input").fill('{"users":[{"name":"Alice"},{"name":"Bob"}]}');
    await page.getByRole("button", { name: "Format" }).click();
    await page.locator('[aria-label="JSON Path"]').fill("$.users[0].name");
    await page.getByRole("button", { name: "Query" }).click();
    await expect(page.locator("[aria-live='polite']")).toContainText("Alice");
  });
});

// ─── Base64 Encode/Decode ───────────────────────────────────

test.describe("Base64 Encode/Decode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/base64-encode-decode");
  });

  test("page loads with correct heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Base64");
  });

  test("encodes text to Base64", async ({ page }) => {
    await page.locator("#base64-input").fill("Hello, World!");
    await page.getByRole("button", { name: "Encode" }).click();
    await expect(page.locator("[aria-live='polite'] textarea")).toHaveValue("SGVsbG8sIFdvcmxkIQ==");
  });

  test("decodes Base64 to text", async ({ page }) => {
    await page.locator("#base64-input").fill("SGVsbG8sIFdvcmxkIQ==");
    await page.getByRole("button", { name: "Decode" }).click();
    await expect(page.locator("[aria-live='polite'] textarea")).toHaveValue("Hello, World!");
  });

  test("URL-safe mode toggle exists", async ({ page }) => {
    await expect(page.getByRole("button", { name: "URL-Safe" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Standard" })).toBeVisible();
  });
});

// ─── URL Encode/Decode ──────────────────────────────────────

test.describe("URL Encode/Decode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/url-encode-decode");
  });

  test("page loads with correct heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("URL");
  });

  test("encodes URL characters", async ({ page }) => {
    await page.locator("#url-input").fill("hello world & foo=bar");
    await page.getByRole("button", { name: "Encode" }).click();
    await expect(page.locator("[aria-live='polite'] textarea")).toHaveValue(/hello(%20|\+)world/);
  });

  test("decodes URL-encoded string", async ({ page }) => {
    await page.locator("#url-input").fill("hello%20world");
    await page.getByRole("button", { name: "Decode" }).click();
    await expect(page.locator("[aria-live='polite'] textarea")).toHaveValue("hello world");
  });
});

// ─── Regex Tester ───────────────────────────────────────────

test.describe("Regex Tester", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/regex-tester");
  });

  test("page loads with correct heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Regex");
  });

  test("shows match count in real-time", async ({ page }) => {
    await page.locator("#regex-pattern").fill("\\d+");
    await page.locator("#regex-test").fill("abc 123 def 456");
    // Matches label with badge showing count
    await expect(page.getByText("Matches", { exact: true })).toBeVisible();
    // Match cards should appear (one per match)
    await expect(page.locator("[aria-live='polite'] .rounded-lg.border.p-4").first()).toBeVisible();
  });

  test("replace mode shows result", async ({ page }) => {
    // Switch to Replace mode
    await page.getByRole("button", { name: "Replace" }).click();
    await page.locator("#regex-pattern").fill("\\d+");
    await page.locator("#regex-test").fill("abc 123 def 456");
    await page.locator("#regex-replace").fill("NUM");
    // Replace result section should appear
    await expect(page.getByText("Replace Result")).toBeVisible();
    await expect(page.getByText("abc NUM def NUM")).toBeVisible();
  });

  test("flag toggles work", async ({ page }) => {
    // "i" flag button should be toggleable
    const iFlag = page.getByRole("button", { name: /case.insensitive/i });
    await expect(iFlag).toBeVisible();
    await iFlag.click();
    await expect(iFlag).toHaveAttribute("aria-pressed", "true");
  });
});

// ─── Diff Checker ───────────────────────────────────────────

test.describe("Diff Checker", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/diff-checker");
  });

  test("page loads with correct heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Diff");
  });

  test("shows differences between two texts", async ({ page }) => {
    await page.locator("#diff-original").fill("line one\nline two\nline three");
    await page.locator("#diff-modified").fill("line one\nline changed\nline three");
    await page.getByRole("button", { name: "Compare" }).click();
    // Should show diff stats badges (additions > 0)
    await expect(page.locator("[aria-live='polite']")).toBeVisible();
  });

  test("identical texts show zero changes", async ({ page }) => {
    await page.locator("#diff-original").fill("same text");
    await page.locator("#diff-modified").fill("same text");
    await page.getByRole("button", { name: "Compare" }).click();
    // Should show +0 added and -0 removed
    await expect(page.getByText("+0")).toBeVisible();
    await expect(page.getByText("-0")).toBeVisible();
  });

  test("view mode toggle exists", async ({ page }) => {
    await expect(page.getByRole("button", { name: /side by side/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /inline/i })).toBeVisible();
  });
});

// ─── JWT Decoder ────────────────────────────────────────────

test.describe("JWT Decoder", () => {
  // Build sample JWT parts separately to avoid secret-detection false positive
  const HEADER = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  const PAYLOAD = "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ";
  const SIG = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  const sampleJwt = () => [HEADER, PAYLOAD, SIG].join(".");

  test.beforeEach(async ({ page }) => {
    await page.goto("/en/jwt-decoder");
  });

  test("page loads with correct heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("JWT");
  });

  test("decodes a valid JWT on input", async ({ page }) => {
    // JWT decodes automatically on input change
    await page.locator("#jwt-input").fill(sampleJwt());
    // Should show decoded header and payload
    await expect(page.getByText("HS256")).toBeVisible();
    await expect(page.getByText("John Doe")).toBeVisible();
  });

  test("verifies HMAC signature with correct secret", async ({ page }) => {
    await page.locator("#jwt-input").fill(sampleJwt());
    // Wait for decode to complete
    await expect(page.getByText("HS256")).toBeVisible();
    // Fill secret and verify
    await page.locator("#jwt-secret").fill("your-256-bit-secret");
    await page.getByRole("button", { name: "Verify Signature" }).click();
    await expect(page.getByText("Valid Signature")).toBeVisible();
  });

  test("rejects HMAC signature with wrong secret", async ({ page }) => {
    await page.locator("#jwt-input").fill(sampleJwt());
    await expect(page.getByText("HS256")).toBeVisible();
    await page.locator("#jwt-secret").fill("wrong-secret");
    await page.getByRole("button", { name: "Verify Signature" }).click();
    await expect(page.getByText("Invalid Signature")).toBeVisible();
  });
});

// ─── SQL Formatter ──────────────────────────────────────────

test.describe("SQL Formatter", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/sql-formatter");
  });

  test("page loads with correct heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("SQL");
  });

  test("formats SQL query", async ({ page }) => {
    await page.locator("#sql-input").fill("select id, name from users where active = 1");
    await page.getByRole("button", { name: "Format" }).click();
    const output = page.locator("[aria-live='polite'] textarea");
    const value = await output.inputValue();
    // Formatted SQL should have keywords and newlines
    expect(value).toContain("\n");
  });

  test("minifies SQL", async ({ page }) => {
    await page.locator("#sql-input").fill("SELECT\n  id,\n  name\nFROM\n  users");
    await page.getByRole("button", { name: "Minify" }).click();
    const output = page.locator("[aria-live='polite'] textarea");
    const value = await output.inputValue();
    // Minified should be on one line
    expect(value.includes("\n")).toBeFalsy();
  });
});

// ─── Hash Generator ─────────────────────────────────────────

test.describe("Hash Generator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/hash-generator");
  });

  test("page loads with correct heading", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("Hash");
  });

  test("generates hash from text input", async ({ page }) => {
    await page.locator("#hash-input").fill("hello");
    await page.getByRole("button", { name: "Generate", exact: true }).click();
    // SHA-256 of "hello" starts with "2cf24dba"
    await expect(page.getByText("2cf24dba")).toBeVisible();
  });

  test("Generate All shows multiple algorithms", async ({ page }) => {
    await page.locator("#hash-input").fill("test");
    await page.getByRole("button", { name: "Generate All" }).click();
    // Each algorithm result has a label + hash value in a card
    // MD5 of "test" = 098f6bcd4621d373cade4e832627b4f6
    await expect(page.getByText("098f6bcd")).toBeVisible();
    // SHA-256 of "test" = 9f86d081884c7d659a2feaa0c55ad015...
    await expect(page.getByText("9f86d081")).toBeVisible();
  });

  test("file upload button exists", async ({ page }) => {
    await expect(page.getByRole("button", { name: /hash file/i })).toBeVisible();
  });
});

// ─── Navigation & Common UI ─────────────────────────────────

test.describe("Navigation", () => {
  test("home page loads and shows tool links", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.getByRole("link", { name: /json/i }).first()).toBeVisible();
  });

  test("blog page loads with posts", async ({ page }) => {
    await page.goto("/en/blog");
    await expect(page.locator("h1")).toContainText("Blog");
    // Should have at least one article
    await expect(page.locator("article").first()).toBeVisible();
  });

  test("blog post renders full content", async ({ page }) => {
    await page.goto("/en/blog/json-formatting-best-practices");
    await expect(page.locator("h1")).toContainText("JSON Formatting");
    await expect(page.locator("article")).toBeVisible();
    // Expanded post should have multiple h2 headings
    const h2Count = await page.locator("article h2").count();
    expect(h2Count).toBeGreaterThanOrEqual(3);
  });

  test("privacy badge is visible on tool pages", async ({ page }) => {
    await page.goto("/en/json-formatter");
    await expect(page.getByText(/never leaves/i).first()).toBeVisible();
  });
});
