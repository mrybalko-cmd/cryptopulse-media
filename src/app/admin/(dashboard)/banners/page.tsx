import Link from 'next/link';
import Image from 'next/image';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminBanners, type AdminBannerDoc } from '@/lib/admin/data';
import { sanityImageTransform } from '@/lib/sanityImage';
import { formatPragueDateTime } from '@/lib/admin/timezone';
import { toggleBannerAction } from './actions';
import { PlacementNotice, PlacementToggleButton } from '../_shared/PlacementToggle';
import PlacementStatus, { placementState, noticeText } from '../_shared/PlacementStatus';

type Show = 'all' | 'live' | 'stopped';

export default async function AdminBannersPage({ searchParams }: { searchParams: Promise<{ show?: string; toggled?: string; name?: string }> }) {
  await requireAdminPermission('banners');
  const sp = await searchParams;
  const show: Show = sp.show === 'live' || sp.show === 'stopped' ? sp.show : 'all';
  const banners = await fetchAdminBanners();
  const notice = noticeText(sp, 'm');

  const counts = {
    all: banners.length,
    live: banners.filter(b => placementState(b) === 'live').length,
    stopped: banners.filter(b => !b.active).length,
  };
  const visible = banners.filter(b =>
    show === 'all' ? true : show === 'stopped' ? !b.active : placementState(b) === 'live',
  );
  const back = show === 'all' ? '/admin/banners' : `/admin/banners?show=${show}`;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-[19px] font-bold">Баннеры</h1>
        <Link href="/admin/banners/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить баннер
        </Link>
      </div>

      {banners.length > 0 && (
        <nav aria-label="Фильтр баннеров" className="flex flex-wrap gap-1.5 mb-4">
          {([
            ['all', 'Все'],
            ['live', 'На сайте'],
            ['stopped', 'Остановлены'],
          ] as const).map(([key, label]) => (
            <Link
              key={key}
              href={key === 'all' ? '/admin/banners' : `/admin/banners?show=${key}`}
              aria-current={show === key ? 'page' : undefined}
              className={`text-[12px] rounded-full border px-3 py-1 transition-colors ${
                show === key
                  ? 'border-cyan-500 text-[var(--admin-text)] font-bold'
                  : 'border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]'
              }`}
            >
              {label} · {counts[key]}
            </Link>
          ))}
        </nav>
      )}

      <PlacementNotice key={notice ?? ''} message={notice} />

      {banners.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока нет ни одного баннера.</p>
      ) : visible.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">
          {show === 'stopped' ? 'Остановленных баннеров нет.' : 'Сейчас на сайте нет ни одного баннера.'}
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map(b => <BannerRow key={b._id} b={b} back={back} />)}
        </div>
      )}
    </div>
  );
}

function BannerRow({ b, back }: { b: AdminBannerDoc; back: string }) {
  const ctr = b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(2) : '0.00';
  const stopped = !b.active;
  return (
    <div className="flex flex-wrap items-center gap-3 border border-[var(--admin-border)] rounded-xl p-3 bg-[var(--admin-panel)] hover:border-cyan-500/40 transition-colors">
      <Link href={`/admin/banners/${b._id}`} className="flex items-center gap-3 min-w-0 flex-[1_1_220px]">
        <div className={`relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-[var(--admin-input)] ${stopped ? 'grayscale opacity-50' : ''}`}>
          {b.image && <Image src={sanityImageTransform(b.image, { width: 192 })!} alt={b.altText} fill className="object-cover" unoptimized />}
        </div>
        <div className="min-w-0">
          <div className={`text-[13px] font-bold ${stopped ? 'text-[var(--admin-text-secondary)]' : ''}`}>{b.title}</div>
          <div className="text-[11px] text-[var(--admin-text-muted)]">
            {b.language === 'all' ? 'Оба языка' : b.language.toUpperCase()} · вес {b.weight}
            {stopped && b.stoppedAt ? ` · остановлен ${formatPragueDateTime(b.stoppedAt)}` : ''}
          </div>
        </div>
      </Link>
      <div className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
        <div className="flex gap-3.5 text-[11px] text-[var(--admin-text-muted)] tabular-nums">
          <span><b className="text-[var(--admin-text)]">{b.impressions.toLocaleString('ru-RU')}</b> показов</span>
          <span><b className="text-[var(--admin-text)]">{b.clicks.toLocaleString('ru-RU')}</b> кликов</span>
          <span><b className="text-[var(--admin-text)]">{ctr}%</b> CTR</span>
        </div>
        <PlacementStatus doc={b} gender="m" />
        <form action={toggleBannerAction}>
          <input type="hidden" name="id" value={b._id} />
          <input type="hidden" name="active" value={stopped ? 'true' : 'false'} />
          <input type="hidden" name="name" value={b.title} />
          <input type="hidden" name="back" value={back} />
          <PlacementToggleButton active={b.active} />
        </form>
      </div>
    </div>
  );
}
