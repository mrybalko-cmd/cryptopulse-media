import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { buildOg, BASE } from '@/lib/metadata';
import { AI_GLOSSARY } from '@/lib/aiGlossary';

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

  const title = isRu ? `${name} — что это такое в ИИ?` : `${name} — What Is It in AI?`;
  const description = definition.slice(0, 160);

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/ai/glossary/${slug}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/ai/glossary/${slug}`,
      languages: {
        ru: `${BASE}/ru/ai/glossary/${slug}`,
        en: `${BASE}/en/ai/glossary/${slug}`,
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

  const idx = AI_GLOSSARY.findIndex(t => t.slug === slug);
  const related = [
    ...AI_GLOSSARY.slice(Math.max(0, idx - 3), idx),
    ...AI_GLOSSARY.slice(idx + 1, idx + 4),
  ].slice(0, 6);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name,
    description: definition,
    url: `${BASE}/${locale}/ai/glossary/${slug}`,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: isRu ? 'Глоссарий ИИ CryptoPulse.media' : 'CryptoPulse.media AI Glossary',
      url: `${BASE}/${locale}/ai/glossary`,
    },
  };

  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? `${name}: что это такое в ИИ` : `${name}: What It Means in AI`,
    description: definition,
    inLanguage: locale,
    author: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
    publisher: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
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

      <div className="mb-10">
        <div className="inline-block text-xs font-bold uppercase tracking-widest text-accent mb-3">
          {isRu ? 'Термин' : 'Term'}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 leading-tight">{name}</h1>
        <div className="bg-card border border-border rounded-2xl p-6">
          <p className="text-foreground text-base leading-relaxed">{definition}</p>
        </div>
      </div>

      <Link
        href={`/${locale}/ai/glossary`}
        className="inline-flex items-center gap-1.5 text-sm text-accent hover:underline mb-10"
      >
        ← {isRu ? 'Все термины глоссария ИИ' : 'All AI glossary terms'}
      </Link>

      {related.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted mb-4">
            {isRu ? 'Смотрите также' : 'See also'}
          </h2>
          <div className="flex flex-col gap-2">
            {related.map(t => (
              <Link
                key={t.slug}
                href={`/${locale}/ai/glossary/${t.slug}`}
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
