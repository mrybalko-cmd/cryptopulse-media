import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAuthorOptions, fetchTranslationCandidates } from '@/lib/admin/data';
import { fetchGlossaryOptions } from '@/lib/admin/glossary';
import { createNewsAction } from '../actions';
import NewsForm from '../NewsForm';

export default async function NewNewsPage() {
  await requireAdminPermission('news');
  const glossaryOptions = await fetchGlossaryOptions();
  const [authors, translationCandidates] = await Promise.all([
    fetchAuthorOptions(),
    fetchTranslationCandidates('news', 'en'),
  ]);

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новая новость</h1>
      <NewsForm authors={authors} translationCandidates={translationCandidates} action={createNewsAction} glossaryOptions={glossaryOptions} />
    </div>
  );
}
