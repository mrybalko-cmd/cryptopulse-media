'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Download, Loader2, Send, X } from 'lucide-react';
import type { WealthState } from '@/lib/wealth';

/**
 * Окно «поделиться результатом».
 *
 * Делимся картинкой, а не ссылкой. Личное число живёт в параметрах, а
 * параметры страницы лежат в адресной решётке — до сервера она не доходит,
 * поэтому в превью ссылки соцсеть покажет общую обложку калькулятора. Чтобы
 * показать своё число, его надо отправить картинкой, и она стоит первой
 * кнопкой. Ссылка при этом честно работает: открывший её увидит калькулятор с
 * тем же доходом и той же нормой.
 *
 * На телефоне это главный сценарий, поэтому:
 *  - окно полноэкранное снизу, а не маленький прямоугольник посередине;
 *  - страница под ним не прокручивается, иначе палец уводит фон;
 *  - первая кнопка отдаёт файл в системное окно «Поделиться» (Web Share с
 *    файлами), а не скачивает его в папку, откуда его ещё надо доставать.
 */
interface Props {
  open: boolean;
  onClose: () => void;
  state: WealthState;
  locale: string;
  /** Адрес страницы с параметрами в решётке — то, что уходит в соцсеть. */
  shareUrl: string;
  /** Текст поста: число лет и чьё состояние. */
  shareText: string;
}

type Status = 'idle' | 'busy' | 'copied' | 'error';

export default function ShareResultSheet({ open, onClose, state, locale, shareUrl, shareText }: Props) {
  const isRu = locale === 'ru';
  const [status, setStatus] = useState<Status>('idle');
  const [imgLoaded, setImgLoaded] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const cardUrl = `/api/wealth-card?locale=${locale}&p=${encodeURIComponent(state.p)}&inc=${state.inc}&rate=${state.rate}`;

  // Esc закрывает, фон не едет под пальцем, фокус уходит внутрь окна.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  useEffect(() => { setStatus('idle'); setImgLoaded(false); }, [cardUrl]);

  if (!open) return null;

  const openShare = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer,width=600,height=640');
  };

  /**
   * Картинка уходит туда, где человек её ждёт. На телефоне это системное окно
   * «Поделиться» с файлом внутри — оттуда она попадает в любой мессенджер за
   * одно касание. На столе Web Share с файлами не поддерживают, и там это
   * обычное скачивание.
   */
  const takeImage = async () => {
    setStatus('busy');
    try {
      const res = await fetch(cardUrl);
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const file = new File([blob], 'intokened-wealth.png', { type: 'image/png' });

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText, url: shareUrl });
        setStatus('idle');
        return;
      }

      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = 'intokened-wealth.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
      setStatus('idle');
    } catch (err) {
      // Отмена в системном окне — не ошибка, показывать её нечего.
      if (err instanceof DOMException && err.name === 'AbortError') setStatus('idle');
      else setStatus('error');
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setStatus('copied');
      setTimeout(() => setStatus((s) => (s === 'copied' ? 'idle' : s)), 2000);
    } catch {
      setStatus('error');
    }
  };

  const u = encodeURIComponent(shareUrl);
  const t = encodeURIComponent(shareText);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-background/85 backdrop-blur-sm
                 sm:items-center sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isRu ? 'Поделиться результатом' : 'Share your result'}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92dvh] w-full max-w-[560px] flex-col overflow-y-auto overscroll-contain
                   rounded-t-2xl border border-[var(--glass-edge)] bg-card p-4 shadow-2xl
                   sm:max-h-[88dvh] sm:rounded-2xl sm:p-5"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[16px] font-bold text-foreground">
              {isRu ? 'Поделиться результатом' : 'Share your result'}
            </h2>
            <p className="mt-0.5 text-[12.5px] text-muted">
              {isRu ? 'Картинка собирается из ваших чисел' : 'The image is built from your own numbers'}
            </p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label={isRu ? 'Закрыть' : 'Close'}
            className="tap-target shrink-0 rounded-lg border border-border p-1.5 text-muted
                       transition-colors hover:text-foreground"
          >
            <X size={16} />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-background"
             style={{ aspectRatio: '1200 / 630' }}>
          {!imgLoaded && (
            <span className="absolute inset-0 flex items-center justify-center text-[12px] text-muted">
              <Loader2 size={16} className="mr-2 animate-spin" />
              {isRu ? 'Рисуем картинку' : 'Drawing the image'}
            </span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cardUrl}
            alt={isRu ? 'Карточка с вашим результатом' : 'A card with your result'}
            width={1200}
            height={630}
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full transition-opacity duration-200 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>

        <button
          onClick={takeImage}
          disabled={status === 'busy'}
          className="mt-4 flex w-full items-center gap-2.5 rounded-xl px-4 py-3 text-left text-white
                     shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_6px_16px_rgba(124,58,237,0.4)]
                     transition-transform hover:-translate-y-px active:translate-y-px
                     disabled:opacity-70 motion-reduce:transform-none"
          style={{ backgroundImage: 'linear-gradient(115deg,#a855f7 0%,#6366f1 38%,#22d3ee 100%)' }}
        >
          {status === 'busy'
            ? <Loader2 size={17} className="shrink-0 animate-spin" />
            : <Download size={17} className="shrink-0" />}
          <span className="min-w-0">
            <span className="block text-[13px] font-bold">
              {isRu ? 'Сохранить картинку' : 'Save the image'}
            </span>
            <span className="block text-[10.5px] text-white/75">
              {isRu ? 'PNG 1200×630 — готова к вложению' : 'PNG 1200×630 — ready to attach'}
            </span>
          </span>
        </button>

        <div className="mt-2.5 grid grid-cols-2 gap-2">
          <ShareLink label="Telegram" hint={isRu ? 'пост со ссылкой' : 'a post with the link'}
                     onClick={() => openShare(`https://t.me/share/url?url=${u}&text=${t}`)} />
          <ShareLink label="Twitter" hint={isRu ? 'пост со ссылкой' : 'a post with the link'}
                     onClick={() => openShare(`https://twitter.com/intent/tweet?url=${u}&text=${t}`)} />
          <ShareLink label="LinkedIn" hint={isRu ? 'пост со ссылкой' : 'a post with the link'}
                     onClick={() => openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${u}`)} />
          <ShareLink
            label={status === 'copied' ? (isRu ? 'Скопировано' : 'Copied') : (isRu ? 'Скопировать' : 'Copy link')}
            hint={isRu ? 'с вашим доходом и нормой' : 'with your income and rate'}
            icon={status === 'copied' ? <Check size={15} className="text-positive" /> : <Copy size={15} />}
            onClick={copyLink}
          />
        </div>

        {status === 'error' && (
          <p className="mt-3 text-[12px] text-negative">
            {isRu
              ? 'Не получилось. Попробуйте ещё раз или сделайте снимок экрана.'
              : 'That did not work. Try again, or take a screenshot instead.'}
          </p>
        )}

        <p className="mt-3 text-[11.5px] leading-relaxed text-muted">
          {isRu
            ? 'Ссылка открывает калькулятор с вашим доходом и нормой сбережений, но в превью соцсети покажут общую обложку страницы. Ваше число уходит только картинкой — поэтому она и стоит первой.'
            : 'The link reopens the calculator with your income and savings rate, but social previews will show the page’s generic cover. Your own number travels as the image — which is why it comes first.'}
        </p>
      </div>
    </div>
  );
}

function ShareLink({ label, hint, onClick, icon }: {
  label: string; hint: string; onClick: () => void; icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl border border-[var(--glass-edge)] bg-[var(--glass-clear)]
                 px-3 py-2.5 text-left backdrop-blur-[12px] transition-[transform,border-color]
                 hover:-translate-y-px hover:border-[var(--glass-edge-lit)] motion-reduce:transform-none"
    >
      <span className="shrink-0 text-muted">{icon ?? <Send size={15} />}</span>
      <span className="min-w-0">
        <span className="block truncate text-[12.5px] font-bold text-foreground">{label}</span>
        <span className="block truncate text-[10.5px] text-muted">{hint}</span>
      </span>
    </button>
  );
}
