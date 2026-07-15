import { defineField, defineType } from 'sanity';

export const youtubeEmbedType = defineType({
  name: 'youtubeEmbed',
  title: 'YouTube-видео',
  type: 'object',
  fields: [
    defineField({
      name: 'url',
      title: 'Ссылка на видео YouTube',
      type: 'url',
      validation: Rule => Rule.required().uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'caption',
      title: 'Подпись (необязательно)',
      type: 'string',
    }),
  ],
  preview: {
    select: { url: 'url', caption: 'caption' },
    prepare({ url, caption }: { url?: string; caption?: string }) {
      return { title: caption || 'YouTube video', subtitle: url };
    },
  },
});
