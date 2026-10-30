import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAssetCtas } from '@/lib/admin/data';
import { COIN_REGISTRY } from '@/lib/coinRegistry';
import { formatPragueDate } from '@/lib/admin/timezone';

function statusOf(c: { active: boolean; startAt?: string; endAt?: string }) {
  if (!c.active) return { color: 'var(--admin-text-muted)', label: 'Выключена' };
  const now = Date.now();
  if (c.endAt && new Date(c.endAt).getTime() < now) return { color: '#f2a93b', label: 'Срок вышел' };
  if (c.startAt && new Date(c.startAt).getTime() > now) return { color: '#f2a93b', label: 'Ещё не началась' };
  return { color: '#22c55e', label: 'На сайте' };
}

export default async function AdminAssetCtaPage() {
  await requireAdminPermission('banners');
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

      {ctas.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">
          Пока нет ни одной кнопки. Карточки монет выглядят как обычно.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {ctas.map(c => {
            const status = statusOf(c);
            const coin = COIN_REGISTRY[c.coinSlug];
            const color = c.color || coin?.color || 'var(--admin-text-muted)';
            return (
              <Link
                key={c._id}
                href={`/admin/asset-cta/${c._id}`}
                className="flex items-center gap-3 border border-[var(--admin-border)] rounded-xl p-3 bg-[var(--admin-panel)] hover:border-cyan-500/40 transition-colors"
              >
                <span className="w-9 h-9 rounded-lg shrink-0" style={{ background: color }} />
                <div className="min-w-0">
                  <div className="text-[13px] font-bold">
                    {coin ? `${coin.name} · ${coin.symbol}` : c.coinSlug}
                  </div>
                  <div className="text-[11px] text-[var(--admin-text-muted)] truncate">
                    {c.partner ? `${c.partner} · ` : ''}
                    {c.language === 'all' ? 'оба языка' : c.language.toUpperCase()}
                    {c.endAt ? ` · до ${formatPragueDate(c.endAt, { day: '2-digit', month: '2-digit', year: 'numeric' })}` : ' · без срока'}
                  </div>
                </div>
                <span className="ml-auto flex items-center gap-2 shrink-0">
                  <span className="text-[11px] text-[var(--admin-text-muted)]">{status.label}</span>
                  <span className="w-2 h-2 rounded-full" style={{ background: status.color }} />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
