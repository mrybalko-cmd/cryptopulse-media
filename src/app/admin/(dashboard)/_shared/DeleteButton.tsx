'use client';

import { useFormStatus } from 'react-dom';

function Inner({ confirmMessage }: { confirmMessage: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-busy={pending}
      onClick={e => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
      className="text-[12.5px] font-bold text-red-400 border border-red-500/30 rounded-lg px-3.5 py-2 hover:bg-red-500/10 hover:border-red-500/50 transition-colors disabled:opacity-60 disabled:cursor-wait"
    >
      {pending ? 'Удаляем…' : '🗑 Удалить'}
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
