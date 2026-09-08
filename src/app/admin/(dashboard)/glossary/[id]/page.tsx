import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminGlossaryTerm, fetchGlossaryOptions, countGlossaryMentions } from '@/lib/admin/glossary';
import GlossaryTermForm from '../GlossaryTermForm';
import { updateGlossaryTermAction, deleteGlossaryTermAction } from '../actions';
import DeleteButton from '../../_shared/DeleteButton';

export const dynamic = 'force-dynamic';

export default async function EditGlossaryTermPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('glossary');
  const { id } = await params;
  const [term, options] = await Promise.all([fetchAdminGlossaryTerm(id), fetchGlossaryOptions()]);
  if (!term) notFound();
  const mentions = await countGlossaryMentions(term.kind, term.slug);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h1 className="text-[19px] font-bold">{term.term?.ru || 'Термин'}</h1>
        <DeleteButton
          action={deleteGlossaryTermAction.bind(null, id)}
          confirmMessage={`Удалить термин «${term.term?.ru || term.slug}»? Он пропадёт с сайта, а ссылки на него в материалах станут битыми.`}
        />
      </div>
      <GlossaryTermForm
        action={updateGlossaryTermAction.bind(null, id)}
        initial={term}
        options={options}
        mentions={mentions}
      />
    </div>
  );
}
