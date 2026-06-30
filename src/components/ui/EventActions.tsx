'use client';

import { useEffect, useState } from 'react';
import { ThumbsUp, ThumbsDown, Link2, Share2, CalendarPlus, Check } from 'lucide-react';
import { getGoogleCalendarUrl } from '@/lib/googleCalendar';
import type { CalendarEvent } from '@/lib/sanity';

interface Props {
  event: CalendarEvent;
  locale: string;
  pageUrl: string;
}

type VoteState = 'like' | 'dislike' | null;

export default function EventActions({ event, locale, pageUrl }: Props) {
  const isRu = locale === 'ru';
  const [likes, setLikes] = useState(event.likes);
  const [dislikes, setDislikes] = useState(event.dislikes);
  const [myVote, setMyVote] = useState<VoteState>(null);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
    try {
      const saved = window.localStorage.getItem(`cp_event_vote_${event._id}`) as VoteState;
      if (saved === 'like' || saved === 'dislike') setMyVote(saved);
    } catch {}
  }, [event._id]);

  const eventUrl = `${pageUrl}#${event.slug}`;
  const title = event.title[locale as 'ru' | 'en'];
  const description = event.description?.[locale as 'ru' | 'en'] || title;

  const vote = async (next: 'like' | 'dislike') => {
    // optimistic update
    const prevVote = myVote;
    if (prevVote === next) {
      setMyVote(null);
      next === 'like' ? setLikes((n) => n - 1) : setDislikes((n) => n - 1);
    } else {
      if (prevVote === 'like') setLikes((n) => n - 1);
      if (prevVote === 'dislike') setDislikes((n) => n - 1);
      setMyVote(next);
      next === 'like' ? setLikes((n) => n + 1) : setDislikes((n) => n + 1);
    }

    try {
      const res = await fetch('/api/calendar-events/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event._id, vote: next }),
      });
      const data = await res.json();
      const finalVote: VoteState = data.vote || null;
      window.localStorage.setItem(`cp_event_vote_${event._id}`, finalVote || '');
    } catch {
      // best-effort; optimistic UI stands even if the request failed
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(eventUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const share = async () => {
    try {
      await navigator.share({ title, text: description, url: eventUrl });
    } catch {}
  };

  const btnClass =
    'w-8 h-8 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-colors';

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => vote('like')}
          aria-label={isRu ? 'Нравится' : 'Like'}
          className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs transition-colors ${
            myVote === 'like' ? 'border-positive text-positive bg-positive/10' : 'border-border text-muted hover:text-foreground'
          }`}
        >
          <ThumbsUp size={12} />
          {likes}
        </button>
        <button
          onClick={() => vote('dislike')}
          aria-label={isRu ? 'Не нравится' : 'Dislike'}
          className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs transition-colors ${
            myVote === 'dislike' ? 'border-negative text-negative bg-negative/10' : 'border-border text-muted hover:text-foreground'
          }`}
        >
          <ThumbsDown size={12} />
          {dislikes}
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <button onClick={copyLink} className={btnClass} aria-label={isRu ? 'Скопировать ссылку' : 'Copy link'} title={isRu ? 'Скопировать ссылку' : 'Copy link'}>
          {copied ? <Check size={13} className="text-positive" /> : <Link2 size={13} />}
        </button>
        {canShare && (
          <button onClick={share} className={btnClass} aria-label={isRu ? 'Отправить' : 'Share'} title={isRu ? 'Отправить' : 'Share'}>
            <Share2 size={13} />
          </button>
        )}
        <a
          href={getGoogleCalendarUrl(title, description, event.date, event.sourceUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          aria-label={isRu ? 'Добавить в Google Calendar' : 'Add to Google Calendar'}
          title={isRu ? 'Добавить в Google Calendar' : 'Add to Google Calendar'}
        >
          <CalendarPlus size={13} />
        </a>
      </div>
    </div>
  );
}
