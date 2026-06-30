'use client';

import { useMemo, useState } from 'react';
import { Check, Info, Share2 } from 'lucide-react';
import { TOP_BILLIONAIRES } from '@/lib/billionaires';
import ShareButtons from './ShareButtons';

const BITCOIN_AGE_YEARS = 17;
const HUMAN_LIFESPAN_YEARS = 80;

function formatMoney(n: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function formatYears(n: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    maximumFractionDigits: 0,
  }).format(n);
}

function formatPercent(n: number, locale: string) {
  return new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'en-US', {
    maximumFractionDigits: n < 0.01 ? 6 : 2,
  }).format(n);
}

function Term({ label, hint }: { label: string; hint: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <span title={hint} className="cursor-help text-muted/70 hover:text-accent transition-colors">
        <Info size={11} />
      </span>
    </span>
  );
}

export default function WealthCalculator({ locale }: { locale: string }) {
  const [salary, setSalary] = useState('1000');
  const [selectedId, setSelectedId] = useState(TOP_BILLIONAIRES[0].id);

  const billionaire = TOP_BILLIONAIRES.find((b) => b.id === selectedId)!;
  const monthlySalary = parseFloat(salary) || 0;
  const yearlySalary = monthlySalary * 12;

  const years = useMemo(() => {
    if (monthlySalary <= 0) return 0;
    return billionaire.netWorth / yearlySalary;
  }, [billionaire, monthlySalary, yearlySalary]);

  const sharePercent = yearlySalary > 0 ? (yearlySalary / billionaire.netWorth) * 100 : 0;
  const lives = years / HUMAN_LIFESPAN_YEARS;
  const bitcoinMultiple = years / BITCOIN_AGE_YEARS;
  const centuries = years / 100;

  const shareTitle =
    locale === 'ru'
      ? `Чтобы заработать состояние ${billionaire.name.ru} (${formatMoney(billionaire.netWorth, locale)}), мне нужно работать ${formatYears(years, locale)} лет. Посчитай свой результат:`
      : `To earn ${billionaire.name.en}'s fortune (${formatMoney(billionaire.netWorth, locale)}), I'd need to work for ${formatYears(years, locale)} years. Calculate yours:`;

  return (
    <div className="flex flex-col gap-8">
      {/* Step 1: salary input */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {locale === 'ru'
            ? <Term label="Твой доход в месяц (в долларах)" hint="Сумма, которую ты зарабатываешь за месяц до вычета расходов — используется только для расчёта на этой странице и никуда не отправляется." />
            : <Term label="Your monthly income (in USD)" hint="The amount you earn per month before expenses — used only for this calculation and never sent anywhere." />}
        </label>
        <div className="relative max-w-xs">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
          <input
            type="number"
            min={0}
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="w-full bg-card border border-border rounded-lg pl-7 pr-3 py-2.5 text-foreground text-sm outline-none focus:border-accent/50"
            placeholder="1000"
          />
        </div>
      </div>

      {/* Step 2: billionaire picker */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          {locale === 'ru'
            ? <Term label="С кем сравнить?" hint="«Состояние» (net worth) — это оценочная стоимость всех активов человека: акций, недвижимости, бизнеса и денег, по данным Forbes/Bloomberg." />
            : <Term label="Compare with?" hint="'Net worth' is the estimated value of everything a person owns — stocks, real estate, businesses, and cash — per Forbes/Bloomberg." />}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {TOP_BILLIONAIRES.map((b) => {
            const active = b.id === selectedId;
            return (
              <button
                key={b.id}
                onClick={() => setSelectedId(b.id)}
                className={`relative text-left p-3 rounded-lg border transition-colors ${
                  active
                    ? 'border-accent bg-accent/10'
                    : 'border-border bg-card hover:border-accent/40'
                }`}
              >
                {active && (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                    <Check size={10} className="text-background" />
                  </span>
                )}
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {locale === 'ru' ? b.name.ru : b.name.en}
                </p>
                <p className="text-xs text-muted mt-0.5">{b.company}</p>
                <p className="text-xs text-accent font-mono mt-1.5">{formatMoney(b.netWorth, locale)}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result card */}
      {monthlySalary > 0 && (
        <div className="rounded-2xl border border-accent/30 bg-gradient-to-br from-card to-background p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
              <span className="text-background text-xs font-bold">⚡</span>
            </div>
            <span className="text-xs font-medium text-muted uppercase tracking-widest">
              CryptoPulse.media
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <p className="text-xs text-muted uppercase tracking-wide">
                {locale === 'ru' ? 'Состояние' : 'Net worth'}
              </p>
              <p className="text-lg font-bold text-foreground">{locale === 'ru' ? billionaire.name.ru : billionaire.name.en}</p>
              <p className="text-sm font-mono text-accent">{formatMoney(billionaire.netWorth, locale)}</p>
            </div>
            <div className="text-muted text-sm">vs</div>
            <div className="text-right">
              <p className="text-xs text-muted uppercase tracking-wide">{locale === 'ru' ? 'Твой годовой доход' : 'Your yearly income'}</p>
              <p className="text-lg font-bold text-foreground">{formatMoney(yearlySalary, locale)}</p>
            </div>
          </div>

          {/* Progress bar: your yearly income as a sliver of their net worth */}
          <div className="mb-6">
            <div className="h-2 rounded-full bg-border overflow-hidden">
              <div
                className="h-full bg-accent rounded-full"
                style={{ width: `${Math.min(Math.max(sharePercent, 0.3), 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-1.5">
              {locale === 'ru'
                ? `Твой годовой доход — это ${formatPercent(sharePercent, locale)}% от состояния ${billionaire.name.ru}`
                : `Your yearly income is ${formatPercent(sharePercent, locale)}% of ${billionaire.name.en}'s net worth`}
            </p>
          </div>

          <div className="border-t border-border pt-6 mb-6">
            <p className="text-4xl sm:text-5xl font-extrabold text-accent leading-none">
              {formatYears(years, locale)}
            </p>
            <p className="text-sm text-muted mt-1">
              {locale === 'ru' ? 'лет нужно работать, чтобы накопить столько же' : 'years of work needed to match that fortune'}
            </p>
          </div>

          <div className="flex flex-col gap-2 mb-6">
            <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">
              {locale === 'ru' ? 'Для сравнения' : 'For comparison'}
            </p>
            <ComparisonRow
              text={
                locale === 'ru'
                  ? `Это примерно ${formatYears(lives, locale)} человеческих жизней (при средней продолжительности 80 лет)`
                  : `That's roughly ${formatYears(lives, locale)} human lifetimes (assuming an 80-year lifespan)`
              }
            />
            <ComparisonRow
              text={
                locale === 'ru'
                  ? `Bitcoin существует всего ${BITCOIN_AGE_YEARS} лет — это в ${formatYears(bitcoinMultiple, locale)} раз меньше`
                  : `Bitcoin has existed for only ${BITCOIN_AGE_YEARS} years — that's ${formatYears(bitcoinMultiple, locale)}x less`
              }
            />
            <ComparisonRow
              text={
                locale === 'ru'
                  ? `Это ${formatYears(centuries, locale)} веков`
                  : `That's ${formatYears(centuries, locale)} centuries`
              }
            />
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <Share2 size={14} className="text-accent" />
                {locale === 'ru' ? 'Поделиться результатом' : 'Share your result'}
              </span>
              <ShareButtons url="https://cryptopulse.media/calculators/wealth" title={shareTitle} locale={locale} vertical={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ComparisonRow({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted">
      <span className="text-accent mt-0.5">•</span>
      <span>{text}</span>
    </div>
  );
}
