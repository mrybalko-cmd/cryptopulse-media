import Link from 'next/link';
import Image from 'next/image';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminArticlesListPage, ADMIN_LIST_PAGE_SIZE, type AdminListStatusFilter } from '@/lib/admin/data';
import { sanityImageTransform } from '@/lib/sanityImage';
import { formatDateTime } from '../_shared/formatDateTime';
import ListSearchBar from '../_shared/ListSearchBar';
import { duplicateArticleAction } from './actions';

function statusOf(a: { publishTiming: string; publishedAt?: string }) {
  if (a.publishTiming === 'draft') return { color: '#8b8d94', label: 'Черновик' };
  if (a.publishTiming === 'scheduled' && a.publishedAt && new Date(a.publishedAt).getTime() > Date.now()) {
    return { color: '#f2a93b', label: 'Запланировано на' };
  }
  return { color: '#22c55e', label: 'Опубликовано' };
}

export default async function AdminArticlesPage({ searchParams }: { searchParams: Promise<{ filter?: string; q?: string; lang?: string; page?: string }> }) {
  await requireAdminPermission('articles');
  const { filter: rawFilter, q, lang: rawLang, page: rawPage } = await searchParams;
  const filter: AdminListStatusFilter = ['all', 'published', 'draft', 'scheduled'].includes(rawFilter ?? '') ? (rawFilter as AdminListStatusFilter) : 'all';
  const lang = rawLang === 'ru' || rawLang === 'en' ? rawLang : undefined;
  const page = Math.max(1, Number(rawPage) || 1);

  const { items: articles, filteredTotal, counts } = await fetchAdminArticlesListPage({ filter, lang, q: q?.trim() || undefined, page });

  const tabs = [
    { key: 'all', label: `Все (${counts.all})` },
    { key: 'published', label: 'Опубликовано' },
    { key: 'draft', label: `Черновики (${counts.draft})` },
    { key: 'scheduled', label: `Запланировано (${counts.scheduled})` },
  ] as const;

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (filter !== 'all') params.set('filter', filter);
    if (q) params.set('q', q);
    if (lang) params.set('lang', lang);
    if (p > 1) params.set('page', String(p));
    const qs = params.toString();
    return qs ? `/admin/articles?${qs}` : '/admin/articles';
  }

  const totalPages = Math.max(1, Math.ceil(filteredTotal / ADMIN_LIST_PAGE_SIZE));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Статьи</h1>
        <Link href="/admin/articles/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить статью
        </Link>
      </div>

      <div className="flex gap-1.5 mb-4">
        {tabs.map(t => (
          <Link
            key={t.key}
            href={t.key === 'all' ? '/admin/articles' : `/admin/articles?filter=${t.key}`}
            className={`text-[11.5px] font-bold px-3 py-1.5 rounded-full border ${
              filter === t.key ? 'bg-cyan-500/15 text-cyan-400 border-transparent' : 'border-[var(--admin-border)] text-[var(--admin-text-muted)]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <ListSearchBar basePath="/admin/articles" query={q} lang={lang} filter={filter} />

      {articles.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Ничего не нашлось.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {articles.map(a => {
            const status = statusOf(a);
            return (
              <div key={a._id} className="flex items-center gap-2">
                <Link
                  href={`/admin/articles/${a._id}`}
                  className="flex-1 min-w-0 flex items-center gap-3 border border-[var(--admin-border)] rounded-xl p-3 bg-[var(--admin-panel)] hover:border-cyan-500/40 transition-colors"
                >
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[var(--admin-input)]">
                    {a.coverImage && <Image src={sanityImageTransform(a.coverImage, { width: 112 })!} alt="" fill className="object-cover" unoptimized />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] font-bold truncate">{a.title}</div>
                    <div className="text-[11px] text-[var(--admin-text-muted)]">{a.language.toUpperCase()} · {a.topic || 'без темы'}</div>
                  </div>
                  <span
                    className="ml-auto text-[10.5px] font-extrabold px-3 py-1.5 rounded-full whitespace-nowrap shrink-0"
                    style={{ background: `${status.color}26`, color: status.color }}
                  >
                    {status.label}{status.label !== 'Черновик' ? ` · ${formatDateTime(a.publishedAt)}` : ''}
                  </span>
                </Link>
                <form action={duplicateArticleAction}>
                  <input type="hidden" name="id" value={a._id} />
                  <button
                    type="submit"
                    title="Дублировать как черновик"
                    className="w-10 h-10 shrink-0 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel)] text-[15px] hover:border-cyan-500/40 transition-colors"
                  >
                    ⧉
                  </button>
                </form>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-5 text-[12px] text-[var(--admin-text-muted)]">
          <span>Стр. {page} из {totalPages} · всего {filteredTotal}</span>
          <div className="flex gap-2">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className="font-bold px-3 py-1.5 rounded-lg border border-[var(--admin-border)] hover:border-cyan-500/40 transition-colors">
                ‹ Назад
              </Link>
            )}
            {page < totalPages && (
              <Link href={pageHref(page + 1)} className="font-bold px-3 py-1.5 rounded-lg border border-[var(--admin-border)] hover:border-cyan-500/40 transition-colors">
                Далее ›
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
