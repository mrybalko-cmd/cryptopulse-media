import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import GlossaryFilter from '@/components/ui/GlossaryFilter';
import { AI_GLOSSARY } from '@/lib/aiGlossary';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Глоссарий ИИ — словарь терминов искусственного интеллекта' : 'AI Glossary — Artificial Intelligence Dictionary';
  const description = isRu
    ? `Понятные объяснения ${AI_GLOSSARY.length}+ ключевых терминов искусственного интеллекта: LLM, промпт-инжиниринг, RAG, галлюцинации и другие — простыми словами.`
    : `Clear explanations of ${AI_GLOSSARY.length}+ key artificial intelligence terms: LLM, prompt engineering, RAG, hallucinations, and more — in plain language.`;

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/ai/glossary`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/ai/glossary`,
      languages: { ru: `${BASE}/ru/ai/glossary`, en: `${BASE}/en/ai/glossary` },
    },
  };
}

export default async function AiGlossaryPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: isRu ? 'Глоссарий ИИ CryptoPulse.media' : 'CryptoPulse.media AI Glossary',
    url: `${BASE}/${locale}/ai/glossary`,
    hasDefinedTerm: AI_GLOSSARY.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term[loc],
      description: t.definition[loc],
      url: `${BASE}/${locale}/ai/glossary#${t.slug}`,
    })),
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'AI', item: `${BASE}/${locale}/ai` },
      { '@type': 'ListItem', position: 3, name: isRu ? 'Глоссарий ИИ' : 'AI Glossary', item: `${BASE}/${locale}/ai/glossary` },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        {isRu ? 'Глоссарий ИИ' : 'AI Glossary'}
      </h1>
      <p className="text-muted text-sm mb-8 leading-relaxed">
        {isRu
          ? `Собрали ${AI_GLOSSARY.length}+ ключевых терминов из мира искусственного интеллекта и объяснили их простыми словами — без жаргона, который понятен только специалистам. Кликните на термин, чтобы раскрыть определение, или воспользуйтесь поиском.`
          : `We've collected ${AI_GLOSSARY.length}+ key artificial intelligence terms and explained them in plain language — no jargon that only specialists would understand. Click a term to expand its definition, or use the search box.`}
      </p>

      <GlossaryFilter terms={AI_GLOSSARY} locale={loc} basePath="ai/glossary" />
    </div>
  );
}
