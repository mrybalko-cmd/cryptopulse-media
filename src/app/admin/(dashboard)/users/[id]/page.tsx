import { notFound } from 'next/navigation';
import { requireOwner } from '@/lib/admin/auth';
import { fetchAdminUserById } from '@/lib/admin/data';
import { updateUserAction } from '../actions';
import UserForm from '../UserForm';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner();
  const { id } = await params;
  const user = await fetchAdminUserById(id);
  if (!user) notFound();

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateUserAction(id, formData);
  };

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">{user.name}</h1>
      <UserForm mode="edit" user={user} action={boundAction} />
    </div>
  );
}
