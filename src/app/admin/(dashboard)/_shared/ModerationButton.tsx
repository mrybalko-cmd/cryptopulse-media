'use client';

import { useFormStatus } from 'react-dom';

/**
 * Кнопка модерации с видимым откликом на нажатие.
 *
 * Обычная кнопка формы внешне не меняется, пока действие идёт на сервере, —
 * секунду-две экран выглядит ровно так же, как до нажатия. Отсюда и жалоба
 * «кнопки не нажимаются»: нажатие было, отклика не было. Здесь кнопка гаснет
 * и подписывается словом на время запроса.
 */
export default function ModerationButton({
  children,
  pendingLabel,
  className,
  confirmMessage,
}: {
  children: React.ReactNode;
  pendingLabel: string;
  className: string;
  confirmMessage?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      onClick={confirmMessage ? e => { if (!confirm(confirmMessage)) e.preventDefault(); } : undefined}
      className={`${className} transition-opacity disabled:opacity-50 disabled:cursor-wait`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
