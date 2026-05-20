const rateMap = new Map<string, { count: number; resetAt: number }>();

const CLEANUP_INTERVAL = 60_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, val] of rateMap) {
    if (val.resetAt < now) rateMap.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

export function checkRateLimit(
  ip: string,
  route: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  cleanup();

  const key = `${ip}:${route}`;
  const now = Date.now();
  const entry = rateMap.get(key);

  if (!entry || entry.resetAt < now) {
    rateMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetInMs: windowMs };
  }

  entry.count++;

  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetInMs: entry.resetAt - now };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetInMs: entry.resetAt - now };
}

export const RATE_LIMITS = {
  aiGenerate: { max: 10, windowMs: 60_000 },
  aiImage: { max: 5, windowMs: 60_000 },
  fileConvert: { max: 20, windowMs: 60_000 },
  pdfProcess: { max: 15, windowMs: 60_000 },
  videoProcess: { max: 5, windowMs: 60_000 },
} as const;
