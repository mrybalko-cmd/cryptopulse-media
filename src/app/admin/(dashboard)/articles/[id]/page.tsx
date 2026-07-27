import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminArticleById, fetchAuthorOptions, fetchTranslationCandidates } from '@/lib/admin/data';
import { updateArticleAction, deleteArticleAction } from '../actions';
import ArticleForm from '../ArticleForm';
import DeleteButton from '../../_shared/DeleteButton';

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
        <div className="flex items-center gap-2">
          <a
            href={`/admin/preview/articles/${id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12.5px] font-bold text-[var(--admin-text-secondary)] border border-[var(--admin-border)] rounded-lg px-3.5 py-2 hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
          >
            👁 Предпросмотр
          </a>
          <DeleteButton action={boundDelete} confirmMessage={`Удалить статью «${article.title}» безвозвратно? Это действие нельзя отменить.`} />
        </div>
      </div>
      <ArticleForm article={article} authors={authors} translationCandidates={translationCandidates} action={boundAction} />
    </div>
  );
}
