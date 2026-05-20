const STORAGE_KEY = "baf_usage";

interface UsageData {
  date: string;
  counts: Record<string, number>;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getUsageData(): UsageData {
  if (typeof window === "undefined") return { date: getTodayKey(), counts: {} };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: getTodayKey(), counts: {} };

    const data: UsageData = JSON.parse(raw);
    if (data.date !== getTodayKey()) {
      return { date: getTodayKey(), counts: {} };
    }
    return data;
  } catch {
    return { date: getTodayKey(), counts: {} };
  }
}

function saveUsageData(data: UsageData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const DAILY_LIMITS: Record<string, number> = {
  "ai-write": 3,
  "ai-image": 2,
  "pdf-ai": 3,
  "video-ai": 2,
  "server-tool": 5,
};

export type ToolTier = keyof typeof DAILY_LIMITS;

export function getUsageCount(tier: ToolTier): number {
  const data = getUsageData();
  return data.counts[tier] || 0;
}

export function getRemainingUses(tier: ToolTier): number {
  const limit = DAILY_LIMITS[tier] || 5;
  return Math.max(0, limit - getUsageCount(tier));
}

export function canUse(tier: ToolTier): boolean {
  return getRemainingUses(tier) > 0;
}

export function recordUsage(tier: ToolTier): void {
  const data = getUsageData();
  data.counts[tier] = (data.counts[tier] || 0) + 1;
  saveUsageData(data);
}
