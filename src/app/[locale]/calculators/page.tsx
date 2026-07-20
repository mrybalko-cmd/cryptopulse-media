import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import Link from 'next/link';
import { Scale, ArrowRightLeft, ArrowRight } from 'lucide-react';
import PopularSidebar from '@/components/ui/PopularSidebar';
import FearGreedWidget from '@/components/ui/FearGreedWidget';
import AltcoinSeasonWidget from '@/components/ui/AltcoinSeasonWidget';
import PulseWidget from '@/components/ui/PulseWidget';
import { fetchFearGreedIndex } from '@/lib/feargreed';
import { fetchAltcoinSeasonIndex } from '@/lib/altcoinSeason';
import { fetchLatestPulse } from '@/lib/pulse';


type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Калькуляторы и показатели — CryptoPulse.media' : 'Calculators & Metrics — CryptoPulse.media';
  const description = isRu
    ? 'Индекс страха и жадности, индекс альткоин-сезона, конвертер валют и сравнение богатства — всё в одном месте.'
    : 'Fear & Greed Index, Altcoin Season Index, currency converter, wealth comparison — all in one place.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/calculators`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/calculators`,
      languages: { ru: `${BASE}/ru/calculators`, en: `${BASE}/en/calculators` },
    },
  };
}

export default async function CalculatorsHubPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  const [fearGreedData, altcoinSeasonData, pulseData] = await Promise.all([
    fetchFearGreedIndex().catch(() => null),
    fetchAltcoinSeasonIndex().catch(() => null),
    fetchLatestPulse().catch(() => null),
  ]);

  const cards = [
    {
      href: `/${locale}/calculators/wealth`,
      icon: Scale,
      title: isRu ? 'Сравнение богатства' : 'Wealth Comparison',
      description: isRu
        ? 'Введи свой доход и узнай, сколько лет нужно работать, чтобы накопить состояние одного из самых богатых людей мира.'
        : "Enter your income and find out how many years it would take to match the fortune of one of the world's richest people.",
    },
    {
      href: `/${locale}/calculators/converter`,
      icon: ArrowRightLeft,
      title: isRu ? 'Конвертер валют' : 'Currency Converter',
      description: isRu
        ? 'Переведи сумму в любой из 20 основных фиатных валют в биткоин и другие топовые криптовалюты по актуальному курсу.'
        : 'Convert an amount in any of the 20 major fiat currencies into Bitcoin and other top cryptocurrencies at live rates.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_256px] gap-6 lg:gap-8">
        <div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">
              {isRu ? 'Калькуляторы и показатели' : 'Calculators & Metrics'}
            </h1>
            <p className="text-muted text-sm mt-2">
              {isRu
                ? 'Индекс страха и жадности, индекс альткоин-сезона, конвертер валют и сравнение богатства.'
                : 'Fear & Greed Index, Altcoin Season Index, currency converter, and wealth comparison.'}
            </p>
          </div>

          {/* Fear & Greed Index + Altcoin Season Index + Pulse */}
          {(fearGreedData || altcoinSeasonData || pulseData) && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {fearGreedData && (
                <div className="p-5 rounded-2xl border border-border bg-card">
                  <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
                    {isRu ? 'Индекс страха и жадности' : 'Fear & Greed Index'}
                  </p>
                  <FearGreedWidget
                    value={fearGreedData.value}
                    classification={fearGreedData.classification}
                    locale={locale}
                  />
                </div>
              )}
              {altcoinSeasonData && (
                <div className="p-5 rounded-2xl border border-border bg-card">
                  <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">
                    {isRu ? 'Индекс альткоин-сезона' : 'Altcoin Season Index'}
                  </p>
                  <AltcoinSeasonWidget
                    value={altcoinSeasonData.index}
                    classification={altcoinSeasonData.classification}
                    locale={locale}
                  />
                </div>
              )}
              {pulseData && <PulseWidget data={pulseData} locale={locale} idSuffix="calculators-hub" />}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="group flex flex-col gap-3 p-6 rounded-2xl border border-border bg-card hover:border-accent/40 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                    <Icon size={20} />
                  </div>
                  <h2 className="text-base font-semibold text-foreground">{card.title}</h2>
                  <p className="text-sm text-muted leading-relaxed flex-1">{card.description}</p>
                  <span className="flex items-center gap-1 text-sm text-accent font-medium">
                    {isRu ? 'Открыть' : 'Open'}
                    <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
