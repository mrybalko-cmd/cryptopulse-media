import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminArticleById, fetchAuthorOptions, fetchTranslationCandidates } from '@/lib/admin/data';
import { updateArticleAction, deleteArticleAction } from '../actions';
import ArticleForm from '../ArticleForm';

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('articles');
  const { id } = await params;
  const article = await fetchAdminArticleById(id);
  if (!article) notFound();

  const otherLanguage = article.language === 'ru' ? 'en' : 'ru';
  const [authors, translationCandidates] = await Promise.all([
    fetchAuthorOptions(),
    fetchTranslationCandidates('article', otherLanguage),
  ]);

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateArticleAction(id, article.body, formData);
  };
  const boundDelete = async () => {
    'use server';
    await deleteArticleAction(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">{article.title}</h1>
        <form action={boundDelete}>
          <button type="submit" className="text-[12px] font-semibold text-red-400 hover:text-red-300">Удалить</button>
        </form>
      </div>
      <ArticleForm article={article} authors={authors} translationCandidates={translationCandidates} action={boundAction} />
    </div>
  );
}
