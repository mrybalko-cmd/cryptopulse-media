'use client';
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Eye } from 'lucide-react';

const NOOP_SUBSCRIBE = () => () => {};

function readRemembered(id: string): number {
  try {
    const v = Number(sessionStorage.getItem(`viewsOf:${id}`));
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
 * Считаем один просмотр на материал за сессию вкладки: перезагрузка, возврат
 * назад и вторая вкладка иначе накручивали и счётчик, и счёт за квоту. Последнее
 * известное число тоже держим в сессии — иначе после перезагрузки оно
 * откатывалось бы к устаревшему серверному и выглядело как убыль.
 */
export default function ViewCount({ id, initial }: { id: string; initial: number }) {
  const [fetched, setFetched] = useState<number | null>(null);

  // Чтение из sessionStorage — внешний источник: на сервере его нет, поэтому
  // при гидрации берём ноль и переключаемся уже на клиенте, без рассинхрона.
  const remembered = useSyncExternalStore(
    NOOP_SUBSCRIBE,
    useCallback(() => readRemembered(id), [id]),
    () => 0
  );

  useEffect(() => {
    const seenKey = `viewed:${id}`;
    try {
      if (sessionStorage.getItem(seenKey) !== null) return;
      sessionStorage.setItem(seenKey, '1');
    } catch {
      // приватный режим или хранилище отключено — считаем как раньше
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
          sessionStorage.setItem(`viewsOf:${id}`, String(d.views));
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
