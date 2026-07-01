import type { Metadata } from 'next';
import { buildOg, BASE } from '@/lib/metadata';
import GlossaryFilter from '@/components/ui/GlossaryFilter';
import { GLOSSARY } from '@/lib/glossary';


type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu ? 'Глоссарий криптовалют — словарь терминов' : 'Crypto Glossary — Dictionary of Terms';
  const description = isRu
    ? `Понятные объяснения ${GLOSSARY.length}+ ключевых терминов криптовалют: блокчейн, биткоин, хеш, транзакция, кошелёк и другие — простыми словами.`
    : `Clear explanations of ${GLOSSARY.length}+ key cryptocurrency terms: blockchain, Bitcoin, hash, transaction, wallet, and more — in plain language.`;

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/glossary`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/glossary`,
      languages: { ru: `${BASE}/ru/glossary`, en: `${BASE}/en/glossary`, 'x-default': `${BASE}/en/glossary` },
    },
  };
}

export default async function GlossaryPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: isRu ? 'Глоссарий криптовалют CryptoPulse.media' : 'CryptoPulse.media Crypto Glossary',
    url: `${BASE}/${locale}/glossary`,
    hasDefinedTerm: GLOSSARY.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term[loc],
      description: t.definition[loc],
      url: `${BASE}/${locale}/glossary#${t.slug}`,
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        {isRu ? 'Глоссарий криптовалют' : 'Crypto Glossary'}
      </h1>
      <p className="text-muted text-sm mb-8 leading-relaxed">
        {isRu
          ? `Собрали ${GLOSSARY.length}+ ключевых терминов из мира криптовалют и блокчейна и объяснили их простыми словами — без жаргона, который понятен только профессионалам. Кликните на термин, чтобы раскрыть определение, или воспользуйтесь поиском.`
          : `We've collected ${GLOSSARY.length}+ key crypto and blockchain terms and explained them in plain language — no jargon that only professionals would understand. Click a term to expand its definition, or use the search box.`}
      </p>

      <GlossaryFilter terms={GLOSSARY} locale={loc} />
    </div>
  );
}
