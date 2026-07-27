import { requireOwner } from '@/lib/admin/auth';
import { createUserAction } from '../actions';
import UserForm from '../UserForm';

export default async function NewUserPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireOwner();
  const { error } = await searchParams;

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новый сотрудник</h1>
      {error === 'exists' && <p className="text-[12.5px] text-red-400 mb-4">Пользователь с таким email уже существует.</p>}
      {error === '1' && <p className="text-[12.5px] text-red-400 mb-4">Проверьте поля — имя, email и пароль (минимум 8 символов) обязательны.</p>}
      <UserForm mode="create" action={createUserAction} />
    </div>
  );
}
