'use client';

import { useState } from 'react';

export interface ChipOption {
  value: string;
  label: string;
  color?: 'purple' | 'orange' | 'amber' | 'slate' | 'cyan' | 'gold' | 'green';
}

const COLORS: Record<NonNullable<ChipOption['color']>, { bg: string; fg: string }> = {
  purple: { bg: 'rgba(139,92,246,.18)', fg: '#a78bfa' },
  orange: { bg: 'rgba(234,88,12,.18)', fg: '#fb923c' },
  amber: { bg: 'rgba(242,169,59,.2)', fg: '#f2a93b' },
  slate: { bg: 'rgba(148,163,184,.18)', fg: '#cbd5e1' },
  cyan: { bg: 'rgba(6,182,212,.18)', fg: '#22d3ee' },
  gold: { bg: 'rgba(234,179,8,.2)', fg: '#eab308' },
  green: { bg: 'rgba(34,197,94,.2)', fg: '#4ade80' },
};

export default function ChipPicker({
  name,
  options,
  defaultValue,
  allowNone = true,
}: {
  name: string;
  options: ChipOption[];
  defaultValue?: string;
  allowNone?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? (allowNone ? '' : options[0]?.value ?? ''));

  return (
    <div className="flex flex-wrap gap-1.5">
      <input type="hidden" name={name} value={value} />
      {allowNone && (
        <button
          type="button"
          onClick={() => setValue('')}
          className={`text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
            value === '' ? 'border-transparent bg-[var(--admin-border)] text-[var(--admin-text)]' : 'border-[var(--admin-border)] text-[var(--admin-text-muted)]'
          }`}
        >
          Нет
        </button>
      )}
      {options.map(opt => {
        const selected = opt.value === value;
        const colors = COLORS[opt.color ?? 'cyan'];
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setValue(opt.value)}
            style={selected ? { background: colors.bg, color: colors.fg } : undefined}
            className={`text-[11.5px] font-bold px-3.5 py-1.5 rounded-full border transition-colors ${
              selected ? 'border-transparent' : 'border-[var(--admin-border)] text-[var(--admin-text-muted)]'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
