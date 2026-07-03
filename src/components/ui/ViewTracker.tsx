'use client';
import { useEffect } from 'react';

export default function ViewTracker({ id }: { id: string }) {
  useEffect(() => {
    fetch('/api/views', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
  }, [id]);
  return null;
}
