'use client';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Eye } from 'lucide-react';

/** Повторный заход на тот же материал засчитывается не раньше, чем через полчаса. */
const COOLDOWN_MS = 30 * 60 * 1000;

const NOOP_SUBSCRIBE = () => () => {};

function readRemembered(id: string): number {
  try {
    const v = Number(localStorage.getItem(`viewsOf:${id}`));
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

/**
 * Число просмотров и его подсчёт в одном месте.
 *
 * Страница материала отдаётся из кэша (ISR 300 с), поэтому пришедшее с сервера
 * число почти всегда отстаёт, и собственный просмотр читатель не видел вовсе.
 * Запись мы всё равно делаем — и ответ на неё содержит новое значение, так что
 * точное число обходится нам без единого лишнего чтения из Sanity.
 *
 * Один просмотр на материал раз в COOLDOWN_MS: перезагрузка, возврат назад и
 * вторая вкладка иначе накручивают и счётчик, и счёт за квоту — записи в Sanity
 * идут мимо CDN и стоят дороже чтений. Окно вместо прежней привязки к сессии
 * вкладки: читатель, вернувшийся к материалу позже, засчитывается снова.
 *
 * Последнее известное число тоже помним — иначе после перезагрузки оно
 * откатывалось бы к устаревшему серверному и выглядело как убыль.
 */
export default function ViewCount({ id, initial }: { id: string; initial: number }) {
  const [fetched, setFetched] = useState<number | null>(null);

  // Хранилище — внешний источник: на сервере его нет, поэтому при гидрации
  // берём ноль и переключаемся уже на клиенте, без рассинхрона разметки.
  const remembered = useSyncExternalStore(
    NOOP_SUBSCRIBE,
    useCallback(() => readRemembered(id), [id]),
    () => 0
  );

  useEffect(() => {
    const seenKey = `viewedAt:${id}`;
    const now = Date.now();
    try {
      const last = Number(localStorage.getItem(seenKey));
      if (Number.isFinite(last) && last > 0 && now - last < COOLDOWN_MS) return;
      localStorage.setItem(seenKey, String(now));
    } catch {
      // приватный режим или хранилище отключено — считаем каждый заход
    }

    let alive = true;
    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(r => r.json())
      .then(d => {
        if (!alive || typeof d?.views !== 'number') return;
        setFetched(d.views);
        try {
          localStorage.setItem(`viewsOf:${id}`, String(d.views));
        } catch {
          // хранилище недоступно — число всё равно показано в этой загрузке
        }
      })
      .catch(() => {
        // подсчёт просмотров — вещь необязательная, читателю о сбое знать незачем
      });
    return () => { alive = false; };
  }, [id]);

  // Серверное число отстаёт, но может и обогнать запомненное, если материал
  // читали другие — поэтому берём наибольшее из трёх, а не последнее.
  const views = Math.max(initial, remembered, fetched ?? 0);

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted">
      <Eye size={12} />
      <span>{views}</span>
    </div>
  );
}
