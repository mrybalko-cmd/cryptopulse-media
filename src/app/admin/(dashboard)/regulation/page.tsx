import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminRegulationCountries } from '@/lib/admin/data';

const STATUS_LABEL: Record<string, string> = {
  legal: 'Разрешено',
  restricted: 'С ограничениями',
  banned: 'Запрещено',
  unclear: 'Серая зона',
};
const STATUS_COLOR: Record<string, string> = {
  legal: '#22c55e', restricted: '#f59e0b', banned: '#ef4444', unclear: '#8b8d94',
};
const REGION_LABEL: Record<string, string> = {
  eu: 'Европа', americas: 'Америка', asia: 'Азия', mena: 'Ближний Восток / Африка',
};

/** A year without a real check date behind it — the migration's placeholder. */
function isPlaceholderDate(d: string) {
  return d?.endsWith('-01-01');
}

export default async function AdminRegulationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; region?: string; gap?: string }>;
}) {
  await requireAdminPermission('regulation');
  const all = await fetchAdminRegulationCountries();
  const sp = await searchParams;

  const countBy = (s: string) => all.filter(c => c.status === s).length;
  const noSource = all.filter(c => !c.sourceUrl).length;

  let list = all;
  if (sp.status) list = list.filter(c => c.status === sp.status);
  if (sp.region) list = list.filter(c => c.region === sp.region);
  if (sp.gap === 'source') list = list.filter(c => !c.sourceUrl);

  const chip = (label: string, count: number, href: string, active: boolean) => (
    <Link
      key={href}
      href={href}
      className={`text-[11.5px] font-bold rounded-full px-3 py-1.5 border whitespace-nowrap transition-colors ${
        active
          ? 'bg-[var(--admin-text)] text-[var(--admin-bg)] border-[var(--admin-text)]'
          : 'bg-[var(--admin-panel)] text-[var(--admin-text-secondary)] border-[var(--admin-border)] hover:border-[var(--admin-focus)]'
      }`}
    >
      {label} <span className="opacity-60">{count}</span>
    </Link>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Карта регулирования</h1>
        <Link href="/admin/regulation/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить страну
        </Link>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {chip('Все', all.length, '/admin/regulation', !sp.status && !sp.gap && !sp.region)}
        {(['legal', 'restricted', 'banned', 'unclear'] as const).map(s =>
          chip(STATUS_LABEL[s], countBy(s), `/admin/regulation?status=${s}`, sp.status === s)
        )}
        {chip('Без источника', noSource, '/admin/regulation?gap=source', sp.gap === 'source')}
      </div>

      {list.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Под этот фильтр ничего не подходит.</p>
      ) : (
        <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] divide-y divide-[var(--admin-border)]">
          {list.map(c => (
            <Link
              key={c._id}
              href={`/admin/regulation/${c._id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--admin-input)] transition-colors"
            >
              <span className="w-9 text-center text-[11px] font-bold font-mono rounded-md py-1.5 bg-[var(--admin-input)] text-[var(--admin-text-dim)] shrink-0">
                {c.iso2}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-bold truncate">{c.nameRu}</div>
                <div className="text-[11px] text-[var(--admin-text-dim)] truncate">
                  {c.nameEn} · {REGION_LABEL[c.region] ?? c.region}
                </div>
              </div>
              <span
                className="text-[10.5px] font-bold rounded-full px-2.5 py-1 shrink-0 whitespace-nowrap border"
                style={{
                  color: STATUS_COLOR[c.status],
                  borderColor: `${STATUS_COLOR[c.status]}4d`,
                  background: `${STATUS_COLOR[c.status]}1a`,
                }}
              >
                {STATUS_LABEL[c.status]}
              </span>
              <span
                className="text-[11.5px] font-mono w-[86px] text-center shrink-0"
                style={{ color: isPlaceholderDate(c.checkedAt) ? 'var(--admin-text-dim)' : 'var(--admin-text-muted)' }}
                title={isPlaceholderDate(c.checkedAt) ? 'Точной даты нет — перенесён только год' : undefined}
              >
                {isPlaceholderDate(c.checkedAt) ? `${c.checkedAt.slice(0, 4)} г.` : c.checkedAt.split('-').reverse().join('.')}
              </span>
              <span
                className="text-[10px] font-bold rounded-md px-2 py-1 w-[104px] text-center shrink-0"
                style={
                  c.sourceUrl
                    ? { color: '#22c55e', background: 'rgba(34,197,94,.1)' }
                    : { color: '#ef4444', background: 'rgba(239,68,68,.1)' }
                }
              >
                {c.sourceUrl ? 'источник есть' : 'нет источника'}
              </span>
              <span className="text-[var(--admin-text-dim)] shrink-0">›</span>
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-5 mt-4 text-[11.5px] text-[var(--admin-text-muted)]">
        <span>Всего <b className="text-[var(--admin-text)]">{all.length}</b></span>
        <span>Без ссылки на регулятора <b className="text-[var(--admin-text)]">{noSource}</b></span>
        <span>Без точной даты проверки <b className="text-[var(--admin-text)]">{all.filter(c => isPlaceholderDate(c.checkedAt)).length}</b></span>
      </div>
    </div>
  );
}
