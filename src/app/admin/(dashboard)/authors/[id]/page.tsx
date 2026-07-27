import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAuthorById } from '@/lib/admin/data';
import { updateAuthorAction, deleteAuthorAction } from '../actions';
import AuthorForm from '../AuthorForm';
import DeleteButton from '../../_shared/DeleteButton';

export default async function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('authors');
  const { id } = await params;
  const author = await fetchAdminAuthorById(id);
  if (!author) notFound();

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateAuthorAction(id, formData);
  };
  const boundDelete = async () => {
    'use server';
    await deleteAuthorAction(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">{author.name}</h1>
        <DeleteButton action={boundDelete} confirmMessage={`Удалить автора «${author.name}» безвозвратно? Это действие нельзя отменить.`} />
      </div>
      <AuthorForm author={author} action={boundAction} />
    </div>
  );
}
