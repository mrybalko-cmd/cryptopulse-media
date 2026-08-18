import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminRegulationCountryById } from '@/lib/admin/data';
import { updateRegulationCountryAction, deleteRegulationCountryAction } from '../actions';
import RegulationCountryForm from '../RegulationCountryForm';
import DeleteButton from '../../_shared/DeleteButton';

export default async function EditRegulationCountryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('regulation');
  const { id } = await params;
  const country = await fetchAdminRegulationCountryById(id);
  if (!country) notFound();

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateRegulationCountryAction(id, formData);
  };
  const boundDelete = async () => {
    'use server';
    await deleteRegulationCountryAction(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">
          {country.nameRu} <span className="text-[var(--admin-text-dim)] font-mono text-[15px]">· {country.iso2}</span>
        </h1>
        <DeleteButton
          action={boundDelete}
          confirmMessage={`Убрать «${country.nameRu}» с карты регулирования? Страна исчезнет со страницы, это нельзя отменить.`}
        />
      </div>
      <RegulationCountryForm country={country} action={boundAction} />
    </div>
  );
}
