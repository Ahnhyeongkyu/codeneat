import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { jwtVerify } from "jose";

const intlMiddleware = createIntlMiddleware(routing);

const COOKIE_NAME = "codeneat-session";

async function getProStatus(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const secret = process.env.JWT_SECRET;
  if (!secret) return false;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret),
    );
    return payload.plan === "pro";
  } catch {
    return false;
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // For API routes: inject x-codeneat-pro header
  if (pathname.startsWith("/api/")) {
    const isPro = await getProStatus(req);
    const headers = new Headers(req.headers);
    headers.set("x-codeneat-pro", String(isPro));

    return NextResponse.next({
      request: { headers },
    });
  }

  // For page routes: use next-intl middleware
  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!_next|_vercel|monitoring|.*\\..*).*)" ],
};
