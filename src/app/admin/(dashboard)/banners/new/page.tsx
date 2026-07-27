import { requireAdminPermission } from '@/lib/admin/auth';
import { createBannerAction } from '../actions';
import BannerForm from '../BannerForm';

export default async function NewBannerPage() {
  await requireAdminPermission('banners');
  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новый баннер</h1>
      <BannerForm action={createBannerAction} />
    </div>
  );
}
