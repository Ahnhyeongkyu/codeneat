import { NextRequest } from "next/server";
import { verifySignature } from "@/lib/crypto";

export async function POST(req: NextRequest) {
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const signature = req.headers.get("x-signature");
  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 401 });
  }

  const rawBody = await req.text();

  const valid = await verifySignature(rawBody, signature, secret);
  if (!valid) {
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const eventName = payload.meta?.event_name;

  // Log webhook events for monitoring
  console.log(`[webhook] Lemon Squeezy event: ${eventName}`, {
    customerId: payload.data?.attributes?.customer_id,
    status: payload.data?.attributes?.status,
  });

  // Future: handle subscription_cancelled, subscription_expired, etc.
  // For now, just acknowledge
  return Response.json({ received: true });
}
