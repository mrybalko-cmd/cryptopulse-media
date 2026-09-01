'use client';

import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

/* Четыре бумажных слоя нарастают снизу, за ними — коралловое пятно.
   Складку проявляет светлая кромка по верхнему краю, а не заливка: на высоте
   в сотню пикселей одни заливки сливаются. vectorEffect держит её в 1px,
   иначе растянутый viewBox раздавил бы штрих по горизонтали.
   Ореол обязателен: без света за собой стекло кнопки неотличимо от плашки.
   Цвета живут в токенах, поэтому светлая тема перекрашивает блок сама. */
function PaperLayers() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 800 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0,40 C130,14 250,62 400,34 C540,10 660,52 800,26 L800,100 L0,100 Z" fill="var(--paper-1)"
        stroke="var(--paper-fold)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke" />
      <path d="M0,56 C140,32 260,78 410,50 C560,26 670,66 800,44 L800,100 L0,100 Z" fill="var(--paper-2)"
        stroke="var(--paper-fold)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke" />
      <path d="M0,72 C150,50 270,92 420,68 C570,46 680,82 800,62 L800,100 L0,100 Z" fill="var(--paper-3)"
        stroke="var(--paper-fold)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke" />
      <path d="M0,86 C160,68 280,102 430,84 C580,66 690,94 800,80 L800,100 L0,100 Z" fill="var(--paper-4)"
        stroke="var(--paper-fold)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke" />
      <ellipse
        cx="655"
        cy="44"
        rx="135"
        ry="54"
        fill="var(--article-accent)"
        style={{ opacity: 'var(--paper-halo)', filter: 'blur(24px)' }}
      />
    </svg>
  );
}

interface Props {
  locale: string;
  source?: string;
  variant?: 'inline' | 'banner' | 'footer';
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
    if (variant === 'footer') {
      return (
        <div className="flex items-center gap-2 text-sm text-accent">
          <CheckCircle size={15} className="shrink-0" />
          <span>{isRu ? 'Вы подписаны.' : "You're subscribed."}</span>
        </div>
      );
    }
    return (
      <div className="paper-block mt-8 mb-8 px-5 py-5 sm:px-6">
        <PaperLayers />
        <div className="relative z-[3] flex items-center gap-2.5">
          <CheckCircle size={16} className="shrink-0 text-article-accent" />
          <p className="text-sm text-foreground">
            {isRu
              ? 'Готово. Первое письмо придёт, когда будет о чём написать.'
              : 'You\'re in. The first letter goes out when we have something to say.'}
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isRu ? 'Главное с крипторынка — раз в неделю на почту' : 'The crypto essentials — once a week in your inbox'}
          </p>
          <p className="text-xs text-muted mt-0.5">
            {isRu ? 'Без спама, можно отписаться в один клик' : 'No spam, unsubscribe anytime'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={isRu ? 'ваш@email.com' : 'your@email.com'}
            required
            className="flex-1 sm:w-56 min-w-0 px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-4 py-2 text-sm font-semibold bg-accent text-background rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0 whitespace-nowrap"
          >
            {status === 'loading' ? '...' : (isRu ? 'Подписаться' : 'Subscribe')}
          </button>
        </form>
        {status === 'error' && <p className="text-xs text-red-500">{errorMsg}</p>}
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
    <div className="paper-block mt-8 mb-8 px-5 py-4 sm:px-6 sm:py-5">
      <PaperLayers />
      <div className="relative z-[3] flex flex-wrap items-center gap-x-6 gap-y-3.5">
        <div className="flex-1 min-w-[230px]">
          <p className="text-[17px] font-semibold leading-tight tracking-tight text-foreground text-balance">
            {isRu
              ? 'Крипторынок производит шум. Мы присылаем сигнал'
              : 'The market talks all day. We write when it says something'}
          </p>
          <p className="mt-1 text-xs text-muted">
            {isRu
              ? 'Письмо, ради которого стоит открыть почту'
              : 'Short, and it tells you why it came'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 max-sm:w-full">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={isRu ? 'ваш@email.com' : 'your@email.com'}
            aria-label={isRu ? 'Ваш email' : 'Your email'}
            required
            className="paper-field backdrop-blur-[18px] w-[180px] min-w-0 max-sm:flex-1 max-sm:w-auto rounded-[10px] px-3 py-2.5 text-[13px] text-foreground placeholder:text-muted transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="paper-cta backdrop-blur-[18px] backdrop-saturate-150 shrink-0 cursor-pointer whitespace-nowrap rounded-[11px] px-5 py-2.5 text-[13px] font-semibold"
          >
            {status === 'loading' ? '…' : (isRu ? 'Оставить адрес' : 'Leave your address')}
          </button>
        </form>
      </div>
      {status === 'error' && (
        <p className="relative z-[3] mt-2.5 text-xs text-red-500">{errorMsg}</p>
      )}
    </div>
  );
}
