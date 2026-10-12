import Link from 'next/link';
import Image from 'next/image';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAiServices, fetchAdminAiJobs } from '@/lib/admin/aiData';

/**
 * Список карточек каталога.
 *
 * Группировка по задачам, а не сплошным списком: редактор приходит сюда с
 * мыслью «что у нас по видео», а не «покажи все пятьдесят». Заодно сразу
 * видно, где задача осталась с одной-двумя карточками — фильтр там почти не
 * работает.
 */
export default async function AdminAiPage() {
  await requireAdminPermission('ai');
  const [services, jobs] = await Promise.all([fetchAdminAiServices(), fetchAdminAiJobs()]);

  const unchecked = services.filter(s => !s.priceCheckedAt).length;
  const noLogo = services.filter(s => !s.logoUrl).length;
  const orphans = services.filter(s => !s.jobId);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h1 className="text-[19px] font-bold">AI-сервисы</h1>
          <p className="text-[11.5px] text-[var(--admin-text-muted)] mt-1 tabular-nums">
            Карточек {services.length} · задач {jobs.length}
            {unchecked > 0 && ` · без даты сверки ${unchecked}`}
            {noLogo > 0 && ` · без логотипа ${noLogo}`}
          </p>
        </div>
        <Link href="/admin/ai/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить сервис
        </Link>
      </div>

      {orphans.length > 0 && (
        <p className="text-[12px] mb-4 px-3.5 py-2.5 rounded-lg border border-[#f2a93b]/35 bg-[#f2a93b]/10">
          Без задачи: {orphans.map(o => o.name).join(', ')}. Такие карточки в разделе не показываются.
        </p>
      )}

      {jobs.map(job => {
        const rows = services.filter(s => s.jobId === job._id);
        if (!rows.length) return null;
        return (
          <section key={job._id} className="mb-7">
            <h2 className="text-[13px] font-bold mb-2 flex items-baseline gap-2">
              {job.nameRu || job.slug}
              <span className="text-[11px] font-semibold text-[var(--admin-text-muted)] tabular-nums">
                {rows.length}
                {rows.length < 3 && ' · фильтр здесь почти не работает'}
              </span>
            </h2>
            <ul className="m-0 p-0 list-none grid gap-1.5">
              {rows.map(s => (
                <li key={s._id}>
                  <Link href={`/admin/ai/${s._id}`}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg border border-[var(--admin-border)] hover:border-cyan-500/50">
                    <span className="w-8 h-8 rounded-lg grid place-items-center overflow-hidden shrink-0 border border-[var(--admin-border)]"
                      style={{ background: s.logoUrl ? (s.logoOnDark ? '#15161a' : '#fff') : s.brandColor }}>
                      {s.logoUrl
                        ? <Image src={s.logoUrl} alt="" width={32} height={32} className="w-full h-full object-contain p-1" />
                        : <b className="text-white text-[11px]">{(s.monogram || s.name.slice(0, 2)).toUpperCase()}</b>}
                    </span>
                    <span className="font-bold text-[13px] min-w-0 truncate">{s.name}</span>
                    <span className="text-[11.5px] text-[var(--admin-text-muted)] min-w-0 truncate flex-1">
                      {s.tagline?.ru ?? ''}
                    </span>
                    <span className="text-[11px] tabular-nums shrink-0 text-[var(--admin-text-muted)]">
                      {s.priceCheckedAt
                        ? <span className="text-green-400 font-semibold">сверено</span>
                        : <span className="text-[#f2a93b] font-semibold">не сверено</span>}
                      {s.hidden && ' · скрыт'}
                      {s.pinned && ' · закреплён'}
                      {s.sponsored && ' · оплачено'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
