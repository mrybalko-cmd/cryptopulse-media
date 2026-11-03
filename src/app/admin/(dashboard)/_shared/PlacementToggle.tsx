'use client';

import { useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';
import { Pause, Play } from 'lucide-react';

/**
 * Кнопка «Остановить / Возобновить» для баннеров и кнопок монет.
 *
 * Только кнопка: форму с id и адресом возврата строит серверная страница,
 * так что одна и та же кнопка работает и в строке списка, и в шапке записи.
 * Подтверждения нет намеренно: действие обратимо тем же нажатием, а
 * статистика при остановке не трогается.
 */
export function PlacementToggleButton({ active, wide }: { active: boolean; wide?: boolean }) {
  const { pending } = useFormStatus();
  const Icon = active ? Pause : Play;
  const label = active ? (wide ? 'Остановить показ' : 'Остановить') : (wide ? 'Возобновить показ' : 'Возобновить');
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-2 text-[12px] font-bold text-white bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 shadow-[0_2px_10px_-2px_rgba(139,92,246,0.55)] hover:brightness-110 transition-[filter] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 disabled:opacity-60 disabled:cursor-wait"
    >
      <Icon size={13} strokeWidth={2.5} aria-hidden="true" />
      {pending ? (active ? 'Останавливаю…' : 'Возвращаю…') : label}
    </button>
  );
}

/**
 * Строка-подтверждение после нажатия. Текст собирает сервер из адреса
 * (noticeText), здесь только убираем параметры, чтобы обновление страницы
 * не показывало её заново, и прячем через восемь секунд. key на месте
 * вызова — текст, так что каждое новое нажатие монтирует строку заново.
 */
export function PlacementNotice({ message }: { message: string | null }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    const url = new URL(window.location.href);
    url.searchParams.delete('toggled');
    url.searchParams.delete('name');
    window.history.replaceState(window.history.state, '', url.toString());
    const t = setTimeout(() => setVisible(false), 8000);
    return () => clearTimeout(t);
  }, [message]);

  if (!message || !visible) return null;
  return (
    <div
      role="status"
      className="mb-4 self-start rounded-lg border border-violet-500/35 bg-violet-500/10 px-3 py-2 text-[12.5px] text-[var(--admin-text)]"
    >
      {message}
    </div>
  );
}
