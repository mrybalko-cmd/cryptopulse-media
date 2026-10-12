import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAiServiceById, fetchAdminAiJobs, fetchFacetChoices } from '@/lib/admin/aiData';
import AiServiceForm from '../AiServiceForm';
import { updateAiServiceAction, deleteAiServiceAction } from '../actions';

export default async function EditAiServicePage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdminPermission('ai');
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const service = await fetchAdminAiServiceById(id);
  if (!service) notFound();
  const [jobs, facetGroups] = await Promise.all([
    fetchAdminAiJobs(),
    fetchFacetChoices(service.jobId),
  ]);

  return (
    <div>
      <Link href="/admin/ai" className="text-[12px] text-[var(--admin-text-muted)]">← К списку</Link>
      <div className="flex items-center gap-3 mt-2 mb-1">
        <h1 className="text-[19px] font-bold">{service.name}</h1>
        {sp.saved && <span className="text-[11.5px] font-bold text-green-400">Сохранено</span>}
      </div>
      <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-5">
        <a href={`https://intokened.com/ru/ai/tools/${service.slug}`} target="_blank" rel="noopener"
          className="hover:text-cyan-400 underline decoration-dotted">
          Посмотреть на сайте ↗
        </a>
      </p>
      <AiServiceForm
        service={service}
        jobs={jobs}
        facetGroups={facetGroups}
        action={updateAiServiceAction.bind(null, id)}
        deleteAction={deleteAiServiceAction.bind(null, id)}
      />
    </div>
  );
}
