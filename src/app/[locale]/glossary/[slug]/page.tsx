import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { GLOSSARY, GLOSSARY_BASELINE } from '@/lib/glossary';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';
import GlossaryTermBody from '@/components/ui/GlossaryTermBody';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return GLOSSARY.map(term => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const term = GLOSSARY.find(t => t.slug === slug);
  if (!term) return {};

  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const name = term.term[loc];
  const definition = term.definition[loc];

  const title = isRu
    ? `${name} — что это такое в крипто?`
    : `${name} — What Is It in Crypto?`;
  const description = definition.slice(0, 160);

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/glossary/${slug}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/glossary/${slug}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/glossary/${slug}`,
      languages: {
        ru: `${BASE}/ru/glossary/${slug}`,
        en: `${BASE}/en/glossary/${slug}`,
        'x-default': `${BASE}/en/glossary/${slug}`,
      },
    },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { locale, slug } = await params;
  const term = GLOSSARY.find(t => t.slug === slug);
  if (!term) notFound();

  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const name = term.term[loc];
  const definition = term.definition[loc];

  // The set's baseline is the honest floor for when this text first existed;
  // a term rewritten since then carries its own date.
  const published = GLOSSARY_BASELINE;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    // Same @id the listing uses for this term, so the two documents describe
    // one entity rather than two that happen to share a name.
    '@id': `${BASE}/${locale}/glossary/${slug}`,
    name,
    description: definition,
    url: `${BASE}/${locale}/glossary/${slug}`,
    inLanguage: locale,
    inDefinedTermSet: { '@id': `${BASE}/${locale}/glossary#dictionary` },
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? `${name}: что это такое в криптовалютах` : `${name}: What It Means in Crypto`,
    description: definition,
    inLanguage: locale,
    // Reference the sitewide publisher entity rather than restating it, so the
    // organization is described once and every page points at the same node.
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    ...(published ? { datePublished: published } : {}),
    ...(term.updated ? { dateModified: term.updated } : {}),
    mainEntityOfPage: `${BASE}/${locale}/glossary/${slug}`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Глоссарий' : 'Glossary', item: `${BASE}/${locale}/glossary` },
      { '@type': 'ListItem', position: 3, name, item: `${BASE}/${locale}/glossary/${slug}` },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">
          {isRu ? 'Главная' : 'Home'}
        </Link>
        <span>›</span>
        <Link href={`/${locale}/glossary`} className="hover:text-accent transition-colors">
          {isRu ? 'Глоссарий' : 'Glossary'}
        </Link>
        <span>›</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <GlossaryTermBody term={term} all={GLOSSARY} locale={locale} base="glossary" />
    </div>
  );
}
