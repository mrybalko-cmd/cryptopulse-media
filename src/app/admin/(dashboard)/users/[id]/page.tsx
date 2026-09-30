import { notFound } from 'next/navigation';
import { requireOwner } from '@/lib/admin/auth';
import { fetchAdminUserById } from '@/lib/admin/data';
import { updateUserAction, deleteUserAction } from '../actions';
import DeleteButton from '../../_shared/DeleteButton';
import UserForm from '../UserForm';

export default async function EditUserPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  await requireOwner();
  const [{ id }, { error }] = await Promise.all([params, searchParams]);
  const user = await fetchAdminUserById(id);
  if (!user) notFound();

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateUserAction(id, formData);
  };
  const boundDelete = async () => {
    'use server';
    await deleteUserAction(id);
  };

  return (
    <div>
      {/* Удаление стоит в шапке отдельной формой, а не внутри формы правки:
          вложенные формы браузер выбрасывает при разборе. */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-[19px] font-bold">{user.name}</h1>
        <DeleteButton
          action={boundDelete}
          confirmMessage={`Удалить сотрудника «${user.name}» (${user.email}) безвозвратно? Доступ пропадёт сразу. Если нужно просто закрыть вход, снимите галочку «Активен» — тогда история его действий останется связной.`}
        />
      </div>
      {error === 'self-delete' && (
        <p className="text-[12.5px] text-red-400 border border-red-500/30 rounded-lg px-3 py-2.5 mb-5 max-w-2xl">
          Себя удалить нельзя. Сессия осталась бы действующей на несуществующую
          запись, а если вы единственный владелец — раздел пользователей закрылся
          бы навсегда.
        </p>
      )}
      {error === 'last-owner-delete' && (
        <p className="text-[12.5px] text-red-400 border border-red-500/30 rounded-lg px-3 py-2.5 mb-5 max-w-2xl">
          Это единственный владелец. Удалить его нельзя: управлять пользователями
          станет некому. Сначала назначьте владельцем кого-то ещё.
        </p>
      )}
      {error === 'last-owner' && (
        <p className="text-[12.5px] text-red-400 border border-red-500/30 rounded-lg px-3 py-2.5 mb-5 max-w-2xl">
          Это единственный владелец. Снять с него права или выключить его нельзя:
          управлять пользователями станет некому, а вернуть доступ из админки будет
          неоткуда. Сначала назначьте владельцем кого-то ещё.
        </p>
      )}
      <UserForm mode="edit" user={user} action={boundAction} />
    </div>
  );
}
