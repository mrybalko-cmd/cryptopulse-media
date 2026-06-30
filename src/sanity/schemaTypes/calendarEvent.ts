import { defineField, defineType } from 'sanity';

export const calendarEventType = defineType({
  name: 'calendarEvent',
  title: 'Calendar Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'object',
      fields: [
        { name: 'ru', title: 'Russian', type: 'string', validation: (Rule) => Rule.required() },
        { name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() },
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Slug (for the share link anchor)',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description (optional)',
      type: 'object',
      fields: [
        { name: 'ru', title: 'Russian', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Отчётность / Reports', value: 'report' },
          { title: 'Разлоки / Token Unlocks', value: 'unlock' },
          { title: 'Токенсейлы / Token Sales', value: 'sale' },
          { title: 'Листинги / Listings', value: 'listing' },
          { title: 'Хардфорки и обновления / Forks & Upgrades', value: 'fork' },
          { title: 'Конференции / Conferences', value: 'conference' },
          { title: 'Регулирование / Regulation', value: 'regulation' },
          { title: 'Другое / Other', value: 'other' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'importance',
      title: 'Importance',
      type: 'string',
      options: {
        list: [
          { title: 'Низкая / Low', value: 'low' },
          { title: 'Средняя / Medium', value: 'medium' },
          { title: 'Высокая / High', value: 'high' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Custom icon (optional)',
      type: 'image',
      description: 'Overrides the default category emoji — e.g. a project logo or country flag, like in the reference screenshot.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL (optional)',
      type: 'url',
    }),
    defineField({
      name: 'likes',
      title: 'Likes',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }),
    defineField({
      name: 'dislikes',
      title: 'Dislikes',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }),
  ],
  preview: {
    select: { title: 'title.ru', date: 'date', category: 'category' },
    prepare({ title, date, category }) {
      return { title, subtitle: `${date} · ${category}` };
    },
  },
});
