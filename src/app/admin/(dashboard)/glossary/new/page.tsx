import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchGlossaryOptions } from '@/lib/admin/glossary';
import GlossaryTermForm from '../GlossaryTermForm';
import { createGlossaryTermAction } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NewGlossaryTermPage() {
  await requireAdminPermission('glossary');
  const options = await fetchGlossaryOptions();
  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новый термин</h1>
      <GlossaryTermForm action={createGlossaryTermAction} options={options} />
    </div>
  );
}
