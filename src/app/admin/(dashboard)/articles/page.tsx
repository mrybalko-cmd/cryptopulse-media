import Link from 'next/link';
import Image from 'next/image';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminArticlesList, type AdminArticleListItem } from '@/lib/admin/data';
import { sanityImageTransform } from '@/lib/sanityImage';
import { formatDateTime } from '../_shared/formatDateTime';
import ListSearchBar from '../_shared/ListSearchBar';

function statusOf(a: { publishTiming: string; publishedAt?: string }) {
  if (a.publishTiming === 'draft') return { color: 'var(--admin-text-muted)', label: 'Черновик' };
  if (a.publishTiming === 'scheduled' && a.publishedAt && new Date(a.publishedAt).getTime() > Date.now()) {
    return { color: '#f2a93b', label: 'Запланировано на' };
  }
  return { color: '#22c55e', label: 'Опубликовано' };
}

function matchesFilter(a: AdminArticleListItem, filter: string): boolean {
  if (filter === 'all') return true;
  if (filter === 'draft') return a.publishTiming === 'draft';
  if (filter === 'scheduled') return a.publishTiming === 'scheduled' && !!a.publishedAt && new Date(a.publishedAt).getTime() > Date.now();
  return a.publishTiming !== 'draft' && !(a.publishTiming === 'scheduled' && a.publishedAt && new Date(a.publishedAt).getTime() > Date.now());
}

export default async function AdminArticlesPage({ searchParams }: { searchParams: Promise<{ filter?: string; q?: string; lang?: string }> }) {
  await requireAdminPermission('articles');
  const { filter: rawFilter, q, lang } = await searchParams;
  const filter = ['all', 'published', 'draft', 'scheduled'].includes(rawFilter ?? '') ? rawFilter! : 'all';
  const allArticles = await fetchAdminArticlesList();
  let articles = allArticles.filter(a => matchesFilter(a, filter));
  if (lang === 'ru' || lang === 'en') articles = articles.filter(a => a.language === lang);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    articles = articles.filter(a => a.title.toLowerCase().includes(needle));
  }

  const counts = {
    all: allArticles.length,
    draft: allArticles.filter(a => a.publishTiming === 'draft').length,
    scheduled: allArticles.filter(a => matchesFilter(a, 'scheduled')).length,
  };

  const tabs = [
    { key: 'all', label: `Все (${counts.all})` },
    { key: 'published', label: 'Опубликовано' },
    { key: 'draft', label: `Черновики (${counts.draft})` },
    { key: 'scheduled', label: `Запланировано (${counts.scheduled})` },
  ] as const;

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
              <Link
                key={a._id}
                href={`/admin/articles/${a._id}`}
                className="flex items-center gap-3 border border-[var(--admin-border)] rounded-xl p-3 bg-[var(--admin-panel)] hover:border-cyan-500/40 transition-colors"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[var(--admin-input)]">
                  {a.coverImage && <Image src={sanityImageTransform(a.coverImage, { width: 112 })!} alt="" fill className="object-cover" unoptimized />}
                </div>
                <div>
                  <div className="text-[13px] font-bold">{a.title}</div>
                  <div className="text-[11px] text-[var(--admin-text-muted)]">{a.language.toUpperCase()} · {a.topic || 'без темы'}</div>
                </div>
                <div className="ml-auto flex items-center gap-3 text-right">
                  <div>
                    <div className="text-[11px] text-[var(--admin-text-muted)]">{status.label}</div>
                    {status.label !== 'Черновик' && <div className="text-[11px] text-[var(--admin-text-secondary)] font-semibold">{formatDateTime(a.publishedAt)}</div>}
                  </div>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: status.color }} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
