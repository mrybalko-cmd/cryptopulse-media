// Час здесь — потолок, а не реальное окно: под маршрутом лежит выборка
// котировок CoinGecko со своим кэшем на 900 секунд, и пересборка идёт по
// меньшему из двух. В сборке маршрут так и отмечен — 15m. Поднимать свежесть
// имеет смысл только сдвигая оба слоя сразу; замер Forbes меняется раз в год,
// а счётчик считается в браузере и от пересборки не зависит вовсе.
export const revalidate = 3600;

import type { Metadata } from 'next';
import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import PopularSidebar from '@/components/ui/PopularSidebar';
import PopularList from '@/components/ui/PopularList';
import SidebarBanner from '@/components/ui/SidebarBanner';
import WealthBoard from '@/components/ui/wealth/WealthBoard';
import { fetchPopularContent, fetchActiveBanners } from '@/lib/sanity';
import { fetchWealthCrypto } from '@/lib/wealthCrypto';
import { NET_WORTH_AS_OF, PREVIOUS_AS_OF } from '@/lib/billionaires';
import { SITE_NAME } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

const FAQ_RU = [
  {
    q: 'Откуда берутся цифры состояния?',
    a: 'Список Forbes 400, котировки на 4 сентября 2026 года. Вторая точка — список за предыдущий год. Один источник, два датированных замера: без этого скорость не посчитать.',
  },
  {
    q: 'Счётчик показывает реальные деньги прямо сейчас?',
    a: 'Нет, и ни один другой счётчик тоже. Он показывает сентябрьский замер плюс среднюю скорость прошедшего года. Настоящая цифра идёт за биржей и в любой день может оказаться сильно выше или ниже этой линии.',
  },
  {
    q: 'Почему в расчёте есть норма сбережений?',
    a: 'Зарплата целиком в накопления не уходит. Поставьте ту долю, которую откладываете, и число начнёт описывать вашу жизнь, а не результат деления.',
  },
  {
    q: 'Учитываются ли налоги и инфляция?',
    a: 'Нет, как и доход с самих накоплений. Число меряет размер разрыва и на этом останавливается.',
  },
  {
    q: 'Зачем переводить состояние в биткоины?',
    a: 'Монет когда-либо будет 21 миллион. Доля от этого количества ставит состояние на шкалу, которая заканчивается. У доллара такого потолка нет.',
  },
];

const FAQ_EN = [
  {
    q: 'Where do the wealth figures come from?',
    a: 'The Forbes 400, share prices as of 4 September 2026, with the previous year’s list as the second point. One source, two dated snapshots, which is what makes a speed possible.',
  },
  {
    q: 'Does the counter show real money right now?',
    a: 'No, and neither does any other. It shows the September snapshot plus the average speed of the past year. The real figure follows the stock market and can sit far above or below that line on any given day.',
  },
  {
    q: 'Why does the calculation ask for a savings rate?',
    a: 'Your whole salary does not go into savings. Set the share you put away and the result starts describing your life instead of a division sum.',
  },
  {
    q: 'Are taxes and inflation included?',
    a: 'No, and neither are returns on what you save. The number measures the size of the gap and stops there.',
  },
  {
    q: 'Why convert the fortune into bitcoin?',
    a: 'Twenty-one million coins will ever exist. A share of that supply puts the fortune on a scale that runs out. Dollars have no such ceiling.',
  },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Счётчик состояния миллиардеров: сколько копить вам'
    : 'Billionaire wealth counter: how long you would save';
  const description = isRu
    ? 'Живой счётчик состояний пятёрки богатейших людей по Forbes: сколько это в биткоинах, что можно купить целиком и сколько лет копить лично вам при вашем доходе и норме сбережений.'
    : 'A live counter for the five largest fortunes on the Forbes 400: what they are worth in bitcoin, what they could buy outright, and how many years you would save at your own income and savings rate.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/calculators/wealth`, title, description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/calculators/wealth`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/calculators/wealth`,
      languages: {
        ru: `${BASE}/ru/calculators/wealth`,
        en: `${BASE}/en/calculators/wealth`,
        'x-default': `${BASE}/en/calculators/wealth`,
      },
    },
  };
}

export default async function WealthComparisonPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const faq = isRu ? FAQ_RU : FAQ_EN;

  const [crypto, mobilePopular, mobileBanners] = await Promise.all([
    fetchWealthCrypto(),
    fetchPopularContent(locale, 5),
    fetchActiveBanners(locale),
  ]);

  const url = `${BASE}/${locale}/calculators/wealth`;
  const appLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: isRu ? 'Счётчик состояния миллиардеров' : 'Billionaire wealth counter',
    url,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    browserRequirements: isRu ? 'Требуется JavaScript' : 'Requires JavaScript',
    inLanguage: isRu ? 'ru' : 'en',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: BASE },
    description: isRu
      ? 'Живой счётчик состояний богатейших людей мира с переводом в биткоины и расчётом срока накопления по вашему доходу.'
      : 'A live counter for the world’s largest fortunes, converted into bitcoin, with the saving horizon calculated from your own income.',
  };
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Калькуляторы и метрики' : 'Calculators & Metrics', item: `${BASE}/${locale}/calculators` },
      { '@type': 'ListItem', position: 3, name: isRu ? 'Состояние миллиардеров' : 'Billionaire wealth', item: url },
    ],
  };

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 sm:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_256px] lg:gap-8">
        <div className="min-w-0">
          <nav aria-label={isRu ? 'Хлебные крошки' : 'Breadcrumb'} className="mb-3 text-[12px] text-muted">
            <Link href={`/${locale}`} className="hover:text-foreground">{isRu ? 'Главная' : 'Home'}</Link>
            <span className="mx-1.5">›</span>
            <Link href={`/${locale}/calculators`} className="hover:text-foreground">
              {isRu ? 'Калькуляторы' : 'Calculators'}
            </Link>
            <span className="mx-1.5">›</span>
            <span className="text-foreground">{isRu ? 'Состояние миллиардеров' : 'Billionaire wealth'}</span>
          </nav>

          <h1 className="mb-4 text-[24px] font-extrabold tracking-[-0.025em] text-foreground sm:text-[30px]">
            {isRu
              ? 'Состояние миллиардеров: живой счётчик и сколько копить вам'
              : 'Billionaire wealth: a live counter, and how long you would save'}
          </h1>

          <WealthBoard locale={locale} crypto={crypto} />

          <div className="mt-10 max-w-[68ch]">
            <h2 className="text-[18px] font-extrabold text-foreground sm:text-[19px]">
              {isRu ? 'Из чего состоит состояние миллиардера' : 'What a billionaire’s fortune is made of'}
            </h2>
            {isRu ? (
              <>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  Денег на счету у первой пятёрки почти нет. Маск держит акции Tesla и SpaceX, Безос — Amazon,
                  Пейдж и Брин — Alphabet, Делл — свою Dell Technologies. Доля в компании переоценивается вместе
                  с котировкой, поэтому состояние прыгает на миллиарды за день, хотя человек ничего не продавал
                  и не покупал.
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  Forbes и{' '}
                  <a href="https://www.bloomberg.com/billionaires/" target="_blank" rel="noopener noreferrer nofollow"
                     className="text-accent hover:underline">Bloomberg</a>{' '}
                  считают непубличные активы по-разному, и разница между их оценками одного человека доходит
                  до десятков миллиардов. Мы берём Forbes и ставим рядом дату, на которую цифра снята.
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  Состав пятёрки тоже меняется: в сентябре 2026-го Ларри Эллисон ушёл со второго места на
                  седьмое, а в список поднялся Майкл Делл.
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  None of the top five keeps that money in an account. Musk holds Tesla and SpaceX stock,
                  Page and Brin hold Alphabet, Bezos holds Amazon. The market reprices a stake like that every
                  second it trades, so a fortune moves by billions in a day while its owner buys and sells nothing.
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  Forbes and{' '}
                  <a href="https://www.bloomberg.com/billionaires/" target="_blank" rel="noopener noreferrer nofollow"
                     className="text-accent hover:underline">Bloomberg</a>{' '}
                  value private holdings on different assumptions, and their two figures for one person can sit
                  tens of billions apart. We take Forbes and print the date the figure was locked in, so you can
                  check it against the list.
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  The five change places too. Larry Ellison fell from second to seventh in September 2026, and
                  Michael Dell came into the group.
                </p>
              </>
            )}

            <h2 className="mt-7 text-[18px] font-extrabold text-foreground sm:text-[19px]">
              {isRu ? 'Почему счётчик — приближение' : 'The counter is an estimate, and it says so under the number'}
            </h2>
            {isRu ? (
              <>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  Открытого потока данных о чьём-либо состоянии нет ни у Forbes, ни у Bloomberg. Живые счётчики,
                  включая наш, берут состояние на одну дату и то же состояние годом раньше, а потом делят
                  разницу на число секунд между замерами. На экране идёт скорость, занятая у прошедшего года.
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  Курс биткоина в блоке выше настоящий и обновляется несколько раз в сутки, поэтому число монет
                  уезжает само, пока вы читаете. Посмотреть его отдельно можно на{' '}
                  <Link href={`/${locale}/assets/bitcoin`} className="text-accent hover:underline">странице биткоина</Link>,
                  а что такое предельная эмиссия — в{' '}
                  <Link href={`/${locale}/glossary`} className="text-accent hover:underline">глоссарии</Link>.
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-[14px] leading-relaxed text-muted">
                  Neither Forbes nor Bloomberg publishes an open feed of anyone’s wealth. Live counters, this one
                  included, take a fortune on one date and the same fortune a year earlier, then divide the
                  difference by the seconds between them. What runs on your screen is a speed borrowed from the
                  past year.
                </p>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">
                  The bitcoin price above is real and refreshes several times a day, so the number of coins drifts
                  on its own while you read. You can watch it on its own{' '}
                  <Link href={`/${locale}/assets/bitcoin`} className="text-accent hover:underline">bitcoin page</Link>,
                  and the hard cap has an entry in the{' '}
                  <Link href={`/${locale}/glossary`} className="text-accent hover:underline">glossary</Link>.
                </p>
              </>
            )}

            <h2 className="mt-7 text-[18px] font-extrabold text-foreground sm:text-[19px]">
              {isRu ? 'Частые вопросы' : 'Frequently asked'}
            </h2>
            <div className="mt-2.5 overflow-hidden rounded-xl border border-border">
              {faq.map((f) => (
                <details key={f.q} className="group border-b border-border last:border-b-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[13.5px] font-bold text-foreground">
                    {f.q}
                    <span aria-hidden className="shrink-0 text-muted transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="px-4 pb-3.5 text-[13.5px] leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>

            <p className="mt-6 text-[12px] leading-relaxed text-muted">
              <b className="font-semibold text-foreground">{isRu ? 'Откуда числа.' : 'Where the numbers come from.'}</b>{' '}
              {isRu
                ? `Состояния — список Forbes 400, котировки на ${NET_WORTH_AS_OF.split('-').reverse().join('.')}; скорость выведена из сравнения со списком от ${PREVIOUS_AS_OF.split('-').reverse().join('.')}. Счётчик не получает данные в реальном времени. Курс биткоина живой, по данным CoinGecko. Расчёт лет не учитывает налоги, инфляцию и доход с накоплений.`
                : `Fortunes come from the Forbes 400, share prices as of ${NET_WORTH_AS_OF}; the speed comes from comparing that list with the one published ${PREVIOUS_AS_OF}. The counter receives no real-time data. The bitcoin price is live, via CoinGecko. The years calculation ignores taxes, inflation and returns on savings.`}
            </p>
          </div>

          {mobilePopular.length > 0 && (
            <div className="mt-8 flex flex-col gap-4 lg:hidden">
              <PopularList items={mobilePopular} locale={locale} asHeadings={false} />
              {mobileBanners.length > 0 && <SidebarBanner banners={mobileBanners} locale={locale} />}
            </div>
          )}
        </div>

        <PopularSidebar locale={locale} limit={5} />
      </div>
    </div>
  );
}
