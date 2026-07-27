'use client';

import { useFormStatus } from 'react-dom';

export default function SubmitButton({
  children,
  pendingLabel = 'Сохраняем…',
  className,
  name,
  value,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      aria-busy={pending}
      className={`${className} disabled:opacity-60 disabled:cursor-wait`}
    >
      {pending ? pendingLabel : children}
    </button>
  );
}
