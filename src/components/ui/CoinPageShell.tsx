import type { ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import CoinInvestmentCalculator from './CoinInvestmentCalculator';
import type { CoinMeta } from '@/lib/coinRegistry';
import type { CoinMarket } from '@/lib/coinMarket';
import type { InvestmentReference } from '@/lib/coinGuides';
import { formatTimestamp } from '@/lib/formatTimestamp';

export interface CoinFaq { question: { ru: string; en: string }; answer: { ru: string; en: string } }
export interface CoinQuote {
  author: string;
  role: { ru: string; en: string };
  year: number;
  quote: { ru: string; en: string };
}
/** Value is bilingual where it needs to be — «Без лимита» / «Unlimited» is a
 *  fact, not a label, and forcing it to one string lost the translation. */
export interface CoinFact {
  label: { ru: string; en: string };
  value: string | { ru: string; en: string };
}

/**
 * The single shell every /assets/{slug} page renders through.
 *
 * Before this, fourteen coins carried their own page layout and their own
 * calculator component while ten shared a different one — so a design change
 * meant fifteen edits, and the copies had already drifted (three calculators
 * were querying the wrong coin's price feed). The bespoke part of each page is
 * its history prose, and that is the only thing a page still passes in.
 */
export default function CoinPageShell({
  locale,
  slug,
  meta,
  market,
  tagline,
  facts,
  reference,
  historyTitle,
  historyContent,
  quotes,
  faq,
  glossaryTerms,
}: {
  locale: string;
  slug: string;
  meta: CoinMeta;
  market: CoinMarket | null;
  tagline: string;
  /** Static facts about the project — founding year, creator, supply model. */
  facts: CoinFact[];
  reference: InvestmentReference[];
  historyTitle: string;
  historyContent: ReactNode;
  quotes?: CoinQuote[];
  faq: CoinFaq[];
  glossaryTerms: { slug: string; label: { ru: string; en: string } }[];
}) {
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const nf = isRu ? 'ru-RU' : 'en-US';

  const money = (n: number) =>
    n >= 1e9 ? `$${(n / 1e9).toFixed(n / 1e9 >= 100 ? 0 : 1)}${isRu ? ' млрд' : 'B'}`
      : n >= 1e6 ? `$${(n / 1e6).toFixed(0)}${isRu ? ' млн' : 'M'}`
        : n >= 1 ? `$${n.toLocaleString(nf, { maximumFractionDigits: 2 })}`
          : `$${n.toFixed(4)}`;

  const supply = market?.circulating
    ? market.maxSupply
      ? `${compact(market.circulating, nf)} ${isRu ? 'из' : 'of'} ${compact(market.maxSupply, nf)}`
      : compact(market.circulating, nf)
    : '—';

  const up = (market?.change24h ?? 0) >= 0;
  const quoteTime = market ? formatTimestamp(market.updatedAt)?.full : null;

  return (
    <div className="coin-page max-w-4xl mx-auto px-4 sm:px-6 py-10" style={{ ['--coin' as string]: meta.color }}>
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-6" aria-label={isRu ? 'Хлебные крошки' : 'Breadcrumb'}>
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
        <span>›</span>
        <Link href={`/${locale}/assets`} className="hover:text-accent transition-colors">{isRu ? 'Крипто-активы' : 'Crypto Assets'}</Link>
        <span>›</span>
        <span className="text-foreground">{meta.name} ({meta.symbol})</span>
      </nav>

      {/* Hero — the live figures come first because that is what the visitor
          arrived for; the project trivia sits below them. */}
      <section className="glass-panel">
        <div className="flex items-start gap-4 flex-wrap">
          {market?.logo && (
            <span
              className="w-14 h-14 rounded-full overflow-hidden shrink-0 relative"
              style={{ boxShadow: `0 8px 26px color-mix(in srgb, ${meta.color} 45%, transparent), 0 0 0 1px var(--popular-glass-line)` }}
            >
              <Image src={market.logo} alt={isRu ? `Логотип ${meta.name}` : `${meta.name} logo`} width={56} height={56} className="w-full h-full object-cover" unoptimized />
            </span>
          )}
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-[24px] sm:text-[31px] font-extrabold tracking-[-0.03em] leading-tight text-foreground">
              {meta.name}{' '}
              <span className="font-semibold text-muted text-[0.62em]">{meta.symbol}</span>
            </h1>
            {meta.formerly && (
              <p className="text-[11.5px] text-muted mt-1">
                {isRu
                  ? `ранее ${meta.formerly.name} (${meta.formerly.symbol})`
                  : `formerly ${meta.formerly.name} (${meta.formerly.symbol})`}
              </p>
            )}
            <p className="text-[13px] text-muted mt-1.5 leading-relaxed max-w-[52ch]">{tagline}</p>
          </div>
          {market && (
            <div className="sm:ml-auto sm:text-right w-full sm:w-auto">
              <p className="text-[28px] sm:text-[34px] font-black tracking-[-0.035em] tabular-nums leading-none text-foreground">
                {money(market.price)}
              </p>
              <span
                className="inline-flex items-center gap-1 text-[12.5px] font-extrabold mt-1.5 px-2.5 py-[3px] rounded-full"
                style={{
                  color: up ? 'var(--positive)' : 'var(--negative)',
                  background: `color-mix(in srgb, ${up ? 'var(--positive)' : 'var(--negative)'} 15%, transparent)`,
                }}
              >
                {up ? '▲' : '▼'} {Math.abs(market.change24h).toFixed(2)}% {isRu ? 'за сутки' : '24h'}
              </span>
              {/* When the upstream refuses a quote the page falls back to the
                  last stored one, which can be hours old. A price with no
                  timestamp reads as live whether it is or not, so the age is
                  always on the page — not only when it is inconvenient. */}
              {quoteTime && (
                <p className="text-[10.5px] text-muted mt-2 tabular-nums">
                  {isRu ? 'обновлено' : 'updated'} {quoteTime}
                </p>
              )}
            </div>
          )}
        </div>

        {market && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-[18px]">
            <Stat k={isRu ? 'Капитализация' : 'Market cap'} v={money(market.marketCap)}
              s={isRu ? 'общая стоимость выпущенных монет' : 'value of all issued coins'} />
            {/* Turnover against size says more than the raw volume figure: a
                large coin trading thinly and a small one trading hard look
                identical until you divide one by the other. */}
            <Stat k={isRu ? 'Объём за сутки' : '24h volume'} v={money(market.volume24h)}
              s={market.marketCap > 0
                ? `${(market.volume24h / market.marketCap * 100).toFixed(1)}% ${isRu ? 'от капитализации' : 'of market cap'}`
                : undefined} />
            <Stat k={isRu ? 'Максимум' : 'All-time high'} v={money(market.ath)}
              s={`${isRu ? 'на' : ''} ${Math.abs(market.athChangePct).toFixed(0)}% ${isRu ? 'ниже сейчас' : 'below now'}`} sColor="var(--negative)" />
            <Stat k={isRu ? 'В обращении' : 'Circulating'} v={supply} vSmall
              s={market.maxSupply
                ? `${(market.circulating! / market.maxSupply * 100).toFixed(0)}% ${isRu ? 'от предела' : 'of the cap'}`
                : (isRu ? 'эмиссия продолжается' : 'still issuing')} />
          </div>
        )}

      </section>

      <CoinInvestmentCalculator
        locale={locale}
        symbol={meta.symbol}
        name={meta.name}
        color={meta.color}
        price={market?.price ?? null}
        ath={market?.ath ?? 0}
        athChangePct={market?.athChangePct ?? 0}
        reference={reference}
        slug={slug}
      />

      {facts.length > 0 && (
        <section className="glass-panel">
          <h2 className="text-[19px] sm:text-xl font-extrabold tracking-tight text-foreground mb-4">
            {isRu ? `Коротко о ${meta.name}` : `${meta.name} at a glance`}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {facts.map((f) => (
              <div key={f.label[loc]} className="rounded-[14px] border border-[var(--popular-glass-line)] px-3 py-2.5 bg-[color-mix(in_srgb,var(--foreground)_3.5%,transparent)]">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.07em] text-muted">{f.label[loc]}</p>
                <p className="text-[13.5px] font-bold mt-1 text-foreground leading-snug">{typeof f.value === 'string' ? f.value : f.value[loc]}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <article className="glass-panel">
        <h2 className="text-[19px] sm:text-xl font-extrabold tracking-tight text-foreground mb-5">{historyTitle}</h2>
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-bold prose-headings:text-[15px] prose-headings:mt-6 prose-headings:mb-2
          prose-p:text-muted prose-p:leading-[1.78] prose-p:text-[13.5px]
          prose-strong:text-foreground
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-li:text-muted prose-li:text-[13.5px]">
          {historyContent}
        </div>
      </article>

      {quotes && quotes.length > 0 && (
        <section className="glass-panel">
          <h2 className="text-[19px] sm:text-xl font-extrabold tracking-tight text-foreground mb-4">
            {isRu ? `Что говорят о ${meta.name}` : `What they say about ${meta.name}`}
          </h2>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {quotes.map((q) => (
              <figure key={`${q.author}-${q.year}`} className="rounded-[14px] border border-[var(--popular-glass-line)] px-4 py-3.5 m-0">
                <blockquote className="text-[13px] text-muted leading-relaxed m-0">«{q.quote[loc]}»</blockquote>
                <figcaption className="text-[11.5px] mt-2.5">
                  <b className="text-foreground">{q.author}</b>
                  <span className="text-muted"> — {q.role[loc]}, {q.year}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="glass-panel">
        <h2 className="text-[19px] sm:text-xl font-extrabold tracking-tight text-foreground mb-4">
          {isRu ? `Частые вопросы о ${meta.name}` : `Frequently asked questions about ${meta.name}`}
        </h2>
        <div className="flex flex-col gap-2">
          {faq.map((item) => (
            <details key={item.question[loc]} className="group rounded-[13px] border border-[var(--popular-glass-line)] px-4 py-3 open:border-accent/40">
              <summary className="flex items-start justify-between gap-3 cursor-pointer list-none text-[13.5px] font-bold text-foreground">
                {item.question[loc]}
                <span className="text-muted text-xs shrink-0 mt-0.5 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-[12.5px] text-muted leading-relaxed mt-2">{item.answer[loc]}</p>
            </details>
          ))}
        </div>

        {glossaryTerms.length > 0 && (
          <>
            <h3 className="text-[13px] font-bold text-foreground mt-5 mb-2.5">
              {isRu ? 'Термины из этой статьи' : 'Terms from this page'}
            </h3>
            <div className="flex flex-wrap gap-[7px]">
              {glossaryTerms.map((t) => (
                <Link
                  key={t.slug}
                  href={`/${locale}/glossary/${t.slug}`}
                  className="rounded-full border border-[var(--popular-glass-line)] px-3 py-1.5 text-[11.5px] text-muted hover:text-accent hover:border-accent/40 transition-colors"
                >
                  {t.label[loc]}
                </Link>
              ))}
            </div>
          </>
        )}
      </section>

      <p className="text-[11px] text-muted leading-relaxed mt-4">
        {isRu
          ? 'Котировки, капитализация и объём — данные CoinGecko, обновляются несколько раз в час. Материал носит справочный характер и не является инвестиционной рекомендацией.'
          : 'Price, market cap and volume come from CoinGecko and refresh several times an hour. This page is reference material, not investment advice.'}
      </p>
    </div>
  );
}

function Stat({ k, v, s, sColor, vSmall }: { k: string; v: string; s?: string; sColor?: string; vSmall?: boolean }) {
  return (
    <div className="rounded-[14px] border border-[var(--popular-glass-line)] px-3 py-2.5 bg-[color-mix(in_srgb,var(--foreground)_3.5%,transparent)]">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.07em] text-muted">{k}</p>
      <p className={`${vSmall ? 'text-[14px]' : 'text-base'} font-extrabold mt-1 tabular-nums text-foreground`}>{v}</p>
      {s && <p className="text-[10.5px] mt-0.5" style={{ color: sColor ?? 'var(--muted)' }}>{s}</p>}
    </div>
  );
}

function compact(n: number, nf: string) {
  if (n >= 1e9) return `${(n / 1e9).toFixed(n / 1e9 >= 100 ? 0 : 1).replace('.', nf === 'ru-RU' ? ',' : '.')} ${nf === 'ru-RU' ? 'млрд' : 'B'}`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(n / 1e6 >= 100 ? 0 : 1).replace('.', nf === 'ru-RU' ? ',' : '.')} ${nf === 'ru-RU' ? 'млн' : 'M'}`;
  return n.toLocaleString(nf, { maximumFractionDigits: 0 });
}
