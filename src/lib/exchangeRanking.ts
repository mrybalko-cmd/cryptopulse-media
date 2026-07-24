export interface Rankable {
  pinned?: boolean;
  pinPosition?: number | null;
  pinUntil?: string | null;
  volume24h?: number | null;
}

// Pinned (paid) placements are sorted into position order first, then the
// organic list fills in by volume — numbering is continuous across the
// whole merged list (1, 2, 3, 4…), it never restarts after the pinned
// slots. A pin past its `pinUntil` date is treated as expired and falls
// back into the organic pool rather than silently staying stuck at #1.
export function rankExchanges<T extends Rankable>(items: T[]): (T & { rank: number })[] {
  const now = Date.now();
  const isPinActive = (item: T) => item.pinned && !(item.pinUntil && new Date(item.pinUntil).getTime() < now);

  const pinned = items
    .filter(isPinActive)
    .sort((a, b) => (a.pinPosition ?? 99) - (b.pinPosition ?? 99));
  const organic = items
    .filter(item => !isPinActive(item))
    .sort((a, b) => (b.volume24h ?? 0) - (a.volume24h ?? 0));

  return [...pinned, ...organic].map((item, i) => ({ ...item, rank: i + 1 }));
}
