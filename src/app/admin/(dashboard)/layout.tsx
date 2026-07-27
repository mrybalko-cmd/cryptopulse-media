import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAdminSession } from '@/lib/admin/auth';
import { hasPermission, type Permission } from '@/lib/admin/permissions';
import LogoutButton from './LogoutButton';
import ThemeToggle from './_shared/ThemeToggle';

const NAV_ITEMS: { href: string; label: string; permission: Permission | null }[] = [
  { href: '/admin', label: '🏠 Обзор / Overview', permission: null },
  { href: '/admin/schedule', label: '🗓️ Расписание / Schedule', permission: null },
  { href: '/admin/news', label: '📰 Новости / News', permission: 'news' },
  { href: '/admin/articles', label: '📝 Статьи / Articles', permission: 'articles' },
  { href: '/admin/banners', label: '🖼️ Баннеры / Banners', permission: 'banners' },
  { href: '/admin/exchanges', label: '🏦 Криптобиржи / Exchanges', permission: 'exchanges' },
  { href: '/admin/exchange-reviews', label: '⭐ Отзывы о биржах / Exchange reviews', permission: 'exchanges' },
  { href: '/admin/comments', label: '💬 Комментарии / Comments', permission: 'comments' },
  { href: '/admin/homepage', label: '🏡 Главная страница / Homepage', permission: 'homepage' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const visibleItems = NAV_ITEMS.filter(item => !item.permission || hasPermission(session, item.permission));

  return (
    <div className="flex min-h-screen">
      <div className="w-[210px] bg-[var(--admin-panel)] border-r border-[var(--admin-border)] px-3.5 py-5 shrink-0 flex flex-col">
        <div className="flex items-center gap-2 px-2 pb-5 font-extrabold text-sm">
          <span className="w-5 h-5 rounded-md bg-red-600 flex items-center justify-center text-[10px]">⚡</span>
          CryptoPulse.admin
        </div>
        <nav className="flex flex-col gap-0.5 flex-1">
          {visibleItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-semibold text-[var(--admin-text-muted)] hover:bg-[var(--admin-input)] hover:text-[var(--admin-text)] transition-colors"
            >
              {item.label}
            </Link>
          ))}
          {session.isOwner && (
            <>
              <div className="text-[10px] uppercase tracking-wide text-[var(--admin-text-dim)] px-2.5 pt-3.5 pb-1.5">Управление</div>
              <Link
                href="/admin/users"
                className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-semibold text-[var(--admin-text-muted)] hover:bg-[var(--admin-input)] hover:text-[var(--admin-text)] transition-colors"
              >
                👥 Пользователи и права / Users & permissions
              </Link>
            </>
          )}
        </nav>
        <div className="pt-3 border-t border-[var(--admin-border)] mt-3">
          <ThemeToggle />
          <Link href="/admin/profile" className="block px-2.5 py-2 text-[12px] rounded-lg hover:bg-[var(--admin-input)] transition-colors">
            <p className="font-semibold">{session.name}</p>
            <p className="text-[var(--admin-text-muted)]">{session.isOwner ? 'Владелец' : 'Сотрудник'} · Профиль</p>
          </Link>
          <LogoutButton />
        </div>
      </div>
      <div className="flex-1 px-8 py-6 min-w-0">{children}</div>
    </div>
  );
}
