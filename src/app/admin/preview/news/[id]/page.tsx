import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Zap, User, Calendar } from 'lucide-react';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminNewsById, fetchAuthorOptions } from '@/lib/admin/data';
import { sanityImageTransform } from '@/lib/sanityImage';
import RichText from '@/components/ui/RichText';
import ArticleBadge from '@/components/ui/ArticleBadge';

export default async function PreviewNewsPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('news');
  const { id } = await params;
  const [news, authors] = await Promise.all([fetchAdminNewsById(id), fetchAuthorOptions()]);
  if (!news) notFound();

  const author = authors.find(a => a._id === news.authorId);
  const date = news.publishedAt
    ? new Date(news.publishedAt).toLocaleDateString(news.language === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-5 px-3 py-2 rounded-lg bg-accent/10 border border-accent/30 text-accent text-xs font-bold">
          👁 Предпросмотр — так материал будет выглядеть на сайте. Эта страница не индексируется и недоступна без входа в админку.
        </div>

        {news.coverImage && (
          <div className="relative w-full h-56 sm:h-72 rounded-xl overflow-hidden mb-6 bg-card">
            <Image src={sanityImageTransform(news.coverImage, { width: 1200 })!} alt={news.coverImageAlt || news.title} fill className="object-cover" unoptimized />
          </div>
        )}

        {news.badge && news.badge !== 'none' && (
          <div className="mb-3"><ArticleBadge badge={news.badge} locale={news.language} /></div>
        )}
        {news.breaking && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold mb-4">
            <Zap size={12} fill="currentColor" />
            {news.language === 'ru' ? 'Молния' : 'Breaking News'}
          </div>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">{news.title}</h1>

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
        </div>

        {news.excerpt && <p className="text-muted text-[15px] leading-relaxed mb-6 italic">{news.excerpt}</p>}

        {news.body?.length > 0 ? (
          <RichText value={news.body} fallbackAlt={news.title} locale={news.language} />
        ) : (
          <p className="text-muted text-sm">Текст ещё не написан.</p>
        )}
      </div>
    </div>
  );
}
