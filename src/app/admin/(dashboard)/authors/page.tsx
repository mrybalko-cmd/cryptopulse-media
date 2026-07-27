import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAuthors } from '@/lib/admin/data';

const SOCIALS: { key: 'telegram' | 'linkedin' | 'facebook' | 'twitter' | 'email'; icon: string }[] = [
  { key: 'telegram', icon: '✈️' },
  { key: 'linkedin', icon: 'in' },
  { key: 'facebook', icon: 'f' },
  { key: 'twitter', icon: '𝕏' },
  { key: 'email', icon: '✉' },
];

export default async function AdminAuthorsPage() {
  await requireAdminPermission('authors');
  const authors = await fetchAdminAuthors();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Авторы</h1>
        <Link href="/admin/authors/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить автора
        </Link>
      </div>

      {authors.length === 0 ? (
        <p className="text-[13px] text-[var(--admin-text-muted)]">Пока нет ни одного автора.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {authors.map(a => (
            <Link
              key={a._id}
              href={`/admin/authors/${a._id}`}
              className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] p-4 hover:border-cyan-500/40 transition-colors"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden bg-[var(--admin-input)] border border-[var(--admin-border)]">
                {a.photo && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`${a.photo}?w=112&h=112&fit=crop`} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="text-[13.5px] font-bold mt-2.5">{a.name}</div>
              {(a.roleRu || a.roleEn) && <div className="text-[11px] text-[var(--admin-text-muted)] mb-2">{a.roleRu || a.roleEn}</div>}
              {(a.bioRu || a.bioEn) && (
                <p className="text-[11px] text-[var(--admin-text-dim)] leading-relaxed mb-3 line-clamp-2">{a.bioRu || a.bioEn}</p>
              )}
              <div className="flex gap-1.5">
                {SOCIALS.map(s => (
                  <span
                    key={s.key}
                    className="w-[22px] h-[22px] rounded-md flex items-center justify-center text-[11px]"
                    style={
                      a[s.key]
                        ? { background: 'rgba(6,182,212,.12)', color: 'var(--admin-focus)' }
                        : { background: 'var(--admin-input)', color: 'var(--admin-text-dim)' }
                    }
                  >
                    {s.icon}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
