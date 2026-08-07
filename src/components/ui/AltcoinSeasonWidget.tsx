import Link from 'next/link';
import GaugeArc from './GaugeArc';

interface Props {
  value: number;
  classification: 'bitcoin' | 'neutral' | 'altcoin';
  locale: string;
  /** Bigger on the calculators hub, compact in the page header. */
  width?: number;
}

const LABELS: Record<Props['classification'], { ru: string; en: string }> = {
  bitcoin: { ru: 'Сезон биткоина', en: 'Bitcoin Season' },
  neutral: { ru: 'Нейтрально', en: 'Neutral' },
  altcoin: { ru: 'Сезон альткоинов', en: 'Altcoin Season' },
};

// Distinct palette from the Fear & Greed widget (red-to-green) so the two
// gauges are never visually confused: orange (Bitcoin's own brand color) at
// low values, gray-gold neutral, violet at high values.
function sentimentColor(v: number) {
  if (v <= 25) return '#F0883E';
  if (v <= 74) return '#D29922';
  return '#8B5CF6';
}

const SCALE = ['#F0883E', '#D29922', '#8B5CF6'];

export default function AltcoinSeasonWidget({ value, classification, locale, width = 96 }: Props) {
  const color = sentimentColor(value);
  const label = LABELS[classification][locale === 'ru' ? 'ru' : 'en'];
  const href = `/${locale}/altcoin-season`;
  const indexLabel = locale === 'ru' ? 'Альткоин-сезон' : 'Altcoin Season';


  return (
    <Link href={href} className="group outline-none focus-visible:ring-2 focus-visible:ring-accent/50 rounded-sm">
      <div className="hidden sm:flex flex-col items-center gap-0">
        <GaugeArc value={value} color={color} width={width} gradient={SCALE} id={`alt-${value}-${width}`} />
        <div className="flex items-baseline gap-1.5 -mt-1">
          <span className="font-mono text-xl font-bold tabular-nums leading-none" style={{ color }}>
            {value}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide leading-none" style={{ color }}>
            {label}
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-muted/60 mt-1 group-hover:text-accent transition-colors">
          {indexLabel} ↗
        </span>
        <span className="text-[8px] text-muted/50 mt-0.5">
          {locale === 'ru' ? 'расчёт CryptoPulse по CoinGecko' : 'CryptoPulse calc via CoinGecko'}
        </span>
      </div>

      <div className="sm:hidden flex flex-col items-center gap-1">
        <div
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors"
          style={{ borderColor: `${color}33`, backgroundColor: `${color}0F` }}
        >
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className="font-mono text-xs font-bold tabular-nums" style={{ color }}>{value}</span>
          <span className="text-[10px] font-medium" style={{ color }}>{label}</span>
        </div>
        <span className="text-[8px] text-muted/50">
          {locale === 'ru' ? 'расчёт CryptoPulse по CoinGecko' : 'CryptoPulse calc via CoinGecko'}
        </span>
      </div>
    </Link>
  );
}
