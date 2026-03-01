import { NextRequest, NextResponse } from "next/server";
import { activateLicenseKey } from "@/lib/lemonsqueezy";
import { createSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: { licenseKey: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { licenseKey } = body;
  if (!licenseKey || typeof licenseKey !== "string") {
    return Response.json({ error: "License key is required" }, { status: 400 });
  }

  const instanceName = `codeneat-${Date.now()}`;

  try {
    const result = await activateLicenseKey(licenseKey.trim(), instanceName);

    if (!result.valid) {
      return Response.json(
        { error: result.error || "Invalid license key" },
        { status: 400 },
      );
    }

    const token = await createSession({
      licenseKey: licenseKey.trim(),
      plan: "pro",
    });

    const response = NextResponse.json({ success: true, plan: "pro" });
    response.cookies.set(SESSION_COOKIE.name, token, {
      maxAge: SESSION_COOKIE.maxAge,
      httpOnly: SESSION_COOKIE.httpOnly,
      secure: SESSION_COOKIE.secure,
      sameSite: SESSION_COOKIE.sameSite,
      path: SESSION_COOKIE.path,
    });

    return response;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return Response.json({ error: message }, { status: 500 });
  }
}
