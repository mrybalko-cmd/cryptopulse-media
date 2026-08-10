import Link from 'next/link';
import { ArrowRight, ArrowRightLeft, Scale } from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import Sparkline from './Sparkline';

/**
 * A calculator entry that shows its own output instead of describing it. The
 * converter carries a live rate, the wealth comparison a scale of years — so
 * the reader sees what the tool does before deciding to open it.
 *
 * Same glass surface, halo and pill button as the index widgets beside it:
 * five cards, one language, each recognisable by its own colour.
 */
function Shell({
  href,
  color,
  icon,
  title,
  description,
  cta,
  children,
}: {
  href: string;
  color: string;
  icon: ReactNode;
  title: string;
  description: string;
  cta: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{ '--c': color } as CSSProperties}
      className="group relative flex flex-col overflow-hidden rounded-[18px] p-[18px] border border-[var(--popular-glass-line)] bg-[var(--popular-glass)] shadow-[inset_0_1px_0_var(--popular-glass-line),var(--popular-shadow)] transition-transform hover:-translate-y-0.5"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 -top-[34%] h-[150px] w-[190px] -translate-x-1/2 blur-[30px]"
        style={{ background: `radial-gradient(50% 60% at 50% 50%, ${color}6b, transparent 70%)` }}
      />

      <span className="relative flex items-center gap-2.5 mb-3">
        <span
          className="w-[34px] h-[34px] rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${color}29`, color, border: `1px solid ${color}47` }}
        >
          {icon}
        </span>
        <span className="text-sm font-extrabold text-foreground -tracking-[0.01em]">{title}</span>
      </span>

      <p className="relative text-[11.5px] text-muted leading-relaxed mb-3">{description}</p>

      <div className="relative rounded-[13px] border border-border bg-card-hover/40 px-[13px] py-3 mb-3">{children}</div>

      <span
        // mt-auto, not mt-3: the two cards carry different amounts of content,
        // and the buttons should still line up along the bottom.
        className="relative mt-auto self-start inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[12.5px] font-extrabold text-foreground border border-border bg-card transition-colors group-hover:border-[var(--c)]"
      >
        {cta}
        <ArrowRight size={13} style={{ color }} />
      </span>
    </Link>
  );
}

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="block text-[9px] font-extrabold uppercase tracking-[0.08em] text-muted mb-2">{children}</span>
  );
}

export function ConverterCard({
  locale,
  btcPrice,
  btcSparkline,
  btcChange7d,
}: {
  locale: string;
  /** Live BTC/USD, already fetched for the page — no extra request. */
  btcPrice?: number;
  /** Same response as the price: the week's shape, thinned server-side. */
  btcSparkline?: number[];
  btcChange7d?: number;
}) {
  const isRu = locale === 'ru';

  return (
    <Shell
      href={`/${locale}/calculators/converter`}
      // Cyan stays the converter's own colour on this page — wealth already
      // owns violet, and two violet cards side by side stop being telling
      // apart. The violet gradient lives on the figure inside instead.
      color="#06b6d4"
      icon={<ArrowRightLeft size={17} />}
      title={isRu ? 'Конвертер валют' : 'Currency Converter'}
      description={
        isRu
          ? '15 монет и 20 валют в любом сочетании — включая крипту в крипту. Курс живой, готовые суммы посчитаны.'
          : '15 coins and 20 currencies in any combination — crypto to crypto included. Live rate, common amounts precomputed.'
      }
      cta={isRu ? 'Открыть конвертер' : 'Open converter'}
    >
      <span className="flex items-center gap-3">
        <span className="min-w-0">
          <Label>1 BTC</Label>
          <span className="block text-[19px] font-black tabular-nums -tracking-[0.035em] bg-[linear-gradient(90deg,var(--violet),var(--violet-2))] bg-clip-text text-transparent">
            {btcPrice ? `$${btcPrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}` : '—'}
          </span>
        </span>
        {btcSparkline && btcSparkline.length > 1 && (
          <span className="ml-auto w-[74px] shrink-0">
            <Sparkline points={btcSparkline} positive={(btcChange7d ?? 0) >= 0} height={34} />
          </span>
        )}
      </span>
    </Shell>
  );
}

export function WealthCard({
  locale,
  people,
}: {
  locale: string;
  /** Top fortunes with the years each would take on a reference salary. */
  people: { name: string; years: string; pct: number }[];
}) {
  const isRu = locale === 'ru';

  return (
    <Shell
      href={`/${locale}/calculators/wealth`}
      color="#8b5cf6"
      icon={<Scale size={17} />}
      title={isRu ? 'Сравнение богатства' : 'Wealth Comparison'}
      description={
        isRu
          ? 'Укажите свой доход и узнайте, сколько лет уйдёт, чтобы догнать одно из крупнейших состояний мира.'
          : 'Enter what you earn and see how long it would take to reach one of the world’s largest fortunes.'
      }
      cta={isRu ? 'Открыть калькулятор' : 'Open calculator'}
    >
      <Label>{isRu ? 'При зарплате $60 000' : 'On a $60,000 salary'}</Label>
      <span className="flex flex-col gap-[7px]">
        {people.map((p) => (
          <span key={p.name} className="grid grid-cols-[52px_minmax(0,1fr)_auto] gap-2.5 items-center">
            <span className="text-[10px] font-bold text-muted truncate">{p.name}</span>
            <span className="h-1.5 rounded-full bg-border overflow-hidden">
              <span
                className="block h-full rounded-full"
                style={{
                  width: `${p.pct}%`,
                  background: 'linear-gradient(90deg, #8b5cf680, #8b5cf6)',
                  boxShadow: '0 0 10px #8b5cf680',
                }}
              />
            </span>
            <span className="text-[10.5px] font-extrabold text-foreground tabular-nums">
              {p.years} {isRu ? 'лет' : 'yrs'}
            </span>
          </span>
        ))}
      </span>
    </Shell>
  );
}
