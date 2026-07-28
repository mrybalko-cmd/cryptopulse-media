'use client';

import { useState } from 'react';
import { formatPragueDateTime } from '@/lib/admin/timezone';
import type { HistoryTransaction } from '@/lib/admin/history';

export default function HistoryPanel({
  docId,
  listAction,
  restoreAction,
}: {
  docId: string;
  listAction: (docId: string) => Promise<HistoryTransaction[]>;
  restoreAction: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<HistoryTransaction[] | null>(null);

  async function toggle() {
    if (!open && items === null) {
      setLoading(true);
      const list = await listAction(docId);
      setItems(list);
      setLoading(false);
    }
    setOpen(o => !o);
  }

  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={toggle}
        className="text-[11.5px] font-bold px-3 py-1.5 rounded-lg border border-[var(--admin-border)] hover:border-cyan-500/40 transition-colors"
      >
        🕐 История изменений
      </button>
      {open && (
        <div className="mt-3 border border-[var(--admin-border)] rounded-xl overflow-hidden max-w-md">
          {loading && <div className="p-4 text-[12px] text-[var(--admin-text-muted)]">Загрузка…</div>}
          {!loading && items && items.length === 0 && (
            <div className="p-4 text-[12px] text-[var(--admin-text-muted)]">История пока пуста.</div>
          )}
          {!loading &&
            items?.map((it, i) => (
              <div key={it.id} className="flex items-center gap-3 px-4 py-3 border-b border-[var(--admin-border)] last:border-b-0 bg-[var(--admin-panel)]">
                <div className="flex-1 text-[12px] text-[var(--admin-text-secondary)]">
                  {formatPragueDateTime(it.timestamp)}
                  {i === 0 && <span className="ml-2 text-cyan-400 font-bold">· текущая версия</span>}
                </div>
                {i !== 0 && (
                  <form action={restoreAction}>
                    <input type="hidden" name="id" value={docId} />
                    <input type="hidden" name="revisionId" value={it.id} />
                    <button
                      type="submit"
                      onClick={e => {
                        if (!window.confirm('Восстановить эту версию? Несохранённые изменения в открытой форме будут потеряны.')) {
                          e.preventDefault();
                        }
                      }}
                      className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-cyan-500 text-[#06222b] whitespace-nowrap shrink-0"
                    >
                      Восстановить
                    </button>
                  </form>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
