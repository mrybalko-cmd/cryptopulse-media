import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAiJobs, fetchFacetChoices } from '@/lib/admin/aiData';
import AiServiceForm from '../AiServiceForm';
import { createAiServiceAction } from '../actions';

export default async function NewAiServicePage() {
  await requireAdminPermission('ai');
  const jobs = await fetchAdminAiJobs();
  const facetGroups = await fetchFacetChoices(jobs[0]?._id ?? null);

  return (
    <div>
      <Link href="/admin/ai" className="text-[12px] text-[var(--admin-text-muted)]">← К списку</Link>
      <h1 className="text-[19px] font-bold mt-2 mb-5">Новый сервис</h1>
      <AiServiceForm jobs={jobs} facetGroups={facetGroups} action={createAiServiceAction} />
    </div>
  );
}
