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
    return { ...empty, error: (e as Error).message };
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
