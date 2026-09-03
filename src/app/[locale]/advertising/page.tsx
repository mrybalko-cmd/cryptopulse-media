import { getTranslations, setRequestLocale} from 'next-intl/server';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import { ADVERTISING_EMAIL } from '@/lib/constants';
import { SITE_NAME, SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });
  const isRu = locale === 'ru';
  const description = isRu
    ? `О чём пишет ${SITE_NAME} и как разместить у нас свой бренд. Открыты к предложениям и долгому сотрудничеству.`
    : `What ${SITE_NAME} covers and how to place your brand with us. We are open to proposals and long-term partnerships.`;
  return {
    title: t('advertisingTitle'),
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/advertising`, title: t('advertisingTitle'), description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/advertising`, title: t('advertisingTitle'), description, locale }),
    alternates: {
      canonical: `${SITE_URL}/${locale}/advertising`,
      languages: { ru: `${SITE_URL}/ru/advertising`, en: `${SITE_URL}/en/advertising`, 'x-default': `${SITE_URL}/en/advertising` },
    },
  };
}

export default async function AdvertisingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const isRu = locale === 'ru';

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Реклама' : 'Advertising', item: `${BASE}/${locale}/advertising` },
    ],
  };

  const points = isRu
    ? [
        ['Держим руку на пульсе', 'Ежедневный разбор рынков — куда всё движется и чего ждать на этой неделе.'],
        ['Следим за деньгами и умами', 'Искусственный интеллект и Web3 — две главные силы сегодня. Мы показываем, как они пересекаются.'],
        ['Даём суть, а не заголовки', 'Детально разбираем устройство DeFi, алгоритмы и причины взломов для тех, кому важна механика.'],
        ['Работаем с фактами', 'Легализация и регулирование по всему миру — с именами и прямыми ссылками на официальные документы.'],
        ['Экосистема 360°', 'Новости соседствуют с нашими собственными инструментами: калькуляторами, индексами, картой регуляций и честными обзорами бирж.'],
      ]
    : [
        ['Markets, every day', 'What moved, and what to expect this week.'],
        ['Money and minds', 'AI and Web3 are the two forces that matter now. We show you where they meet.'],
        ['Mechanism over headline', 'How DeFi is built, how the algorithms work, why the hacks happened.'],
        ['Facts with names on them', 'Legalisation and regulation worldwide, each entry naming the regulator and linking the official document.'],
        ['The whole ecosystem', 'News sits beside tools we built ourselves: calculators, indices, a regulation map and exchange reviews we stand behind.'],
      ];

  return (
    <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Ореолы за текстом — тот же приём, что несут ExchangeTable и AuthorColumns.
          Без света позади страница читается плоской заливкой. */}
      <span aria-hidden className="pointer-events-none absolute -left-[12%] -top-[6%] h-[300px] w-[420px] rounded-full blur-[56px]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-violet), transparent 70%)' }} />
      <span aria-hidden className="pointer-events-none absolute -right-[16%] top-[2%] h-[320px] w-[460px] rounded-full blur-[56px]"
            style={{ background: 'radial-gradient(50% 50% at 50% 50%, var(--halo-cyan), transparent 70%)' }} />

      <div className="relative z-[2]">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-[-0.03em] mb-3">
          {t('advertisingTitle')}
        </h1>

        <p className="text-[17px] sm:text-[17.5px] leading-[1.55] text-muted max-w-[58ch] mb-7">
          {isRu
            ? 'Устали от информационного шума? Мы создали площадку, где крипта и ИИ становятся понятными, а каждое утверждение можно проверить, не уходя с сайта.'
            : 'Tired of the noise? We built a place where crypto and AI make sense, and where you can check any claim without leaving the page.'}
        </p>

        {/* Название и текст одной строкой: раздельными строками блок вытягивался
            вдвое, а двумя колонками раздувался русский — там заголовки длиннее. */}
        <div className="flex flex-col">
          {points.map(([label, text]) => (
            <p key={label} className="border-t border-border py-2.5 text-[14.5px] leading-[1.62] text-foreground/85 last:border-b">
              <b className="font-bold text-foreground tracking-[-0.01em]">{label}.</b> {text}
            </p>
          ))}
        </div>

        {/* Блок для рекламодателя отделён: выше всё написано читателю, здесь — ему */}
        <div className="mt-7 rounded-[14px] border border-[var(--glass-line)] bg-[var(--glass-clear)] px-6 py-5">
          <div className="text-[11.5px] font-extrabold uppercase tracking-[0.1em] text-accent mb-2.5">
            {isRu ? 'Почему брендам выгодно быть с нами' : 'Why brands work with us'}
          </div>
          <p className="text-[14.5px] leading-[1.7] text-foreground/85">
            {isRu
              ? 'Мы объединяем глубокую аналитику и полезные инструменты. Это формирует лояльное комьюнити, которое доверяет нашей экспертизе и регулярно возвращается на платформу. Это идеальная среда для продвижения вашего продукта думающей и технологичной аудитории.'
              : 'We put deep analysis next to tools people use. Readers trust what we publish and come back for it. Your product reaches an audience that wants the mechanism before it decides.'}
          </p>
        </div>

        <div className="relative mt-6 overflow-hidden rounded-[16px] border border-accent/35 px-6 py-6 sm:px-7
                        bg-[linear-gradient(155deg,color-mix(in_srgb,var(--accent)_12%,transparent),transparent_62%)]">
          <span aria-hidden className="pointer-events-none absolute -right-[70px] -top-[70px] h-[230px] w-[230px] rounded-full blur-[34px]"
                style={{ background: 'radial-gradient(50% 50% at 50% 50%, color-mix(in srgb, var(--accent) 42%, transparent), transparent 70%)' }} />
          <div className="relative z-[2]">
            <span className="block text-[11px] font-extrabold uppercase tracking-[0.11em] text-accent mb-3">
              {isRu ? 'Напишите нам' : 'Write to us'}
            </span>
            <a
              href={`mailto:${ADVERTISING_EMAIL}`}
              className="inline-block text-[22px] sm:text-[26px] font-bold tracking-[-0.024em] leading-tight break-words
                         text-accent no-underline border-b-2 border-accent/35
                         transition-colors duration-200 hover:text-article-accent hover:border-article-accent/55"
            >
              {ADVERTISING_EMAIL}
            </a>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-muted max-w-[50ch]">
              {isRu
                ? 'Открыты к предложениям, в том числе к долгому сотрудничеству. Расскажите о бренде — придумаем, где ему место на сайте.'
                : 'We are open to proposals, including long-term partnerships. Tell us about your brand and we will work out where it belongs on the site.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
