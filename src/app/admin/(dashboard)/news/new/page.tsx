import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAuthorOptions, fetchTranslationCandidates } from '@/lib/admin/data';
import { createNewsAction } from '../actions';
import NewsForm from '../NewsForm';

export default async function NewNewsPage() {
  await requireAdminPermission('news');
  const [authors, translationCandidates] = await Promise.all([
    fetchAuthorOptions(),
    fetchTranslationCandidates('news', 'en'),
  ]);

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новая новость</h1>
      <NewsForm authors={authors} translationCandidates={translationCandidates} action={createNewsAction} />
    </div>
  );
}
