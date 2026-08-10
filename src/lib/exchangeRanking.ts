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
function isPinActive<T extends Rankable>(item: T, now: number): boolean {
  return Boolean(item.pinned) && !(item.pinUntil && new Date(item.pinUntil).getTime() < now);
}

/**
 * Paid placements are lifted out of the ranking entirely rather than sorted to
 * the top of it: a pinned exchange with $976M sitting above one with $4.1B
 * reads as a broken sort. `featured` is rendered as its own slot above the
 * table, `rest` is numbered purely by whatever the list is sorted on.
 */
export function splitPinned<T extends Rankable>(items: T[]): { featured: T[]; rest: T[] } {
  const now = Date.now();
  return {
    featured: items.filter(i => isPinActive(i, now)).sort((a, b) => (a.pinPosition ?? 99) - (b.pinPosition ?? 99)),
    rest: items.filter(i => !isPinActive(i, now)),
  };
}

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
