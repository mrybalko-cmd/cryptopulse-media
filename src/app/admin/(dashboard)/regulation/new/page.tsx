import { requireAdminPermission } from '@/lib/admin/auth';
import { createRegulationCountryAction } from '../actions';
import RegulationCountryForm from '../RegulationCountryForm';

export default async function NewRegulationCountryPage() {
  await requireAdminPermission('regulation');
  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новая страна на карте</h1>
      <RegulationCountryForm action={createRegulationCountryAction} />
    </div>
  );
}
