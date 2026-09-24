import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAuthors, type AdminAuthorDoc } from '@/lib/admin/data';
import { authorName } from '@/lib/authorName';

// Порядок тот же, что в форме, чтобы глаз не искал заново.
const LINKS: { key: keyof AdminAuthorDoc; icon: string; title: string }[] = [
  { key: 'telegram',  icon: '✈',  title: 'Telegram' },
  { key: 'twitter',   icon: '𝕏',  title: 'X / Twitter' },
  { key: 'linkedin',  icon: 'in', title: 'LinkedIn' },
  { key: 'facebook',  icon: 'f',  title: 'Facebook' },
  { key: 'instagram', icon: '◎',  title: 'Instagram' },
  { key: 'website',   icon: '⌂',  title: 'Сайт автора' },
  { key: 'email',     icon: '✉',  title: 'Email' },
];

export default async function AdminAuthorsPage() {
  await requireAdminPermission('authors');
  const authors = await fetchAdminAuthors();
  const shown = authors.filter(a => !a.hidden).length;
  const hidden = authors.length - shown;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[19px] font-bold">Авторы</h1>
          <p className="text-[11.5px] text-[var(--admin-text-muted)] mt-0.5">
            {shown} на сайте{hidden > 0 ? ` · ${hidden} скрыто` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href="/admin/authors/rubrics"
            className="border border-[var(--admin-border)] text-[12.5px] font-bold rounded-lg px-3.5 py-2.5 hover:border-cyan-500/40">
            Рубрики
          </Link>
          <Link href="/admin/authors/settings"
            className="border border-[var(--admin-border)] text-[12.5px] font-bold rounded-lg px-3.5 py-2.5 hover:border-cyan-500/40">
            Страница раздела
          </Link>
          <Link href="/admin/authors/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
            + Добавить
          </Link>
        </div>
      </div>

      {authors.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока нет ни одного автора.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {authors.map(a => {
            const ru = authorName(a, 'ru');
            const en = authorName(a, 'en');
            // Показываем пару языков только когда написания расходятся —
            // иначе строка повторяет заголовок карточки и ничего не сообщает.
            const twoNames = ru !== en;
            return (
              <Link
                key={a._id}
                href={`/admin/authors/${a._id}`}
                className={`border rounded-xl bg-[var(--admin-panel)] p-4 transition-colors hover:border-cyan-500/40 ${
                  a.hidden ? 'border-amber-500/30' : 'border-[var(--admin-border)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-14 h-14 ${a.entityKind === 'organization' ? 'rounded-xl' : 'rounded-full'} overflow-hidden bg-[var(--admin-input)] border border-[var(--admin-border)] shrink-0 ${a.hidden ? 'opacity-45' : ''}`}>
                    {a.photo && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`${a.photo}?w=112&h=112&fit=crop`} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[13.5px] font-bold truncate">{a.name}</span>
                      {a.hidden && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-amber-500 bg-amber-500/12 rounded px-1.5 py-0.5 shrink-0">
                          скрыт
                        </span>
                      )}
                      {a.entityKind === 'organization' && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-[var(--admin-text-dim)] bg-[var(--admin-input)] rounded px-1.5 py-0.5 shrink-0">
                          компания
                        </span>
                      )}
                      {a.sponsored && (
                        <span className="text-[10px] font-bold uppercase tracking-wide text-cyan-400 bg-cyan-500/12 rounded px-1.5 py-0.5 shrink-0">
                          размещение
                        </span>
                      )}
                    </div>
                    {twoNames && (
                      <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 truncate">
                        RU {ru} · EN {en}
                      </div>
                    )}
                    {(a.roleRu || a.roleEn) && (
                      <div className="text-[11px] text-[var(--admin-text-muted)] mt-0.5 truncate">{a.roleRu || a.roleEn}</div>
                    )}
                    <div className="text-[11px] text-[var(--admin-text-dim)] mt-1">
                      {a.materials ?? 0} материал{plural(a.materials ?? 0)} · /{a.slug}
                    </div>
                  </div>
                </div>

                {(a.bioRu || a.bioEn) && (
                  <p className="text-[11px] text-[var(--admin-text-dim)] leading-relaxed mt-3 line-clamp-2">
                    {a.bioRu || a.bioEn}
                  </p>
                )}

                <div className="flex gap-1.5 mt-3 flex-wrap">
                  {LINKS.map(l => {
                    const on = Boolean(a[l.key]);
                    return (
                      <span
                        key={String(l.key)}
                        title={on ? l.title : `${l.title} — не заполнен`}
                        className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[11px]"
                        style={
                          on
                            ? { background: 'rgba(6,182,212,.12)', color: 'var(--admin-focus)' }
                            : { background: 'var(--admin-input)', color: 'var(--admin-text-dim)' }
                        }
                      >
                        {l.icon}
                      </span>
                    );
                  })}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** 1 материал, 2 материала, 5 материалов. */
function plural(n: number): string {
  const d = Math.abs(n) % 100;
  if (d >= 11 && d <= 14) return 'ов';
  const u = d % 10;
  return u === 1 ? '' : u >= 2 && u <= 4 ? 'а' : 'ов';
}
