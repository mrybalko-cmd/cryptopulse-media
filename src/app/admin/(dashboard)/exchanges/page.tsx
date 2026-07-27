import Link from 'next/link';
import Image from 'next/image';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminExchangesList, type AdminExchangeListItem } from '@/lib/admin/data';
import { sanityImageTransform } from '@/lib/sanityImage';

const REGION_TONE_COLOR: Record<string, string> = { ok: '#22c55e', warn: '#f2a93b', off: '#8b8d94' };

function ExchangeRow({ e }: { e: AdminExchangeListItem }) {
  return (
    <Link
      href={`/admin/exchanges/${e._id}`}
      className="grid grid-cols-[40px_1.6fr_0.9fr_1fr_0.8fr_0.6fr_0.5fr] gap-3 items-center px-3 py-2.5 border-b border-[var(--admin-border)] last:border-b-0 hover:bg-[var(--admin-input)] transition-colors"
    >
      <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[var(--admin-input)]">
        {e.logo && <Image src={sanityImageTransform(e.logo, { width: 64 })!} alt={e.name} fill className="object-cover" unoptimized />}
      </div>
      <div className="text-[12.5px] font-bold truncate">{e.pinned ? '📌 ' : ''}{e.name}</div>
      <div className="flex gap-1 flex-wrap">
        {e.type.map(t => (
          <span key={t} className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[var(--admin-input)] text-[var(--admin-text-secondary)]">{t}</span>
        ))}
      </div>
      <div className="flex gap-1 items-center">
        {e.regionTones.length === 0 ? (
          <span className="text-[10.5px] text-[var(--admin-text-dim)]">—</span>
        ) : (
          e.regionTones.map((tone, i) => (
            <span key={i} className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: REGION_TONE_COLOR[tone] ?? '#8b8d94' }} />
          ))
        )}
      </div>
      <div className="text-[11.5px] text-[var(--admin-text-muted)]">
        {typeof e.volume24h === 'number' ? `$${(e.volume24h / 1e9).toFixed(1)}B` : '—'}
      </div>
      <div className="text-[11.5px] text-[var(--admin-text-muted)]">{e.foundedYear ?? '—'}</div>
      <div className="text-[11.5px] font-bold" style={{ color: e.pinned ? 'var(--admin-focus)' : 'var(--admin-text-dim)' }}>
        {e.pinned ? `#${e.pinPosition ?? 1}` : '—'}
      </div>
    </Link>
  );
}

export default async function AdminExchangesPage() {
  await requireAdminPermission('exchanges');
  const exchanges = await fetchAdminExchangesList();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Криптобиржи</h1>
        <Link href="/admin/exchanges/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить биржу
        </Link>
      </div>

      {exchanges.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока нет ни одной биржи.</p>
      ) : (
        <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] overflow-hidden">
          <div className="grid grid-cols-[40px_1.6fr_0.9fr_1fr_0.8fr_0.6fr_0.5fr] gap-3 px-3 py-2 text-[10px] uppercase font-extrabold text-[var(--admin-text-dim)] border-b border-[var(--admin-border)]">
            <span></span><span>Биржа</span><span>Тип</span><span>Регионы</span><span>Объём 24ч</span><span>Основана</span><span>Закреп.</span>
          </div>
          {exchanges.map(e => <ExchangeRow key={e._id} e={e} />)}
        </div>
      )}
      <p className="text-[10.5px] text-[var(--admin-text-dim)] mt-2.5">
        Регионы: 🟢 разрешена · 🟡 предупреждение · ⚪ недоступна
      </p>
    </div>
  );
}
