import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAiJobById, fetchAdminAiJobs, fetchFacetUsage, fetchFacetUsageInJob } from '@/lib/admin/aiData';
import AiJobForm from '../AiJobForm';
import { updateAiJobAction, deleteAiJobAction } from '../../actions';
import { collectTakenKeys } from '../takenKeys';

export default async function EditAiJobPage({
  params, searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; used?: string }>;
}) {
  await requireAdminPermission('ai');
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [job, jobs] = await Promise.all([fetchAdminAiJobById(id), fetchAdminAiJobs()]);
  if (!job) notFound();
  const [usage, usageInJob] = await Promise.all([fetchFacetUsage(), fetchFacetUsageInJob(job.slug)]);

  return (
    <div>
      <Link href="/admin/ai/filters" className="text-[12px] text-[var(--admin-text-muted)]">← К списку</Link>
      <div className="flex items-center gap-3 mt-2 mb-5">
        <h1 className="text-[19px] font-bold">{job.nameRu || job.slug}</h1>
        {sp.saved && <span className="text-[11.5px] font-bold text-green-400">Сохранено</span>}
      </div>

      {sp.used && (
        <p className="text-[12px] mb-5 px-3.5 py-2.5 rounded-lg border border-[#f2a93b]/35 bg-[#f2a93b]/10">
          Задачу не удалил: на ней {sp.used} карточек. Переложите их на другую
          задачу — тогда удаление пройдёт.
        </p>
      )}

      <AiJobForm
        job={job}
        takenKeys={collectTakenKeys(jobs, id)}
        usage={usage}
        usageInJob={usageInJob}
        usedBy={job.serviceCount}
        action={updateAiJobAction.bind(null, id)}
        deleteAction={deleteAiJobAction.bind(null, id)}
      />
    </div>
  );
}
