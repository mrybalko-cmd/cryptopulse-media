import Link from 'next/link';
import Image from 'next/image';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminBanners, bannerLiveNow, type AdminBannerDoc, type BannerPlacement } from '@/lib/admin/data';
import { BANNER_ROTATION_LIMIT } from '@/lib/sanity';
import { sanityImageTransform } from '@/lib/sanityImage';
import { formatPragueDateTime } from '@/lib/admin/timezone';
import { toggleBannerAction } from './actions';
import { PlacementNotice, PlacementToggleButton } from '../_shared/PlacementToggle';
import PlacementStatus, { placementState, noticeText } from '../_shared/PlacementStatus';

type Show = 'all' | 'sidebar' | 'inline' | 'live' | 'stopped';

const SHOWS: Array<[Show, string]> = [
  ['all', 'Все'],
  ['sidebar', 'Под «Популярным»'],
  ['inline', 'В тексте'],
  ['live', 'На сайте'],
  ['stopped', 'Остановлены'],
];

const PLACEMENT_LABEL: Record<BannerPlacement, string> = {
  sidebar: 'Под «Популярным»',
  inline: 'В тексте',
};

const CONTENT_LABEL = { all: 'новости и статьи', news: 'только новости', article: 'только статьи' } as const;

function matches(b: AdminBannerDoc, show: Show) {
  switch (show) {
    case 'sidebar':
    case 'inline':
      return b.placement === show;
    case 'live':
      return placementState(b) === 'live';
    case 'stopped':
      return !b.active;
    default:
      return true;
  }
}

/** Баннер в тексте без картинки для телефона на сайт не попадает: запрос его отбрасывает. */
const missingMobile = (b: AdminBannerDoc) => b.placement === 'inline' && !b.mobileImage;

export default async function AdminBannersPage({
  searchParams,
}: {
  searchParams: Promise<{ show?: string; toggled?: string; name?: string; full?: string }>;
}) {
  await requireAdminPermission('banners');
  const sp = await searchParams;
  const show: Show = SHOWS.some(([k]) => k === sp.show) ? (sp.show as Show) : 'all';
  const banners = await fetchAdminBanners();
  const notice = noticeText(sp, 'm');

  const live = (p: BannerPlacement) => banners.filter(b => b.placement === p && bannerLiveNow(b)).length;
  const visible = banners.filter(b => matches(b, show));
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
        <>
          <nav aria-label="Фильтр баннеров" className="flex flex-wrap gap-1.5 mb-3">
            {SHOWS.map(([key, label]) => (
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
                {label} · {banners.filter(b => matches(b, key)).length}
              </Link>
            ))}
          </nav>
          <div className="flex flex-wrap gap-x-6 gap-y-1.5 mb-4">
            {(['sidebar', 'inline'] as const).map(p => <RotationMeter key={p} label={PLACEMENT_LABEL[p]} n={live(p)} />)}
          </div>
        </>
      )}

      {sp.full === '1' && (
        <div role="alert" className="mb-4 self-start rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[12.5px]">
          В ротации этого места уже {BANNER_ROTATION_LIMIT} баннеров, шестой сайт не покажет. Остановите один из работающих и включите этот снова.
        </div>
      )}
      <PlacementNotice key={notice ?? ''} message={notice} />

      {banners.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока нет ни одного баннера.</p>
      ) : visible.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">В этом разделе баннеров нет.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {visible.map(b => <BannerRow key={b._id} b={b} back={back} />)}
        </div>
      )}
    </div>
  );
}

function RotationMeter({ label, n }: { label: string; n: number }) {
  return (
    <div className="flex items-center gap-2 text-[11.5px] text-[var(--admin-text-muted)]">
      <span>{label}: в ротации</span>
      <span className="flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: BANNER_ROTATION_LIMIT }, (_, i) => (
          <i key={i} className={`block w-3.5 h-1.5 rounded-full ${i < n ? 'bg-violet-500' : 'bg-[var(--admin-border)]'}`} />
        ))}
      </span>
      <b className="text-[var(--admin-text)] tabular-nums">{n} из {BANNER_ROTATION_LIMIT}</b>
    </div>
  );
}

function BannerRow({ b, back }: { b: AdminBannerDoc; back: string }) {
  const ctr = b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(2) : '0.00';
  const stopped = !b.active;
  const inline = b.placement === 'inline';
  return (
    <div className="flex flex-wrap items-center gap-3 border border-[var(--admin-border)] rounded-xl p-3 bg-[var(--admin-panel)] hover:border-cyan-500/40 transition-colors">
      <Link href={`/admin/banners/${b._id}`} className="flex items-center gap-3 min-w-0 flex-[1_1_260px]">
        <div
          className={`relative shrink-0 rounded-lg overflow-hidden bg-[var(--admin-input)] ${inline ? 'w-[150px] aspect-[970/200]' : 'w-24 h-24'} ${stopped ? 'grayscale opacity-50' : ''}`}
        >
          {b.image && <Image src={sanityImageTransform(b.image, { width: inline ? 300 : 192 })!} alt={b.altText} fill className="object-cover" unoptimized />}
        </div>
        <div className="min-w-0">
          <div className={`text-[13px] font-bold ${stopped ? 'text-[var(--admin-text-secondary)]' : ''}`}>{b.title}</div>
          <div className="text-[11px] text-[var(--admin-text-muted)]">
            {PLACEMENT_LABEL[b.placement]}
            {inline ? ` · ${CONTENT_LABEL[b.contentTypes]}` : ''}
            {' · '}{b.language === 'all' ? 'оба языка' : b.language.toUpperCase()} · вес {b.weight}
            {stopped && b.stoppedAt ? ` · остановлен ${formatPragueDateTime(b.stoppedAt)}` : ''}
          </div>
          {missingMobile(b) && (
            <div className="text-[11px] font-bold text-amber-500 mt-0.5">Нет картинки для телефона, на сайте не показывается</div>
          )}
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
