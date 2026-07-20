import { defineField, defineType } from 'sanity';

export const sidebarBannerType = defineType({
  name: 'sidebarBanner',
  title: 'Sidebar Banner',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal name',
      type: 'string',
      description: 'For identifying this banner in Studio only — never shown on the site.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image (square, 1:1)',
      type: 'image',
      description: 'Use a square image, ideally at least 600×600px — it fills a square slot under the Popular block.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Alt text',
      type: 'string',
      description: 'Describes the banner for accessibility and search engines.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Destination link',
      type: 'url',
      description: 'Paste the full advertiser URL, including any UTM parameters, e.g. https://example.com?utm_source=cryptopulse&utm_medium=banner&utm_campaign=name',
      validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'language',
      title: 'Language / Язык показа',
      type: 'string',
      options: {
        list: [
          { title: 'Both languages / Оба языка', value: 'all' },
          { title: 'Russian only / Только RU', value: 'ru' },
          { title: 'English only / Только EN', value: 'en' },
        ],
        layout: 'radio',
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'weight',
      title: 'Rotation weight / Вес в ротации',
      type: 'number',
      initialValue: 1,
      validation: (Rule) => Rule.min(1).max(100),
      description: 'Higher weight = shown more often relative to other active banners. Leave at 1 so all banners rotate equally.',
    }),
    defineField({
      name: 'startAt',
      title: 'Show from / Показывать с',
      type: 'datetime',
      description: 'Leave empty to start showing immediately once Active is on.',
    }),
    defineField({
      name: 'endAt',
      title: 'Show until / Показывать до',
      type: 'datetime',
      description: 'Leave empty to keep showing indefinitely.',
    }),
    defineField({
      name: 'active',
      title: 'Active (shown in rotation)',
      type: 'boolean',
      initialValue: true,
      description: 'Up to 5 active banners rotate randomly on every page load, within their scheduled dates. Switch off to pull a banner without deleting it.',
    }),
    defineField({
      name: 'impressions',
      title: 'Impressions (auto-tracked)',
      type: 'number',
      initialValue: 0,
      readOnly: true,
      description: 'Counted only when the banner is actually visible on screen, not just rendered in the page.',
    }),
    defineField({
      name: 'clicks',
      title: 'Clicks (auto-tracked)',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
      active: 'active',
      impressions: 'impressions',
      clicks: 'clicks',
      language: 'language',
      weight: 'weight',
      startAt: 'startAt',
      endAt: 'endAt',
    },
    prepare({ title, media, active, impressions, clicks, language, weight, startAt, endAt }) {
      const imp = impressions || 0;
      const clk = clicks || 0;
      const ctr = imp > 0 ? ((clk / imp) * 100).toFixed(2) : '0.00';
      const lang = language && language !== 'all' ? language.toUpperCase() : 'RU+EN';
      const now = new Date();
      const scheduled = (startAt && new Date(startAt) > now) || (endAt && new Date(endAt) < now);
      return {
        title: `${active ? (scheduled ? '🟡' : '🟢') : '⚪'} ${title}`,
        subtitle: `👁 ${imp} · 🖱 ${clk} · CTR ${ctr}% · ${lang} · вес ${weight || 1}`,
        media,
      };
    },
  },
});
