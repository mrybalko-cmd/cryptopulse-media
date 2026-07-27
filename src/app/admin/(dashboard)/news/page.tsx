import Link from 'next/link';
import Image from 'next/image';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminNewsList, type AdminNewsListItem } from '@/lib/admin/data';
import { sanityImageTransform } from '@/lib/sanityImage';
import { formatDateTime } from '../_shared/formatDateTime';
import ListSearchBar from '../_shared/ListSearchBar';

function statusOf(n: { publishTiming: string; publishedAt?: string }) {
  if (n.publishTiming === 'draft') return { color: 'var(--admin-text-muted)', label: 'Черновик' };
  if (n.publishTiming === 'scheduled' && n.publishedAt && new Date(n.publishedAt).getTime() > Date.now()) {
    return { color: '#f2a93b', label: 'Запланировано на' };
  }
  return { color: '#22c55e', label: 'Опубликовано' };
}

function matchesFilter(n: AdminNewsListItem, filter: string): boolean {
  if (filter === 'all') return true;
  if (filter === 'draft') return n.publishTiming === 'draft';
  if (filter === 'scheduled') return n.publishTiming === 'scheduled' && !!n.publishedAt && new Date(n.publishedAt).getTime() > Date.now();
  return n.publishTiming !== 'draft' && !(n.publishTiming === 'scheduled' && n.publishedAt && new Date(n.publishedAt).getTime() > Date.now());
}

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<{ filter?: string; q?: string; lang?: string }> }) {
  await requireAdminPermission('news');
  const { filter: rawFilter, q, lang } = await searchParams;
  const filter = ['all', 'published', 'draft', 'scheduled'].includes(rawFilter ?? '') ? rawFilter! : 'all';
  const allNews = await fetchAdminNewsList();
  let news = allNews.filter(n => matchesFilter(n, filter));
  if (lang === 'ru' || lang === 'en') news = news.filter(n => n.language === lang);
  if (q?.trim()) {
    const needle = q.trim().toLowerCase();
    news = news.filter(n => n.title.toLowerCase().includes(needle));
  }

  const counts = {
    all: allNews.length,
    published: allNews.filter(n => matchesFilter(n, 'published')).length,
    draft: allNews.filter(n => n.publishTiming === 'draft').length,
    scheduled: allNews.filter(n => matchesFilter(n, 'scheduled')).length,
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
        <h1 className="text-[19px] font-bold">Новости</h1>
        <Link href="/admin/news/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить новость
        </Link>
      </div>

      <div className="flex gap-1.5 mb-4">
        {tabs.map(t => (
          <Link
            key={t.key}
            href={t.key === 'all' ? '/admin/news' : `/admin/news?filter=${t.key}`}
            className={`text-[11.5px] font-bold px-3 py-1.5 rounded-full border ${
              filter === t.key ? 'bg-cyan-500/15 text-cyan-400 border-transparent' : 'border-[var(--admin-border)] text-[var(--admin-text-muted)]'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <ListSearchBar basePath="/admin/news" query={q} lang={lang} filter={filter} />

      {news.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Ничего не нашлось.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {news.map(n => {
            const status = statusOf(n);
            return (
              <Link
                key={n._id}
                href={`/admin/news/${n._id}`}
                className="flex items-center gap-3 border border-[var(--admin-border)] rounded-xl p-3 bg-[var(--admin-panel)] hover:border-cyan-500/40 transition-colors"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[var(--admin-input)]">
                  {n.coverImage && <Image src={sanityImageTransform(n.coverImage, { width: 112 })!} alt="" fill className="object-cover" unoptimized />}
                </div>
                <div>
                  <div className="text-[13px] font-bold">{n.breaking ? '⚡ ' : ''}{n.title}</div>
                  <div className="text-[11px] text-[var(--admin-text-muted)]">{n.language.toUpperCase()} · {n.topic || 'без темы'}</div>
                </div>
                <div className="ml-auto flex items-center gap-3 text-right">
                  <div>
                    <div className="text-[11px] text-[var(--admin-text-muted)]">{status.label}</div>
                    {status.label !== 'Черновик' && <div className="text-[11px] text-[var(--admin-text-secondary)] font-semibold">{formatDateTime(n.publishedAt)}</div>}
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
