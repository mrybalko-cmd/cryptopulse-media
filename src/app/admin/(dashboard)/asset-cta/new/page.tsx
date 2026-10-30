import { requireAdminPermission } from '@/lib/admin/auth';
import { createAssetCtaAction } from '../actions';
import AssetCtaForm from '../AssetCtaForm';

export default async function NewAssetCtaPage({
  searchParams,
}: {
  searchParams: Promise<{ taken?: string }>;
}) {
  await requireAdminPermission('banners');
  const sp = await searchParams;
  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новая кнопка на монете</h1>
      <AssetCtaForm action={createAssetCtaAction} taken={sp.taken} />
    </div>
  );
}
