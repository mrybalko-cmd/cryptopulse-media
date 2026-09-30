import { notFound } from 'next/navigation';
import { requireOwner } from '@/lib/admin/auth';
import { fetchAdminUserById } from '@/lib/admin/data';
import { updateUserAction } from '../actions';
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

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">{user.name}</h1>
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
