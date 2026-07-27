import Link from 'next/link';
import Image from 'next/image';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminExchangesList } from '@/lib/admin/data';
import { sanityImageTransform } from '@/lib/sanityImage';

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
        <div className="flex flex-col gap-2">
          {exchanges.map(e => (
            <Link
              key={e._id}
              href={`/admin/exchanges/${e._id}`}
              className="flex items-center gap-3 border border-[var(--admin-border)] rounded-xl p-3 bg-[var(--admin-panel)] hover:border-cyan-500/40 transition-colors"
            >
              <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[var(--admin-input)]">
                {e.logo && <Image src={sanityImageTransform(e.logo, { width: 88 })!} alt={e.name} fill className="object-cover" unoptimized />}
              </div>
              <div>
                <div className="text-[13px] font-bold">{e.pinned ? '📌 ' : ''}{e.name}</div>
                {typeof e.volume24h === 'number' && (
                  <div className="text-[11px] text-[var(--admin-text-muted)]">Объём 24ч: ${(e.volume24h / 1e9).toFixed(1)}B</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
