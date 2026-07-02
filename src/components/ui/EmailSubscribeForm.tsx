'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';

interface Props {
  locale: string;
  source?: string;
  variant?: 'inline' | 'banner';
}

export default function EmailSubscribeForm({ locale, source = 'unknown', variant = 'banner' }: Props) {
  const isRu = locale === 'ru';
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), locale, source }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus('success');
      } else {
        setErrorMsg(isRu ? 'Что-то пошло не так. Попробуй снова.' : 'Something went wrong. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMsg(isRu ? 'Ошибка сети.' : 'Network error.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={variant === 'banner'
        ? 'flex items-center gap-3 rounded-xl bg-accent/10 border border-accent/20 px-5 py-4'
        : 'flex items-center gap-2 text-sm text-accent'
      }>
        <CheckCircle size={18} className="text-accent shrink-0" />
        <span className="text-sm font-medium text-accent">
          {isRu ? 'Отлично! Вы подписаны.' : 'Great! You\'re subscribed.'}
        </span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={isRu ? 'ваш@email.com' : 'your@email.com'}
          required
          className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-background border border-border rounded text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-3 py-1.5 text-sm font-medium bg-accent text-background rounded hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
        >
          {status === 'loading' ? '...' : (isRu ? 'OK' : 'OK')}
        </button>
      </form>
    );
  }

  return (
    <div className="rounded-xl bg-card border border-border p-6 my-8">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <Mail size={18} className="text-accent" />
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">
            {isRu ? 'Получайте главное на почту' : 'Get top crypto news in your inbox'}
          </p>
          <p className="text-xs text-muted mt-0.5">
            {isRu
              ? 'Дайджест важных новостей и статей — без спама, только суть.'
              : 'A digest of important news and analysis — no spam, just the essentials.'}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={isRu ? 'ваш@email.com' : 'your@email.com'}
          required
          className="flex-1 min-w-0 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-accent text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
        >
          {status === 'loading'
            ? (isRu ? 'Отправка...' : 'Sending...')
            : (
              <>
                {isRu ? 'Подписаться' : 'Subscribe'}
                <ArrowRight size={14} />
              </>
            )}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-2">{errorMsg}</p>
      )}
      <p className="text-xs text-muted mt-3">
        {isRu ? 'Отписаться можно в любой момент.' : 'Unsubscribe anytime.'}
      </p>
    </div>
  );
}
