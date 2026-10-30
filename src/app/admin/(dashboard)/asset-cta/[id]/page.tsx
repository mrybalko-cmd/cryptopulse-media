import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAssetCtaById } from '@/lib/admin/data';
import { COIN_REGISTRY } from '@/lib/coinRegistry';
import { updateAssetCtaAction, deleteAssetCtaAction } from '../actions';
import AssetCtaForm from '../AssetCtaForm';
import { DeleteSubmitButton } from '../../_shared/DeleteButton';

export default async function EditAssetCtaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ taken?: string }>;
}) {
  await requireAdminPermission('banners');
  const { id } = await params;
  const sp = await searchParams;
  const cta = await fetchAdminAssetCtaById(id);
  if (!cta) notFound();

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateAssetCtaAction(id, formData);
  };

  const coin = COIN_REGISTRY[cta.coinSlug];

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-[19px] font-bold">
          {coin ? `${coin.name} · ${coin.symbol}` : cta.coinSlug}
        </h1>
        <form action={deleteAssetCtaAction}>
          <input type="hidden" name="id" value={id} />
          <DeleteSubmitButton confirmMessage="Удалить кнопку у этой монеты? Карточка вернётся к обычному виду." />
        </form>
      </div>
      <AssetCtaForm cta={cta} action={boundAction} taken={sp.taken} />
    </div>
  );
}
