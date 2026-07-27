import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminBannerById } from '@/lib/admin/data';
import { updateBannerAction } from '../actions';
import BannerForm from '../BannerForm';

export default async function EditBannerPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('banners');
  const { id } = await params;
  const banner = await fetchAdminBannerById(id);
  if (!banner) notFound();

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateBannerAction(id, formData);
  };

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">{banner.title}</h1>
      <BannerForm banner={banner} action={boundAction} />
    </div>
  );
}
