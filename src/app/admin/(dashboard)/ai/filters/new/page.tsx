import Link from 'next/link';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminAiJobs } from '@/lib/admin/aiData';
import AiJobForm from '../AiJobForm';
import { createAiJobAction } from '../../actions';
import { collectTakenKeys } from '../takenKeys';

export default async function NewAiJobPage() {
  await requireAdminPermission('ai');
  const jobs = await fetchAdminAiJobs();
  return (
    <div>
      <Link href="/admin/ai/filters" className="text-[12px] text-[var(--admin-text-muted)]">← К списку</Link>
      <h1 className="text-[19px] font-bold mt-2 mb-5">Новая задача</h1>
      <AiJobForm takenKeys={collectTakenKeys(jobs)} action={createAiJobAction} />
    </div>
  );
}
