'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';
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
 * Страница материала отдаётся из кэша (ISR), поэтому пришедшее с сервера число
 * почти всегда отстаёт. Запись мы всё равно делаем — и ответ на неё содержит
 * новое значение, так что точное число обходится нам без единого лишнего
 * чтения из Sanity: читатель сразу видит результат своего захода.
 *
 * Считается каждый заход, включая перезагрузку. Прежние ограничения (раз на
 * вкладку, потом окно в полчаса) экономили записи, но выглядели как поломка:
 * счётчик замирал и не реагировал на обновление страницы.
 *
 * Последнее известное число помним на время сессии вкладки — чтобы в момент
 * загрузки не мелькало устаревшее серверное значение.
 */
export default function ViewCount({ id, initial }: { id: string; initial: number }) {
  const [fetched, setFetched] = useState<number | null>(null);
  // Один заход — одна запись: эффект в строгом режиме вызывается дважды.
  const counted = useRef(false);

  // Хранилище — внешний источник: на сервере его нет, поэтому при гидрации
  // берём ноль и переключаемся уже на клиенте, без рассинхрона разметки.
  const remembered = useSyncExternalStore(
    NOOP_SUBSCRIBE,
    useCallback(() => readRemembered(id), [id]),
    () => 0
  );

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;

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
