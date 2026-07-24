import ExchangeToneBadge from './ExchangeToneBadge';
import type { ExchangeRegionRaw } from '@/lib/sanity';

const TONE_LABEL: Record<'ok' | 'warn' | 'off', { ru: string; en: string }> = {
  ok: { ru: 'Разрешена', en: 'Allowed' },
  warn: { ru: 'Ограничения', en: 'Restricted' },
  off: { ru: 'Недоступна', en: 'Unavailable' },
};

export default function ExchangeRegions({ regions, locale }: { regions?: ExchangeRegionRaw[]; locale: string }) {
  if (!regions || regions.length === 0) return null;
  const isRu = locale === 'ru';

  return (
    <div className="flex flex-col gap-2">
      {regions.map((r, i) => {
        const tone = r.tone;
        const note = isRu ? r.noteRu : r.noteEn;
        return (
          <div key={i} className="flex items-center justify-between gap-3 bg-card border border-border rounded-lg px-3 py-2.5 text-sm">
            <div>
              <span className="text-foreground font-medium">{isRu ? r.regionRu : r.regionEn}</span>
              {note && <span className="text-muted text-xs ml-2">— {note}</span>}
            </div>
            <ExchangeToneBadge text={isRu ? TONE_LABEL[tone].ru : TONE_LABEL[tone].en} tone={tone} />
          </div>
        );
      })}
    </div>
  );
}
