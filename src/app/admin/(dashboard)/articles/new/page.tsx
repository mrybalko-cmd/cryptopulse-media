import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAuthorOptions, fetchTranslationCandidates } from '@/lib/admin/data';
import { fetchGlossaryOptions } from '@/lib/admin/glossary';
import { createArticleAction } from '../actions';
import ArticleForm from '../ArticleForm';

export default async function NewArticlePage() {
  await requireAdminPermission('articles');
  const glossaryOptions = await fetchGlossaryOptions();
  const [authors, translationCandidates] = await Promise.all([
    fetchAuthorOptions(),
    fetchTranslationCandidates('article', 'en'),
  ]);

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новая статья</h1>
      <ArticleForm authors={authors} translationCandidates={translationCandidates} action={createArticleAction} glossaryOptions={glossaryOptions} />
    </div>
  );
}
