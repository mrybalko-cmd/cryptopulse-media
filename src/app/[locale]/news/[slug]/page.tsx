import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import { fetchNewsBySlug } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';

type Props = { params: Promise<{ locale: string; slug: string }> };

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const news = await fetchNewsBySlug(slug, locale);

  if (!news) notFound();

  const date = new Date(news.publishedAt).toLocaleDateString(
    locale === 'ru' ? 'ru-RU' : 'en-US',
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <Link
        href={`/${locale}/news`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        {locale === 'ru' ? 'Все новости' : 'All news'}
      </Link>

      {/* Cover */}
      {news.coverImage && (
        <div className="relative h-64 sm:h-80 rounded-lg overflow-hidden mb-8">
          <Image src={news.coverImage} alt={news.title} fill className="object-cover" />
        </div>
      )}

      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
        {news.title}
      </h1>

      <div className="flex items-center gap-4 mb-8 pb-8 border-b border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Calendar size={12} />
          <span>{date}</span>
        </div>
        {news.sourceName && (
          <a
            href={news.sourceUrl || undefined}
            target={news.sourceUrl ? '_blank' : undefined}
            rel={news.sourceUrl ? 'noopener noreferrer' : undefined}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors"
          >
            <span>{locale === 'ru' ? 'Источник' : 'Source'}: {news.sourceName}</span>
            {news.sourceUrl && <ExternalLink size={12} />}
          </a>
        )}
      </div>

      {/* Body */}
      {news.body ? (
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted prose-p:leading-relaxed
          prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
          prose-strong:text-foreground
          prose-blockquote:border-accent prose-blockquote:text-muted
          prose-code:text-accent prose-code:bg-card prose-code:px-1 prose-code:rounded
        ">
          <PortableText
            value={news.body}
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
        <p className="text-muted">{news.excerpt}</p>
      )}
    </div>
  );
}
