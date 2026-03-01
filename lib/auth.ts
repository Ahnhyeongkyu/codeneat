import { SignJWT, jwtVerify } from "jose";

const ALG = "HS256";
const COOKIE_NAME = "codeneat-session";
const TTL_DAYS = 7;

function getSecret() {
  const raw = process.env.JWT_SECRET;
  if (!raw) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(raw);
}

export interface SessionPayload {
  licenseKey: string;
  plan: "pro";
}

/** Create a signed JWT */
export async function createSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${TTL_DAYS}d`)
    .sign(getSecret());
}

/** Verify and decode a JWT — returns null if invalid/expired */
export async function verifySession(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/** Cookie configuration */
export const SESSION_COOKIE = {
  name: COOKIE_NAME,
  maxAge: TTL_DAYS * 24 * 60 * 60,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
