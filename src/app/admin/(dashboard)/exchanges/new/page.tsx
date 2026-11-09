import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminBanners } from '@/lib/admin/data';
import { createExchangeAction } from '../actions';
import ExchangeForm from '../ExchangeForm';

export default async function NewExchangePage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  await requireAdminPermission('exchanges');
  const banners = (await fetchAdminBanners()).filter(b => b.placement !== 'inline').map(({ _id, title }) => ({ _id, title }));
  const kind = (await searchParams).kind === 'broker' ? 'broker' : 'exchange';

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">{kind === 'broker' ? 'Новый брокер' : 'Новая биржа'}</h1>
      <ExchangeForm action={createExchangeAction} kind={kind} banners={banners} />
    </div>
  );
}
