import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { sanityImageTransform } from '@/lib/sanityImage';
import { EXCHANGE_NEWS_PAGE_SIZE, exchangeNewsPageCount } from '@/lib/exchangeMentions';
import { fetchExchangeMentions, type ExchangeDetailRaw, type ExchangeMention } from '@/lib/sanity';
import { SITE_BRAND } from '@/lib/site';
import Pagination from './Pagination';

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function archivePath(locale: string, slug: string, page: number) {
  return `/${locale}/exchanges/${slug}/news${page > 1 ? `/page/${page}` : ''}`;
}

/**
 * Метаданные страницы архива. Материалов на двух языках бывает разное число, и
 * последней странице может быть не с кем образовать пару: hreflang на такой адрес
 * вёл бы в 404, поэтому парный адрес ставим, только если он существует.
 */
export async function exchangeNewsMetadata(exchange: ExchangeDetailRaw, locale: string, page: number): Promise<Metadata> {
  const isRu = locale === 'ru';
  const slug = isRu ? exchange.slugRu : exchange.slugEn;
  const otherLocale = isRu ? 'en' : 'ru';
  const otherSlug = isRu ? exchange.slugEn : exchange.slugRu;
  const other = await fetchExchangeMentions(exchange.name, exchange.slugRu, exchange.slugEn, exchange.website, otherLocale);
  const hasPair = page <= exchangeNewsPageCount(other.length);

  const pageSuffix = page > 1 ? (isRu ? ` — страница ${page}` : ` — page ${page}`) : '';
  const title = `${isRu ? `Новости ${exchange.name}` : `${exchange.name} News`}${pageSuffix}`;
  const description = `${isRu
    ? `Все статьи и новости ${SITE_BRAND}, упоминающие ${exchange.name}`
    : `All ${SITE_BRAND} articles and news mentioning ${exchange.name}`}${pageSuffix}.`;
  const url = `${BASE}${archivePath(locale, slug, page)}`;

  const languages: Record<string, string> = { [locale]: url };
  if (hasPair) languages[otherLocale] = `${BASE}${archivePath(otherLocale, otherSlug, page)}`;
  if (languages.en) languages['x-default'] = languages.en;

  return {
    title,
    description,
    openGraph: buildOg({ url, title, description, locale }),
    twitter: buildTwitter({ url, title, description, locale }),
    alternates: { canonical: url, languages },
  };
}

export default function ExchangeNewsArchive({
  exchange,
  slug,
  mentions,
  locale,
  page,
}: {
  exchange: ExchangeDetailRaw;
  slug: string;
  mentions: ExchangeMention[];
  locale: string;
  page: number;
}) {
  const isRu = locale === 'ru';
  const totalPages = exchangeNewsPageCount(mentions.length);
  const start = (page - 1) * EXCHANGE_NEWS_PAGE_SIZE;
  const visible = mentions.slice(start, start + EXCHANGE_NEWS_PAGE_SIZE);
  const basePath = archivePath(locale, slug, 1);

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Криптобиржи' : 'Crypto Exchanges', item: `${BASE}/${locale}/exchanges` },
      { '@type': 'ListItem', position: 3, name: exchange.name, item: `${BASE}/${locale}/exchanges/${slug}` },
      { '@type': 'ListItem', position: 4, name: isRu ? 'Новости' : 'News', item: `${BASE}${basePath}` },
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
        {page > 1 && <span className="text-muted font-bold"> · {isRu ? `страница ${page}` : `page ${page}`}</span>}
      </h1>

      {mentions.length === 0 ? (
        <p className="text-sm text-muted">{isRu ? 'Пока нет материалов, упоминающих эту биржу.' : 'No coverage mentioning this exchange yet.'}</p>
      ) : (
        <>
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
            {isRu ? 'Все материалы' : 'All coverage'}
          </h2>
          <div className="flex flex-col gap-3">
            {visible.map(m => (
              <Link
                key={`${m._type}-${m.slug}`}
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
          <Pagination basePath={basePath} currentPage={page} totalPages={totalPages} locale={locale} />
        </>
      )}
    </div>
  );
}
