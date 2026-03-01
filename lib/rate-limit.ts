import { getRedis } from "./redis";

const DAILY_SECONDS = 86400;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  isPro: boolean;
}

// In-memory fallback when Redis is not configured
const memoryMap = new Map<string, { count: number; resetAt: number }>();

function checkMemoryRateLimit(key: string, limit: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = memoryMap.get(key);

  if (!entry || now > entry.resetAt) {
    memoryMap.set(key, { count: 1, resetAt: now + DAILY_SECONDS * 1000 });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}

export async function checkRateLimit(
  ip: string,
  isPro: boolean,
): Promise<RateLimitResult> {
  const limit = isPro ? 1000 : 10;
  const tier = isPro ? "pro" : "free";
  const key = `rl:ai:${tier}:${ip}`;

  const redis = getRedis();

  // Fallback to in-memory if Redis is not available
  if (!redis) {
    const result = checkMemoryRateLimit(key, limit);
    return { ...result, isPro };
  }

  const current = await redis.incr(key);

  // Set TTL on first request of the day
  if (current === 1) {
    await redis.expire(key, DAILY_SECONDS);
  }

  if (current > limit) {
    return { allowed: false, remaining: 0, isPro };
  }

  return { allowed: true, remaining: limit - current, isPro };
}
