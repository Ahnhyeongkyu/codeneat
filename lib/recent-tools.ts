const STORAGE_KEY = "codeneat-recent-tools";
const MAX_RECENT = 4;

export function getRecentTools(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

export function recordToolUsage(toolKey: string): void {
  if (typeof window === "undefined") return;
  try {
    const recent = getRecentTools().filter((k) => k !== toolKey);
    recent.unshift(toolKey);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(recent.slice(0, MAX_RECENT)),
    );
  } catch {
    // localStorage unavailable
  }
}
