import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { buildOg, buildTwitter, BASE, titleText } from '@/lib/metadata';
import {
  fetchBrokerBySlug,
  fetchBrokerSlugsForSitemap,
  fetchBrokers,
  fetchExchangeMentions,
  fetchExchangeReviews,
  fetchExchangeReviewSummary,
} from '@/lib/sanity';
import { rankBrokers, tier1Count } from '@/lib/brokerFields';
import { activeTradeUrl, venueButtonColor } from '@/lib/exchangePlacements';
import { formatTimestamp } from '@/lib/formatTimestamp';
import CollapsibleRichText from '@/components/ui/CollapsibleRichText';
import ExchangeReviewSection from '@/components/ui/ExchangeReviewSection';
import ExchangeNewsSection from '@/components/ui/ExchangeNewsSection';
import { ExchangeLogo, ProductChips, RowAction, VenueButton } from '@/components/ui/exchangePresentation';
import { AccessChip, brokerHref } from '@/components/ui/brokerPresentation';
import BrokerRisk, { brokerLossSentence } from '@/components/ui/BrokerRisk';
import PopularSidebar from '@/components/ui/PopularSidebar';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await fetchBrokerSlugsForSitemap();
  return slugs.flatMap(s => [
    { locale: 'en', slug: s.slugEn },
    { locale: 'ru', slug: s.slugRu },
  ]);
}

type Props = { params: Promise<{ locale: string; slug: string }> };

const MENTIONS_FETCH_LIMIT = 4;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const broker = await fetchBrokerBySlug(slug, locale);
  if (!broker) return {};

  const title = titleText(
    (isRu ? broker.seo?.metaTitleRu : broker.seo?.metaTitleEn)
      || (isRu ? `${broker.name}: лицензии, условия и криптовалюта` : `${broker.name}: licences, terms and crypto`)
  );
  const description = (isRu ? broker.seo?.metaDescriptionRu : broker.seo?.metaDescriptionEn)
    || (isRu ? broker.taglineRu : broker.taglineEn)
    || (isRu ? `${broker.name}: лицензии, что вы получаете по криптовалюте и условия счёта.` : `${broker.name}: licences, what you get on crypto and account terms.`);

  return {
    title,
    description,
    robots: broker.seo?.noIndex ? { index: false, follow: true } : undefined,
    openGraph: buildOg({ url: `${BASE}/${locale}/brokers/${slug}`, title, description, locale, image: broker.logo || undefined }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/brokers/${slug}`, title, description, locale, image: broker.logo || undefined }),
    alternates: {
      canonical: `${BASE}/${locale}/brokers/${slug}`,
      ...(!broker.seo?.noIndex && {
        languages: { ru: `${BASE}/ru/brokers/${broker.slugRu}`, en: `${BASE}/en/brokers/${broker.slugEn}`, 'x-default': `${BASE}/en/brokers/${broker.slugEn}` },
      }),
    },
  };
}

export default async function BrokerPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';

  const broker = await fetchBrokerBySlug(slug, locale);
  if (!broker) notFound();

  const [all, mentions, reviews, reviewSummary] = await Promise.all([
    fetchBrokers(),
    fetchExchangeMentions(broker.slugRu, broker.slugEn, broker.website, locale, MENTIONS_FETCH_LIMIT),
    fetchExchangeReviews(broker._id),
    fetchExchangeReviewSummary(broker._id),
  ]);
  const ranked = rankBrokers(all);
  const rank = ranked.find(b => b._id === broker._id)?.rank;
  const similar = ranked.filter(b => b._id !== broker._id).slice(0, 2);

  const name = broker.name;
  const description = isRu ? broker.descriptionRu : broker.descriptionEn;
  const regulators = broker.regulators ?? [];
  const regulatorNames = regulators.map(r => r.name.split(',')[0]);
  const openHref = activeTradeUrl(broker);
  const color = venueButtonColor(broker.buttonColor);
  const text = (ru?: string | null, en?: string | null) => (isRu ? ru : en) || null;

  const passport: [string, string | null, string?][] = [
    [isRu ? 'Регуляторы' : 'Regulators', regulatorNames.join(' · ') || null],
    [isRu ? 'Что получаете' : 'What you get', text(broker.accessRu, broker.accessEn)],
    [isRu ? 'Криптоинструменты' : 'Crypto instruments', text(broker.instrumentsRu, broker.instrumentsEn)],
    [isRu ? 'Проверено' : 'Checked', broker.verifiedAt ? (formatTimestamp(broker.verifiedAt)?.date ?? null) : null],
    [isRu ? 'Плечо, розница' : 'Retail leverage', text(broker.leverageRu, broker.leverageEn)],
    [isRu ? 'Спред BTC' : 'BTC spread', text(broker.spreadRu, broker.spreadEn)],
    [isRu ? 'Мин. депозит' : 'Min. deposit', broker.minDeposit || null],
    [isRu ? 'Теряют деньги' : 'Lose money', broker.lossPercent || null, text(broker.lossNoteRu, broker.lossNoteEn) ?? (isRu ? 'по данным брокера' : 'per the broker')],
    [isRu ? 'Платформы' : 'Platforms', text(broker.platformsRu, broker.platformsEn)],
    [isRu ? 'Пополнение' : 'Funding', text(broker.fundingRu, broker.fundingEn)],
    [isRu ? 'Комиссия за ночь' : 'Overnight fee', text(broker.overnightRu, broker.overnightEn)],
    [isRu ? 'Доступен' : 'Available in', text(broker.availableRu, broker.availableEn)],
  ];

  const navLinks = [
    { id: 'passport', label: isRu ? 'Паспорт' : 'Passport' },
    ...(description?.length ? [{ id: 'overview', label: isRu ? 'Обзор' : 'Overview' }] : []),
    { id: 'licences', label: isRu ? 'Лицензии' : 'Licences' },
    { id: 'news', label: isRu ? 'Материалы' : 'Coverage' },
    { id: 'reviews', label: isRu ? `Отзывы${reviews.length ? ` (${reviews.length})` : ''}` : `Reviews${reviews.length ? ` (${reviews.length})` : ''}` },
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name,
      url: broker.website,
      ...(broker.logo ? { logo: broker.logo } : {}),
      ...(broker.foundedYear ? { foundingDate: String(broker.foundedYear) } : {}),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
        { '@type': 'ListItem', position: 2, name: isRu ? 'Брокеры' : 'Brokers', item: `${BASE}/${locale}/brokers` },
        { '@type': 'ListItem', position: 3, name, item: `${BASE}/${locale}/brokers/${slug}` },
      ],
    },
  ];

  return (
    <div className="max-w-[1320px] mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div className="min-w-0">
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-5 flex-wrap">
            <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
            <span>›</span>
            <span>{isRu ? 'Где торговать' : 'Where to trade'}</span>
            <span>›</span>
            <Link href={`/${locale}/brokers`} className="hover:text-accent transition-colors">{isRu ? 'Брокеры' : 'Brokers'}</Link>
            <span>›</span>
            <span className="text-foreground">{name}</span>
          </nav>

          <header className="rounded-[20px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] shadow-[inset_0_1px_0_var(--glass-hi),var(--glass-shadow)] p-4 sm:p-5">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <ExchangeLogo exchange={broker} size={64} sizeMobile={52} className="!rounded-[16px]" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-[28px] font-extrabold text-foreground leading-tight -tracking-[0.03em]">{name}</h1>
                  <AccessChip broker={broker} isRu={isRu} />
                </div>
                <p className="text-[13px] text-muted mt-1">
                  {rank && (isRu ? `${rank}-й по регуляторам из ${ranked.length}` : `No. ${rank} of ${ranked.length} by regulators`)}
                  {broker.foundedYear ? ` · ${isRu ? 'с' : 'since'} ${broker.foundedYear}` : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-4">
              {openHref && (
                <VenueButton href={openHref} color={color}>{isRu ? 'Открыть счёт' : 'Open account'}</VenueButton>
              )}
              {broker.demoUrl && (
                <VenueButton href={broker.demoUrl} color={color}>{isRu ? 'Демо-счёт' : 'Demo account'}</VenueButton>
              )}
              <a
                href={broker.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-10 px-4 rounded-xl border border-[var(--glass-line)] bg-[var(--rates-inset)] text-[13.5px] font-extrabold text-foreground hover:bg-[var(--glass-hover)] transition-colors whitespace-nowrap"
              >
                {isRu ? 'Сайт брокера ↗' : 'Broker website ↗'}
              </a>
            </div>

            <BrokerRisk className="mt-3.5">
              <b>{brokerLossSentence(broker, isRu)}</b>{' '}
              {isRu
                ? 'Подумайте, понимаете ли вы, как работают CFD, и можете ли позволить себе высокий риск потерь.'
                : 'Consider whether you understand how CFDs work and can afford the high risk of losing your money.'}
            </BrokerRisk>
          </header>

          <nav
            aria-label={isRu ? 'Разделы страницы' : 'Page sections'}
            className="flex gap-1 border-b border-border mt-5 mb-6 sticky top-14 md:top-[6.25rem] bg-background z-10 overflow-x-auto scrollbar-none"
          >
            {navLinks.map(l => (
              <a key={l.id} href={`#${l.id}`} className="whitespace-nowrap shrink-0 px-3 py-3 text-sm font-semibold text-muted hover:text-foreground border-b-2 border-transparent hover:border-border transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-9">
            <section id="passport" className="scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? 'Паспорт брокера' : 'Broker passport'}</h2>
              <dl className="grid grid-cols-2 lg:grid-cols-4 rounded-2xl overflow-hidden border border-[color-mix(in_srgb,var(--passport-gold)_40%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--passport-gold)_10%,transparent),color-mix(in_srgb,var(--passport-gold)_3%,transparent))]">
                {passport.map(([label, value, note]) => (
                  <div key={label} className="min-w-0 px-3 py-2.5 border-r border-b border-[color-mix(in_srgb,var(--passport-gold)_16%,transparent)]">
                    <dt className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-[var(--passport-gold)] mb-0.5">{label}</dt>
                    {value ? (
                      <dd className="text-sm font-bold text-foreground leading-snug break-words">
                        {value}
                        {note && <span className="block text-[11px] font-normal text-muted mt-0.5">{note}</span>}
                      </dd>
                    ) : (
                      <dd className="text-xs text-muted leading-snug">{isRu ? 'нет подтверждённых данных' : 'no confirmed data'}</dd>
                    )}
                  </div>
                ))}
              </dl>
            </section>

            {description && description.length > 0 && (
              <section id="overview" className="scroll-mt-32">
                <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? 'Обзор' : 'Overview'}</h2>
                <CollapsibleRichText value={description} fallbackAlt={name} locale={locale} />
              </section>
            )}

            <section id="licences" className="scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">
                {isRu ? 'Лицензии' : 'Licences'}{' '}
                <span className="text-xs font-semibold text-muted tabular-nums">
                  {regulators.length}{tier1Count(broker) ? ` · ${isRu ? 'первого уровня' : 'tier 1'}: ${tier1Count(broker)}` : ''}
                </span>
              </h2>
              {regulators.length === 0 ? (
                <p className="text-sm text-muted">{isRu ? 'Нет подтверждённых данных.' : 'No confirmed data.'}</p>
              ) : (
                <ul className="flex flex-col gap-2 list-none">
                  {regulators.map((r, i) => (
                    <li key={i} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 rounded-xl border border-[var(--glass-line)] bg-[image:var(--glass-fill)] px-3.5 py-2.5 text-[13px] text-muted">
                      <span className="min-w-0 flex-1 basis-[240px]">
                        <b className="font-extrabold text-foreground">{r.name}</b>
                        {r.entity ? ` · ${r.entity}` : ''}
                        {r.licence ? ` · ${r.licence}` : ''}
                        {text(r.noteRu, r.noteEn) && <span className="block text-xs mt-0.5">{text(r.noteRu, r.noteEn)}</span>}
                      </span>
                      {r.url && (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs font-bold text-accent hover:underline">
                          {isRu ? 'Реестр ↗' : 'Register ↗'}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {mentions.length > 0 ? (
              <ExchangeNewsSection exchangeName={name} slug={slug} mentions={mentions} locale={locale} showArchiveLink={false} />
            ) : (
              <section id="news" className="scroll-mt-32">
                <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? 'Материалы о брокере' : 'Coverage of this broker'}</h2>
                <p className="text-sm text-muted rounded-xl border border-dashed border-[var(--glass-line)] px-3.5 py-3">
                  {isRu ? `О ${name} мы пока не писали. Материалы появятся здесь сами.` : `We have not covered ${name} yet. Coverage will appear here on its own.`}
                </p>
              </section>
            )}

            <section id="reviews" className="scroll-mt-32">
              <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? 'Отзывы читателей' : 'Reader reviews'}</h2>
              <ExchangeReviewSection exchangeId={broker._id} locale={locale} initialReviews={reviews} initialAverage={reviewSummary.average} />
            </section>

            {similar.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-foreground mb-3">{isRu ? 'Другие брокеры' : 'Other brokers'}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {similar.map(other => (
                    <div key={other._id} className="group relative flex items-center gap-3 rounded-[14px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] px-3 py-2.5 hover:bg-[var(--glass-hover)] transition-colors">
                      <Link href={brokerHref(other, locale)} aria-label={other.name} className="absolute inset-0 z-10" />
                      <ExchangeLogo exchange={other} size={34} />
                      <span className="min-w-0 flex-1">
                        <b className="block text-[13px] font-extrabold text-foreground truncate">{other.name}</b>
                        <span className="flex flex-wrap gap-1 mt-0.5">
                          <ProductChips labels={(other.regulators ?? []).map(r => r.name.split(',')[0])} max={2} />
                        </span>
                      </span>
                      <RowAction exchange={other} isRu={isRu} tradeLabel={isRu ? 'Открыть счёт' : 'Open account'} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        <PopularSidebar locale={locale} limit={7} />
      </div>
    </div>
  );
}
