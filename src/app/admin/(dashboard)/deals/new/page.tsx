import Link from 'next/link';
import { requireOwner } from '@/lib/admin/auth';
import DealForm from '../DealForm';
import { createDealAction } from '../actions';

export default async function NewDealPage() {
  await requireOwner();
  return (
    <div>
      <Link href="/admin/deals" className="text-[12px] text-[var(--admin-text-muted)]">← К списку</Link>
      <h1 className="text-[19px] font-bold mt-2 mb-5">Новая сделка</h1>
      <DealForm action={createDealAction} />
    </div>
  );
}
