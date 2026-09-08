import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminGlossary } from '@/lib/admin/glossary';
import ListSearchBar from '../_shared/ListSearchBar';

export const dynamic = 'force-dynamic';

const CATEGORY_LABELS: Record<string, string> = {
  basics: 'Основы', wallets: 'Кошельки', trading: 'Торговля', defi: 'DeFi',
  tech: 'Технологии', compliance: 'Регулирование', tokens: 'Токены',
  slang: 'Сленг', security: 'Безопасность',
};

type Props = { searchParams: Promise<{ q?: string; kind?: string; gap?: string }> };

export default async function AdminGlossaryPage({ searchParams }: Props) {
  await requireAdminPermission('glossary');
  const { q = '', kind = '', gap = '' } = await searchParams;
  const all = await fetchAdminGlossary();

  const needle = q.trim().toLowerCase();
  const rows = all.filter(r => {
    if (kind && r.kind !== kind) return false;
    // «Без словоформ» — это рабочий список: пока у термина их нет,
    // автоматическая ссылка встанет только на точное слово.
    if (gap === 'aliases' && r.aliasCount > 0) return false;
    if (!needle) return true;
    return (
      r.termRu.toLowerCase().includes(needle) ||
      r.termEn.toLowerCase().includes(needle) ||
      r.slug.toLowerCase().includes(needle)
    );
  });

  const crypto = all.filter(r => r.kind === 'crypto').length;
  const ai = all.length - crypto;
  const noAliases = all.filter(r => r.aliasCount === 0).length;

  function Chip({ label, count, href, on }: { label: string; count: number; href: string; on: boolean }) {
    return (
      <Link
        href={href}
        className={`text-[11.5px] font-bold rounded-full px-3 py-1.5 border transition-colors ${
          on
            ? 'bg-cyan-500 text-[#06222b] border-cyan-500'
            : 'bg-[var(--admin-panel)] text-[var(--admin-text-muted)] border-[var(--admin-border)] hover:text-[var(--admin-text)]'
        }`}
      >
        {label} <span className="opacity-60">{count}</span>
      </Link>
    );
  }

  const qs = (o: Record<string, string>) => {
    const p = new URLSearchParams({ ...(q ? { q } : {}), ...o });
    [...p.entries()].forEach(([k, v]) => { if (!v) p.delete(k); });
    const s = p.toString();
    return `/admin/glossary${s ? `?${s}` : ''}`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Глоссарий</h1>
        <Link
          href="/admin/glossary/new"
          className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5"
        >
          Добавить термин
        </Link>
      </div>

      <ListSearchBar basePath="/admin/glossary" query={q} filter={kind || gap}
        placeholder="Поиск по термину или адресу" />

      <div className="flex flex-wrap gap-2 my-4">
        <Chip label="Все" count={all.length} href={qs({})} on={!kind && !gap} />
        <Chip label="Криптовалюты" count={crypto} href={qs({ kind: 'crypto' })} on={kind === 'crypto'} />
        <Chip label="Искусственный интеллект" count={ai} href={qs({ kind: 'ai' })} on={kind === 'ai'} />
        <Chip label="Без словоформ" count={noAliases} href={qs({ gap: 'aliases' })} on={gap === 'aliases'} />
      </div>

      {rows.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Под этот фильтр ничего не подходит.</p>
      ) : (
        <div className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] divide-y divide-[var(--admin-border)]">
          {rows.map((r, i) => (
            <Link
              key={r._id}
              href={`/admin/glossary/${r._id}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--admin-input)] transition-colors"
            >
              <span className="w-9 text-center text-[11px] font-bold font-mono rounded-md py-1.5 bg-[var(--admin-input)] text-[var(--admin-text-dim)] shrink-0">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-bold truncate">
                  {r.termRu} <span className="text-[var(--admin-text-dim)] font-normal">· {r.termEn}</span>
                </div>
                <div className="text-[11px] text-[var(--admin-text-dim)] truncate">
                  /{r.kind === 'ai' ? 'ai/glossary' : 'glossary'}/{r.slug}
                  {r.category ? ` · ${CATEGORY_LABELS[r.category] || r.category}` : ''}
                  {r.sectionCount ? ` · ${r.sectionCount} разд.` : ' · только определение'}
                  {r.exampleCount ? `, ${r.exampleCount} с разбором` : ''}
                </div>
              </div>
              <span
                className={`text-[10px] font-extrabold rounded-md px-2 py-1 shrink-0 ${
                  r.kind === 'ai'
                    ? 'bg-purple-500/15 text-purple-300'
                    : 'bg-cyan-500/15 text-cyan-300'
                }`}
              >
                {r.kind === 'ai' ? 'ИИ' : 'Крипто'}
              </span>
              <span
                className={`text-[10px] font-bold rounded-md px-2 py-1 w-[104px] text-center shrink-0 ${
                  r.aliasCount
                    ? 'bg-[var(--admin-input)] text-[var(--admin-text-muted)]'
                    : 'bg-amber-500/15 text-amber-300'
                }`}
                title="Словоформы, по которым автоссылка узнаёт термин в тексте"
              >
                {r.aliasCount ? `${r.aliasCount} форм` : 'нет форм'}
              </span>
              <span className="text-[11.5px] font-mono w-[86px] text-center shrink-0 text-[var(--admin-text-dim)]">
                {r.updated ? r.updated.split('-').reverse().join('.') : '—'}
              </span>
              <span className="text-[var(--admin-text-dim)] shrink-0">›</span>
            </Link>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-5 mt-4 text-[11.5px] text-[var(--admin-text-muted)]">
        <span>Всего <b className="text-[var(--admin-text)]">{all.length}</b></span>
        <span>Показано <b className="text-[var(--admin-text)]">{rows.length}</b></span>
        <span>Без словоформ <b className="text-[var(--admin-text)]">{noAliases}</b></span>
      </div>
    </div>
  );
}
