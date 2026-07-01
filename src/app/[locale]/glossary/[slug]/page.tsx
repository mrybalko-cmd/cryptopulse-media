import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildOg, BASE } from '@/lib/metadata';
import { GLOSSARY } from '@/lib/glossary';

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  return GLOSSARY.map(term => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const term = GLOSSARY.find(t => t.slug === slug);
  if (!term) return {};

  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const name = term.term[loc];
  const definition = term.definition[loc];

  const title = isRu
    ? `${name} — что это такое в крипто? | Глоссарий`
    : `${name} — What Is It in Crypto? | Glossary`;
  const description = definition.slice(0, 160);

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/glossary/${slug}`, title, description, locale }),
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

  // Adjacent terms for "See also"
  const idx = GLOSSARY.findIndex(t => t.slug === slug);
  const related = [
    ...GLOSSARY.slice(Math.max(0, idx - 3), idx),
    ...GLOSSARY.slice(idx + 1, idx + 4),
  ].slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name,
    description: definition,
    url: `${BASE}/${locale}/glossary/${slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: isRu ? 'Глоссарий криптовалют CryptoPulse.media' : 'CryptoPulse.media Crypto Glossary',
      url: `${BASE}/${locale}/glossary`,
    },
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? `${name}: что это такое в криптовалютах` : `${name}: What It Means in Crypto`,
    description: definition,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
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

      {/* Term */}
      <div className="mb-10">
        <div className="inline-block text-xs font-bold uppercase tracking-widest text-accent mb-3">
          {isRu ? 'Термин' : 'Term'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">{name}</h1>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-foreground text-base leading-relaxed">{definition}</p>
        </div>
      </div>

      {/* Back link */}
      <Link
        href={`/${locale}/glossary`}
        className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline mb-10"
      >
        ← {isRu ? 'Все термины глоссария' : 'All glossary terms'}
      </Link>

      {/* Related terms */}
      {related.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted mb-4">
            {isRu ? 'Смотрите также' : 'See also'}
          </h2>
          <div className="flex flex-col gap-2">
            {related.map(t => (
              <Link
                key={t.slug}
                href={`/${locale}/glossary/${t.slug}`}
                className="group flex items-start gap-3 bg-card border border-border rounded-xl px-4 py-3 hover:border-accent/40 transition-colors"
              >
                <span className="text-accent mt-0.5 shrink-0">→</span>
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                    {t.term[loc]}
                  </p>
                  <p className="text-xs text-muted mt-0.5 line-clamp-1">{t.definition[loc]}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
