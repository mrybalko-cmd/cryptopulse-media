export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { fetchAIContent } from '@/lib/sanity';
import { buildOg, BASE } from '@/lib/metadata';
import AIPageBody, { AI_PAGE_FAQ } from '@/components/ui/AIPageBody';

export const AI_PAGE_SIZE = 20;

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu
    ? 'AI & Искусственный интеллект в крипто — CryptoPulse.media'
    : 'AI & Artificial Intelligence in Crypto — CryptoPulse.media';
  const description = isRu
    ? 'Новости и аналитика об искусственном интеллекте в мире криптовалют и блокчейна. ChatGPT, нейросети, AI-трейдинг, генеративные модели и их влияние на рынок.'
    : 'News and analysis on artificial intelligence in the crypto and blockchain world. ChatGPT, neural networks, AI trading, generative models and their market impact.';
  return {
    title,
    description,
    keywords: isRu
      ? ['AI криптовалюта', 'искусственный интеллект блокчейн', 'ChatGPT крипто', 'AI трейдинг', 'нейросети крипто']
      : ['AI crypto', 'artificial intelligence blockchain', 'ChatGPT crypto', 'AI trading', 'neural networks crypto'],
    openGraph: buildOg({ url: `${BASE}/${locale}/ai`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/ai`,
      languages: {
        ru: `${BASE}/ru/ai`,
        en: `${BASE}/en/ai`,
      },
    },
  };
}

export default async function AIPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const { items, total } = await fetchAIContent(locale, AI_PAGE_SIZE, 0);
  const pageUrl = `${BASE}/${locale}/ai`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: 'AI', item: pageUrl },
    ],
  };

  const collectionLd = items.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isRu ? 'AI & Искусственный интеллект в крипто' : 'AI & Artificial Intelligence in Crypto',
    description: isRu
      ? 'Новости и аналитика об искусственном интеллекте в мире криптовалют'
      : 'News and analysis on AI in the crypto world',
    url: pageUrl,
    inLanguage: locale,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE}/${locale}/${item._type === 'article' ? 'articles' : 'news'}/${item.slug.current}`,
        name: item.title,
      })),
    },
  } : null;

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: AI_PAGE_FAQ.map(f => ({
      '@type': 'Question',
      name: isRu ? f.question.ru : f.question.en,
      acceptedAnswer: { '@type': 'Answer', text: isRu ? f.answer.ru : f.answer.en },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      {collectionLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <AIPageBody locale={locale} items={items} total={total} page={1} pageSize={AI_PAGE_SIZE} />
    </>
  );
}
