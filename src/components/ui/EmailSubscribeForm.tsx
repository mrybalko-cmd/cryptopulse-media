'use client';

import { useRef, useState } from 'react';

/**
 * Блок подписки — один на весь сайт: в футере, под новостью и под статьёй.
 *
 * До этого видов было три: стеклянный «бумажный» блок в статьях, плоская серая
 * полоса в футере и короткая форма, которой никто не пользовался. Общего между
 * ними не было ничего, включая текст.
 *
 * Три решения, которые стоит объяснить.
 *
 * 1. Трещины рисуются от точки нажатия, а не от середины кнопки. Это ответ на
 *    действие, а не украшение: человек видит, что система отреагировала именно
 *    на его нажатие, и каждый раз рисунок другой.
 *
 * 2. Трещины появляются сразу по нажатию, а галочка — только когда сервер
 *    ответил. Трещина говорит «нажатие принято», галочка — «адрес сохранён».
 *    Показывать подтверждение до ответа значило бы врать.
 *
 * 3. Подпись и галочка делят одно место внутри кнопки, поэтому ширина не
 *    меняется и строка не прыгает. Поле с адресом остаётся на экране и лишь
 *    притухает: человеку полезно видеть, какой адрес он оставил.
 */

interface Props {
  locale: string;
  source?: string;
  /** Футеру нужна панель без внешних отступов — у полосы они свои. */
  variant?: 'banner' | 'footer';
}

const T = {
  ru: {
    title: 'Присоединяйся к нашему комьюнити',
    sub: 'Без спама, можно отписаться в один клик',
    ph: 'ваш@email.com',
    label: 'Ваш email',
    btn: 'Подписаться',
    done: 'Готово',
    sending: 'Отправляем',
    failed: 'Что-то пошло не так. Попробуйте снова.',
    network: 'Нет связи с сервером.',
  },
  en: {
    title: 'Join our community',
    sub: 'No spam, unsubscribe in one click',
    ph: 'you@email.com',
    label: 'Your email',
    btn: 'Subscribe',
    done: 'Done',
    sending: 'Sending',
    failed: 'Something went wrong. Please try again.',
    network: 'No connection to the server.',
  },
} as const;

const RAYS = 7;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Сетка трещин внутри кнопки: лучи от точки удара к краям, с одним изломом и
 * редкими ответвлениями. Координаты зажаты по прямоугольнику кнопки — линия,
 * вышедшая за край, читалась бы как царапина на панели, а не как трещина.
 */
function crackPaths(w: number, h: number, ox: number, oy: number): string[] {
  const out: string[] = [];
  const clamp = (x: number, y: number): [number, number] => [
    Math.max(2, Math.min(w - 2, x)),
    Math.max(2, Math.min(h - 2, y)),
  ];
  for (let i = 0; i < RAYS; i++) {
    const a = (i / RAYS) * Math.PI * 2 + rnd(-0.22, 0.22);
    const t = Math.min(
      Math.abs((Math.cos(a) < 0 ? ox : w - ox) / (Math.cos(a) || 1e-6)),
      Math.abs((Math.sin(a) < 0 ? oy : h - oy) / (Math.sin(a) || 1e-6))
    );
    const len = t * rnd(0.72, 1);
    const [mx, my] = clamp(
      ox + Math.cos(a + rnd(-0.3, 0.3)) * len * rnd(0.4, 0.62),
      oy + Math.sin(a + rnd(-0.3, 0.3)) * len * rnd(0.4, 0.62)
    );
    const [ex, ey] = clamp(ox + Math.cos(a) * len, oy + Math.sin(a) * len);
    out.push(`M${ox.toFixed(1)} ${oy.toFixed(1)} L${mx.toFixed(1)} ${my.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}`);
    if (i % 3 === 0) {
      const [bx, by] = clamp(
        mx + Math.cos(a + rnd(0.7, 1.3)) * len * 0.3,
        my + Math.sin(a + rnd(0.7, 1.3)) * len * 0.3
      );
      out.push(`M${mx.toFixed(1)} ${my.toFixed(1)} L${bx.toFixed(1)} ${by.toFixed(1)}`);
    }
  }
  return out;
}

interface Crack { d: string; dur: number; delay: number }

export default function EmailSubscribeForm({ locale, source = 'unknown', variant = 'banner' }: Props) {
  const t = locale === 'ru' ? T.ru : T.en;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [cracks, setCracks] = useState<Crack[]>([]);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [hit, setHit] = useState({ x: 50, y: 50 });
  const btn = useRef<HTMLButtonElement>(null);

  /**
   * Трескаем стекло от точки нажатия. С клавиатуры координат нет — середина.
   *
   * Пустое или кривое поле браузер не отправит и покажет свою подсказку, а
   * кнопка при этом уже треснула бы и осталась треснувшей ни за что. Поэтому
   * сначала спрашиваем форму, годится ли то, что в ней.
   */
  const strike = (e: React.MouseEvent) => {
    const el = btn.current;
    if (!el || !el.form?.checkValidity()) return;
    const r = el.getBoundingClientRect();
    const quiet = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ox = e.clientX ? Math.max(8, Math.min(r.width - 8, e.clientX - r.left)) : r.width / 2;
    const oy = e.clientY ? Math.max(6, Math.min(r.height - 6, e.clientY - r.top)) : r.height / 2;
    setBox({ w: r.width, h: r.height });
    setHit({ x: (ox / r.width) * 100, y: (oy / r.height) * 100 });
    setCracks(
      crackPaths(r.width, r.height, ox, oy).map((d, i) => ({
        d,
        dur: quiet ? 0 : Math.round(220 + Math.random() * 160),
        delay: quiet ? 0 : i * 22,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;
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
        setErrorMsg(t.failed);
        setStatus('error');
        setCracks([]);
      }
    } catch {
      setErrorMsg(t.network);
      setStatus('error');
      setCracks([]);
    }
  };

  const sent = status === 'success';

  return (
    <section
      className={`sub-wrap ${variant === 'banner' ? 'my-8' : ''}`}
      aria-label={t.title}
    >
      <span className="sub-halo sub-halo-a" aria-hidden="true" />
      <span className="sub-halo sub-halo-b" aria-hidden="true" />
      <span className="sub-halo sub-halo-c" aria-hidden="true" />

      <div className="sub-pane">
        <div className="flex flex-wrap items-center gap-x-[18px] gap-y-3.5">
          <div className="min-w-0 flex-1 basis-[280px]">
            <p className="m-0 text-[17px] font-bold leading-tight tracking-[-.02em] text-foreground text-balance">
              {t.title}
            </p>
            <p className="mt-1 text-[12.5px] text-muted">{t.sub}</p>
          </div>

          <form
            onSubmit={handleSubmit}
            className={`relative flex flex-nowrap items-center gap-2.5 max-sm:w-full ${sent ? 'sub-sent' : ''}`}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={t.ph}
              aria-label={t.label}
              required
              disabled={sent}
              className="sub-field w-[190px] min-w-0 max-sm:w-auto max-sm:flex-1"
            />
            <button
              ref={btn}
              type="submit"
              onClick={strike}
              disabled={sent}
              aria-live="polite"
              className="sub-cta"
              data-sent={sent ? '1' : undefined}
            >
              {cracks.length > 0 && (
                <>
                  <span
                    className="sub-flash"
                    style={{ ['--fx' as string]: `${hit.x}%`, ['--fy' as string]: `${hit.y}%` }}
                    aria-hidden="true"
                  />
                  <span className={`sub-cracks ${sent ? 'sub-calm' : ''}`} aria-hidden="true">
                    <svg viewBox={`0 0 ${box.w.toFixed(1)} ${box.h.toFixed(1)}`}>
                      {cracks.map((c, i) => (
                        <path
                          key={i}
                          d={c.d}
                          style={{
                            ['--len' as string]: `${box.w + box.h}`,
                            animationDuration: `${c.dur}ms`,
                            animationDelay: `${c.delay}ms`,
                          }}
                        />
                      ))}
                    </svg>
                  </span>
                </>
              )}
              <span className="sub-face">
                <span className="sub-lbl">{status === 'loading' ? `${t.sending}…` : t.btn}</span>
                <span className="sub-ok">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5 10 17.5 19 7" />
                  </svg>
                  {t.done}
                </span>
              </span>
            </button>
          </form>
        </div>

        {status === 'error' && (
          <p className="mt-2.5 text-xs text-negative" role="alert">{errorMsg}</p>
        )}
      </div>
    </section>
  );
}
