import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminBannerById } from '@/lib/admin/data';
import { updateBannerAction, toggleBannerAction } from '../actions';
import PlacementBar from '../../_shared/PlacementBar';
import { PlacementNotice } from '../../_shared/PlacementToggle';
import { noticeText } from '../../_shared/PlacementStatus';
import { BANNER_ROTATION_LIMIT } from '@/lib/sanity';
import { pluralRu } from '../../_shared/pluralRu';
import BannerForm from '../BannerForm';

export default async function EditBannerPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ toggled?: string; name?: string; full?: string }>;
}) {
  await requireAdminPermission('banners');
  const { id } = await params;
  const banner = await fetchAdminBannerById(id);
  if (!banner) notFound();
  const sp = await searchParams;
  const notice = noticeText(sp, 'm');

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateBannerAction(id, formData);
  };

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-4">{banner.title}</h1>
      {sp.full === '1' && (
        <div role="alert" className="mb-4 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[12.5px]">
          В ротации этого места уже {BANNER_ROTATION_LIMIT} баннеров, поэтому этот сохранён остановленным. Остановите один из работающих и включите этот снова.
        </div>
      )}
      <PlacementNotice key={notice ?? ''} message={notice} />
      <PlacementBar
        doc={banner}
        gender="m"
        stats={`${pluralRu(banner.impressions, 'показ', 'показа', 'показов')} и ${pluralRu(banner.clicks, 'клик', 'клика', 'кликов')}`}
        action={toggleBannerAction}
        name={banner.title}
        back={`/admin/banners/${id}`}
      />
      {/* key: форма неуправляемая, и после «Остановить» галочка осталась бы
          в старом положении — следующее сохранение вернуло бы баннер в показ. */}
      <BannerForm key={String(banner.active)} banner={banner} action={boundAction} />
    </div>
  );
}
