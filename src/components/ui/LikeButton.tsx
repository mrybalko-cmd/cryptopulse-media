'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface Props {
  id: string;
  locale: string;
  initialLikes: number;
}

export default function LikeButton({ id, locale, initialLikes }: Props) {
  const isRu = locale === 'ru';
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    try {
      setLiked(window.localStorage.getItem(`cp_liked_${id}`) === '1');
    } catch {}
  }, [id]);

  const toggle = async () => {
    const next = !liked;
    // optimistic update
    setLiked(next);
    setLikes((n) => n + (next ? 1 : -1));

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, liked: next }),
      });
      const data = await res.json();
      if (typeof data.likes === 'number') setLikes(data.likes);
      window.localStorage.setItem(`cp_liked_${id}`, next ? '1' : '0');
    } catch {
      // best-effort; optimistic UI stands even if the request failed
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={liked}
      aria-label={isRu ? 'Нравится' : 'Like'}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
        liked ? 'border-negative text-negative bg-negative/10' : 'border-border text-muted hover:text-foreground hover:border-accent/40'
      }`}
    >
      <Heart size={13} fill={liked ? 'currentColor' : 'none'} />
      {likes}
    </button>
  );
}
