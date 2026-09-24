import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminRubrics } from '@/lib/admin/data';
import { createAuthorAction } from '../actions';
import AuthorForm from '../AuthorForm';

export default async function NewAuthorPage() {
  await requireAdminPermission('authors');
  const rubrics = await fetchAdminRubrics();

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новый автор</h1>
      <AuthorForm rubrics={rubrics} action={createAuthorAction} />
    </div>
  );
}
