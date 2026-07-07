import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import WealthCalculator from '@/components/ui/WealthCalculator';

const BASE = 'https://cryptopulse.media';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Сравнение богатства — сколько лет работать, чтобы стать как Илон Маск?'
    : "Wealth Comparison — how many years to earn Elon Musk's fortune?";
  const description = isRu
    ? 'Введи свою зарплату и узнай, сколько лет нужно работать, чтобы накопить состояние одного из топ-5 самых богатых людей мира по версии Forbes.'
    : 'Enter your salary and find out how many years of work it would take to match the fortune of one of the world\'s top 5 richest people, per Forbes.';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/calculators/wealth`,
      languages: { ru: `${BASE}/ru/calculators/wealth`, en: `${BASE}/en/calculators/wealth` },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${BASE}/${locale}/calculators/wealth`,
      siteName: 'CryptoPulse.media',
      locale: isRu ? 'ru_RU' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function WealthComparisonPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {isRu ? 'Сравнение богатства' : 'Wealth Comparison'}
        </h1>
        <p className="text-muted text-sm mt-2">
          {isRu
            ? 'Введи свою зарплату и выбери одного из самых богатых людей мира — узнай, сколько лет тебе нужно работать, чтобы накопить столько же.'
            : "Enter your salary and pick one of the world's richest people — find out how many years it would take to match their fortune."}
        </p>
      </div>

      <WealthCalculator locale={locale} />

      <p className="text-xs text-muted mt-8">
        {isRu
          ? 'Данные о состоянии — приблизительные, по открытым источникам (Forbes, Bloomberg Billionaires Index), июнь 2026. Расчёт условный и не учитывает налоги, инфляцию и рост капитала.'
          : 'Net worth figures are approximate, based on public sources (Forbes, Bloomberg Billionaires Index), June 2026. The calculation is illustrative and ignores taxes, inflation, and capital growth.'}
      </p>
    </div>
  );
}
