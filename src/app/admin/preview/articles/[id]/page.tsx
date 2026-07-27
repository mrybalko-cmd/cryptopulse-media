import { notFound } from 'next/navigation';
import Image from 'next/image';
import { User, Calendar, Clock } from 'lucide-react';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminArticleById, fetchAuthorOptions } from '@/lib/admin/data';
import { sanityImageTransform } from '@/lib/sanityImage';
import RichText from '@/components/ui/RichText';
import ArticleBadge from '@/components/ui/ArticleBadge';

export default async function PreviewArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('articles');
  const { id } = await params;
  const [article, authors] = await Promise.all([fetchAdminArticleById(id), fetchAuthorOptions()]);
  if (!article) notFound();

  const author = authors.find(a => a._id === article.authorId);
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(article.language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-5 px-3 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-bold">
          👁 Предпросмотр — так материал будет выглядеть на сайте. Эта страница не индексируется и недоступна без входа в админку.
        </div>

        {article.coverImage && (
          <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-6 bg-card">
            <Image src={sanityImageTransform(article.coverImage, { width: 1200 })!} alt={article.coverImageAlt || article.title} fill className="object-cover" unoptimized />
          </div>
        )}

        {article.badge && article.badge !== 'none' && (
          <div className="mb-3"><ArticleBadge badge={article.badge} locale={article.language} /></div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">{article.title}</h1>

        <div className="flex items-center flex-wrap gap-3 mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <User size={12} />
            <span>{author?.name || 'CryptoPulse.media'}</span>
          </div>
          {date && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Calendar size={12} />
              <span>{date}</span>
            </div>
          )}
          {!date && (
            <span className="text-xs text-amber-500 font-semibold">Черновик — дата публикации ещё не назначена</span>
          )}
          {article.readingTime && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Clock size={12} />
              <span>{article.readingTime} {article.language === 'ru' ? 'мин чтения' : 'min read'}</span>
            </div>
          )}
        </div>

        {article.excerpt && <p className="text-muted text-[15px] leading-relaxed mb-6 italic">{article.excerpt}</p>}

        {article.body?.length > 0 ? (
          <RichText value={article.body} fallbackAlt={article.title} locale={article.language} />
        ) : (
          <p className="text-muted text-sm">Текст ещё не написан.</p>
        )}
      </div>
    </div>
  );
}
