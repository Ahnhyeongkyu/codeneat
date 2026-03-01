import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE.name, "", {
    maxAge: 0,
    httpOnly: SESSION_COOKIE.httpOnly,
    secure: SESSION_COOKIE.secure,
    sameSite: SESSION_COOKIE.sameSite,
    path: SESSION_COOKIE.path,
  });
  return response;
}
