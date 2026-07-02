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
      <div className="border-t border-border pt-6 mt-6 mb-8 flex items-center gap-2 text-xs text-accent">
        <CheckCircle size={13} className="shrink-0" />
        <span>{isRu ? 'Вы подписаны.' : 'You\'re subscribed.'}</span>
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
    <div className="border-t border-border pt-6 mt-6 mb-8">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Mail size={14} className="text-muted shrink-0" />
        <span className="text-xs text-muted shrink-0 hidden sm:inline">
          {isRu ? 'Рассылка:' : 'Newsletter:'}
        </span>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={isRu ? 'ваш@email.com' : 'your@email.com'}
          required
          className="flex-1 min-w-0 px-3 py-1.5 text-xs bg-background border border-border rounded text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-3 py-1.5 text-xs font-medium bg-accent/10 text-accent border border-accent/20 rounded hover:bg-accent/20 transition-colors disabled:opacity-50 shrink-0"
        >
          {status === 'loading' ? '...' : (isRu ? 'Подписаться' : 'Subscribe')}
        </button>
      </form>
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-1.5 pl-5">{errorMsg}</p>
      )}
    </div>
  );
}
