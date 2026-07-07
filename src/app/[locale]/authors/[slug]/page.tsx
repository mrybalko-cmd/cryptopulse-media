export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { buildOg, BASE } from '@/lib/metadata';
import Link from 'next/link';
import Image from 'next/image';
import { fetchAuthorBySlug, fetchAuthorContent } from '@/lib/sanity';
import { ArrowLeft, Calendar, Eye, ExternalLink, Mail } from 'lucide-react';
import ArticleCard from '@/components/ui/ArticleCard';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const author = await fetchAuthorBySlug(slug);
  if (!author) return {};
  const isRu = locale === 'ru';
  const role = (isRu ? author.roleRu : author.roleEn) || '';
  const title = `${author.name}${role ? ` — ${role}` : ''} | CryptoPulse.media`;
  const bio = isRu ? author.bioRu : author.bioEn;
  const description = bio
    ? bio.slice(0, 155)
    : isRu
    ? `Материалы автора ${author.name} на CryptoPulse.media`
    : `Articles by ${author.name} on CryptoPulse.media`;
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/authors/${slug}`, title, description, locale, image: author.photo }),
    alternates: {
      canonical: `${BASE}/${locale}/authors/${slug}`,
      languages: { ru: `${BASE}/ru/authors/${slug}`, en: `${BASE}/en/authors/${slug}` },
    },
  };
}

export default async function AuthorPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const [author, { articles, news }] = await Promise.all([
    fetchAuthorBySlug(slug),
    fetchAuthorContent(slug, locale),
  ]);

  if (!author) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    ...(author.photo && { image: author.photo }),
    ...(author.roleEn && { jobTitle: isRu ? author.roleRu : author.roleEn }),
    worksFor: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    url: `${BASE}/${locale}/authors/${slug}`,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link
        href={`/${locale}/authors`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        {isRu ? 'Все авторы' : 'All authors'}
      </Link>

      {/* Author profile */}
      <div className="flex flex-col sm:flex-row gap-6 bg-card border border-border rounded-2xl p-6 sm:p-8 mb-10">
        {author.photo ? (
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-2 border-border self-center sm:self-start">
            <Image src={author.photo} alt={author.name} fill className="object-cover" sizes="128px" />
          </div>
        ) : (
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shrink-0 bg-accent/10 border-2 border-border flex items-center justify-center self-center sm:self-start">
            <span className="text-4xl font-bold text-accent">{author.name.charAt(0)}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">
            {isRu ? 'Автор' : 'Author'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{author.name}</h1>
          {(isRu ? author.roleRu : author.roleEn) && (
            <p className="text-sm text-accent mb-3">{isRu ? author.roleRu : author.roleEn}</p>
          )}
          {(isRu ? author.bioRu : author.bioEn) && (
            <p className="text-sm text-muted leading-relaxed mb-4">{isRu ? author.bioRu : author.bioEn}</p>
          )}

          {(author.email || author.telegram || author.linkedin || author.facebook || author.twitter) && (
            <div className="flex items-center gap-2 flex-wrap">
              {author.email && (
                <a href={`mailto:${author.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-colors"
                  title={author.email}>
                  <Mail size={11} />
                </a>
              )}
              {author.telegram && (
                <a href={author.telegram} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-colors">
                  <ExternalLink size={11} /> Telegram
                </a>
              )}
              {author.linkedin && (
                <a href={author.linkedin} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-colors">
                  <ExternalLink size={11} /> LinkedIn
                </a>
              )}
              {author.facebook && (
                <a href={author.facebook} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-colors">
                  <ExternalLink size={11} /> Facebook
                </a>
              )}
              {author.twitter && (
                <a href={author.twitter} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-colors">
                  <ExternalLink size={11} /> X / Twitter
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-xs text-muted mb-10">
        <span className="flex items-center gap-1.5">
          <span className="font-bold text-foreground text-base">{articles.length + news.length}</span>
          {isRu ? 'материалов' : 'publications'}
        </span>
        {articles.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-foreground text-base">{articles.length}</span>
            {isRu ? 'статей' : 'articles'}
          </span>
        )}
        {news.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="font-bold text-foreground text-base">{news.length}</span>
            {isRu ? 'новостей' : 'news'}
          </span>
        )}
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-lg font-bold text-foreground mb-5">
            {isRu ? 'Статьи' : 'Articles'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article: any) => (
              <ArticleCard
                key={article._id}
                title={article.title}
                excerpt={article.excerpt}
                slug={article.slug.current}
                coverImage={article.coverImage}
                publishedAt={article.publishedAt}
                readingTime={article.readingTime}
                badge={article.badge}
                views={article.views}
                locale={locale}
              />
            ))}
          </div>
        </section>
      )}

      {/* News */}
      {news.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-foreground mb-5">
            {isRu ? 'Новости' : 'News'}
          </h2>
          <div className="flex flex-col divide-y divide-border">
            {news.map((item: any) => {
              const date = new Date(item.publishedAt);
              const dateStr = date.toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
                day: '2-digit', month: '2-digit', year: 'numeric',
              });
              return (
                <Link
                  key={item._id}
                  href={`/${locale}/news/${item.slug.current}`}
                  className="group flex items-center justify-between gap-4 py-3 hover:text-accent transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {item.coverImage && (
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                        <Image src={item.coverImage} alt={item.title} fill className="object-cover" sizes="48px" />
                      </div>
                    )}
                    <span className="text-sm text-foreground group-hover:text-accent transition-colors font-medium leading-snug line-clamp-2">
                      {item.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 text-xs text-muted">
                    {typeof item.views === 'number' && item.views > 0 && (
                      <span className="flex items-center gap-1">
                        <Eye size={11} /> {item.views}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {dateStr}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {articles.length === 0 && news.length === 0 && (
        <p className="text-muted text-sm">
          {isRu ? 'Материалы автора появятся скоро.' : 'Author publications coming soon.'}
        </p>
      )}
    </div>
  );
}
