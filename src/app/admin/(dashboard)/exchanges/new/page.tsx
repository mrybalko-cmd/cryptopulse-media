import { requireAdminPermission } from '@/lib/admin/auth';
import { createExchangeAction } from '../actions';
import ExchangeForm from '../ExchangeForm';

export default async function NewExchangePage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  await requireAdminPermission('exchanges');
  const kind = (await searchParams).kind === 'broker' ? 'broker' : 'exchange';

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">{kind === 'broker' ? 'Новый брокер' : 'Новая биржа'}</h1>
      <ExchangeForm action={createExchangeAction} kind={kind} />
    </div>
  );
}
