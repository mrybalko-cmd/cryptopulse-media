import { defineField, defineType } from 'sanity';

export const quoteBlockType = defineType({
  name: 'quoteBlock',
  title: 'Цитата / Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Текст цитаты',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'quoteAuthor',
      title: 'Автор (необязательно)',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Источник (необязательно)',
      type: 'string',
      description: 'Например: интервью Bloomberg, 2026',
    }),
    defineField({
      name: 'style',
      title: 'Стиль',
      type: 'string',
      options: {
        list: [
          { title: 'Обычная', value: 'plain' },
          { title: 'Акцентная', value: 'accent' },
          { title: 'С автором', value: 'attributed' },
        ],
        layout: 'radio',
      },
      initialValue: 'plain',
    }),
  ],
  preview: {
    select: { text: 'text', quoteAuthor: 'quoteAuthor' },
    prepare({ text, quoteAuthor }: { text?: string; quoteAuthor?: string }) {
      const trimmed = text && text.length > 60 ? `${text.slice(0, 60)}…` : text;
      return {
        title: trimmed ? `“${trimmed}”` : 'Цитата',
        subtitle: quoteAuthor ? `— ${quoteAuthor}` : 'Quote',
      };
    },
  },
});
