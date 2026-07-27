import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminExchangeById } from '@/lib/admin/data';
import { updateExchangeAction, deleteExchangeAction } from '../actions';
import ExchangeForm from '../ExchangeForm';

export default async function EditExchangePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('exchanges');
  const { id } = await params;
  const exchange = await fetchAdminExchangeById(id);
  if (!exchange) notFound();

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateExchangeAction(id, exchange.descriptionRu, exchange.descriptionEn, exchange.products, formData);
  };
  const boundDelete = async () => {
    'use server';
    await deleteExchangeAction(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">{exchange.name}</h1>
        <form action={boundDelete}>
          <button type="submit" className="text-[12px] font-semibold text-red-400 hover:text-red-300">Удалить</button>
        </form>
      </div>
      <ExchangeForm exchange={exchange} action={boundAction} />
    </div>
  );
}
