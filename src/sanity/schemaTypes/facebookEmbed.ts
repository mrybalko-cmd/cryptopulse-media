import { defineField, defineType } from 'sanity';

export const facebookEmbedType = defineType({
  name: 'facebookEmbed',
  title: 'Пост Facebook',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Ссылка на пост Facebook',
      type: 'url',
      validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'authorName',
      title: 'Имя автора / страницы',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Текст поста (необязательно, для карточки)',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { text: 'text', authorName: 'authorName' },
    prepare({ text, authorName }: { text?: string; authorName?: string }) {
      const trimmed = text && text.length > 60 ? `${text.slice(0, 60)}…` : text;
      return { title: trimmed || 'Facebook post', subtitle: authorName || 'Facebook' };
    },
  },
});
