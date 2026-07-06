export const revalidate = 300;

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import NewsLoadMore from '@/components/ui/NewsLoadMore';
import NewsTimelineRow, { TOPIC_META } from '@/components/ui/NewsTimelineRow';
import { fetchOwnNews } from '@/lib/news';
import type { UnifiedNewsItem } from '@/lib/news';
import Link from 'next/link';

const TZ = 'Europe/Prague';
const INITIAL = 30;

// ─── helpers ──────────────────────────────────────────────────────────────────

function toDayKey(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString('en-CA', { timeZone: TZ });
}

function dayLabel(dayISO: string, locale: string): string {
  const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: TZ });
  const yestKey = new Date(Date.now() - 86400000).toLocaleDateString('en-CA', { timeZone: TZ });
  if (dayISO === todayKey) return locale === 'ru' ? 'Сегодня' : 'Today';
  if (dayISO === yestKey) return locale === 'ru' ? 'Вчера' : 'Yesterday';
  const d = new Date(dayISO + 'T12:00:00');
  return d.toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
}

function groupByDay(items: UnifiedNewsItem[]): { day: string; label: string; items: UnifiedNewsItem[] }[] {
  const map = new Map<string, UnifiedNewsItem[]>();
  for (const item of items) {
    const key = toDayKey(item.publishedAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return [...map.entries()].map(([day, items]) => ({
    day,
    label: dayLabel(day, 'en'), // placeholder; actual label rendered per-locale below
    items,
  }));
}

// ─── metadata ─────────────────────────────────────────────────────────────────

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'news' });
  const title = t('title');
  const description = t('subtitle');
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/news`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/news`,
      languages: {
        ru: `${BASE}/ru/news`,
        en: `${BASE}/en/news`,
        'x-default': `${BASE}/en/news`,
      },
    },
  };
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('news');
  const isRu = locale === 'ru';

  const items = (await fetchOwnNews({ limit: INITIAL, locale })) ?? [];
  const groups = groupByDay(items);
  const lastDay = groups.length > 0 ? groups[groups.length - 1].day : undefined;

  // JSON-LD ItemList for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: t('title'),
    url: `${BASE}/${locale}/news`,
    itemListElement: items.slice(0, 20).map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE}${item.href}`,
      name: item.title,
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-muted text-sm mt-1">{t('subtitle')}</p>
      </div>

      {/* Topic filter pills */}
      <div className="flex flex-wrap gap-1.5 mb-8" role="navigation" aria-label={isRu ? 'Фильтр по теме' : 'Filter by topic'}>
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-accent text-background">
          {isRu ? 'Все' : 'All'}
        </span>
        {Object.entries(TOPIC_META).map(([key, meta]) => (
          <Link
            key={key}
            href={`/${locale}/news/topic/${key}`}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-border text-muted hover:border-accent/40 hover:text-foreground transition-colors`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dotCls}`} />
            {isRu ? meta.ru : meta.en}
          </Link>
        ))}
      </div>

      {/* Timeline */}
      {items.length > 0 ? (
        <>
          {groups.map(({ day, items: dayItems }) => (
            <section key={day} aria-label={dayLabel(day, locale)}>
              {/* Day separator */}
              <div className="flex items-center gap-3 mt-8 mb-2 first:mt-0">
                <h2 className="text-[11px] font-bold uppercase tracking-widest text-muted whitespace-nowrap" suppressHydrationWarning>
                  {dayLabel(day, locale)}
                </h2>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Rows */}
              <div>
                {dayItems.map(item => (
                  <NewsTimelineRow
                    key={item.id}
                    title={item.title}
                    href={item.href}
                    external={item.external}
                    publishedAt={item.publishedAt}
                    imageUrl={item.imageUrl}
                    topic={item.topic}
                    locale={locale}
                    pinned={item.pinned}
                    breaking={item.breaking}
                    ownBadge={item.ownBadge}
                  />
                ))}
              </div>
            </section>
          ))}

          <NewsLoadMore
            locale={locale}
            initialCount={items.length}
            pageSize={20}
            lastInitialDay={lastDay}
          />
        </>
      ) : (
        <div className="border border-dashed border-border rounded-lg py-20 flex items-center justify-center">
          <span className="text-sm text-muted">
            {isRu ? 'Новостей пока нет' : 'No news yet'}
          </span>
        </div>
      )}
    </div>
  );
}
