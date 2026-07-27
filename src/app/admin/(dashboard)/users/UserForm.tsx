import { PERMISSIONS } from '@/lib/admin/permissions';
import type { AdminUserDoc } from '@/lib/admin/data';

export default function UserForm({
  user,
  action,
  mode,
}: {
  user?: AdminUserDoc;
  action: (formData: FormData) => void;
  mode: 'create' | 'edit';
}) {
  return (
    <form action={action} className="max-w-lg">
      <div className="mb-4">
        <label className="text-[11.5px] font-bold text-[#c3c9d6] mb-1.5 block">Имя</label>
        <input name="name" defaultValue={user?.name} required className="w-full bg-[#1c202b] border border-[#262b38] rounded-lg px-3 py-2.5 text-[13px]" />
      </div>
      {mode === 'create' ? (
        <div className="mb-4">
          <label className="text-[11.5px] font-bold text-[#c3c9d6] mb-1.5 block">Email (логин)</label>
          <input name="email" type="email" required className="w-full bg-[#1c202b] border border-[#262b38] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>
      ) : (
        <div className="mb-4">
          <label className="text-[11.5px] font-bold text-[#c3c9d6] mb-1.5 block">Email</label>
          <input value={user?.email} disabled className="w-full bg-[#1c202b] border border-[#262b38] rounded-lg px-3 py-2.5 text-[13px] opacity-50" />
        </div>
      )}
      <div className="mb-4">
        <label className="text-[11.5px] font-bold text-[#c3c9d6] mb-1.5 block">
          {mode === 'create' ? 'Пароль (минимум 8 символов)' : 'Новый пароль (оставьте пустым, чтобы не менять)'}
        </label>
        <input name={mode === 'create' ? 'password' : 'newPassword'} type="password" minLength={8} required={mode === 'create'} className="w-full bg-[#1c202b] border border-[#262b38] rounded-lg px-3 py-2.5 text-[13px]" />
      </div>

      <label className="flex items-center gap-2 text-[12.5px] mb-3">
        <input type="checkbox" name="isOwner" defaultChecked={user?.isOwner} />
        Владелец — все права + управление пользователями
      </label>

      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-wide text-[#8b93a7] font-bold mb-2">Права доступа (игнорируются, если «Владелец» включён)</div>
        <div className="flex flex-wrap gap-3">
          {PERMISSIONS.map(p => (
            <label key={p.key} className="flex items-center gap-1.5 text-[12.5px]">
              <input type="checkbox" name={`perm_${p.key}`} defaultChecked={user?.permissions?.includes(p.key)} />
              {p.label}
            </label>
          ))}
        </div>
      </div>

      {mode === 'edit' && (
        <label className="flex items-center gap-2 text-[12.5px] mb-5">
          <input type="checkbox" name="active" defaultChecked={user?.active ?? true} />
          Активен (может войти)
        </label>
      )}

      <button type="submit" className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
        {mode === 'create' ? 'Добавить сотрудника' : 'Сохранить'}
      </button>
    </form>
  );
}
