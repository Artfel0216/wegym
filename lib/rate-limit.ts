import { logger } from './logger';

const WINDOW_MS = 10_000;
const PROD_MAX_REQUESTS = 10;
const DEV_MAX_REQUESTS = 1_000;

const MAX_REQUESTS =
  process.env.NODE_ENV === 'production' ? PROD_MAX_REQUESTS : DEV_MAX_REQUESTS;

const redisUrl = () => process.env.REDIS_URL;

const memWindows = new Map<string, number[]>();

let redisClient: Awaited<ReturnType<typeof createRedisClient>> | null = null;
let redisFailed = false;

async function createRedisClient() {
  const { createClient } = await import('redis');
  const client = createClient({
    url: redisUrl(),
    socket: { reconnectStrategy: false },
  });
  await client.connect();
  return client;
}

async function getRedis() {
  if (redisFailed || !redisUrl()) return null;
  if (redisClient?.isOpen) return redisClient;
  try {
    redisClient = await createRedisClient();
    redisFailed = false;
    return redisClient;
  } catch (err) {
    logger.warn({ err }, '[RateLimit] Redis unavailable, using in-memory fallback');
    try { redisClient?.quit(); } catch { /* ignore */ }
    redisClient = null;
    redisFailed = true;
    return null;
  }
}

export const ratelimit = {
  async limit(identifier: string): Promise<{ success: boolean }> {
    const redis = await getRedis();
    if (redis) {
      try {
        const key = `ratelimit:${identifier}`;
        const current = await redis.incr(key);
        if (current === 1) await redis.pExpire(key, WINDOW_MS);
        return { success: current <= MAX_REQUESTS };
      } catch {
        return memLimit(identifier);
      }
    }
    return memLimit(identifier);
  },
};

function memLimit(identifier: string): { success: boolean } {
  const now = Date.now();
  const timestamps = memWindows.get(identifier) ?? [];
  const withinWindow = timestamps.filter((t) => now - t < WINDOW_MS);
  if (withinWindow.length >= MAX_REQUESTS) {
    return { success: false };
  }
  withinWindow.push(now);
  memWindows.set(identifier, withinWindow);
  return { success: true };
}
