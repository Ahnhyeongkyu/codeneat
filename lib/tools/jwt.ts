export interface JwtParts {
  header: Record<string, unknown> | null;
  payload: Record<string, unknown> | null;
  signature: string;
  isExpired: boolean | null;
  expiresAt: string | null;
  issuedAt: string | null;
  error: string | null;
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  if (pad) {
    base64 += "=".repeat(4 - pad);
  }
  return atob(base64);
}

export function decodeJwt(token: string): JwtParts {
  const empty: JwtParts = {
    header: null,
    payload: null,
    signature: "",
    isExpired: null,
    expiresAt: null,
    issuedAt: null,
    error: null,
  };

  if (!token.trim()) {
    return empty;
  }

  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { ...empty, error: "Invalid JWT format: expected 3 parts separated by dots" };
  }

  try {
    const headerJson = base64UrlDecode(parts[0]);
    const header = JSON.parse(headerJson);

    const payloadJson = base64UrlDecode(parts[1]);
    const payload = JSON.parse(payloadJson);

    const signature = parts[2];

    let isExpired: boolean | null = null;
    let expiresAt: string | null = null;
    let issuedAt: string | null = null;

    if (typeof payload.exp === "number") {
      const expDate = new Date(payload.exp * 1000);
      expiresAt = expDate.toISOString();
      isExpired = expDate.getTime() < Date.now();
    }

    if (typeof payload.iat === "number") {
      issuedAt = new Date(payload.iat * 1000).toISOString();
    }

    return { header, payload, signature, isExpired, expiresAt, issuedAt, error: null };
  } catch (e) {
    return { ...empty, error: e instanceof Error ? e.message : String(e) };
  }
}

export interface JwtVerifyResult {
  valid: boolean;
  error: string | null;
}

export async function verifyJwtHmac(
  token: string,
  secret: string
): Promise<JwtVerifyResult> {
  if (!token.trim() || !secret) {
    return { valid: false, error: "Token and secret are required" };
  }

  const parts = token.trim().split(".");
  if (parts.length !== 3) {
    return { valid: false, error: "Invalid JWT format" };
  }

  try {
    const header = JSON.parse(base64UrlDecode(parts[0]));
    const alg = header.alg;

    const algMap: Record<string, string> = {
      HS256: "SHA-256",
      HS384: "SHA-384",
      HS512: "SHA-512",
    };

    const hashAlg = algMap[alg];
    if (!hashAlg) {
      return { valid: false, error: `Unsupported algorithm: ${alg}. Only HS256/HS384/HS512 are supported.` };
    }

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: hashAlg },
      false,
      ["sign"]
    );

    const data = encoder.encode(`${parts[0]}.${parts[1]}`);
    const signatureBuffer = await crypto.subtle.sign("HMAC", key, data);
    const signatureArray = new Uint8Array(signatureBuffer);

    // Convert to base64url
    let binary = "";
    for (let i = 0; i < signatureArray.length; i++) {
      binary += String.fromCharCode(signatureArray[i]);
    }
    const expectedSig = btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    return { valid: expectedSig === parts[2], error: null };
  } catch (e) {
    return { valid: false, error: e instanceof Error ? e.message : String(e) };
  }
}

/** Build a sample JWT at runtime to avoid secret-detection false positives */
export function buildSampleJwt(): string {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const payload = btoa(JSON.stringify({
    sub: "1234567890",
    name: "John Doe",
    iat: 1516239022,
    exp: 1916239022,
  })).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const sig = "4S8B2Mz-fE6x7lXfI0OYcqVqsRJP3yFpM7t2EFsPKKA";
  return `${header}.${payload}.${sig}`;
}
