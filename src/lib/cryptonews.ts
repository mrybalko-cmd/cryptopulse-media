import Parser from 'rss-parser';
import { unstable_cache } from 'next/cache';

const parser = new Parser({
  customFields: {
    item: ['media:content', 'enclosure'],
  },
});

const RSS_FEEDS_EN = [
  { url: 'https://decrypt.co/feed', source: 'Decrypt' },
  { url: 'https://www.theblock.co/rss.xml', source: 'The Block' },
  { url: 'https://cointelegraph.com/rss', source: 'CoinTelegraph' },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', source: 'CoinDesk' },
];

const RSS_FEEDS_RU = [
  { url: 'https://forklog.com/feed', source: 'ForkLog' },
  { url: 'https://ru.beincrypto.com/feed/', source: 'BeInCrypto' },
  { url: 'https://incrypted.com/feed/', source: 'INCRYPTED' },
];

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: number;
  imageUrl?: string;
  categories?: string;
}

const FEED_TIMEOUT_MS = 6000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('feed timeout')), ms)),
  ]);
}

async function fetchFeed(feedUrl: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const feed = await withTimeout(parser.parseURL(feedUrl), FEED_TIMEOUT_MS);
    return feed.items.slice(0, 15).map(item => ({
      id: item.guid || item.link || Math.random().toString(),
      title: item.title || '',
      url: item.link || '',
      source: sourceName,
      publishedAt: item.pubDate ? Math.floor(new Date(item.pubDate).getTime() / 1000) : Date.now() / 1000,
      imageUrl: (item as any)['media:content']?.$.url || item.enclosure?.url,
      categories: item.categories?.join('|'),
    }));
  } catch {
    return [];
  }
}

export const fetchNews = unstable_cache(
  async ({ limit = 20, locale = 'ru' }: { limit?: number; locale?: string } = {}): Promise<NewsItem[]> => {
    const feeds = locale === 'ru' ? RSS_FEEDS_RU : RSS_FEEDS_EN;
    const results = await Promise.allSettled(
      feeds.map(feed => fetchFeed(feed.url, feed.source))
    );

    const all: NewsItem[] = results
      .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === 'fulfilled')
      .flatMap(r => r.value)
      .sort((a, b) => b.publishedAt - a.publishedAt)
      .slice(0, limit);

    return all;
  },
  ['fetchNews'],
  { revalidate: 300 }
);
