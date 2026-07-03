interface FearGreedBadgeProps {
  value: number;
  classification: string;
  locale: string;
}

const LABELS: Record<string, { ru: string; en: string }> = {
  'Extreme Fear': { ru: 'Крайний страх', en: 'Extreme Fear' },
  'Fear': { ru: 'Страх', en: 'Fear' },
  'Neutral': { ru: 'Нейтрально', en: 'Neutral' },
  'Greed': { ru: 'Жадность', en: 'Greed' },
  'Extreme Greed': { ru: 'Крайняя жадность', en: 'Extreme Greed' },
};

export default function FearGreedBadge({ value, classification, locale }: FearGreedBadgeProps) {
  const isFear = classification.toLowerCase().includes('fear');
  const isGreed = classification.toLowerCase().includes('greed');
  const colorClass = isFear
    ? 'text-negative border-negative/20 bg-negative/10'
    : isGreed
    ? 'text-positive border-positive/20 bg-positive/10'
    : 'text-muted border-border bg-card';
  const label = LABELS[classification]?.[locale === 'ru' ? 'ru' : 'en'] ?? classification;

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${colorClass}`}>
      <span className="hidden sm:inline text-xs font-medium uppercase tracking-widest">
        {locale === 'ru' ? 'Индекс страха' : 'Fear & Greed'}
      </span>
      <span className="font-bold text-sm">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  );
}
