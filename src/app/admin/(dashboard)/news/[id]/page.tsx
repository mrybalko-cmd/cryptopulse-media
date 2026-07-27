import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminNewsById, fetchAuthorOptions, fetchTranslationCandidates } from '@/lib/admin/data';
import { updateNewsAction, deleteNewsAction } from '../actions';
import NewsForm from '../NewsForm';

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('news');
  const { id } = await params;
  const news = await fetchAdminNewsById(id);
  if (!news) notFound();

  const otherLanguage = news.language === 'ru' ? 'en' : 'ru';
  const [authors, translationCandidates] = await Promise.all([
    fetchAuthorOptions(),
    fetchTranslationCandidates('news', otherLanguage),
  ]);

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateNewsAction(id, news.body, formData);
  };
  const boundDelete = async () => {
    'use server';
    await deleteNewsAction(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">{news.title}</h1>
        <form action={boundDelete}>
          <button type="submit" className="text-[12px] font-semibold text-red-400 hover:text-red-300">Удалить</button>
        </form>
      </div>
      <NewsForm news={news} authors={authors} translationCandidates={translationCandidates} action={boundAction} />
    </div>
  );
}
