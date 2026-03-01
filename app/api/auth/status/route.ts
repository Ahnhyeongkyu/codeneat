import { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE.name)?.value;

  if (!token) {
    return Response.json({ plan: "free", isPro: false });
  }

  const session = await verifySession(token);

  if (!session) {
    return Response.json({ plan: "free", isPro: false });
  }

  return Response.json({ plan: session.plan, isPro: true });
}
