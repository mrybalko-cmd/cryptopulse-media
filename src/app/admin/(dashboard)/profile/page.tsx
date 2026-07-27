import { getAdminSession } from '@/lib/admin/auth';
import { redirect } from 'next/navigation';
import { changeOwnPasswordAction } from './actions';

const ERROR_MESSAGES: Record<string, string> = {
  current: 'Текущий пароль указан неверно.',
  short: 'Новый пароль должен быть не короче 8 символов.',
  mismatch: 'Новый пароль и подтверждение не совпадают.',
};

export default async function ProfilePage({ searchParams }: { searchParams: Promise<{ error?: string; success?: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  const { error, success } = await searchParams;

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-1">Профиль</h1>
      <p className="text-[12.5px] text-[#8b93a7] mb-6">{session.name} · {session.email} · {session.isOwner ? 'Владелец' : 'Сотрудник'}</p>

      <div className="max-w-md">
        <h2 className="text-[14px] font-bold mb-3">Сменить пароль</h2>

        {error && ERROR_MESSAGES[error] && (
          <p className="text-[12.5px] text-red-400 mb-4">{ERROR_MESSAGES[error]}</p>
        )}
        {success === '1' && (
          <p className="text-[12.5px] text-[#22c55e] mb-4">Пароль обновлён.</p>
        )}

        <form action={changeOwnPasswordAction}>
          <div className="mb-4">
            <label className="text-[11.5px] font-bold text-[#c3c9d6] mb-1.5 block">Текущий пароль</label>
            <input
              name="currentPassword"
              type="password"
              required
              className="w-full bg-[#1c202b] border border-[#262b38] rounded-lg px-3 py-2.5 text-[13px]"
            />
          </div>
          <div className="mb-4">
            <label className="text-[11.5px] font-bold text-[#c3c9d6] mb-1.5 block">Новый пароль (минимум 8 символов)</label>
            <input
              name="newPassword"
              type="password"
              required
              minLength={8}
              className="w-full bg-[#1c202b] border border-[#262b38] rounded-lg px-3 py-2.5 text-[13px]"
            />
          </div>
          <div className="mb-6">
            <label className="text-[11.5px] font-bold text-[#c3c9d6] mb-1.5 block">Подтверждение нового пароля</label>
            <input
              name="newPasswordConfirm"
              type="password"
              required
              minLength={8}
              className="w-full bg-[#1c202b] border border-[#262b38] rounded-lg px-3 py-2.5 text-[13px]"
            />
          </div>
          <button type="submit" className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
            Сохранить пароль
          </button>
        </form>
      </div>
    </div>
  );
}
