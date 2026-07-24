'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import type { ExchangeReview } from '@/lib/sanity';

interface Props {
  exchangeId: string;
  locale: string;
  initialReviews?: ExchangeReview[];
  initialAverage?: number;
}

interface PendingReview {
  _id: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
  pending: true;
}

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5 text-yellow-500">
      {[1, 2, 3, 4, 5].map(i => (
        <Star key={i} size={size} fill={i <= value ? 'currentColor' : 'none'} className={i <= value ? '' : 'text-border'} />
      ))}
    </div>
  );
}

export default function ExchangeReviewSection({ exchangeId, locale, initialReviews = [], initialAverage = 0 }: Props) {
  const isRu = locale === 'ru';
  const [reviews, setReviews] = useState<ExchangeReview[]>(initialReviews);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const allReviews = [...pendingReviews, ...reviews];
  const count = reviews.length;
  const average = count > 0 ? initialAverage : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website) return; // bots only
    if (!name.trim() || !text.trim() || rating < 1) return;

    setStatus('sending');
    setErrorMessage('');

    try {
      const res = await fetch('/api/exchange-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorName: name.trim(), text: text.trim(), rating, exchangeId, locale }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.message || (isRu ? 'Не удалось отправить отзыв.' : "Couldn't submit the review."));
        return;
      }
      setPendingReviews(prev => [
        { _id: `pending-${Date.now()}`, authorName: name.trim(), text: text.trim(), rating, createdAt: new Date().toISOString(), pending: true },
        ...prev,
      ]);
      setText('');
      setRating(0);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setErrorMessage(isRu ? 'Не удалось отправить отзыв.' : "Couldn't submit the review.");
    }
  };

  return (
    <section>
      <h2 className="text-lg font-bold text-foreground mb-4">{isRu ? 'Отзывы' : 'Reviews'}</h2>

      {count > 0 && (
        <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 mb-5">
          <p className="text-4xl font-black text-foreground">{average.toFixed(1)}</p>
          <div>
            <Stars value={Math.round(average)} size={16} />
            <p className="text-xs text-muted mt-1">
              {isRu ? `${count} ${count === 1 ? 'отзыв' : 'отзывов'} читателей CryptoPulse` : `${count} review${count === 1 ? '' : 's'} from CryptoPulse readers`}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-4 mb-6">
        <h3 className="text-sm font-bold text-foreground mb-3">{isRu ? 'Оставить отзыв' : 'Leave a review'}</h3>
        <div className="flex items-center gap-1 mb-3" onMouseLeave={() => setHoverRating(0)}>
          {[1, 2, 3, 4, 5].map(i => (
            <button
              key={i}
              type="button"
              onMouseEnter={() => setHoverRating(i)}
              onClick={() => setRating(i)}
              aria-label={`${i} ${isRu ? 'звёзд' : 'stars'}`}
              className="text-yellow-500"
            >
              <Star size={22} fill={i <= (hoverRating || rating) ? 'currentColor' : 'none'} className={i <= (hoverRating || rating) ? '' : 'text-border'} />
            </button>
          ))}
        </div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={isRu ? 'Ваше имя' : 'Your name'}
          maxLength={60}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50 mb-2"
        />
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={isRu ? 'Расскажите о своём опыте с этой биржей...' : 'Share your experience with this exchange...'}
          maxLength={2000}
          rows={3}
          className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-accent/50 resize-none mb-2"
        />
        <input
          type="text"
          value={website}
          onChange={e => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute opacity-0 -z-10 w-0 h-0"
        />
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={status === 'sending' || !name.trim() || !text.trim() || rating < 1}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity"
          >
            {status === 'sending' && <Loader2 size={14} className="animate-spin" />}
            {isRu ? 'Отправить отзыв' : 'Submit review'}
          </button>
          {status === 'success' && (
            <span className="text-xs text-positive">{isRu ? 'Спасибо! Отзыв появится после проверки.' : 'Thanks! Your review will appear after moderation.'}</span>
          )}
          {status === 'error' && <span className="text-xs text-negative">{errorMessage}</span>}
        </div>
        <p className="text-xs text-muted mt-2">{isRu ? 'Публикуется после проверки модератором.' : 'Published after moderator review.'}</p>
      </form>

      {allReviews.length > 0 ? (
        <div className="flex flex-col gap-3">
          {allReviews.map(r => (
            <div key={r._id} className="bg-card border border-border rounded-xl p-3.5">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-sm font-semibold text-foreground">{r.authorName}</span>
                <Stars value={r.rating} />
                {(r as PendingReview).pending && (
                  <span className="text-xs text-accent border border-accent/30 rounded-full px-2 py-0.5">
                    {isRu ? 'на модерации' : 'pending review'}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap break-words">{r.text}</p>
              <p className="text-xs text-muted mt-1.5">{formatDate(r.createdAt, locale)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">{isRu ? 'Пока нет отзывов — будьте первым!' : 'No reviews yet — be the first!'}</p>
      )}
    </section>
  );
}
