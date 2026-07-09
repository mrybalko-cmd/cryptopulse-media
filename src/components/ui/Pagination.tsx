import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  basePath: string; // e.g. `/${locale}/authors/${slug}` — page 1 lives here, page N at `${basePath}/page/${N}`
  currentPage: number;
  totalPages: number;
  locale: string;
}

function pageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}/page/${page}`;
}

// Windows the page list around the current page so it stays readable even
// with dozens of pages: first, last, and a neighborhood around current,
// with "…" gaps in between.
function buildPageList(current: number, total: number): (number | '…')[] {
  const pages = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter(p => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | '…')[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push('…');
    result.push(p);
    prev = p;
  }
  return result;
}

export default function Pagination({ basePath, currentPage, totalPages, locale }: Props) {
  if (totalPages <= 1) return null;
  const isRu = locale === 'ru';
  const pages = buildPageList(currentPage, totalPages);

  const linkClass = (active: boolean) =>
    `flex items-center justify-center min-w-8 h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? 'bg-accent text-background'
        : 'border border-border text-muted hover:text-foreground hover:border-accent/40'
    }`;

  return (
    <nav
      aria-label={isRu ? 'Постраничная навигация' : 'Pagination'}
      className="flex items-center justify-center gap-1.5 mt-10 flex-wrap"
    >
      {currentPage > 1 && (
        <Link href={pageHref(basePath, currentPage - 1)} className={linkClass(false)} aria-label={isRu ? 'Предыдущая страница' : 'Previous page'}>
          <ChevronLeft size={14} />
        </Link>
      )}

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-1 text-muted text-sm select-none">…</span>
        ) : (
          <Link
            key={p}
            href={pageHref(basePath, p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={linkClass(p === currentPage)}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link href={pageHref(basePath, currentPage + 1)} className={linkClass(false)} aria-label={isRu ? 'Следующая страница' : 'Next page'}>
          <ChevronRight size={14} />
        </Link>
      )}
    </nav>
  );
}
