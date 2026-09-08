'use client';

import { useEffect, useState } from 'react';

/**
 * Отметка «Сохранено» рядом с кнопкой сохранения.
 *
 * Экшены после записи редиректят на ту же форму. Страница возвращается
 * визуально идентичной, поэтому редактор не понимает, сработала кнопка или
 * нет, и жмёт её второй раз. Отметка закрывает именно этот разрыв.
 *
 * Компонент сам читает адрес и сам же убирает из него параметр, чтобы
 * обновление страницы не показывало старое подтверждение заново. Поэтому
 * форме достаточно одной строки, а страницам не нужно принимать
 * и пробрасывать searchParams.
 */
export default function SavedMark({ param = 'saved' }: { param?: string }) {
  const [at, setAt] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(param)) return;
    setAt(
      new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
    );
    url.searchParams.delete(param);
    window.history.replaceState(null, '', url.toString());
    const t = setTimeout(() => setAt(null), 6000);
    return () => clearTimeout(t);
  }, [param]);

  if (!at) return null;

  return (
    <span
      role="status"
      className="text-[12px] font-bold text-emerald-400 flex items-center gap-1.5"
    >
      <svg
        width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      Сохранено в {at}
    </span>
  );
}
