import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAiJobs } from '@/lib/admin/aiData';

/**
 * Задачи и фильтр.
 *
 * Рядом с каждой задачей стоит число карточек: от него зависит, сработает ли
 * фильтр вообще. Пункт показывается в хабе, только когда его имеют минимум
 * две компании, поэтому на задаче с двумя карточками фильтровать почти нечем,
 * и об этом сказано здесь, а не выясняется потом на сайте.
 */
export default async function AdminAiFiltersPage() {
  await requireAdminPermission('ai');
  const jobs = await fetchAdminAiJobs();

  const globalGroups = new Set<string>();
  for (const j of jobs) for (const g of j.facetGroups) if (g.scope === 'global') globalGroups.add(g.titleRu);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div>
          <h1 className="text-[19px] font-bold">Фильтры и задачи</h1>
          <p className="text-[11.5px] text-[var(--admin-text-muted)] mt-1">
            Общие группы на весь каталог: {[...globalGroups].join(', ') || 'нет'}
          </p>
        </div>
        <Link href="/admin/ai/filters/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить задачу
        </Link>
      </div>

      <ul className="m-0 p-0 list-none grid gap-2">
        {jobs.map(j => {
          const own = j.facetGroups.filter(g => g.scope === 'task');
          const items = j.facetGroups.reduce((n, g) => n + g.items.length, 0);
          return (
            <li key={j._id}>
              <Link href={`/admin/ai/filters/${j._id}`}
                className="block px-3.5 py-3 rounded-xl border border-[var(--admin-border)] hover:border-cyan-500/50">
                <div className="flex items-baseline gap-2.5 flex-wrap">
                  <b className="text-[14px]">{j.nameRu || j.slug}</b>
                  <span className="text-[11.5px] text-[var(--admin-text-muted)]">{j.nameEn}</span>
                  <span className="text-[11px] font-mono text-[var(--admin-text-dim)]">{j.slug}</span>
                  {j.hidden && <span className="text-[11px] font-semibold text-[#f2a93b]">скрыта</span>}
                  <span className="ml-auto text-[11.5px] tabular-nums text-[var(--admin-text-muted)]">
                    карточек {j.serviceCount}
                    {j.serviceCount < 3 && ' · фильтр почти не работает'}
                  </span>
                </div>
                <p className="text-[11.5px] text-[var(--admin-text-muted)] mt-1">
                  своих групп {own.length} · признаков всего {items} · порядок {j.order}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
