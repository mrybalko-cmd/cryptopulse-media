import { defineField, defineType } from 'sanity';

export const articleType = defineType({
  name: 'article',
  title: 'Article',
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
      description: 'Short summary shown in article cards',
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
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'string',
      description: 'Optional highlight shown on the article card and inside the article',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Выбор редакции / Editor\'s choice', value: 'editorsChoice' },
          { title: 'Актуально / Trending', value: 'trending' },
        ],
      },
      initialValue: 'none',
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
      name: 'commentsEnabled',
      title: 'Comments enabled / Комментарии включены',
      type: 'boolean',
      initialValue: true,
      description: 'Show or hide the comment section under this article on the site.',
    }),
    defineField({
      name: 'translationRef',
      title: 'Перевод на другом языке / Translation in the other language',
      type: 'reference',
      to: [{ type: 'article' }],
      description: 'Ссылка на эту же статью на другом языке — нужна, чтобы переключатель языка вёл на правильный перевод, а не на список статей.',
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
      name: 'seo',
      title: 'SEO',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Overrides the page title shown in search results. Falls back to the article title if empty.',
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
  ],
  preview: {
    select: { title: 'title', language: 'language', media: 'coverImage' },
    prepare({ title, language, media }) {
      return { title, subtitle: language?.toUpperCase(), media };
    },
  },
});
