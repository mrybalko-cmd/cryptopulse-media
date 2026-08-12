import { defineField, defineType } from 'sanity';

/**
 * The last good quote for every coin we publish a page for.
 *
 * Written by /api/cron/coin-quotes and read whenever CoinGecko will not answer.
 * A build runs thirteen page workers in parallel and the free tier refuses part
 * of the burst, which left coin pages shipping with no logo, no price and no
 * stat tiles — and their own revalidation kept losing the same race. Sanity has
 * no such limit for us, so a page is never empty: it shows fresh numbers when
 * the upstream answers and the last known ones when it does not.
 */
export const coinQuotesType = defineType({
  name: 'coinQuotes',
  title: 'Coin Quotes (auto)',
  type: 'document',
  fields: [
    defineField({ name: 'updatedAt', title: 'Updated at', type: 'datetime', readOnly: true }),
    defineField({
      name: 'quotes',
      title: 'Quotes',
      type: 'array',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            { name: 'coinId', type: 'string', title: 'CoinGecko id' },
            { name: 'price', type: 'number' },
            { name: 'change24h', type: 'number' },
            { name: 'marketCap', type: 'number' },
            { name: 'volume24h', type: 'number' },
            { name: 'ath', type: 'number' },
            { name: 'athChangePct', type: 'number' },
            { name: 'circulating', type: 'number' },
            { name: 'maxSupply', type: 'number' },
            { name: 'logo', type: 'url' },
          ],
          preview: { select: { title: 'coinId', subtitle: 'price' } },
        },
      ],
    }),
  ],
  preview: {
    select: { updatedAt: 'updatedAt', quotes: 'quotes' },
    prepare({ updatedAt, quotes }) {
      return { title: `${quotes?.length ?? 0} coins`, subtitle: updatedAt };
    },
  },
});
