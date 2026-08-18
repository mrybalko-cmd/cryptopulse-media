import Link from 'next/link';
import { getAdminSession } from '@/lib/admin/auth';
import { hasPermission } from '@/lib/admin/permissions';
import { fetchDashboardCounts, countAdminUsers } from '@/lib/admin/data';

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  const counts = await fetchDashboardCounts();
  const userCount = session?.isOwner ? await countAdminUsers() : null;

  const tiles = [
    { key: 'news' as const, href: '/admin/news', icon: '📰', color: '#06b6d4', title: 'Новости', stat: counts.draftNews, label: 'черновиков' },
    { key: 'articles' as const, href: '/admin/articles', icon: '📝', color: '#8b5cf6', title: 'Статьи', stat: counts.draftArticles, label: 'черновиков' },
    { key: 'banners' as const, href: '/admin/banners', icon: '🖼️', color: '#f2a93b', title: 'Баннеры', stat: counts.activeBanners, label: 'активных' },
    { key: 'exchanges' as const, href: '/admin/exchanges', icon: '🏦', color: '#22c55e', title: 'Криптобиржи', stat: counts.exchangeCount, label: 'бирж' },
    { key: 'exchanges' as const, href: '/admin/exchange-reviews', icon: '⭐', color: '#f59e0b', title: 'Отзывы о биржах', stat: counts.pendingReviews, label: 'на проверке' },
    { key: 'comments' as const, href: '/admin/comments', icon: '💬', color: '#ec4899', title: 'Комментарии', stat: counts.pendingComments, label: 'на проверке' },
    { key: 'regulation' as const, href: '/admin/regulation', icon: '🗺️', color: '#f97316', title: 'Карта регулирования', stat: counts.regulationNoSource, label: 'без источника' },
    { key: null, href: '/admin/schedule', icon: '📅', color: '#22d3ee', title: 'Расписание', stat: counts.scheduleThisWeek, label: 'событий на неделе' },
    { key: 'subscribers' as const, href: '/admin/subscribers', icon: '✉️', color: '#38bdf8', title: 'Подписчики', stat: counts.activeSubscribers, label: 'активных' },
    { key: 'homepage' as const, href: '/admin/homepage', icon: '🏡', color: '#94a3b8', title: 'Главная страница', stat: null, label: 'настройки вывода' },
  ];

  const visibleTiles = tiles.filter(t => t.key === null || hasPermission(session, t.key));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Обзор</h1>
        <span className={`text-[10.5px] font-extrabold px-2.5 py-1 rounded-full ${session?.isOwner ? 'bg-amber-500/15 text-amber-400' : 'bg-cyan-500/15 text-cyan-400'}`}>
          {session?.isOwner ? 'Владелец · все права' : 'Сотрудник'}
        </span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {visibleTiles.map(t => (
          <Link key={t.href} href={t.href} className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-2xl p-4 hover:border-cyan-500/40 transition-colors">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-[15px] mb-2.5" style={{ background: `${t.color}26`, color: t.color }}>
              {t.icon}
            </div>
            <h3 className="text-[13px] font-bold mb-2.5">{t.title}</h3>
            {t.stat !== null && (
              <>
                <div className="text-[20px] font-black">{t.stat}</div>
                <div className="text-[10px] text-[var(--admin-text-muted)]">{t.label}</div>
              </>
            )}
          </Link>
        ))}
        {session?.isOwner && (
          <Link href="/admin/users" className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-2xl p-4 hover:border-cyan-500/40 transition-colors">
            <div className="w-[34px] h-[34px] rounded-lg flex items-center justify-center text-[15px] mb-2.5 bg-slate-400/15 text-slate-300">👥</div>
            <h3 className="text-[13px] font-bold mb-2.5">Пользователи</h3>
            <div className="text-[20px] font-black">{userCount}</div>
            <div className="text-[10px] text-[var(--admin-text-muted)]">сотрудника</div>
          </Link>
        )}
      </div>
    </div>
  );
}
