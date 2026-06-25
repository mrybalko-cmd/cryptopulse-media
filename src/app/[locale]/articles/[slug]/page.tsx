import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Eye } from 'lucide-react';
import { fetchArticleBySlug, incrementViews } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function ArticlePage({ params }: Props) {
  const { locale, slug } = await params;
  const article = await fetchArticleBySlug(slug, locale);

  if (!article) notFound();

  await incrementViews(article._id);

  const date = new Date(article.publishedAt).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link
        href={`/${locale}/articles`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        {locale === 'ru' ? 'Все статьи' : 'All articles'}
      </Link>

      {/* Cover */}
      {article.coverImage && (
        <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden mb-8">
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" />
        </div>
      )}

      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
        {article.title}
      </h1>

      <div className="flex items-center justify-between gap-4 mb-8 pb-8 border-b border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <Calendar size={12} />
            <span>{date}</span>
          </div>
          {article.readingTime && (
            <div className="flex items-center gap-1.5 text-xs text-muted">
              <Clock size={12} />
              <span>{article.readingTime} {locale === 'ru' ? 'мин чтения' : 'min read'}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Eye size={12} />
          <span>{article.views || 0}</span>
        </div>
      </div>

      {/* Body */}
      {article.body ? (
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted prose-p:leading-relaxed
          prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
          prose-strong:text-foreground
          prose-blockquote:border-accent prose-blockquote:text-muted
          prose-code:text-accent prose-code:bg-card prose-code:px-1 prose-code:rounded
        ">
          <PortableText
            value={article.body}
            components={{
              marks: {
                link: ({ value, children }) => (
                  <a
                    href={value?.href}
                    target={value?.href?.startsWith('http') ? '_blank' : undefined}
                    rel={value?.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    style={{ color: '#06b6d4', textDecoration: 'underline', textDecorationColor: '#06b6d4' }}
                  >
                    {children}
                  </a>
                ),
              },
            }}
          />
        </div>
      ) : (
        <p className="text-muted">{article.excerpt}</p>
      )}
    </div>
  );
}
