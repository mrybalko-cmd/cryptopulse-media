'use client';

import { useState, useTransition, type ReactNode } from 'react';
import { Copy, EyeOff, Trash2, Undo2, TriangleAlert } from 'lucide-react';

type Action = (formData: FormData) => Promise<void>;
type Mode = 'idle' | 'confirmUnpublish' | 'confirmDelete';

const ICON_BTN =
  'w-10 h-10 shrink-0 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel)] ' +
  'flex items-center justify-center text-[var(--admin-text-muted)] transition-colors ' +
  'hover:border-cyan-500/40 hover:text-cyan-400 disabled:opacity-50 disabled:cursor-wait';

function shorten(title: string, max = 46): string {
  return title.length > max ? `${title.slice(0, max)}…` : title;
}

/**
 * One row of the news/articles list: the row itself is rendered on the server
 * and passed in as children, this only owns the actions beside it.
 *
 * Confirmation replaces the row in place rather than opening a browser
 * `confirm()` — nothing covers the screen, and cancelling is one click.
 */
export default function ListRow({
  id,
  title,
  isPublished,
  children,
  duplicateAction,
  unpublishAction,
  republishAction,
  deleteAction,
}: {
  id: string;
  title: string;
  isPublished: boolean;
  children: ReactNode;
  duplicateAction: Action;
  unpublishAction: Action;
  republishAction: Action;
  deleteAction: Action;
}) {
  const [mode, setMode] = useState<Mode>('idle');
  const [gone, setGone] = useState(false);
  const [pending, startTransition] = useTransition();

  function run(action: Action, onDone?: () => void) {
    const formData = new FormData();
    formData.set('id', id);
    startTransition(async () => {
      await action(formData);
      setMode('idle');
      onDone?.();
    });
  }

  if (gone) {
    return (
      <div className="flex items-center gap-2.5 border border-dashed border-[var(--admin-border)] rounded-xl px-3 py-3.5 text-[12.5px] text-[var(--admin-text-dim)]">
        <Trash2 size={15} className="shrink-0" />
        Удалено: «{shorten(title)}»
      </div>
    );
  }

  if (mode !== 'idle') {
    const deleting = mode === 'confirmDelete';
    return (
      <div
        className={`flex items-center gap-3 flex-wrap rounded-xl p-3 border ${
          deleting
            ? 'border-red-500/45 bg-red-500/[0.09]'
            : 'border-amber-500/50 bg-amber-500/[0.09]'
        }`}
      >
        <span
          className={`w-[34px] h-[34px] rounded-lg shrink-0 flex items-center justify-center ${
            deleting ? 'bg-red-500/15 text-red-400' : 'bg-amber-500/15 text-amber-400'
          }`}
        >
          {deleting ? <TriangleAlert size={17} /> : <EyeOff size={17} />}
        </span>

        <span className="min-w-0 flex-1 basis-full sm:basis-auto">
          <span className="block text-[12.5px] font-extrabold truncate">
            {deleting ? `Удалить «${shorten(title, 40)}»?` : `Снять «${shorten(title, 40)}» с сайта?`}
          </span>
          <span className="block text-[11px] text-[var(--admin-text-muted)] mt-0.5">
            {deleting
              ? 'Документ стирается насовсем — вернуть будет нельзя.'
              : 'Уйдёт в черновики, дата публикации сохранится. Вернуть можно в один клик.'}
          </span>
        </span>

        <button
          type="button"
          onClick={() => setMode('idle')}
          disabled={pending}
          className="shrink-0 text-[12px] font-extrabold px-3.5 py-2 rounded-lg border border-[var(--admin-border)] text-[var(--admin-text-secondary)] hover:text-[var(--admin-text)] transition-colors disabled:opacity-50"
        >
          Отмена
        </button>
        <button
          type="button"
          disabled={pending}
          aria-busy={pending}
          onClick={() =>
            deleting
              ? run(deleteAction, () => setGone(true))
              : run(unpublishAction)
          }
          className={`shrink-0 text-[12px] font-extrabold px-3.5 py-2 rounded-lg transition-opacity disabled:opacity-60 disabled:cursor-wait ${
            deleting ? 'bg-red-500 text-white' : 'bg-amber-500 text-[#1d1d1f]'
          }`}
        >
          {pending ? '…' : deleting ? 'Удалить' : 'Снять'}
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${pending ? 'opacity-60' : ''}`}>
      {children}

      <form action={duplicateAction} className="shrink-0">
        <input type="hidden" name="id" value={id} />
        <button type="submit" title="Дублировать как черновик" aria-label="Дублировать как черновик" className={ICON_BTN}>
          <Copy size={16} />
        </button>
      </form>

      {isPublished ? (
        <button
          type="button"
          title="Снять с сайта"
          aria-label="Снять с сайта"
          disabled={pending}
          onClick={() => setMode('confirmUnpublish')}
          className={ICON_BTN}
        >
          <EyeOff size={16} />
        </button>
      ) : (
        <button
          type="button"
          title="Вернуть на сайт"
          aria-label="Вернуть на сайт"
          disabled={pending}
          onClick={() => run(republishAction)}
          className={`${ICON_BTN} hover:border-green-500/45 hover:text-green-400`}
        >
          <Undo2 size={16} />
        </button>
      )}

      <button
        type="button"
        title="Удалить"
        aria-label="Удалить"
        disabled={pending}
        onClick={() => setMode('confirmDelete')}
        className={`${ICON_BTN} hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10`}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
