import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import CoinGuideLayout from '@/components/ui/CoinGuideLayout';
import { COIN_GUIDES } from '@/lib/coinGuides';
import { ORGANIZATION_ID } from '@/lib/organizationSchema';

import { ASSET_REVISIONS } from '@/lib/pageRevisions';
type Props = { params: Promise<{ locale: string }> };
const SLUG = 'quant';
const guide = COIN_GUIDES[SLUG];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Quant (QNT): цена, история, калькулятор' : 'Quant (QNT): price, history, calculator';
  const description = isRu
    ? 'Как Quant построил Overledger, чтобы связать блокчейны друг с другом и с банковскими системами, и почему QNT всего 14,6 миллиона. История и калькулятор.'
    : 'How Quant built Overledger to connect blockchains with each other and with bank systems, and why QNT has a supply of only 14.6 million. History and a calculator.';

  return {
    // Absolute: the layout template appends the site name, which adds nothing here.
    title: { absolute: title },
    description,
    keywords: isRu
      ? ['quant история', 'qnt токен', 'quant калькулятор', 'quant цена', 'курс qnt']
      : ['quant history', 'qnt token', 'quant investment calculator', 'quant price', 'qnt price'],
    openGraph: buildOg({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/assets/${SLUG}`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/assets/${SLUG}`,
      languages: { ru: `${BASE}/ru/assets/${SLUG}`, en: `${BASE}/en/assets/${SLUG}`, 'x-default': `${BASE}/en/assets/${SLUG}` },
    },
  };
}

export default async function QuantPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: isRu ? 'Quant (QNT): мост между блокчейнами и банками' : 'Quant (QNT): connecting blockchains to banks',
    description: isRu ? 'Как Quant построил Overledger, чтобы связать блокчейны друг с другом и с банковскими системами, и почему QNT всего 14,6 миллиона. История и калькулятор.' : 'How Quant built Overledger to connect blockchains with each other and with bank systems, and why QNT has a supply of only 14.6 million. History and a calculator.',
    inLanguage: locale,
    datePublished: '2026-11-02',
    dateModified: ASSET_REVISIONS[SLUG] ?? '2026-11-02',
    author: { '@id': ORGANIZATION_ID },
    publisher: { '@id': ORGANIZATION_ID },
    mainEntityOfPage: `${BASE}/${locale}/assets/${SLUG}`,
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map(item => ({ '@type': 'Question', name: item.question[isRu ? 'ru' : 'en'], acceptedAnswer: { '@type': 'Answer', text: item.answer[isRu ? 'ru' : 'en'] } })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Крипто-активы' : 'Crypto Assets', item: `${BASE}/${locale}/assets` },
      { '@type': 'ListItem', position: 3, name: 'Quant (QNT)', item: `${BASE}/${locale}/assets/${SLUG}` },
    ],
  };

  const historyContent = isRu ? (
    <>
      <h3>Всего 14,6 миллиона</h3>
      <p>
        Выпуск QNT ограничен 14 612 493 токенами — меньше, чем у большинства крупных монет. Для сравнения: биткоинов будет 21 миллион. На подъёме 2021 года QNT поставил исторический максимум, 427,42 доллара, 11 сентября.
      </p>

      <h3>Специалист по безопасности и его идея</h3>
      <p>
        Quant основал в Лондоне <strong>Гилберт Вердиан</strong>, специалист по кибербезопасности. Он исходил из того, что банки и государства будут пользоваться сразу несколькими блокчейнами, и им понадобится один слой, который умеет говорить со всеми.
      </p>

      <h3>2018: Overledger и продажа токенов</h3>
      <p>
        Деньги Quant собрал через <Link href={`/${locale}/glossary/ico`}>ICO</Link> в 2018 году и выпустил Overledger — программу, через которую приложение передаёт данные и ценности между разными <Link href={`/${locale}/glossary/blockchain`}>блокчейнами</Link> и обычными банковскими системами. QNT нужен для оплаты: компании, которые строят на Overledger, покупают лицензии за QNT.
      </p>

      <h3>Ставка на банки</h3>
      <p>
        Свои продукты Quant нацеливает на банки и платёжные компании, которые работают с токенизированными депозитами и цифровыми валютами. Покупая QNT, вы ставите на то, что именно они возьмут эту программу в работу.
      </p>
    </>
  ) : (
    <>
      <h3>A security official starts a company</h3>
      <p>
        <strong>Gilbert Verdian</strong>, a cybersecurity specialist, founded Quant in London. His idea was that banks and governments would use several blockchains at once and would need one layer to talk to all of them.
      </p>

      <h3>2018: Overledger and the token sale</h3>
      <p>
        Quant raised money through an <Link href={`/${locale}/glossary/ico`}>ICO</Link> in 2018 and released Overledger, software that lets an application send data and value across different <Link href={`/${locale}/glossary/blockchain`}>blockchains</Link> and existing bank systems. QNT pays for access: companies that build on Overledger buy licences in QNT.
      </p>

      <h3>14.6 million and no more</h3>
      <p>
        The supply of QNT is capped at 14,612,493 tokens, small next to most large coins. In the 2021 rally QNT reached its all-time high of 427.42 dollars on 11 September 2021.
      </p>

      <h3>A focus on finance</h3>
      <p>
        Quant aims its products at banks and payment firms that work on tokenised deposits and digital currencies. If you hold QNT, you are betting that banks and payment firms adopt that software.
      </p>
    </>
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <CoinGuideLayout
        locale={locale}
        slug={SLUG}
        name="Quant"
        symbol="QNT"
        icon="Ⓠ"
        coingeckoId="quant-network"
        tagline={isRu ? 'Программа, которая связывает блокчейны с банками' : 'Software that connects blockchains to bank systems'}
        historyTitle={isRu ? 'История Quant: Overledger и маленький выпуск' : 'Quant history: Overledger and a small supply'}
        historyContent={historyContent}
        guide={guide}
      />
    </>
  );
}
