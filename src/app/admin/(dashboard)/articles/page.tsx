import Link from 'next/link';
import Image from 'next/image';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminArticlesList } from '@/lib/admin/data';
import { sanityImageTransform } from '@/lib/sanityImage';
import { formatDateTime } from '../_shared/formatDateTime';

function statusOf(a: { publishTiming: string; publishedAt?: string }) {
  if (a.publishTiming === 'scheduled' && a.publishedAt && new Date(a.publishedAt).getTime() > Date.now()) {
    return { color: '#f2a93b', label: 'Запланировано на' };
  }
  return { color: '#22c55e', label: 'Опубликовано' };
}

export default async function AdminArticlesPage() {
  await requireAdminPermission('articles');
  const articles = await fetchAdminArticlesList();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Статьи</h1>
        <Link href="/admin/articles/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить статью
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока нет ни одной статьи.</p>
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
                    <div className="text-[11px] text-[var(--admin-text-secondary)] font-semibold">{formatDateTime(a.publishedAt)}</div>
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
