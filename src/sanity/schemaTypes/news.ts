import { defineField, defineType } from 'sanity';

export const newsType = defineType({
  name: 'news',
  title: 'News',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      options: { list: [{ title: 'Russian', value: 'ru' }, { title: 'English', value: 'en' }] },
      initialValue: 'ru',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown in news cards',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt text' }],
        },
      ],
    }),
    defineField({
      name: 'sourceName',
      title: 'Source Name (optional)',
      type: 'string',
      description: 'Attribution if this news item references an external source',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL (optional)',
      type: 'url',
      description: 'Link to the original external source, if applicable',
    }),
  ],
  preview: {
    select: { title: 'title', language: 'language', media: 'coverImage' },
    prepare({ title, language, media }) {
      return { title, subtitle: language?.toUpperCase(), media };
    },
  },
});
