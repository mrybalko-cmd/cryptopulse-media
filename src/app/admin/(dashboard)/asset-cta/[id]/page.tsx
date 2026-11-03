import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAssetCtaById } from '@/lib/admin/data';
import { COIN_REGISTRY } from '@/lib/coinRegistry';
import { updateAssetCtaAction, deleteAssetCtaAction, toggleAssetCtaAction } from '../actions';
import PlacementBar from '../../_shared/PlacementBar';
import { PlacementNotice } from '../../_shared/PlacementToggle';
import { noticeText } from '../../_shared/PlacementStatus';
import { pluralRu } from '../../_shared/pluralRu';
import AssetCtaForm from '../AssetCtaForm';
import { DeleteSubmitButton } from '../../_shared/DeleteButton';

export default async function EditAssetCtaPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ taken?: string; toggled?: string; name?: string }>;
}) {
  await requireAdminPermission('banners');
  const { id } = await params;
  const sp = await searchParams;
  const cta = await fetchAdminAssetCtaById(id);
  if (!cta) notFound();
  const notice = noticeText(sp, 'f');

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateAssetCtaAction(id, formData);
  };

  const coin = COIN_REGISTRY[cta.coinSlug];
  const name = coin ? `${coin.name} · ${coin.symbol}` : cta.coinSlug;

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h1 className="text-[19px] font-bold">{name}</h1>
        <form action={deleteAssetCtaAction}>
          <input type="hidden" name="id" value={id} />
          <DeleteSubmitButton confirmMessage="Удалить кнопку у этой монеты? Карточка вернётся к обычному виду." />
        </form>
      </div>
      <PlacementNotice key={notice ?? ''} message={notice} />
      <PlacementBar
        doc={cta}
        gender="f"
        stats={pluralRu(cta.clicks + cta.sellClicks, 'клик', 'клика', 'кликов')}
        action={toggleAssetCtaAction}
        name={name}
        back={`/admin/asset-cta/${id}`}
      />
      {/* key: см. баннеры — иначе галочка «Показывать кнопку» отстаёт от статуса. */}
      <AssetCtaForm key={String(cta.active)} cta={cta} action={boundAction} taken={sp.taken} />
    </div>
  );
}
