/**
 * Comprehensive unit tests for all 8 tool pure functions in lib/tools/
 * Run with: npx tsx tests/test-tools.mjs
 *
 * Uses a minimal test harness (no framework required).
 */

// ─── Minimal test harness ────────────────────────────────────────────────────

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;
const failures = [];

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  \x1b[32mPASS\x1b[0m  ${message}`);
  } else {
    failedTests++;
    failures.push(message);
    console.log(`  \x1b[31mFAIL\x1b[0m  ${message}`);
  }
}

function assertEqual(actual, expected, message) {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  totalTests++;
  if (pass) {
    passedTests++;
    console.log(`  \x1b[32mPASS\x1b[0m  ${message}`);
  } else {
    failedTests++;
    const detail = `${message}\n         expected: ${JSON.stringify(expected)}\n         actual:   ${JSON.stringify(actual)}`;
    failures.push(detail);
    console.log(`  \x1b[31mFAIL\x1b[0m  ${detail}`);
  }
}

function skip(message) {
  totalTests++;
  skippedTests++;
  console.log(`  \x1b[33mSKIP\x1b[0m  ${message}`);
}

function section(name) {
  console.log(`\n\x1b[36m=== ${name} ===\x1b[0m`);
}

// ─── Import all tool modules ─────────────────────────────────────────────────

const { formatJson, minifyJson, validateJson, buildJsonTree, jsonToYaml, yamlToJson, jsonToCsv, highlightJson, queryJsonPath } = await import("../lib/tools/json.ts");
const { encodeShareState, decodeShareState } = await import("../lib/share.ts");
const { getAllPosts, getPostBySlug } = await import("../lib/blog.ts");
const { testRegex, replaceWithRegex } = await import("../lib/tools/regex.ts");
const { computeDiff, computeLineDiff, DIFF_SAMPLE } = await import("../lib/tools/diff.ts");
const { formatSql, minifySql } = await import("../lib/tools/sql.ts");
const { encodeUrl, decodeUrl, encodeFullUrl, decodeFullUrl } = await import("../lib/tools/url-encode.ts");
const { encodeBase64, decodeBase64, encodeBase64Url, decodeBase64Url } = await import("../lib/tools/base64.ts");
const { decodeJwt, buildSampleJwt } = await import("../lib/tools/jwt.ts");
const { generateHash, generateAllHashes } = await import("../lib/tools/hash.ts");

// ═══════════════════════════════════════════════════════════════════════════════
// 1. JSON TOOL TESTS
// ═══════════════════════════════════════════════════════════════════════════════

section("json.ts - formatJson");
{
  // 1. Empty string -> empty output, no error
  const r1 = formatJson("");
  assertEqual(r1, { output: "", error: null }, "formatJson: empty string returns empty output, no error");

  const r1b = formatJson("   ");
  assertEqual(r1b, { output: "", error: null }, "formatJson: whitespace-only string returns empty output, no error");

  // 2. Valid JSON -> formatted output
  const r2 = formatJson('{"a":1,"b":2}');
  assertEqual(r2.error, null, "formatJson: valid JSON has no error");
  assert(r2.output.includes("\n"), "formatJson: valid JSON output is multi-line (formatted)");
  assertEqual(JSON.parse(r2.output), { a: 1, b: 2 }, "formatJson: formatted output parses back to same value");

  // Custom indent
  const r2b = formatJson('{"a":1}', 4);
  assert(r2b.output.includes("    "), "formatJson: indent=4 uses 4 spaces");

  // 3. Invalid JSON -> error message
  const r3 = formatJson("{bad json}");
  assert(r3.error !== null, "formatJson: invalid JSON returns error");
  assertEqual(r3.output, "", "formatJson: invalid JSON returns empty output");
}

section("json.ts - minifyJson");
{
  // 4. Minify valid JSON -> single line
  const r4 = minifyJson('{\n  "a": 1,\n  "b": [1, 2, 3]\n}');
  assertEqual(r4.error, null, "minifyJson: valid JSON has no error");
  assert(!r4.output.includes("\n"), "minifyJson: output is single line");
  assertEqual(r4.output, '{"a":1,"b":[1,2,3]}', "minifyJson: output is minified correctly");

  // Empty input
  const r4b = minifyJson("  ");
  assertEqual(r4b, { output: "", error: null }, "minifyJson: whitespace-only returns empty");

  // Invalid JSON
  const r4c = minifyJson("not json");
  assert(r4c.error !== null, "minifyJson: invalid JSON returns error");
}

section("json.ts - validateJson");
{
  // 5. validateJson valid -> { valid: true }
  const r5 = validateJson('{"key":"value"}');
  assertEqual(r5, { valid: true, error: null }, "validateJson: valid JSON returns valid:true");

  // 6. validateJson invalid -> { valid: false, error: "..." }
  const r6 = validateJson("{invalid}");
  assertEqual(r6.valid, false, "validateJson: invalid JSON returns valid:false");
  assert(r6.error !== null, "validateJson: invalid JSON has error message");

  // Empty
  const r6b = validateJson("  ");
  assertEqual(r6b, { valid: false, error: null }, "validateJson: empty input returns valid:false, no error");
}

section("json.ts - buildJsonTree");
{
  // 7. buildJsonTree -> correct tree structure
  const r7 = buildJsonTree('{"name":"test","count":42,"active":true,"items":[1,2],"meta":null}');
  assertEqual(r7.error, null, "buildJsonTree: valid JSON has no error");
  assertEqual(r7.tree.type, "object", "buildJsonTree: root is object");
  assertEqual(r7.tree.key, "root", "buildJsonTree: root key is 'root'");
  assertEqual(r7.tree.children.length, 5, "buildJsonTree: 5 children");

  // Check child types
  const nameChild = r7.tree.children.find(c => c.key === "name");
  assertEqual(nameChild.type, "string", "buildJsonTree: string child type");
  assertEqual(nameChild.value, "test", "buildJsonTree: string child value");

  const countChild = r7.tree.children.find(c => c.key === "count");
  assertEqual(countChild.type, "number", "buildJsonTree: number child type");
  assertEqual(countChild.value, 42, "buildJsonTree: number child value");

  const activeChild = r7.tree.children.find(c => c.key === "active");
  assertEqual(activeChild.type, "boolean", "buildJsonTree: boolean child type");
  assertEqual(activeChild.value, true, "buildJsonTree: boolean child value");

  const itemsChild = r7.tree.children.find(c => c.key === "items");
  assertEqual(itemsChild.type, "array", "buildJsonTree: array child type");
  assertEqual(itemsChild.length, 2, "buildJsonTree: array child length");

  const metaChild = r7.tree.children.find(c => c.key === "meta");
  assertEqual(metaChild.type, "null", "buildJsonTree: null child type");

  // Empty
  const r7b = buildJsonTree("  ");
  assertEqual(r7b, { tree: null, error: null }, "buildJsonTree: empty input returns null tree");

  // Invalid JSON
  const r7c = buildJsonTree("{bad}");
  assert(r7c.error !== null, "buildJsonTree: invalid JSON returns error");
  assertEqual(r7c.tree, null, "buildJsonTree: invalid JSON returns null tree");

  // 8. Deeply nested JSON (depth 60) -> tree truncated at depth 50
  let deepObj = '"leaf"';
  for (let i = 0; i < 60; i++) {
    deepObj = `{"d${i}":${deepObj}}`;
  }
  const r8 = buildJsonTree(deepObj);
  assertEqual(r8.error, null, "buildJsonTree: deeply nested JSON has no error");

  // Walk down to find the truncation node
  let node = r8.tree;
  let depth = 0;
  while (node && node.children && node.children.length > 0) {
    node = node.children[0];
    depth++;
  }
  // The tree should stop at depth ~51 with "[Max depth exceeded]"
  assert(node.value === "[Max depth exceeded]", "buildJsonTree: depth > 50 shows truncation message");
  assert(depth <= 52, `buildJsonTree: tree depth (${depth}) is capped around 51`);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. REGEX TOOL TESTS
// ═══════════════════════════════════════════════════════════════════════════════

section("regex.ts - testRegex");
{
  // 1. Empty pattern -> empty matches
  const r1 = testRegex("", "hello");
  assertEqual(r1, { matches: [], error: null }, "testRegex: empty pattern returns empty matches");

  const r1b = testRegex("hello", "");
  assertEqual(r1b, { matches: [], error: null }, "testRegex: empty test string returns empty matches");

  // 2. Simple match -> correct index/length
  const r2 = testRegex("world", "hello world");
  assertEqual(r2.error, null, "testRegex: simple match has no error");
  assertEqual(r2.matches.length, 1, "testRegex: simple match finds 1 result");
  assertEqual(r2.matches[0].match, "world", "testRegex: match text is correct");
  assertEqual(r2.matches[0].index, 6, "testRegex: match index is correct");
  assertEqual(r2.matches[0].length, 5, "testRegex: match length is correct");

  // 3. Global flag finds all matches
  const r3 = testRegex("\\d+", "a1 b22 c333", "g");
  assertEqual(r3.matches.length, 3, "testRegex: global finds all 3 numbers");
  assertEqual(r3.matches[0].match, "1", "testRegex: first match is '1'");
  assertEqual(r3.matches[1].match, "22", "testRegex: second match is '22'");
  assertEqual(r3.matches[2].match, "333", "testRegex: third match is '333'");

  // Without explicit g flag (function adds g internally)
  const r3b = testRegex("\\d+", "a1 b22 c333", "");
  assertEqual(r3b.matches.length, 3, "testRegex: without g flag still finds all (g added internally)");

  // 4. Named groups captured
  const r4 = testRegex("(?<year>\\d{4})-(?<month>\\d{2})", "2024-06-15");
  assertEqual(r4.matches.length, 1, "testRegex: named groups match count");
  const groups4 = r4.matches[0].groups;
  const yearGroup = groups4.find(g => g.name === "year");
  assert(yearGroup !== undefined, "testRegex: named group 'year' exists");
  assertEqual(yearGroup.value, "2024", "testRegex: named group 'year' value");
  const monthGroup = groups4.find(g => g.name === "month");
  assertEqual(monthGroup.value, "06", "testRegex: named group 'month' value");
  // Should also have numbered groups
  const g1 = groups4.find(g => g.name === "Group 1");
  assertEqual(g1.value, "2024", "testRegex: numbered Group 1 value");
  const g2 = groups4.find(g => g.name === "Group 2");
  assertEqual(g2.value, "06", "testRegex: numbered Group 2 value");

  // 5. Invalid pattern -> error
  const r5 = testRegex("[unclosed", "test");
  assert(r5.error !== null, "testRegex: invalid pattern returns error");
  assertEqual(r5.matches.length, 0, "testRegex: invalid pattern returns no matches");

  // 6. Zero-length match doesn't infinite loop
  const r6 = testRegex("(?=a)", "aaa");
  assertEqual(r6.error, null, "testRegex: zero-length match no error");
  assertEqual(r6.matches.length, 3, "testRegex: zero-length match finds 3 lookaheads");
  r6.matches.forEach((m, i) => {
    assertEqual(m.length, 0, `testRegex: zero-length match[${i}] has length 0`);
  });

  // 7. Timeout protection (ReDoS pattern)
  // Note: ^(a+)+$ with "aaa...b" triggers catastrophic backtracking
  // However, V8 in Node 20 may handle this efficiently. We test with a very long string.
  const r7 = testRegex("^(a+)+$", "a".repeat(30) + "b");
  // In V8 with linear-time regex, this may not timeout. Accept either outcome:
  // - timeout error OR empty matches (pattern doesn't match)
  const r7TimedOut = r7.error !== null && r7.error.includes("timed out");
  const r7NoMatch = r7.matches.length === 0 && r7.error === null;
  assert(r7TimedOut || r7NoMatch, "testRegex: ReDoS pattern either times out or returns no match (no infinite loop)");
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. DIFF TOOL TESTS
// ═══════════════════════════════════════════════════════════════════════════════

section("diff.ts - computeDiff");
{
  // 1. Identical strings -> all equal segments
  const r1 = computeDiff("hello world", "hello world");
  assert(r1.diffs.length >= 1, "computeDiff: identical has at least 1 segment");
  assert(r1.diffs.every(d => d.type === "equal"), "computeDiff: identical strings are all equal");
  assertEqual(r1.stats.additions, 0, "computeDiff: identical has 0 additions");
  assertEqual(r1.stats.deletions, 0, "computeDiff: identical has 0 deletions");
  assertEqual(r1.stats.unchanged, 11, "computeDiff: identical has 11 unchanged chars");

  // 2. Additions only -> insert segments
  const r2 = computeDiff("hello", "hello world");
  const insertSegments2 = r2.diffs.filter(d => d.type === "insert");
  assert(insertSegments2.length > 0, "computeDiff: additions have insert segments");
  assertEqual(r2.stats.deletions, 0, "computeDiff: pure addition has 0 deletions");
  assert(r2.stats.additions > 0, "computeDiff: pure addition has positive additions");

  // 3. Deletions only -> delete segments
  const r3 = computeDiff("hello world", "hello");
  const deleteSegments3 = r3.diffs.filter(d => d.type === "delete");
  assert(deleteSegments3.length > 0, "computeDiff: deletions have delete segments");
  assertEqual(r3.stats.additions, 0, "computeDiff: pure deletion has 0 additions");
  assert(r3.stats.deletions > 0, "computeDiff: pure deletion has positive deletions");

  // 4. Mixed changes -> correct stats
  const r4 = computeDiff("the cat sat on the mat", "the dog sat on a mat");
  assert(r4.stats.additions > 0, "computeDiff: mixed has additions");
  assert(r4.stats.deletions > 0, "computeDiff: mixed has deletions");
  assert(r4.stats.unchanged > 0, "computeDiff: mixed has unchanged");
  const types4 = new Set(r4.diffs.map(d => d.type));
  assert(types4.has("equal"), "computeDiff: mixed has equal segments");
  assert(types4.has("insert") || types4.has("delete"), "computeDiff: mixed has insert or delete segments");

  // 5. Empty strings -> empty result
  const r5 = computeDiff("", "");
  assertEqual(r5.diffs.length, 0, "computeDiff: both empty yields 0 segments");
  assertEqual(r5.stats, { additions: 0, deletions: 0, unchanged: 0 }, "computeDiff: both empty yields zero stats");
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. SQL TOOL TESTS
// ═══════════════════════════════════════════════════════════════════════════════

section("sql.ts - formatSql");
{
  // 1. Format simple SELECT -> proper indentation
  const r1 = formatSql("SELECT id, name FROM users WHERE active = 1");
  assertEqual(r1.error, null, "formatSql: simple SELECT has no error");
  assert(r1.output.includes("\n"), "formatSql: output is multi-line");
  assert(r1.output.includes("SELECT"), "formatSql: output contains SELECT (uppercased)");
  assert(r1.output.includes("FROM"), "formatSql: output contains FROM");

  // Empty input
  const r1b = formatSql("  ");
  assertEqual(r1b, { output: "", error: null }, "formatSql: empty input returns empty");

  // Keyword case lower
  const r1c = formatSql("SELECT id FROM users", "sql", 2, "lower");
  assert(r1c.output.includes("select"), "formatSql: keywordCase lower uses lowercase keywords");
}

section("sql.ts - minifySql");
{
  // 2. Minify SQL -> single line
  const r2 = minifySql("SELECT  id,\n  name\nFROM  users\nWHERE active = 1");
  assertEqual(r2.error, null, "minifySql: has no error");
  assert(!r2.output.includes("\n"), "minifySql: output is single line");
  assertEqual(r2.output, "SELECT id, name FROM users WHERE active = 1", "minifySql: extra whitespace collapsed");

  // 3. String literals preserved in minify
  const r3 = minifySql("SELECT 'abc--def' FROM t");
  assertEqual(r3.error, null, "minifySql: string literal has no error");
  assert(r3.output.includes("'abc--def'"), "minifySql: string literal preserved (-- inside quotes not treated as comment)");

  // 4. Block comment removed in minify
  const r4 = minifySql("SELECT /* comment */ id FROM t");
  assertEqual(r4.error, null, "minifySql: block comment has no error");
  assert(!r4.output.includes("comment"), "minifySql: block comment removed");
  assert(r4.output.includes("id"), "minifySql: code after block comment preserved");

  // 5. Line comment removed in minify
  const r5 = minifySql("SELECT id -- this is a comment\nFROM t");
  assertEqual(r5.error, null, "minifySql: line comment has no error");
  assert(!r5.output.includes("this is a comment"), "minifySql: line comment removed");
  assert(r5.output.includes("FROM"), "minifySql: code after line comment preserved");

  // 6. Empty input -> empty output
  const r6 = minifySql("  ");
  assertEqual(r6, { output: "", error: null }, "minifySql: empty input returns empty");
}

// ═══════════════════════════════════════════════════════════════════════════════
// 5. URL-ENCODE TOOL TESTS
// ═══════════════════════════════════════════════════════════════════════════════

section("url-encode.ts - encodeUrl / decodeUrl");
{
  // 1. Encode special chars -> percent-encoded
  const r1 = encodeUrl("hello world&foo=bar");
  assertEqual(r1.error, null, "encodeUrl: no error");
  assertEqual(r1.output, "hello%20world%26foo%3Dbar", "encodeUrl: special chars percent-encoded");

  // 2. Decode percent-encoded -> original
  const r2 = decodeUrl("hello%20world%26foo%3Dbar");
  assertEqual(r2.error, null, "decodeUrl: no error");
  assertEqual(r2.output, "hello world&foo=bar", "decodeUrl: percent-encoded decoded to original");

  // Roundtrip
  const original = "test value=100% done!";
  const encoded = encodeUrl(original);
  const decoded = decodeUrl(encoded.output);
  assertEqual(decoded.output, original, "encodeUrl/decodeUrl: roundtrip preserves original");

  // 3. encodeFullUrl preserves :, /, ?
  const r3 = encodeFullUrl("https://example.com/path?q=hello world");
  assertEqual(r3.error, null, "encodeFullUrl: no error");
  assert(r3.output.includes("https://"), "encodeFullUrl: preserves https://");
  assert(r3.output.includes("?"), "encodeFullUrl: preserves ?");
  assert(r3.output.includes("%20"), "encodeFullUrl: encodes space");

  // decodeFullUrl
  const r3b = decodeFullUrl(r3.output);
  assertEqual(r3b.output, "https://example.com/path?q=hello world", "decodeFullUrl: decodes back to original URL");

  // 4. Empty input -> empty output
  assertEqual(encodeUrl(""), { output: "", error: null }, "encodeUrl: empty input returns empty");
  assertEqual(decodeUrl(""), { output: "", error: null }, "decodeUrl: empty input returns empty");
  assertEqual(encodeFullUrl(""), { output: "", error: null }, "encodeFullUrl: empty input returns empty");
  assertEqual(decodeFullUrl(""), { output: "", error: null }, "decodeFullUrl: empty input returns empty");

  // 5. Malformed percent -> error
  const r5 = decodeUrl("%ZZ");
  assert(r5.error !== null, "decodeUrl: malformed percent encoding returns error");
}

// ═══════════════════════════════════════════════════════════════════════════════
// 6. BASE64 TOOL TESTS
// ═══════════════════════════════════════════════════════════════════════════════

section("base64.ts - encodeBase64 / decodeBase64");
{
  // 1. Encode "Hello" -> "SGVsbG8="
  const r1 = encodeBase64("Hello");
  assertEqual(r1.error, null, "encodeBase64: no error for 'Hello'");
  assertEqual(r1.output, "SGVsbG8=", "encodeBase64: 'Hello' -> 'SGVsbG8='");

  // 2. Decode "SGVsbG8=" -> "Hello"
  const r2 = decodeBase64("SGVsbG8=");
  assertEqual(r2.error, null, "decodeBase64: no error");
  assertEqual(r2.output, "Hello", "decodeBase64: 'SGVsbG8=' -> 'Hello'");

  // 3. UTF-8 emoji encode/decode roundtrip
  const emoji = "Hello \u{1F600}\u{1F30D}";
  const r3enc = encodeBase64(emoji);
  assertEqual(r3enc.error, null, "encodeBase64: no error for emoji");
  const r3dec = decodeBase64(r3enc.output);
  assertEqual(r3dec.error, null, "decodeBase64: no error for emoji decode");
  assertEqual(r3dec.output, emoji, "base64: emoji roundtrip preserves content");

  // 4. Invalid base64 -> error
  const r4 = decodeBase64("!!!not-valid-base64!!!");
  assert(r4.error !== null, "decodeBase64: invalid base64 returns error");

  // 5. Empty input -> empty output
  assertEqual(encodeBase64(""), { output: "", error: null }, "encodeBase64: empty input returns empty");
  assertEqual(decodeBase64(""), { output: "", error: null }, "decodeBase64: empty input returns empty");

  // Whitespace in base64 is stripped
  const r5b = decodeBase64("SGVs\n  bG8=");
  assertEqual(r5b.output, "Hello", "decodeBase64: whitespace in input is stripped before decoding");
}

// ═══════════════════════════════════════════════════════════════════════════════
// 7. JWT TOOL TESTS
// ═══════════════════════════════════════════════════════════════════════════════

section("jwt.ts - decodeJwt");
{
  // Build a sample JWT for testing
  const sampleJwt = buildSampleJwt();

  // 1. Valid JWT decode -> header + payload + signature
  const r1 = decodeJwt(sampleJwt);
  assertEqual(r1.error, null, "decodeJwt: valid JWT has no error");
  assert(r1.header !== null, "decodeJwt: header is not null");
  assertEqual(r1.header.alg, "HS256", "decodeJwt: header.alg is HS256");
  assertEqual(r1.header.typ, "JWT", "decodeJwt: header.typ is JWT");
  assert(r1.payload !== null, "decodeJwt: payload is not null");
  assertEqual(r1.payload.sub, "1234567890", "decodeJwt: payload.sub is correct");
  assertEqual(r1.payload.name, "John Doe", "decodeJwt: payload.name is correct");
  assert(r1.signature.length > 0, "decodeJwt: signature is non-empty");
  assert(r1.issuedAt !== null, "decodeJwt: issuedAt is set");

  // 2. Invalid token -> error
  const r2a = decodeJwt("not.a.valid.jwt.too.many.parts");
  assert(r2a.error !== null, "decodeJwt: too many parts returns error");

  const r2b = decodeJwt("onlyone");
  assert(r2b.error !== null, "decodeJwt: single part returns error");

  const r2c = decodeJwt("two.parts");
  assert(r2c.error !== null, "decodeJwt: two parts returns error");

  // 3. Expired JWT -> isExpired: true
  // Create an expired JWT (exp in the past)
  const expiredPayload = btoa(JSON.stringify({
    sub: "user",
    exp: Math.floor(Date.now() / 1000) - 3600, // 1 hour ago
    iat: Math.floor(Date.now() / 1000) - 7200,
  })).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const expiredHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const expiredJwt = `${expiredHeader}.${expiredPayload}.fakesignature`;
  const r3 = decodeJwt(expiredJwt);
  assertEqual(r3.error, null, "decodeJwt: expired JWT has no error");
  assertEqual(r3.isExpired, true, "decodeJwt: expired JWT isExpired is true");
  assert(r3.expiresAt !== null, "decodeJwt: expired JWT has expiresAt");

  // Non-expired JWT
  const futurePayload = btoa(JSON.stringify({
    sub: "user",
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
    iat: Math.floor(Date.now() / 1000),
  })).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const futureJwt = `${expiredHeader}.${futurePayload}.fakesignature`;
  const r3b = decodeJwt(futureJwt);
  assertEqual(r3b.isExpired, false, "decodeJwt: future JWT isExpired is false");

  // 4. Empty input -> no result
  const r4 = decodeJwt("");
  assertEqual(r4.header, null, "decodeJwt: empty input header is null");
  assertEqual(r4.payload, null, "decodeJwt: empty input payload is null");
  assertEqual(r4.error, null, "decodeJwt: empty input has no error");

  const r4b = decodeJwt("   ");
  assertEqual(r4b.header, null, "decodeJwt: whitespace-only input header is null");
}

// ═══════════════════════════════════════════════════════════════════════════════
// 8. HASH TOOL TESTS
// ═══════════════════════════════════════════════════════════════════════════════

section("hash.ts - generateHash / generateAllHashes");

const hasCryptoSubtle = typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.subtle !== "undefined";

if (hasCryptoSubtle) {
  // 1. SHA-256 of "hello" -> known hash
  const r1 = await generateHash("hello", "SHA-256");
  assertEqual(r1.error, null, "generateHash: SHA-256 of 'hello' has no error");
  assertEqual(
    r1.hash,
    "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    "generateHash: SHA-256 of 'hello' matches known value"
  );

  // SHA-1 of "hello" -> known hash
  const r1b = await generateHash("hello", "SHA-1");
  assertEqual(
    r1b.hash,
    "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d",
    "generateHash: SHA-1 of 'hello' matches known value"
  );

  // MD5 of "hello" -> known hash
  const r1md5 = await generateHash("hello", "MD5");
  assertEqual(r1md5.error, null, "generateHash: MD5 of 'hello' has no error");
  assertEqual(
    r1md5.hash,
    "5d41402abc4b2a76b9719d911017c592",
    "generateHash: MD5 of 'hello' matches known value"
  );

  // MD5 of empty string
  const r1md5e = await generateHash("", "MD5");
  assertEqual(r1md5e.hash, "", "generateHash: MD5 empty input returns empty hash");

  // 2. Empty input -> empty result
  const r2 = await generateHash("", "SHA-256");
  assertEqual(r2, { hash: "", error: null }, "generateHash: empty input returns empty hash");

  // 3. generateAllHashes returns all 4 algorithms
  const r3 = await generateAllHashes("hello");
  const algos = Object.keys(r3);
  assertEqual(algos.length, 5, "generateAllHashes: returns 5 algorithm results");
  assert(algos.includes("MD5"), "generateAllHashes: includes MD5");
  assert(algos.includes("SHA-1"), "generateAllHashes: includes SHA-1");
  assert(algos.includes("SHA-256"), "generateAllHashes: includes SHA-256");
  assert(algos.includes("SHA-384"), "generateAllHashes: includes SHA-384");
  assert(algos.includes("SHA-512"), "generateAllHashes: includes SHA-512");
  // All hashes should be non-empty
  for (const algo of algos) {
    assert(r3[algo].length > 0, `generateAllHashes: ${algo} hash is non-empty`);
  }
  // Verify SHA-256 matches single call
  assertEqual(r3["SHA-256"], r1.hash, "generateAllHashes: SHA-256 matches single generateHash");
} else {
  skip("generateHash: crypto.subtle not available in this environment");
  skip("generateHash: empty input (skipped)");
  skip("generateAllHashes: all 4 algorithms (skipped)");
}

// ═══════════════════════════════════════════════════════════════════════════════
// diff.ts - computeLineDiff (Side-by-Side)
// ═══════════════════════════════════════════════════════════════════════════════

section("diff.ts - computeLineDiff");
{
  const lines = computeLineDiff("line1\nline2\nline3", "line1\nchanged\nline3");
  assert(lines.length >= 3, "computeLineDiff: returns at least 3 rows");

  // First and last lines are equal
  const equalRows = lines.filter(r => r.left.type === "equal" && r.right.type === "equal");
  assert(equalRows.length >= 2, "computeLineDiff: at least 2 equal rows (line1, line3)");

  // Should have delete and insert for the changed line
  const hasDelete = lines.some(r => r.left.type === "delete");
  const hasInsert = lines.some(r => r.right.type === "insert");
  assert(hasDelete, "computeLineDiff: has deleted line");
  assert(hasInsert, "computeLineDiff: has inserted line");

  // Empty inputs
  const emptyLines = computeLineDiff("", "new");
  assert(emptyLines.length >= 1, "computeLineDiff: empty original produces rows");

  // Identical inputs
  const sameLines = computeLineDiff("same\ntext", "same\ntext");
  assert(sameLines.every(r => r.left.type === "equal"), "computeLineDiff: identical texts are all equal");

  // Line numbers
  assert(lines[0].left.lineNo === 1, "computeLineDiff: first left lineNo is 1");
  assert(lines[0].right.lineNo === 1, "computeLineDiff: first right lineNo is 1");
}

// ═══════════════════════════════════════════════════════════════════════════════
// json.ts - jsonToYaml, yamlToJson, jsonToCsv, highlightJson
// ═══════════════════════════════════════════════════════════════════════════════

section("json.ts - jsonToYaml");
{
  const r1 = jsonToYaml('{"name":"test","count":42}');
  assertEqual(r1.error, null, "jsonToYaml: valid JSON has no error");
  assert(r1.output.includes("name: test"), "jsonToYaml: output contains 'name: test'");
  assert(r1.output.includes("count: 42"), "jsonToYaml: output contains 'count: 42'");

  const r2 = jsonToYaml("not json");
  assert(r2.error !== null, "jsonToYaml: invalid JSON returns error");

  const r3 = jsonToYaml("  ");
  assertEqual(r3.output, "", "jsonToYaml: empty input returns empty output");
}

section("json.ts - yamlToJson");
{
  const r1 = yamlToJson("name: test\ncount: 42\n");
  assertEqual(r1.error, null, "yamlToJson: valid YAML has no error");
  const parsed = JSON.parse(r1.output);
  assertEqual(parsed.name, "test", "yamlToJson: parsed name matches");
  assertEqual(parsed.count, 42, "yamlToJson: parsed count matches");

  const r2 = yamlToJson("  ");
  assertEqual(r2.output, "", "yamlToJson: empty input returns empty output");

  // Array YAML
  const r3 = yamlToJson("- a\n- b\n- c\n");
  assertEqual(r3.error, null, "yamlToJson: array YAML has no error");
  const arr = JSON.parse(r3.output);
  assertEqual(arr.length, 3, "yamlToJson: array length is 3");
}

section("json.ts - jsonToCsv");
{
  const r1 = jsonToCsv('[{"name":"Alice","age":30},{"name":"Bob","age":25}]');
  assertEqual(r1.error, null, "jsonToCsv: valid array has no error");
  const lines = r1.output.split("\n");
  assertEqual(lines[0], "name,age", "jsonToCsv: header row correct");
  assertEqual(lines[1], "Alice,30", "jsonToCsv: first data row correct");
  assertEqual(lines[2], "Bob,25", "jsonToCsv: second data row correct");

  // Single object → treated as array of 1
  const r2 = jsonToCsv('{"x":1,"y":2}');
  assertEqual(r2.error, null, "jsonToCsv: single object has no error");
  assert(r2.output.includes("x,y"), "jsonToCsv: single object headers correct");

  // CSV escaping
  const r3 = jsonToCsv('[{"msg":"hello, world","quote":"she said \\"hi\\""}]');
  assertEqual(r3.error, null, "jsonToCsv: escaping has no error");
  assert(r3.output.includes('"hello, world"'), "jsonToCsv: comma in value is quoted");

  const r4 = jsonToCsv("  ");
  assertEqual(r4.output, "", "jsonToCsv: empty input returns empty output");

  const r5 = jsonToCsv("invalid");
  assert(r5.error !== null, "jsonToCsv: invalid JSON returns error");
}

section("json.ts - highlightJson");
{
  const tokens = highlightJson('{"name": "test", "count": 42, "active": true, "meta": null}');
  assert(tokens.length > 0, "highlightJson: returns tokens");

  const keyTokens = tokens.filter(t => t.type === "key");
  assert(keyTokens.length >= 3, "highlightJson: has key tokens");
  assert(keyTokens.some(t => t.text === '"name"'), "highlightJson: found 'name' key");

  const stringTokens = tokens.filter(t => t.type === "string");
  assert(stringTokens.some(t => t.text === '"test"'), "highlightJson: found 'test' string value");

  const numberTokens = tokens.filter(t => t.type === "number");
  assert(numberTokens.some(t => t.text === "42"), "highlightJson: found number 42");

  const booleanTokens = tokens.filter(t => t.type === "boolean");
  assert(booleanTokens.some(t => t.text === "true"), "highlightJson: found boolean true");

  const nullTokens = tokens.filter(t => t.type === "null");
  assert(nullTokens.some(t => t.text === "null"), "highlightJson: found null");

  const braceTokens = tokens.filter(t => t.type === "brace");
  assert(braceTokens.length >= 2, "highlightJson: has brace tokens");

  // Empty
  const empty = highlightJson("");
  assertEqual(empty.length, 0, "highlightJson: empty input returns no tokens");
}

// ═══════════════════════════════════════════════════════════════════════════════
// share.ts - encodeShareState / decodeShareState
// ═══════════════════════════════════════════════════════════════════════════════

section("share.ts - encodeShareState / decodeShareState");
{
  // Round-trip test
  const state = { input: '{"hello":"world"}' };
  const encoded = encodeShareState(state);
  assert(encoded.length > 0, "encodeShareState: produces non-empty output");
  assert(!encoded.includes("+"), "encodeShareState: URL-safe (no +)");
  assert(!encoded.includes("/"), "encodeShareState: URL-safe (no /)");

  const decoded = decodeShareState(encoded);
  assertEqual(decoded.input, state.input, "decodeShareState: round-trip preserves input");

  // UTF-8 support
  const utf8State = { input: '한국어 テスト 🚀' };
  const utf8Encoded = encodeShareState(utf8State);
  const utf8Decoded = decodeShareState(utf8Encoded);
  assertEqual(utf8Decoded.input, utf8State.input, "share: round-trip UTF-8 preserves data");

  // Empty/null handling
  const nullResult = decodeShareState("");
  assertEqual(nullResult, null, "decodeShareState: empty string returns null");

  const invalidResult = decodeShareState("!!!invalid!!!");
  assertEqual(invalidResult, null, "decodeShareState: invalid input returns null");

  // Size limit: >8KB should return empty
  const bigInput = "x".repeat(9000);
  const bigEncoded = encodeShareState({ input: bigInput });
  assertEqual(bigEncoded, "", "encodeShareState: >8KB returns empty string");

  // Size check uses TextEncoder (not Blob)
  const unicodeState = { input: "가".repeat(3000) }; // 3-byte chars = ~9KB
  const unicodeEncoded = encodeShareState(unicodeState);
  assertEqual(unicodeEncoded, "", "encodeShareState: multibyte chars counted correctly (TextEncoder)");
}

// ═══════════════════════════════════════════════════════════════════════════════
// blog.ts - getAllPosts / getPostBySlug
// ═══════════════════════════════════════════════════════════════════════════════

section("blog.ts - getAllPosts / getPostBySlug");
{
  const posts = getAllPosts();
  assert(posts.length >= 4, "getAllPosts: returns at least 4 posts");
  assert(posts.every(p => p.slug && p.title && p.content), "getAllPosts: all posts have slug, title, content");

  // Sorted by date descending
  for (let i = 1; i < posts.length; i++) {
    assert(posts[i - 1].date >= posts[i].date, `getAllPosts: sorted descending (${posts[i-1].date} >= ${posts[i].date})`);
  }

  // getPostBySlug
  const post = getPostBySlug("json-formatting-best-practices");
  assert(post !== undefined, "getPostBySlug: found json-formatting post");
  assertEqual(post.relatedTool, "jsonFormatter", "getPostBySlug: relatedTool is jsonFormatter");

  const missing = getPostBySlug("nonexistent-post");
  assertEqual(missing, undefined, "getPostBySlug: nonexistent returns undefined");
}

// ═══════════════════════════════════════════════════════════════════════════════
// en.json - i18n key completeness
// ═══════════════════════════════════════════════════════════════════════════════

section("en.json - FAQ completeness");
{
  const fs = await import("fs");
  const enJson = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));
  const toolKeys = ["jsonFormatter", "base64", "urlEncode", "regexTester", "diffChecker", "jwtDecoder", "sqlFormatter", "hashGenerator"];

  for (const key of toolKeys) {
    const faq = enJson.tools[key]?.faq;
    assert(faq !== undefined, `en.json: ${key} has faq object`);
    for (const n of ["q1", "a1", "q2", "a2", "q3", "a3", "q4", "a4", "q5", "a5"]) {
      assert(faq[n] !== undefined && faq[n].length > 0, `en.json: ${key}.faq.${n} exists`);
    }
  }

  // shareTooLarge key exists
  assert(enJson.common.shareTooLarge !== undefined, "en.json: common.shareTooLarge exists");
  assert(enJson.common.shareTooLarge.length > 0, "en.json: common.shareTooLarge is non-empty");
}

// ═══════════════════════════════════════════════════════════════════════════════
// Batch 3: Tab indent, DIFF_SAMPLE, debounce, accessibility, error handling
// ═══════════════════════════════════════════════════════════════════════════════

section("json.ts - Tab indent support");
{
  const r1 = formatJson('{"a":1,"b":2}', "\t");
  assertEqual(r1.error, null, "formatJson with tab indent: no error");
  assert(r1.output.includes("\t"), "formatJson with tab indent: output contains tab characters");
  assert(!r1.output.includes("  "), "formatJson with tab indent: no space indentation");

  const r2 = yamlToJson("name: test\ncount: 42\n", "\t");
  assertEqual(r2.error, null, "yamlToJson with tab indent: no error");
  assert(r2.output.includes("\t"), "yamlToJson with tab indent: output contains tab characters");

  // Number indent still works
  const r3 = formatJson('{"a":1}', 4);
  assertEqual(r3.error, null, "formatJson with 4-space indent: no error");
  assert(r3.output.includes("    "), "formatJson with 4-space indent: has 4-space indentation");
}

section("diff.ts - DIFF_SAMPLE export");
{
  assert(DIFF_SAMPLE !== undefined, "DIFF_SAMPLE: is exported");
  assert(DIFF_SAMPLE.original.length > 0, "DIFF_SAMPLE: original is non-empty");
  assert(DIFF_SAMPLE.modified.length > 0, "DIFF_SAMPLE: modified is non-empty");
  assert(DIFF_SAMPLE.original !== DIFF_SAMPLE.modified, "DIFF_SAMPLE: original and modified differ");

  // Can compute diff with sample
  const result = computeDiff(DIFF_SAMPLE.original, DIFF_SAMPLE.modified);
  assert(result.stats.additions > 0 || result.stats.deletions > 0, "DIFF_SAMPLE: diff produces changes");

  const lineDiffs = computeLineDiff(DIFF_SAMPLE.original, DIFF_SAMPLE.modified);
  assert(lineDiffs.length > 0, "DIFF_SAMPLE: line diff produces rows");
}

section("regex.ts - error handling safety");
{
  // Invalid regex pattern should return error string, not throw
  const r1 = testRegex("[invalid", "test", "g");
  assert(r1.error !== null, "testRegex: invalid pattern returns error");
  assert(typeof r1.error === "string", "testRegex: error is a string");
  assertEqual(r1.matches.length, 0, "testRegex: invalid pattern returns no matches");
}

section("Accessibility: en.json i18n key completeness for new features");
{
  const fs = await import("fs");
  const enJson = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));

  // Check required common keys exist
  const commonKeys = ["copy", "copied", "share", "shareTooLarge", "clear", "download", "sample", "swap", "input", "output"];
  for (const key of commonKeys) {
    assert(enJson.common[key] !== undefined && enJson.common[key].length > 0, `en.json: common.${key} exists and non-empty`);
  }

  // Check indent keys
  assert(enJson.common.indent?.twoSpaces, "en.json: common.indent.twoSpaces exists");
  assert(enJson.common.indent?.fourSpaces, "en.json: common.indent.fourSpaces exists");
  assert(enJson.common.indent?.tab, "en.json: common.indent.tab exists");
}

// ═══════════════════════════════════════════════════════════════════════════════
// P2: replaceWithRegex
// ═══════════════════════════════════════════════════════════════════════════════

section("regex.ts - replaceWithRegex");
{
  // Basic replacement
  const r1 = replaceWithRegex("world", "hello world", "g", "earth");
  assertEqual(r1.error, null, "replaceWithRegex: basic has no error");
  assertEqual(r1.output, "hello earth", "replaceWithRegex: basic output correct");
  assertEqual(r1.count, 1, "replaceWithRegex: basic count is 1");

  // Global replacement
  const r2 = replaceWithRegex("o", "foo boo", "g", "0");
  assertEqual(r2.output, "f00 b00", "replaceWithRegex: global replaces all");
  assertEqual(r2.count, 4, "replaceWithRegex: global count is 4");

  // Group reference ($1)
  const r3 = replaceWithRegex("(\\w+)@(\\w+)", "user@host", "g", "$1 at $2");
  assertEqual(r3.output, "user at host", "replaceWithRegex: group reference works");

  // Empty pattern
  const r4 = replaceWithRegex("", "hello", "g", "x");
  assertEqual(r4.output, "", "replaceWithRegex: empty pattern returns empty");

  // Invalid pattern
  const r5 = replaceWithRegex("[invalid", "hello", "g", "x");
  assert(r5.error !== null, "replaceWithRegex: invalid pattern returns error");
}

// ═══════════════════════════════════════════════════════════════════════════════
// P2: encodeBase64Url / decodeBase64Url
// ═══════════════════════════════════════════════════════════════════════════════

section("base64.ts - Base64URL");
{
  // Encode
  const r1 = encodeBase64Url("Hello, World!");
  assertEqual(r1.error, null, "encodeBase64Url: no error");
  assert(!r1.output.includes("+"), "encodeBase64Url: no + character");
  assert(!r1.output.includes("/"), "encodeBase64Url: no / character");
  assert(!r1.output.includes("="), "encodeBase64Url: no padding");

  // Round-trip
  const r2 = decodeBase64Url(r1.output);
  assertEqual(r2.error, null, "decodeBase64Url: no error");
  assertEqual(r2.output, "Hello, World!", "Base64URL: round-trip preserves data");

  // UTF-8
  const r3 = encodeBase64Url("café 🌍");
  const r4 = decodeBase64Url(r3.output);
  assertEqual(r4.output, "café 🌍", "Base64URL: round-trip UTF-8");

  // Empty
  const r5 = encodeBase64Url("");
  assertEqual(r5.output, "", "encodeBase64Url: empty input returns empty");
  const r6 = decodeBase64Url("");
  assertEqual(r6.output, "", "decodeBase64Url: empty input returns empty");

  // Standard vs URL-safe difference
  const stdResult = encodeBase64("a>b?c");
  const urlResult = encodeBase64Url("a>b?c");
  assert(stdResult.output !== urlResult.output || !urlResult.output.includes("+"), "Base64URL: differs from standard or avoids unsafe chars");
}

// ═══════════════════════════════════════════════════════════════════════════════
// P2: queryJsonPath
// ═══════════════════════════════════════════════════════════════════════════════

section("json.ts - queryJsonPath");
{
  const sample = '{"store":{"book":[{"title":"A","price":10},{"title":"B","price":20}],"name":"Shop"}}';

  // Simple key
  const r1 = queryJsonPath(sample, "$.store.name");
  assertEqual(r1.error, null, "queryJsonPath: simple key no error");
  assertEqual(r1.matches, ["Shop"], "queryJsonPath: simple key result");

  // Array index
  const r2 = queryJsonPath(sample, "$.store.book[0].title");
  assertEqual(r2.error, null, "queryJsonPath: array index no error");
  assertEqual(r2.matches, ["A"], "queryJsonPath: array index result");

  // Second element
  const r3 = queryJsonPath(sample, "$.store.book[1].price");
  assertEqual(r3.matches, [20], "queryJsonPath: second element price");

  // Wildcard
  const r4 = queryJsonPath(sample, "$.store.book[*].title");
  assertEqual(r4.matches, ["A", "B"], "queryJsonPath: wildcard returns all titles");

  // Root only
  const r5 = queryJsonPath(sample, "$");
  assert(r5.matches.length === 1, "queryJsonPath: root returns single result");

  // Non-existent path
  const r6 = queryJsonPath(sample, "$.store.nonexistent");
  assertEqual(r6.matches, [], "queryJsonPath: non-existent path returns empty");

  // Empty input
  const r7 = queryJsonPath("", "$.x");
  assertEqual(r7.matches, [], "queryJsonPath: empty input returns empty");

  // Invalid JSON
  const r8 = queryJsonPath("not json", "$.x");
  assert(r8.error !== null, "queryJsonPath: invalid JSON returns error");

  // Bracket notation
  const r9 = queryJsonPath(sample, "$['store']['name']");
  assertEqual(r9.matches, ["Shop"], "queryJsonPath: bracket notation works");
}

// ═══════════════════════════════════════════════════════════════════════════════
// P2: i18n keys for new features
// ═══════════════════════════════════════════════════════════════════════════════

section("en.json - P2 feature i18n keys");
{
  const fs = await import("fs");
  const enJson = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));

  // Regex replace keys
  assert(enJson.tools.regexTester.replace, "en.json: regexTester.replace exists");
  assert(enJson.tools.regexTester.replacePlaceholder, "en.json: regexTester.replacePlaceholder exists");
  assert(enJson.tools.regexTester.replaceResult, "en.json: regexTester.replaceResult exists");
  assert(enJson.tools.regexTester.replacements, "en.json: regexTester.replacements exists");
  assert(enJson.tools.regexTester.matchMode, "en.json: regexTester.matchMode exists");
  assert(enJson.tools.regexTester.replaceMode, "en.json: regexTester.replaceMode exists");

  // Base64 URL-safe keys
  assert(enJson.tools.base64.standard, "en.json: base64.standard exists");
  assert(enJson.tools.base64.urlSafe, "en.json: base64.urlSafe exists");

  // JWT verify keys
  assert(enJson.tools.jwtDecoder.secret, "en.json: jwtDecoder.secret exists");
  assert(enJson.tools.jwtDecoder.secretPlaceholder, "en.json: jwtDecoder.secretPlaceholder exists");
  assert(enJson.tools.jwtDecoder.verify, "en.json: jwtDecoder.verify exists");
  assert(enJson.tools.jwtDecoder.validSignature, "en.json: jwtDecoder.validSignature exists");
  assert(enJson.tools.jwtDecoder.invalidSignature, "en.json: jwtDecoder.invalidSignature exists");

  // Hash file upload keys
  assert(enJson.tools.hashGenerator.uploadFile, "en.json: hashGenerator.uploadFile exists");
  assert(enJson.tools.hashGenerator.fileName, "en.json: hashGenerator.fileName exists");
  assert(enJson.tools.hashGenerator.fileSize, "en.json: hashGenerator.fileSize exists");

  // JSON Path keys
  assert(enJson.tools.jsonFormatter.jsonPath, "en.json: jsonFormatter.jsonPath exists");
  assert(enJson.tools.jsonFormatter.jsonPathPlaceholder, "en.json: jsonFormatter.jsonPathPlaceholder exists");
  assert(enJson.tools.jsonFormatter.queryPath, "en.json: jsonFormatter.queryPath exists");
}

// P3: ko.json key parity with en.json
{
  section("ko.json — key parity with en.json");
  const fs = await import("fs");
  const enJson = JSON.parse(fs.readFileSync("messages/en.json", "utf8"));
  const koJson = JSON.parse(fs.readFileSync("messages/ko.json", "utf8"));

  function getLeafKeys(obj, prefix = "") {
    let keys = [];
    for (const k of Object.keys(obj)) {
      const path = prefix ? `${prefix}.${k}` : k;
      if (typeof obj[k] === "object" && obj[k] !== null && !Array.isArray(obj[k])) {
        keys = keys.concat(getLeafKeys(obj[k], path));
      } else {
        keys.push(path);
      }
    }
    return keys;
  }

  const enKeys = getLeafKeys(enJson);
  const koKeys = new Set(getLeafKeys(koJson));

  const missingInKo = enKeys.filter((k) => !koKeys.has(k));
  const extraInKo = [...koKeys].filter((k) => !enKeys.includes(k));

  assert(missingInKo.length === 0, `ko.json has all EN keys (missing: ${missingInKo.length === 0 ? "none" : missingInKo.slice(0, 5).join(", ")})`);
  assert(extraInKo.length === 0, `ko.json has no extra keys (extra: ${extraInKo.length === 0 ? "none" : extraInKo.slice(0, 5).join(", ")})`);
  assertEqual(enKeys.length, koKeys.size, `ko.json key count matches en.json (${enKeys.length})`);

  // Spot-check critical KO translations
  assert(koJson.common?.copy?.length > 0, "ko.json: common.copy exists");
  assert(koJson.common?.clear?.length > 0, "ko.json: common.clear exists");
  assert(koJson.tools?.jsonFormatter?.title?.length > 0, "ko.json: jsonFormatter.title exists");
  assert(koJson.tools?.regexTester?.title?.length > 0, "ko.json: regexTester.title exists");
  assert(koJson.tools?.hashGenerator?.title?.length > 0, "ko.json: hashGenerator.title exists");
  assert(koJson.home?.hero?.title?.length > 0, "ko.json: home.hero.title exists");
  assert(koJson.home?.hero?.subtitle?.length > 0, "ko.json: home.hero.subtitle exists");
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════════════════

console.log("\n" + "=".repeat(60));
console.log(`\x1b[1mTest Results: ${passedTests} passed, ${failedTests} failed, ${skippedTests} skipped (${totalTests} total)\x1b[0m`);

if (failures.length > 0) {
  console.log(`\n\x1b[31mFailed tests:\x1b[0m`);
  failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
}

console.log("=".repeat(60));
process.exit(failedTests > 0 ? 1 : 0);
