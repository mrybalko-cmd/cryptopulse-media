import { requireAdminPermission } from '@/lib/admin/auth';
import { createExchangeAction } from '../actions';
import ExchangeForm from '../ExchangeForm';

export default async function NewExchangePage() {
  await requireAdminPermission('exchanges');

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новая биржа</h1>
      <ExchangeForm action={createExchangeAction} />
    </div>
  );
}
