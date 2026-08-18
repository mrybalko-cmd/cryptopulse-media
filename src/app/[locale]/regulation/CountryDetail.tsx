import { STATUS_META } from '@/lib/regulationData';
import { REGION_LABELS, type RegCountry } from '@/lib/regulation';

function flag(iso2: string) {
  return String.fromCodePoint(...[...iso2].map(ch => 0x1f1e6 + ch.charCodeAt(0) - 65));
}

/**
 * One country in full. Rendered on the server for every country in the index,
 * so the text is in the HTML whether or not anyone clicks — that was the whole
 * point of the exercise: 2,100 words were hidden behind `{isOpen && …}`.
 */
export default function CountryDetail({ country, locale }: { country: RegCountry; locale: string }) {
  const isRu = locale === 'ru';
  const meta = STATUS_META[country.status];
  const checked = country.checkedAt?.endsWith('-01-01')
    ? (isRu ? `данные за ${country.checkedAt.slice(0, 4)} год` : `data from ${country.checkedAt.slice(0, 4)}`)
    : (isRu ? `проверено ${country.checkedAt.split('-').reverse().join('.')}`
            : `checked ${country.checkedAt.split('-').reverse().join('.')}`);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 px-4 pb-4 pt-3">
      <p className="m-0 text-[13px] leading-relaxed text-foreground">{isRu ? country.summary.ru : country.summary.en}</p>
      <p className="m-0 text-[12.5px] leading-relaxed text-muted">{isRu ? country.details.ru : country.details.en}</p>

      {country.taxNote && (isRu ? country.taxNote.ru : country.taxNote.en) && (
        <div className="sm:col-span-2 rounded-xl border border-border bg-card px-3 py-2.5 text-[12px] text-muted">
          <b className="text-foreground">{isRu ? 'Налоги.' : 'Taxes.'}</b>{' '}
          {isRu ? country.taxNote.ru : country.taxNote.en}
        </div>
      )}

      <div className="sm:col-span-2 flex items-center gap-2 flex-wrap text-[11px] text-muted">
        <span>{checked}</span>
        {country.sourceUrl ? (
          <a href={country.sourceUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-accent hover:underline">
            {country.regulatorName || (isRu ? 'источник' : 'source')}
          </a>
        ) : (
          <span className="rounded-md px-2 py-0.5 font-bold text-[10.5px]" style={{ color: meta.color, background: `${meta.color}1f` }}>
            {isRu ? 'источник не указан' : 'no source listed'}
          </span>
        )}
        <span className="opacity-60">{isRu ? REGION_LABELS[country.region].ru : REGION_LABELS[country.region].en}</span>
      </div>
    </div>
  );
}

export { flag };
