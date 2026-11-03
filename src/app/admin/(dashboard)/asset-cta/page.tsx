import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAssetCtas } from '@/lib/admin/data';
import { COIN_REGISTRY } from '@/lib/coinRegistry';
import { formatPragueDate, formatPragueDateTime } from '@/lib/admin/timezone';
import { toggleAssetCtaAction } from './actions';
import { PlacementNotice, PlacementToggleButton } from '../_shared/PlacementToggle';
import PlacementStatus, { noticeText } from '../_shared/PlacementStatus';

export default async function AdminAssetCtaPage({ searchParams }: { searchParams: Promise<{ toggled?: string; name?: string }> }) {
  await requireAdminPermission('banners');
  const notice = noticeText(await searchParams, 'f');
  const ctas = await fetchAdminAssetCtas();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-[19px] font-bold">Кнопки на монетах</h1>
        <Link href="/admin/asset-cta/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить кнопку
        </Link>
      </div>
      <p className="text-[12px] text-[var(--admin-text-muted)] mb-6">
        Одна монета — один партнёр. После сохранения кнопка появляется на сайте
        за пару минут, деплой не нужен.
      </p>

      <PlacementNotice key={notice ?? ''} message={notice} />

      {ctas.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">
          Пока нет ни одной кнопки. Карточки монет выглядят как обычно.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {ctas.map(c => {
            const coin = COIN_REGISTRY[c.coinSlug];
            const color = c.color || coin?.color || 'var(--admin-text-muted)';
            const stopped = !c.active;
            const name = coin ? `${coin.name} · ${coin.symbol}` : c.coinSlug;
            return (
              <div
                key={c._id}
                className="flex flex-wrap items-center gap-3 border border-[var(--admin-border)] rounded-xl p-3 bg-[var(--admin-panel)] hover:border-cyan-500/40 transition-colors"
              >
                <Link href={`/admin/asset-cta/${c._id}`} className="flex items-center gap-3 min-w-0 flex-[1_1_220px]">
                  <span className={`w-9 h-9 rounded-lg shrink-0 ${stopped ? 'grayscale opacity-50' : ''}`} style={{ background: color }} />
                  <div className="min-w-0">
                    <div className={`text-[13px] font-bold ${stopped ? 'text-[var(--admin-text-secondary)]' : ''}`}>{name}</div>
                    <div className="text-[11px] text-[var(--admin-text-muted)] truncate">
                      {c.partner ? `${c.partner} · ` : ''}
                      {c.language === 'all' ? 'оба языка' : c.language.toUpperCase()}
                      {c.endAt ? ` · до ${formatPragueDate(c.endAt, { day: '2-digit', month: '2-digit', year: 'numeric' })}` : ' · без срока'}
                      {stopped && c.stoppedAt ? ` · остановлена ${formatPragueDateTime(c.stoppedAt)}` : ''}
                    </div>
                  </div>
                </Link>
                <span className="ml-auto flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
                  <span className="text-[11px] text-[var(--admin-text-muted)] tabular-nums">
                    <b className="text-[var(--admin-text)]">{(c.clicks + c.sellClicks).toLocaleString('ru-RU')}</b> кликов
                  </span>
                  <PlacementStatus doc={c} gender="f" />
                  <form action={toggleAssetCtaAction}>
                    <input type="hidden" name="id" value={c._id} />
                    <input type="hidden" name="active" value={stopped ? 'true' : 'false'} />
                    <input type="hidden" name="name" value={name} />
                    <input type="hidden" name="back" value="/admin/asset-cta" />
                    <PlacementToggleButton active={c.active} />
                  </form>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
