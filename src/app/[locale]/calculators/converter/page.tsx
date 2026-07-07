import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import CurrencyConverter from '@/components/ui/CurrencyConverter';

const BASE = 'https://cryptopulse.media';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu
    ? 'Конвертер валют в криптовалюту — курс онлайн'
    : 'Fiat-to-Crypto Currency Converter — Live Rates';
  const description = isRu
    ? 'Переведи доллары, евро, гривны и ещё 17 валют в биткоин и другие топ-15 криптовалют по актуальному курсу.'
    : 'Convert dollars, euros, and 18 other currencies into Bitcoin and 14 other top cryptocurrencies at live rates.';

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${locale}/calculators/converter`,
      languages: { ru: `${BASE}/ru/calculators/converter`, en: `${BASE}/en/calculators/converter` },
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: `${BASE}/${locale}/calculators/converter`,
      siteName: 'CryptoPulse.media',
      locale: isRu ? 'ru_RU' : 'en_US',
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function CurrencyConverterPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {isRu ? 'Конвертер валют' : 'Currency Converter'}
        </h1>
        <p className="text-muted text-sm mt-2">
          {isRu
            ? 'Выбери валюту и сумму — узнай, сколько это в биткоине или другой топовой криптовалюте по текущему курсу. Можно конвертировать и в обратную сторону.'
            : "Pick a currency and amount to see how much it's worth in Bitcoin or another top cryptocurrency at the current rate. Works in reverse too."}
        </p>
      </div>

      <CurrencyConverter locale={locale} />

      <p className="text-xs text-muted mt-8">
        {isRu
          ? 'Курсы предоставлены CoinGecko и обновляются раз в минуту. Расчёт носит информационный характер и не учитывает комиссии бирж — реальный курс при покупке или продаже может отличаться.'
          : "Rates are provided by CoinGecko and refresh every minute. This is for informational purposes only and doesn't account for exchange fees — the actual rate when buying or selling may differ."}
      </p>
    </div>
  );
}
