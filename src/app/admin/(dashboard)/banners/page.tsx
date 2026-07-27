import Link from 'next/link';
import Image from 'next/image';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminBanners } from '@/lib/admin/data';
import { sanityImageTransform } from '@/lib/sanityImage';

function statusOf(b: { active: boolean; startAt?: string; endAt?: string }) {
  if (!b.active) return { color: '#8b93a7', label: 'Выключен' };
  const now = Date.now();
  const scheduled = (b.startAt && new Date(b.startAt).getTime() > now) || (b.endAt && new Date(b.endAt).getTime() < now);
  return scheduled ? { color: '#f2a93b', label: 'Запланирован/истёк' } : { color: '#22c55e', label: 'Активен' };
}

export default async function AdminBannersPage() {
  await requireAdminPermission('banners');
  const banners = await fetchAdminBanners();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Баннеры</h1>
        <Link href="/admin/banners/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить баннер
        </Link>
      </div>

      {banners.length === 0 ? (
        <p className="text-[13px] text-[#8b93a7]">Пока нет ни одного баннера.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {banners.map(b => {
            const status = statusOf(b);
            const ctr = b.impressions > 0 ? ((b.clicks / b.impressions) * 100).toFixed(2) : '0.00';
            return (
              <Link
                key={b._id}
                href={`/admin/banners/${b._id}`}
                className="flex items-center gap-3 border border-[#262b38] rounded-xl p-3 bg-[#161922] hover:border-cyan-500/40 transition-colors"
              >
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-[#1c202b]">
                  {b.image && <Image src={sanityImageTransform(b.image, { width: 88 })!} alt={b.altText} fill className="object-cover" unoptimized />}
                </div>
                <div>
                  <div className="text-[13px] font-bold">{b.title}</div>
                  <div className="text-[11px] text-[#8b93a7]">{b.language === 'all' ? 'Оба языка' : b.language.toUpperCase()} · вес {b.weight}</div>
                </div>
                <div className="ml-auto flex items-center gap-4">
                  <div className="flex gap-3.5 text-[11px] text-[#8b93a7]">
                    <span><b className="text-[#eef0f4]">{b.impressions.toLocaleString('ru-RU')}</b> показов</span>
                    <span><b className="text-[#eef0f4]">{b.clicks.toLocaleString('ru-RU')}</b> кликов</span>
                    <span><b className="text-[#eef0f4]">{ctr}%</b> CTR</span>
                  </div>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: status.color }} title={status.label} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
