'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import type { ScheduleItem } from '@/lib/admin/data';
import { formatPragueTime } from '@/lib/admin/timezone';

const TYPE_META: Record<ScheduleItem['type'], { color: string; label: string; title: (t: string) => string }> = {
  news: { color: '#06b6d4', label: 'Новость', title: t => t },
  article: { color: '#8b5cf6', label: 'Статья', title: t => t },
  'banner-start': { color: '#f2a93b', label: 'Баннер', title: t => `«${t}» — старт показа` },
  'banner-end': { color: '#f2a93b', label: 'Баннер', title: t => `«${t}» — конец показа` },
  'exchange-pin': { color: '#ec4899', label: 'Биржа', title: t => `${t} — истекает закрепление` },
};

export default function DayItemsList({ items }: { items: ScheduleItem[] }) {
  const nextRef = useRef<HTMLAnchorElement>(null);
  const nextUpIndex = items.findIndex(i => !i.realized);

  useEffect(() => {
    nextRef.current?.scrollIntoView({ block: 'center' });
  }, []);

  return (
    <div className={`flex flex-col ${items.length > 4 ? 'max-h-[168px] overflow-y-auto pr-0.5' : ''}`}>
      {items.map((item, i) => {
        const meta = TYPE_META[item.type];
        const isNextUp = i === nextUpIndex;
        return (
          <Link
            key={`${item.type}-${item.id}-${item.at}`}
            ref={isNextUp ? nextRef : undefined}
            href={item.href}
            title={meta.title(item.title)}
            className="flex items-center gap-1.5 py-1 border-t border-[var(--admin-border)] first:border-t-0 hover:bg-[var(--admin-input)] -mx-1 px-1 rounded transition-colors"
            style={isNextUp ? { background: 'rgba(6,182,212,.10)' } : undefined}
          >
            <span className="text-[9.5px] text-[var(--admin-text-dim)] w-8 shrink-0 tabular-nums">
              {formatPragueTime(item.at)}
            </span>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: item.realized ? 'var(--admin-text-dim)' : meta.color }} />
            <span
              className={`text-[10.5px] flex-1 min-w-0 truncate ${item.realized ? 'text-[var(--admin-text-dim)]' : 'text-[var(--admin-text)] font-semibold'}`}
            >
              {item.realized ? '✓ ' : ''}{item.title}
            </span>
            {isNextUp && (
              <span className="text-[8px] font-extrabold uppercase shrink-0" style={{ color: 'var(--admin-focus)' }}>Далее</span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
