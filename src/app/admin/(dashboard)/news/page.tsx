import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminNewsList } from '@/lib/admin/data';

function statusOf(n: { publishTiming: string; publishedAt?: string }) {
  if (n.publishTiming === 'scheduled' && n.publishedAt && new Date(n.publishedAt).getTime() > Date.now()) {
    return { color: '#f2a93b', label: 'Запланировано' };
  }
  return { color: '#22c55e', label: 'Опубликовано' };
}

export default async function AdminNewsPage() {
  await requireAdminPermission('news');
  const news = await fetchAdminNewsList();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Новости</h1>
        <Link href="/admin/news/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить новость
        </Link>
      </div>

      {news.length === 0 ? (
        <p className="text-[13px] text-[#8b93a7]">Пока нет ни одной новости.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {news.map(n => {
            const status = statusOf(n);
            return (
              <Link
                key={n._id}
                href={`/admin/news/${n._id}`}
                className="flex items-center gap-3 border border-[#262b38] rounded-xl p-3 bg-[#161922] hover:border-cyan-500/40 transition-colors"
              >
                <div>
                  <div className="text-[13px] font-bold">{n.breaking ? '⚡ ' : ''}{n.title}</div>
                  <div className="text-[11px] text-[#8b93a7]">{n.language.toUpperCase()} · {n.topic || 'без темы'}</div>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-[11px] text-[#8b93a7]">{status.label}</span>
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
