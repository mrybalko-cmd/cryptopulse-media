import { defineField, defineType } from 'sanity';

export const tweetEmbedType = defineType({
  name: 'tweetEmbed',
  title: 'Твит / X post',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Ссылка на твит (X/Twitter)',
      type: 'url',
      validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'authorName',
      title: 'Имя автора',
      type: 'string',
    }),
    defineField({
      name: 'authorHandle',
      title: 'Хэндл (без @)',
      type: 'string',
    }),
    defineField({
      name: 'text',
      title: 'Текст твита (необязательно, для карточки)',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: { text: 'text', authorHandle: 'authorHandle' },
    prepare({ text, authorHandle }: { text?: string; authorHandle?: string }) {
      const trimmed = text && text.length > 60 ? `${text.slice(0, 60)}…` : text;
      return { title: trimmed || 'Tweet', subtitle: authorHandle ? `@${authorHandle}` : 'X / Twitter' };
    },
  },
});
