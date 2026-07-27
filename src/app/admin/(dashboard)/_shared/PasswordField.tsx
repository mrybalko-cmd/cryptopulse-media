'use client';

import { useId, useState } from 'react';

export default function PasswordField({
  name,
  label,
  required,
  minLength,
  className = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px] pr-16',
}: {
  name: string;
  label?: string;
  required?: boolean;
  minLength?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div>
      {label && <label htmlFor={id} className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">{label}</label>}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          required={required}
          minLength={minLength}
          className={className}
        />
        <button
          type="button"
          onClick={() => setVisible(v => !v)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
          tabIndex={-1}
        >
          {visible ? 'Скрыть' : 'Показать'}
        </button>
      </div>
    </div>
  );
}
