import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildOg, buildTwitter, BASE, truncateTitle, truncateDesc } from '@/lib/metadata';
import { AI_GLOSSARY, AI_GLOSSARY_BASELINE } from '@/lib/aiGlossary';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';
import GlossaryTermBody from '@/components/ui/GlossaryTermBody';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return AI_GLOSSARY.map(term => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const term = AI_GLOSSARY.find(t => t.slug === slug);
  if (!term) return {};

  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const name = term.term[loc];
  const definition = term.definition[loc];

  // Same reasoning as the crypto glossary: term first, no brand suffix, clamped.
  const title = truncateTitle(
    isRu ? `${name} — что это такое в ИИ?` : `${name} — What Is It in AI?`,
    60,
    0
  );
  const description = truncateDesc(definition);

  return {
    title: { absolute: title },
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/ai/glossary/${slug}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/ai/glossary/${slug}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/ai/glossary/${slug}`,
      languages: {
        ru: `${BASE}/ru/ai/glossary/${slug}`,
        en: `${BASE}/en/ai/glossary/${slug}`,
        'x-default': `${BASE}/en/ai/glossary/${slug}`,
      },
    },
  };
}

export default async function AiGlossaryTermPage({ params }: Props) {
  const { locale, slug } = await params;
  const term = AI_GLOSSARY.find(t => t.slug === slug);
  if (!term) notFound();

  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const name = term.term[loc];
  const definition = term.definition[loc];


  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE}/${locale}/ai/glossary/${slug}`,
    name,
    description: definition,
    url: `${BASE}/${locale}/ai/glossary/${slug}`,
    inDefinedTermSet: { '@id': `${BASE}/${locale}/ai/glossary#dictionary` },
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? `${name}: что это такое в ИИ` : `${name}: What It Means in AI`,
    description: definition,
    inLanguage: locale,
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    datePublished: AI_GLOSSARY_BASELINE,
    ...(term.updated ? { dateModified: term.updated } : {}),
    mainEntityOfPage: `${BASE}/${locale}/ai/glossary/${slug}`,
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'AI', item: `${BASE}/${locale}/ai` },
      { '@type': 'ListItem', position: 3, name: isRu ? 'Глоссарий ИИ' : 'AI Glossary', item: `${BASE}/${locale}/ai/glossary` },
      { '@type': 'ListItem', position: 4, name, item: `${BASE}/${locale}/ai/glossary/${slug}` },
    ],
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">
          {isRu ? 'Главная' : 'Home'}
        </Link>
        <span>›</span>
        <Link href={`/${locale}/ai/glossary`} className="hover:text-accent transition-colors">
          {isRu ? 'Глоссарий ИИ' : 'AI Glossary'}
        </Link>
        <span>›</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <GlossaryTermBody term={term} all={AI_GLOSSARY} locale={locale} base="ai/glossary" />
    </div>
  );
}
