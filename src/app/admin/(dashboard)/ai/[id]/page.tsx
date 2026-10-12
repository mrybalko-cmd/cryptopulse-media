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
  searchParams: Promise<{ saved?: string; dup?: string; clash?: string; with?: string }>;
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
      {sp.dup && (
        <p className="text-[12px] mb-4 px-3.5 py-2.5 rounded-lg border border-[#f2a93b]/35 bg-[#f2a93b]/10">
          Новую карточку не завёл: {sp.dup === 'site' ? 'такой сайт' : 'такой адрес'} уже
          есть у этой компании. Правьте её, а не создавайте вторую — две записи об
          одном сервисе потом придётся сводить руками.
        </p>
      )}
      {sp.clash && (
        <p className="text-[12px] mb-4 px-3.5 py-2.5 rounded-lg border border-red-400/35 bg-red-400/10">
          Не сохранил: {sp.clash === 'site' ? 'такой сайт' : 'такой адрес'} уже занят
          карточкой «{sp.with}». Поменяйте значение и сохраните ещё раз.
        </p>
      )}
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
