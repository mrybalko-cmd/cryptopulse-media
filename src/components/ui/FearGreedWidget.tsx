import Link from 'next/link';
import GaugeArc from './GaugeArc';

interface Props {
  value: number;
  classification: string;
  locale: string;
  /** Bigger on the calculators hub, compact in the page headers. */
  width?: number;
}

const LABELS: Record<string, { ru: string; en: string }> = {
  'Extreme Fear': { ru: 'Крайний страх', en: 'Extreme Fear' },
  'Fear':         { ru: 'Страх',         en: 'Fear' },
  'Neutral':      { ru: 'Нейтрально',    en: 'Neutral' },
  'Greed':        { ru: 'Жадность',      en: 'Greed' },
  'Extreme Greed':{ ru: 'Крайняя жадность', en: 'Extreme Greed' },
};

function sentimentColor(v: number) {
  if (v <= 24) return '#E5534B';
  if (v <= 44) return '#F0883E';
  if (v <= 55) return '#D29922';
  if (v <= 74) return '#3FB950';
  return '#2EA043';
}

// Fear on the left, greed on the right — the same run of colour the canvas
// version stepped through, now handed to one SVG gradient.
const SCALE = ['#E5534B', '#F0883E', '#D29922', '#3FB950', '#2EA043'];

export default function FearGreedWidget({ value, classification, locale, width = 96 }: Props) {
  const color = sentimentColor(value);
  const label = LABELS[classification]?.[locale === 'ru' ? 'ru' : 'en'] ?? classification;
  const href = `/${locale}/fear-greed`;
  const indexLabel = locale === 'ru' ? 'Индекс страха' : 'Fear & Greed';


  return (
    <Link href={href} className="group outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm">
      {/* Desktop: full arc widget */}
      <div className="hidden sm:flex flex-col items-center gap-0">
        <GaugeArc value={value} color={color} width={width} gradient={SCALE} id={`fng-${value}-${width}`} />
        <div className="flex items-baseline gap-1.5 -mt-1">
          <span
            className="font-mono text-xl font-bold tabular-nums leading-none"
            style={{ color }}
          >
            {value}
          </span>
          <span
            className="text-[10px] font-semibold uppercase tracking-wide leading-none"
            style={{ color }}
          >
            {label}
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-muted/60 mt-1 group-hover:text-accent transition-colors">
          {indexLabel} ↗
        </span>
        {/* Source attribution right on the widget, not just buried in the
            full page's footnote — this number is our own source's reading
            (alternative.me) and can legitimately differ from other trackers
            (e.g. CoinMarketCap's own Fear & Greed Index uses a different
            methodology), so anywhere this widget is shown standalone
            (e.g. the /calculators hub card) it's clear which one it is. */}
        <span className="text-[8px] text-muted/50 mt-0.5">
          {locale === 'ru' ? 'по данным alternative.me' : 'via alternative.me'}
        </span>
      </div>

      {/* Mobile: compact pill — just number + label + colored dot */}
      <div className="sm:hidden flex flex-col items-center gap-1">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors"
          style={{
            borderColor: `${color}33`,
            backgroundColor: `${color}0F`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: color }}
          />
          <span
            className="font-mono text-xs font-bold tabular-nums"
            style={{ color }}
          >
            {value}
          </span>
          <span className="text-[10px] font-medium" style={{ color }}>
            {label}
          </span>
        </div>
        <span className="text-[8px] text-muted/50">
          {locale === 'ru' ? 'по данным alternative.me' : 'via alternative.me'}
        </span>
      </div>
    </Link>
  );
}
