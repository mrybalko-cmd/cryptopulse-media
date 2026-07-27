import Link from 'next/link';
import { requireOwner } from '@/lib/admin/auth';
import { fetchAdminUsers } from '@/lib/admin/data';
import { PERMISSIONS } from '@/lib/admin/permissions';

export default async function AdminUsersPage() {
  await requireOwner();
  const users = await fetchAdminUsers();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">Пользователи и права</h1>
        <Link href="/admin/users/new" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-4 py-2.5">
          + Добавить сотрудника
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[12.5px]">
          <thead>
            <tr className="text-[var(--admin-text-muted)] text-[10px] uppercase tracking-wide">
              <th className="text-left pb-2.5 px-2">Сотрудник</th>
              {PERMISSIONS.map(p => <th key={p.key} className="pb-2.5 px-2">{p.label}</th>)}
              <th className="pb-2.5 px-2">Всё</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t border-[var(--admin-border)]">
                <td className="py-2.5 px-2">
                  <Link href={`/admin/users/${u._id}`} className="font-bold hover:text-cyan-400">{u.name}</Link>
                  <div className="text-[10.5px] text-[var(--admin-text-muted)]">{u.email}{!u.active && ' · отключён'}</div>
                </td>
                {PERMISSIONS.map(p => (
                  <td key={p.key} className="text-center">{u.isOwner || u.permissions?.includes(p.key) ? '✅' : '—'}</td>
                ))}
                <td className="text-center">{u.isOwner ? '✅' : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
