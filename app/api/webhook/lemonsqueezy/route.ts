import { NextRequest } from "next/server";
import { verifySignature } from "@/lib/crypto";
import { getRedis } from "@/lib/redis";

interface WebhookAttributes {
  customer_id?: number;
  status?: string;
  total_formatted?: string;
  user_email?: string;
}

interface WebhookPayload {
  meta?: { event_name?: string };
  data?: {
    id?: string;
    attributes?: WebhookAttributes;
  };
}

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

  let payload: WebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  const attrs = payload.data?.attributes;

  console.log(`[webhook] Lemon Squeezy event: ${eventName}`, {
    customerId: attrs?.customer_id,
    status: attrs?.status,
  });

  switch (eventName) {
    case "subscription_created":
    case "subscription_resumed":
    case "subscription_unpaused":
      await setSubscriptionStatus(attrs, "active");
      break;

    case "subscription_updated":
      if (attrs?.status === "active") {
        await setSubscriptionStatus(attrs, "active");
      } else if (
        attrs?.status === "cancelled" ||
        attrs?.status === "expired" ||
        attrs?.status === "paused"
      ) {
        await clearSubscriptionStatus(attrs);
      }
      break;

    case "subscription_cancelled":
    case "subscription_expired":
    case "subscription_paused":
      await clearSubscriptionStatus(attrs);
      break;

    case "order_created":
      console.log(`[webhook] Order created: ${payload.data?.id}`, {
        total: attrs?.total_formatted,
        email: attrs?.user_email,
      });
      break;

    case "license_key_created":
      console.log(`[webhook] License key created for customer ${attrs?.customer_id}`);
      break;

    default:
      console.log(`[webhook] Unhandled event: ${eventName}`);
  }

  return Response.json({ received: true });
}

async function setSubscriptionStatus(
  attrs: WebhookAttributes | undefined,
  status: string,
) {
  const customerId = attrs?.customer_id;
  if (!customerId) return;

  const redis = getRedis();
  if (redis) {
    await redis.set(
      `sub:customer:${customerId}`,
      JSON.stringify({ status, updatedAt: new Date().toISOString() }),
    );
  }
  console.log(`[webhook] Subscription ${status} for customer ${customerId}`);
}

async function clearSubscriptionStatus(attrs: WebhookAttributes | undefined) {
  const customerId = attrs?.customer_id;
  if (!customerId) return;

  const redis = getRedis();
  if (redis) {
    await redis.del(`sub:customer:${customerId}`);
  }
  console.log(`[webhook] Subscription cleared for customer ${customerId}`, {
    status: attrs?.status,
  });
}
