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
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input: string) =>
          input.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').slice(0, 96),
      },
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
      name: 'publishTiming',
      title: 'Publish timing / Время публикации',
      type: 'string',
      options: {
        list: [
          { title: 'Сейчас / Now', value: 'now' },
          { title: 'Запланировать / Scheduled', value: 'scheduled' },
        ],
        layout: 'radio',
      },
      initialValue: 'now',
      description: 'On first publish, "Now" stamps the actual moment you click Publish. "Scheduled" hides the material from the site until the date/time below.',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      hidden: ({ document }) => document?.publishTiming !== 'scheduled',
      validation: Rule =>
        Rule.custom((value, context) => {
          const doc = context.document as { publishTiming?: string } | undefined;
          if (doc?.publishTiming === 'scheduled' && !value) {
            return 'Set the scheduled date and time / Укажите дату и время публикации';
          }
          return true;
        }),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          marks: {
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  { name: 'href', type: 'url', title: 'URL', validation: Rule => Rule.required() },
                  {
                    name: 'rel',
                    type: 'string',
                    title: 'Link relationship',
                    description: 'Dofollow passes SEO value to the linked page; nofollow tells search engines not to.',
                    options: {
                      list: [
                        { title: 'Dofollow', value: 'dofollow' },
                        { title: 'Nofollow', value: 'nofollow' },
                      ],
                      layout: 'radio',
                    },
                    initialValue: 'dofollow',
                  },
                ],
              },
            ],
          },
        },
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
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Overrides the page title shown in search results. Falls back to the news title if empty.',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Shown in search results and social previews. Falls back to the excerpt if empty.',
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
        }),
      ],
    }),
    defineField({
      name: 'views',
      title: 'Views',
      type: 'number',
      readOnly: true,
      initialValue: 0,
      description: 'Internal view counter, increments automatically on each visit',
    }),
    defineField({
      name: 'breaking',
      title: '⚡ Молния / Breaking news',
      type: 'boolean',
      initialValue: false,
      description: 'Отметьте, если это срочная новость. На сайте рядом с заголовком появится бейдж «⚡ Молния». Снимите отметку, когда новость перестанет быть срочной.',
    }),
    defineField({
      name: 'pinnedUntil',
      title: 'Закрепить в топе до / Pinned until',
      type: 'datetime',
      description:
        'Новость будет показываться первой в списках новостей, пока не наступит это время. Чтобы закрепить на 6 часов — выставьте текущее время +6ч, на 24 часа — +24ч. Оставьте пустым, чтобы не закреплять.',
    }),
    defineField({
      name: 'author',
      title: 'Автор / Author',
      type: 'reference',
      to: [{ type: 'author' }],
      description: 'Оставьте пустым, чтобы опубликовать без подписи автора.',
    }),
    defineField({
      name: 'commentsEnabled',
      title: 'Comments enabled / Комментарии включены',
      type: 'boolean',
      initialValue: true,
      description: 'Show or hide the comment section under this news item on the site.',
    }),
    defineField({
      name: 'translationRef',
      title: 'Перевод на другом языке / Translation in the other language',
      type: 'reference',
      to: [{ type: 'news' }],
      description: 'Ссылка на эту же новость на другом языке — нужна, чтобы переключатель языка вёл на правильный перевод, а не на список новостей.',
    }),
  ],
  preview: {
    select: { title: 'title', language: 'language', media: 'coverImage' },
    prepare({ title, language, media }) {
      return { title, subtitle: language?.toUpperCase(), media };
    },
  },
});
