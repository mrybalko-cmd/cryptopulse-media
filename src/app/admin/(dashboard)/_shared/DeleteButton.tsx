'use client';

import { useFormStatus } from 'react-dom';
import { Trash2 } from 'lucide-react';

/**
 * Только кнопка, без формы вокруг.
 *
 * Нужна там, где форма уже есть и в неё кладутся скрытые поля: вложенная
 * форма в HTML недопустима, браузер её просто выбрасывает при разборе, и
 * кнопка перестаёт отправлять что-либо.
 */
export function DeleteSubmitButton({
  confirmMessage,
  compact,
}: {
  confirmMessage: string;
  /** Только иконка, без подписи — для строки списка, где подпись не влезает. */
  compact?: boolean;
}) {
  return <Inner confirmMessage={confirmMessage} compact={compact} />;
}

function Inner({ confirmMessage, compact }: { confirmMessage: string; compact?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      aria-label={compact ? 'Удалить' : undefined}
      title={compact ? 'Удалить' : undefined}
      onClick={e => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
      className={`inline-flex items-center justify-center gap-1.5 text-[12.5px] font-bold text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-colors disabled:opacity-60 disabled:cursor-wait ${
        compact ? 'w-[30px] h-[30px]' : 'px-3.5 py-2'
      }`}
    >
      <Trash2 size={14} />
      {!compact && (pending ? 'Удаляем…' : 'Удалить')}
    </button>
  );
}

export default function DeleteButton({
  action,
  confirmMessage = 'Удалить безвозвратно? Это действие нельзя отменить.',
}: {
  action: () => void;
  confirmMessage?: string;
}) {
  return (
    <form action={action}>
      <Inner confirmMessage={confirmMessage} />
    </form>
  );
}
