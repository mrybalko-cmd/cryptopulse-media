import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { sanityImageTransform } from '@/lib/sanityImage';
import { fetchExchangeBySlug, fetchExchangeMentions } from '@/lib/sanity';
import { SITE_BRAND } from '@/lib/site';

type Props = { params: Promise<{ locale: string; slug: string }> };

const ARCHIVE_LIMIT = 60;

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const exchange = await fetchExchangeBySlug(slug, locale);
  if (!exchange) return {};

  const title = isRu ? `Новости ${exchange.name}` : `${exchange.name} News`;
  const description = isRu
    ? `Все статьи и новости ${SITE_BRAND}, упоминающие ${exchange.name}.`
    : `All ${SITE_BRAND} articles and news mentioning ${exchange.name}.`;

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/exchanges/${slug}/news`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/exchanges/${slug}/news`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/exchanges/${slug}/news`,
      languages: { ru: `${BASE}/ru/exchanges/${exchange.slugRu}/news`, en: `${BASE}/en/exchanges/${exchange.slugEn}/news`, 'x-default': `${BASE}/en/exchanges/${exchange.slugEn}/news` },
    },
  };
}

export default async function ExchangeNewsArchivePage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const exchange = await fetchExchangeBySlug(slug, locale);
  if (!exchange) notFound();

  const mentions = await fetchExchangeMentions(exchange.slugRu, exchange.slugEn, exchange.website, locale, ARCHIVE_LIMIT);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Криптобиржи' : 'Crypto Exchanges', item: `${BASE}/${locale}/exchanges` },
      { '@type': 'ListItem', position: 3, name: exchange.name, item: `${BASE}/${locale}/exchanges/${slug}` },
      { '@type': 'ListItem', position: 4, name: isRu ? 'Новости' : 'News', item: `${BASE}/${locale}/exchanges/${slug}/news` },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8 flex-wrap">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
        <span>›</span>
        <Link href={`/${locale}/exchanges`} className="hover:text-accent transition-colors">{isRu ? 'Криптобиржи' : 'Crypto Exchanges'}</Link>
        <span>›</span>
        <Link href={`/${locale}/exchanges/${slug}`} className="hover:text-accent transition-colors">{exchange.name}</Link>
        <span>›</span>
        <span className="text-foreground">{isRu ? 'Новости' : 'News'}</span>
      </nav>

      <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight mb-8">
        {isRu ? `Новости ${exchange.name}` : `${exchange.name} News`}
      </h1>

      {mentions.length === 0 ? (
        <p className="text-sm text-muted">{isRu ? 'Пока нет материалов, ссылающихся на эту биржу.' : 'No coverage linking to this exchange yet.'}</p>
      ) : (
        <>
        <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
          {isRu ? 'Все материалы' : 'All coverage'}
        </h2>
        <div className="flex flex-col gap-3">
          {mentions.map((m, i) => (
            <Link
              key={i}
              href={`/${locale}/${m._type === 'news' ? 'news' : 'articles'}/${m.slug}`}
              className="flex gap-4 border border-border rounded-xl p-4 bg-card hover:border-accent/50 transition-colors"
            >
              <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-background">
                {m.coverImage && (
                  <Image src={sanityImageTransform(m.coverImage, { width: 160 })!} alt={m.title} width={80} height={80} className="w-full h-full object-cover" unoptimized />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-extrabold text-accent uppercase tracking-wide">
                  {m._type === 'news' ? (isRu ? 'Новость' : 'News') : (isRu ? 'Статья' : 'Article')}
                </span>
                <h3 className="text-sm font-bold text-foreground leading-snug mt-0.5">{m.title}</h3>
                <p className="text-xs text-muted mt-1.5">{formatDate(m.publishedAt, locale)}</p>
              </div>
            </Link>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
