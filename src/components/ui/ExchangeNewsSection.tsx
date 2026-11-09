import Link from 'next/link';
import Image from 'next/image';
import { sanityImageTransform } from '@/lib/sanityImage';
import { featuredMentions } from '@/lib/exchangeMentions';
import { formatTimestamp } from '@/lib/formatTimestamp';
import type { ExchangeMention } from '@/lib/sanity';

const VISIBLE = 6;

function typeLabel(m: ExchangeMention, isRu: boolean) {
  return m._type === 'news' ? (isRu ? 'Новость' : 'News') : (isRu ? 'Статья' : 'Article');
}

function Meta({ m, isRu }: { m: ExchangeMention; isRu: boolean }) {
  const when = formatTimestamp(m.publishedAt);
  return (
    <span className="block text-[11px] text-muted mt-1 tabular-nums">
      {when ? `${when.time} · ${when.date} · ` : ''}
      {m.inTitle ? (isRu ? 'в заголовке' : 'in the headline') : (isRu ? 'в тексте' : 'in the text')}
    </span>
  );
}

/**
 * Материалы о площадке. Сначала с её названием в заголовке, и подпись честно
 * говорит, где найдено: упоминание в тексте не выдаётся за новость о бирже.
 */
export default function ExchangeNewsSection({
  exchangeName,
  slug,
  mentions,
  locale,
  showArchiveLink = true,
}: {
  showArchiveLink?: boolean;
  exchangeName: string;
  slug: string;
  mentions: ExchangeMention[];
  locale: string;
}) {
  if (mentions.length === 0) return null;
  const isRu = locale === 'ru';
  const [lead, ...rest] = featuredMentions(mentions, VISIBLE);
  const href = (m: ExchangeMention) => `/${locale}/${m._type === 'news' ? 'news' : 'articles'}/${m.slug}`;
  const shown = rest.length + 1;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-3">
        <Link
          href={href(lead)}
          className="flex md:flex-col gap-3 rounded-[14px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] p-3 hover:bg-[var(--glass-hover)] transition-colors"
        >
          <span className="relative block w-20 h-20 md:w-full md:h-auto md:aspect-[1.9] rounded-[10px] overflow-hidden shrink-0 bg-[var(--rates-inset)]">
            {lead.coverImage && (
              <Image src={sanityImageTransform(lead.coverImage, { width: 640 })!} alt="" fill sizes="(min-width: 768px) 320px, 80px" className="object-cover" unoptimized />
            )}
          </span>
          <span className="min-w-0">
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--violet-2)]">{typeLabel(lead, isRu)}</span>
            <span className="block text-sm md:text-[15px] font-bold text-foreground leading-snug mt-0.5">{lead.title}</span>
            <Meta m={lead} isRu={isRu} />
          </span>
        </Link>

        {rest.length > 0 && (
          <ul className="flex flex-col list-none rounded-[14px] border border-[var(--glass-line)] bg-[image:var(--glass-fill)] overflow-hidden">
            {rest.map(m => (
              <li key={`${m._type}-${m.slug}`} className="border-b last:border-b-0 border-[var(--glass-line)]">
                <Link href={href(m)} className="block px-3 py-2.5 hover:bg-[var(--glass-hover)] transition-colors">
                  <span className="text-[13px] font-semibold text-foreground leading-snug line-clamp-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wide text-[var(--violet-2)] mr-1.5">{typeLabel(m, isRu)}</span>
                    {m.title}
                  </span>
                  <Meta m={m} isRu={isRu} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      {mentions.length > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 mt-3">
          <span className="text-xs text-muted">
            {isRu
              ? `Показано ${shown} из ${mentions.length} · сначала с названием в заголовке`
              : `Showing ${shown} of ${mentions.length} · headline mentions first`}
          </span>
          {showArchiveLink && mentions.length > VISIBLE && (
            <Link
              href={`/${locale}/exchanges/${slug}/news`}
              className="inline-flex items-center min-h-10 px-4 rounded-xl border border-[var(--glass-line)] bg-[var(--rates-inset)] text-[13px] font-extrabold text-foreground hover:bg-[var(--glass-hover)] transition-colors"
            >
              {isRu ? `Все материалы о ${exchangeName} (${mentions.length}) →` : `All ${exchangeName} coverage (${mentions.length}) →`}
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
