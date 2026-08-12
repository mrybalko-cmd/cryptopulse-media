'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, LayoutGrid, List, Search, TrendingDown, TrendingUp } from 'lucide-react';
import Sparkline from './Sparkline';
import { SECTOR_META, SECTOR_ORDER, type AssetSector } from '@/lib/coins';

/** Everything the listing needs, already localized and thinned server-side. */
export interface AssetRow {
  slug: string;
  name: string;
  symbol: string;
  tagline: string;
  year: number;
  sector: AssetSector;
  available: boolean;
  logo?: string;
  rank?: number;
  price?: number;
  ch24?: number;
  ch7d?: number;
  mcap?: number;
  volume?: number;
  spark?: number[];
}

type SortKey = 'mcap' | 'ch24' | 'ch7d' | 'price' | 'name';
type View = 'cards' | 'table';

function formatMoney(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString('en-US')}`;
}

function formatPrice(n: number): string {
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
  if (n >= 1) return `$${n.toFixed(2)}`;
  if (n >= 0.01) return `$${n.toFixed(4)}`;
  return `$${n.toFixed(6)}`;
}

function formatPct(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(1)}%`;
}

function CoinLogo({ asset, size }: { asset: AssetRow; size: number }) {
  if (asset.logo) {
    return (
      <Image
        src={asset.logo}
        alt="" aria-hidden="true"
        width={size}
        height={size}
        className="rounded-full shrink-0"
        style={{ width: size, height: size }}
        unoptimized
      />
    );
  }
  // Fallback to the text glyph if CoinGecko is unreachable.
  return (
    <span
      className="shrink-0 rounded-full bg-accent/10 text-accent font-bold flex items-center justify-center"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      aria-hidden
    >
      {asset.symbol.slice(0, 1)}
    </span>
  );
}

function SectorChip({ sector, locale }: { sector: AssetSector; locale: 'ru' | 'en' }) {
  const meta = SECTOR_META[sector];
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ color: meta.color, background: `${meta.color}20` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: meta.color }} />
      {meta.label[locale]}
    </span>
  );
}

function ChangeChip({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11.5px] font-bold tabular-nums px-1.5 py-0.5 rounded-md ${
        up ? 'text-positive bg-positive/10' : 'text-negative bg-negative/10'
      }`}
    >
      {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
      {formatPct(value)}
    </span>
  );
}

/** The three biggest assets, given room to breathe above the full catalogue. */
function SpotlightCard({ asset, locale }: { asset: AssetRow; locale: 'ru' | 'en' }) {
  const isRu = locale === 'ru';
  return (
    <Link
      href={`/${locale}/assets/${asset.slug}`}
      className="group relative flex flex-col flex-1 min-w-0 overflow-hidden bg-card border border-border rounded-2xl px-[18px] pt-[18px] transition-all hover:border-accent/45 hover:-translate-y-0.5 hover:shadow-xl"
    >
      <span className="absolute top-4 right-4 w-7 h-7 rounded-[9px] border border-border flex items-center justify-center text-muted opacity-0 transition-all group-hover:opacity-100 group-hover:text-accent group-hover:border-accent/45">
        <ArrowRight size={13} />
      </span>

      <div className="flex items-center gap-3 mb-4">
        <CoinLogo asset={asset} size={38} />
        <div className="min-w-0">
          <p className="text-[15px] font-extrabold text-foreground leading-tight truncate">{asset.name}</p>
          <p className="text-[11px] text-muted font-semibold mt-0.5">
            {asset.symbol} · {isRu ? 'с' : 'since'} {asset.year}
          </p>
        </div>
      </div>

      {asset.price !== undefined && (
        <p className="text-3xl font-extrabold text-foreground tracking-tight tabular-nums leading-none">
          {formatPrice(asset.price)}
        </p>
      )}
      {/* Wraps as whole phrases: three items no longer fit on one line on a
          narrow phone, and without nowrap they broke mid-phrase — "$1.29T
          капита-/лизация" across two lines in a card 289px wide. */}
      <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1.5 mt-2.5">
        {asset.ch24 !== undefined && <ChangeChip value={asset.ch24} />}
        {asset.mcap !== undefined && (
          <span className="text-[11px] text-muted tabular-nums whitespace-nowrap">
            {formatMoney(asset.mcap)} {isRu ? 'капитализация' : 'cap'}
          </span>
        )}
        {/* The rank sits beside the market cap rather than in the top corner:
            the two say the same thing in different units, and the corner is
            the arrow's — they used to overlap on hover. "worldwide" is not
            decoration; without it a bare #96 reads as 96th on this page. */}
        {asset.rank && (
          <span className="text-[11px] text-muted tabular-nums whitespace-nowrap border-l border-border pl-2.5">
            #{asset.rank} {isRu ? 'в мире' : 'worldwide'}
          </span>
        )}
      </div>

      <p className="text-xs text-muted leading-relaxed mt-3.5 line-clamp-2">{asset.tagline}</p>

      {asset.spark && (
        <div className="-mx-[18px] mt-3.5">
          <Sparkline points={asset.spark} positive={(asset.ch7d ?? 0) >= 0} height={64} showDot />
        </div>
      )}
    </Link>
  );
}

function AssetCard({ asset, locale }: { asset: AssetRow; locale: 'ru' | 'en' }) {
  const isRu = locale === 'ru';

  const body = (
    <>
      <div className="flex items-center gap-2.5">
        <CoinLogo asset={asset} size={28} />
        <div className="min-w-0">
          <p className="text-[13.5px] font-extrabold text-foreground leading-tight truncate">{asset.name}</p>
          <p className="text-[10.5px] text-muted font-semibold mt-px tabular-nums">
            {asset.symbol}{asset.rank ? ` · #${asset.rank}` : ''}
          </p>
        </div>
        {asset.price !== undefined && (
          <div className="ml-auto text-right shrink-0">
            <p className="text-sm font-extrabold text-foreground tabular-nums tracking-tight">{formatPrice(asset.price)}</p>
            {asset.ch24 !== undefined && (
              <p className={`text-[11px] font-bold tabular-nums mt-px ${asset.ch24 >= 0 ? 'text-positive' : 'text-negative'}`}>
                {formatPct(asset.ch24)}
              </p>
            )}
          </div>
        )}
      </div>

      {asset.spark && (
        <div className="-mx-[15px] mt-2.5">
          <Sparkline points={asset.spark} positive={(asset.ch7d ?? 0) >= 0} height={34} />
        </div>
      )}

      <p className="text-[11.5px] text-muted leading-snug mt-2.5 line-clamp-2 min-h-8 hidden sm:block">{asset.tagline}</p>

      <div className="flex items-center justify-between gap-2 mt-2.5 pt-2.5 border-t border-border/60">
        <SectorChip sector={asset.sector} locale={locale} />
        {asset.available ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-accent">
            {isRu ? 'Читать гид' : 'Read guide'}
            <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        ) : (
          <span className="text-[11px] text-muted">{isRu ? 'Скоро' : 'Soon'}</span>
        )}
      </div>
    </>
  );

  const shell = 'group relative flex flex-col overflow-hidden bg-card border border-border rounded-[15px] px-[15px] pt-3.5 pb-3';

  return asset.available ? (
    <Link
      href={`/${locale}/assets/${asset.slug}`}
      className={`${shell} transition-all hover:border-accent/40 hover:-translate-y-0.5 hover:shadow-lg`}
    >
      {body}
    </Link>
  ) : (
    <div className={`${shell} opacity-50`}>{body}</div>
  );
}

function AssetTable({ assets, locale }: { assets: AssetRow[]; locale: 'ru' | 'en' }) {
  const isRu = locale === 'ru';
  const th = 'text-[10px] font-extrabold uppercase tracking-wider text-muted px-3 py-2.5 border-b border-border whitespace-nowrap';
  const td = 'px-3 py-2.5 border-b border-border/50 text-[12.5px] text-foreground whitespace-nowrap tabular-nums';

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {/* Not "#": the figure is CoinGecko's global market-cap rank, so
                the gaps in it are coins we do not cover. A bare hash invited
                the reading "Nth on this page", which it never was. */}
            <th className={`${th} text-left`}>{isRu ? 'В мире' : 'Worldwide'}</th>
            <th className={`${th} text-left`}>{isRu ? 'Актив' : 'Asset'}</th>
            <th className={`${th} text-right`}>{isRu ? 'Цена' : 'Price'}</th>
            <th className={`${th} text-right`}>24{isRu ? 'ч' : 'h'}</th>
            <th className={`${th} text-right`}>7{isRu ? 'д' : 'd'}</th>
            <th className={`${th} text-right`}>{isRu ? 'Капитализация' : 'Market cap'}</th>
            <th className={`${th} text-right hidden md:table-cell`}>{isRu ? '7 дней' : '7-day'}</th>
            <th className={th} />
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.slug} className="hover:bg-card-hover transition-colors">
              <td className={`${td} text-left text-muted text-[11px]`}>{asset.rank ? `#${asset.rank}` : '—'}</td>
              <td className={`${td} text-left`}>
                <Link href={`/${locale}/assets/${asset.slug}`} className="flex items-center gap-2.5 min-w-0">
                  <CoinLogo asset={asset} size={24} />
                  <span className="min-w-0">
                    <span className="font-extrabold">{asset.name}</span>{' '}
                    <span className="text-[10.5px] text-muted font-semibold">{asset.symbol}</span>
                    <span className="block text-[10.5px] text-muted font-normal max-w-[230px] truncate">{asset.tagline}</span>
                  </span>
                </Link>
              </td>
              <td className={`${td} text-right font-extrabold`}>
                {asset.price !== undefined ? formatPrice(asset.price) : '—'}
              </td>
              <td className={`${td} text-right ${(asset.ch24 ?? 0) >= 0 ? 'text-positive' : 'text-negative'}`}>
                {asset.ch24 !== undefined ? formatPct(asset.ch24) : '—'}
              </td>
              <td className={`${td} text-right ${(asset.ch7d ?? 0) >= 0 ? 'text-positive' : 'text-negative'}`}>
                {asset.ch7d !== undefined ? formatPct(asset.ch7d) : '—'}
              </td>
              <td className={`${td} text-right`}>{asset.mcap !== undefined ? formatMoney(asset.mcap) : '—'}</td>
              <td className={`${td} text-right hidden md:table-cell w-[110px]`}>
                {asset.spark && <Sparkline points={asset.spark} positive={(asset.ch7d ?? 0) >= 0} height={26} />}
              </td>
              <td className={`${td} text-right`}>
                <Link href={`/${locale}/assets/${asset.slug}`} className="text-[11px] font-bold text-accent hover:underline">
                  {isRu ? 'Гид →' : 'Guide →'}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Why the numbering skips.
 *
 * Shown under both views, because both carry the rank. Readers counted the
 * gaps and concluded the list was broken — it is not, the figure was simply
 * never about this page.
 */
function RankNote({ locale }: { locale: 'ru' | 'en' }) {
  return (
    <p className="text-[11px] text-muted leading-relaxed mt-3 max-w-[68ch]">
      {locale === 'ru'
        ? 'Место — позиция монеты по капитализации среди всех криптовалют мира, а не в этом списке. Пропуски в нумерации — это стейблкоины и обёрточные токены, страницы по которым мы не ведём.'
        : 'The rank is a coin’s place by market cap among all cryptocurrencies worldwide, not within this list. The gaps are stablecoins and wrapped tokens, which we do not cover.'}
    </p>
  );
}

export default function AssetsExplorer({ assets, locale }: { assets: AssetRow[]; locale: string }) {
  const isRu = locale === 'ru';
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';

  const [query, setQuery] = useState('');
  const [sector, setSector] = useState<AssetSector | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('mcap');
  // Table first: it fits more assets per screen and the numbers line up.
  const [view, setView] = useState<View>('table');

  const sectorCounts = useMemo(() => {
    const counts = {} as Record<AssetSector, number>;
    for (const a of assets) counts[a.sector] = (counts[a.sector] || 0) + 1;
    return counts;
  }, [assets]);

  const market = useMemo(() => {
    const withCap = assets.filter((a) => a.mcap);
    if (!withCap.length) return null;
    const totalCap = withCap.reduce((s, a) => s + (a.mcap || 0), 0);
    const totalVolume = assets.reduce((s, a) => s + (a.volume || 0), 0);
    // Cap-weighted, so Bitcoin moving 1% outweighs a small-cap moving 8%.
    const weighted = withCap.reduce((s, a) => s + (a.ch24 || 0) * (a.mcap || 0), 0) / totalCap;
    const ranked = assets.filter((a) => a.ch24 !== undefined).sort((a, b) => (b.ch24 || 0) - (a.ch24 || 0));
    return { totalCap, totalVolume, weighted, top: ranked[0], bottom: ranked[ranked.length - 1] };
  }, [assets]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = assets.filter((a) => {
      if (sector !== 'all' && a.sector !== sector) return false;
      if (!q) return true;
      return `${a.name} ${a.symbol} ${a.tagline} ${SECTOR_META[a.sector].label[loc]}`.toLowerCase().includes(q);
    });

    const sorters: Record<SortKey, (a: AssetRow, b: AssetRow) => number> = {
      mcap: (a, b) => (b.mcap || 0) - (a.mcap || 0),
      ch24: (a, b) => (b.ch24 ?? -Infinity) - (a.ch24 ?? -Infinity),
      ch7d: (a, b) => (b.ch7d ?? -Infinity) - (a.ch7d ?? -Infinity),
      price: (a, b) => (b.price || 0) - (a.price || 0),
      name: (a, b) => a.name.localeCompare(b.name),
    };
    return [...filtered].sort(sorters[sort]);
  }, [assets, sector, query, sort, loc]);

  const spotlight = assets.filter((a) => a.mcap).slice(0, 3);
  const showSpotlight = !query.trim() && sector === 'all' && spotlight.length === 3;

  const pill = 'shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors whitespace-nowrap';

  return (
    <div>
      {/* Market summary — the numbers a reader wants before any single asset */}
      {market && (
        <div className="flex items-stretch overflow-x-auto scrollbar-none border-y border-border -mx-4 sm:mx-0 mb-1">
          <div className="flex items-baseline gap-2 px-4 sm:px-5 py-2.5 border-r border-border whitespace-nowrap">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted">
              {isRu ? 'Капитализация' : 'Tracked market cap'}
            </span>
            <span className="text-[13px] font-extrabold text-foreground tabular-nums">{formatMoney(market.totalCap)}</span>
            <span className={`text-[11px] font-bold tabular-nums ${market.weighted >= 0 ? 'text-positive' : 'text-negative'}`}>
              {formatPct(market.weighted)}
            </span>
          </div>
          <div className="flex items-baseline gap-2 px-4 sm:px-5 py-2.5 border-r border-border whitespace-nowrap">
            <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted">
              {isRu ? 'Объём 24ч' : '24h volume'}
            </span>
            <span className="text-[13px] font-extrabold text-foreground tabular-nums">{formatMoney(market.totalVolume)}</span>
          </div>
          {[
            { asset: market.top, label: isRu ? 'Лидер роста' : 'Top gainer' },
            { asset: market.bottom, label: isRu ? 'Лидер падения' : 'Top loser' },
          ].map(({ asset, label }) =>
            asset ? (
              <div key={label} className="flex items-center gap-2 px-4 sm:px-5 py-2.5 border-r border-border whitespace-nowrap">
                <span className="text-[9.5px] font-bold uppercase tracking-wider text-muted">{label}</span>
                <CoinLogo asset={asset} size={15} />
                <span className="text-[13px] font-extrabold text-foreground">{asset.symbol}</span>
                <span className={`text-[11px] font-bold tabular-nums ${(asset.ch24 || 0) >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {formatPct(asset.ch24 || 0)}
                </span>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Search, sort, view */}
      {/* Sticks flush to the header: --header-h is the header's measured
          height, so no strip of scrolling table shows between the two. */}
      <div className="flex items-center gap-2.5 flex-wrap py-3 border-b border-border sticky top-[var(--header-h)] bg-background z-10">
        <label className="flex-1 min-w-[230px] flex items-center gap-2.5 border border-border bg-card rounded-[11px] px-3.5 py-2.5">
          <Search size={15} className="text-muted shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isRu
                ? `Поиск по ${assets.length} активам — Bitcoin, ETH, мем…`
                : `Search ${assets.length} assets — Bitcoin, ETH, meme…`
            }
            aria-label={isRu ? 'Поиск по криптоактивам' : 'Search crypto assets'}
            className="w-full bg-transparent border-0 outline-none text-[13px] text-foreground placeholder:text-muted"
          />
        </label>

        <label className="flex items-center gap-2 border border-border bg-card rounded-[11px] px-3 py-2.5 cursor-pointer">
          <span className="text-[10px] font-bold uppercase tracking-wide text-muted">{isRu ? 'Сортировка' : 'Sort'}</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label={isRu ? 'Сортировка активов' : 'Sort assets'}
            className="bg-transparent border-0 outline-none text-[12.5px] font-bold text-foreground cursor-pointer"
          >
            <option value="mcap">{isRu ? 'Капитализация' : 'Market cap'}</option>
            <option value="ch24">{isRu ? 'Рост за 24ч' : '24h change'}</option>
            <option value="ch7d">{isRu ? 'Рост за 7д' : '7d change'}</option>
            <option value="price">{isRu ? 'Цена' : 'Price'}</option>
            <option value="name">{isRu ? 'Название А-Я' : 'Name A-Z'}</option>
          </select>
        </label>

        <div className="flex border border-border rounded-[11px] overflow-hidden bg-card">
          {([
            { key: 'cards' as View, icon: LayoutGrid, label: isRu ? 'Карточки' : 'Cards' },
            { key: 'table' as View, icon: List, label: isRu ? 'Таблица' : 'Table' },
          ]).map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[11.5px] font-bold transition-colors ${
                view === key ? 'bg-accent/15 text-accent' : 'text-muted hover:text-foreground'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sector filters */}
      <div className="flex gap-1.5 flex-wrap py-3.5 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setSector('all')}
          aria-pressed={sector === 'all'}
          className={`${pill} ${sector === 'all' ? 'border-accent/55 bg-accent/10 text-foreground' : 'border-border text-muted hover:text-foreground'}`}
        >
          <span className="w-[7px] h-[7px] rounded-full bg-accent" />
          {isRu ? 'Все' : 'All'}
          <span className="text-[10px] text-muted tabular-nums">{assets.length}</span>
        </button>
        {SECTOR_ORDER.filter((s) => sectorCounts[s]).map((s) => {
          const meta = SECTOR_META[s];
          const active = sector === s;
          return (
            <button
              key={s}
              onClick={() => setSector(s)}
              aria-pressed={active}
              style={active ? { borderColor: `${meta.color}8c`, background: `${meta.color}1c` } : undefined}
              className={`${pill} ${active ? 'text-foreground' : 'border-border text-muted hover:text-foreground'}`}
            >
              <span className="w-[7px] h-[7px] rounded-full" style={{ background: meta.color }} />
              {meta.label[loc]}
              <span className="text-[10px] text-muted tabular-nums">{sectorCounts[s]}</span>
            </button>
          );
        })}
      </div>

      {showSpotlight && (
        <section className="mt-5">
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <h2 className="text-[12.5px] font-extrabold uppercase tracking-wider text-foreground">
              {isRu ? 'Крупнейшие по капитализации' : 'Top assets by market cap'}
            </h2>
            <span className="text-[11px] text-muted hidden sm:block">
              {isRu ? 'график — цена за 7 дней' : '7-day price · click any card to open its guide'}
            </span>
          </div>
          {/* Swipeable on phones — three full-height cards stacked would push
              the actual catalogue below two screens of scrolling. */}
          <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 sm:overflow-visible">
            {spotlight.map((asset) => (
              <div key={asset.slug} className="snap-start shrink-0 w-[74vw] max-w-[300px] sm:w-auto sm:max-w-none flex">
                <SpotlightCard asset={asset} locale={loc} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-7">
        <div className="flex items-baseline justify-between gap-3 mb-3">
          <h2 className="text-[12.5px] font-extrabold uppercase tracking-wider text-foreground">
            {isRu ? 'Все гиды по активам' : 'All asset guides'}
          </h2>
          <span className="text-[11px] text-muted tabular-nums text-right">
            <span className="hidden md:inline">
              {isRu ? 'график — 7 дней · цены каждые 15 минут · ' : 'sparkline = 7 days · prices refresh every 15 minutes · '}
            </span>
            {visible.length} {isRu ? 'из' : 'of'} {assets.length}
          </span>
        </div>

        {visible.length === 0 ? (
          <p className="text-sm text-muted py-6">
            {isRu
              ? `По запросу «${query}» ничего не нашлось. Попробуйте тикер — например, BTC.`
              : `Nothing matches “${query}”. Try a ticker like BTC instead.`}
          </p>
        ) : view === 'table' ? (
          <>
            <AssetTable assets={visible} locale={loc} />
            <RankNote locale={loc} />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {visible.map((asset) => (
                <AssetCard key={asset.slug} asset={asset} locale={loc} />
              ))}
            </div>
            <RankNote locale={loc} />
          </>
        )}
      </section>
    </div>
  );
}
