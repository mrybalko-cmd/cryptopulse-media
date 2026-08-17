'use client';
import { useEffect } from 'react';

/**
 * Counts one view per story per browser session.
 *
 * Every count is a write to Sanity, and writes never touch the CDN — they come
 * out of the smaller uncached quota. Firing on each mount meant a reload, a
 * back-navigation or a second tab all charged again, which inflated the number
 * as much as the bill. sessionStorage is the right scope here: it forgets when
 * the tab closes, so a genuine return visit still counts.
 */
export default function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    const key = `viewed:${id}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {
      // Private mode or storage disabled — fall through and count it, the same
      // behaviour as before this guard existed.
    }
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch(() => {
      // best-effort, never surface a counting failure to the reader
    });
  }, [id]);
  return null;
}
