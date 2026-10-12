import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireOwner } from '@/lib/admin/auth';
import { fetchDealById } from '@/lib/admin/deals';
import DealForm from '../DealForm';
import { updateDealAction, deleteDealAction } from '../actions';

export default async function EditDealPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireOwner();
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const deal = await fetchDealById(id);
  if (!deal) notFound();

  return (
    <div>
      <Link href="/admin/deals" className="text-[12px] text-[var(--admin-text-muted)]">← К списку</Link>
      <div className="flex items-center gap-3 mt-2 mb-5">
        <h1 className="text-[19px] font-bold">{deal.client}</h1>
        {sp.saved && <span className="text-[11.5px] font-bold text-green-400">Сохранено</span>}
      </div>
      <DealForm
        deal={deal}
        action={updateDealAction.bind(null, id)}
        deleteAction={deleteDealAction.bind(null, id)}
      />
    </div>
  );
}
