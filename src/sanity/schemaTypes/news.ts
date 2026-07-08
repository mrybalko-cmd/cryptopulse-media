import { defineField, defineType } from 'sanity';
import { LockedSlugInput } from '../components/LockedSlugInput';

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
        slugify: (input: string) => {
          const RU: Record<string, string> = {
            а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',
            н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'sch',
            ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
          };
          return input
            .trim()
            .toLowerCase()
            .replace(/[а-яёА-ЯЁ]/g, c => RU[c] ?? c)
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/-{2,}/g, '-')
            .replace(/^-+|-+$/g, '')
            .slice(0, 96);
        },
      },
      validation: Rule => Rule.required(),
      components: { input: LockedSlugInput },
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
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text (SEO & accessibility)',
          type: 'string',
          description: 'Краткое описание изображения — для SEO и скринридеров. Если пусто — используется заголовок новости.',
        }),
      ],
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
          name: 'focusKeyphrase',
          title: '🎯 Фокусный запрос / Focus Keyphrase',
          type: 'string',
          description: 'Главное ключевое слово или фраза для этой новости. Пример: "SEC регулирование крипто 2026".',
        }),
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Overrides the page title shown in search results. Falls back to the news title if empty. Optimal: 50–60 characters.',
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Shown in search results and social previews. Falls back to the excerpt if empty. Optimal: 120–155 characters.',
        }),
        defineField({
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{ type: 'string' }],
          options: { layout: 'tags' },
          description: 'Secondary keywords for internal categorisation.',
        }),
        defineField({
          name: 'ogImage',
          title: '📸 OG Image (соцсети) / Social Sharing Image',
          type: 'image',
          options: { hotspot: true },
          description: 'Картинка для предпросмотра в соцсетях. Рекомендуемый размер: 1200×630 px. Если пусто — используется обложка новости.',
        }),
        defineField({
          name: 'canonicalUrl',
          title: '🔗 Canonical URL (при синдикации)',
          type: 'url',
          description: 'Укажите, если новость — перепечатка с другого ресурса. Обычно оставляйте пустым.',
        }),
        defineField({
          name: 'noIndex',
          title: '🚫 Скрыть из поисковиков / No-index',
          type: 'boolean',
          initialValue: false,
          description: 'Включите для пресс-релизов и рекламных материалов, которые не должны индексироваться.',
        }),
      ],
    }),
    defineField({
      name: 'updatedAt',
      title: 'Обновлено / Last Updated',
      type: 'datetime',
      description: 'Дата последнего существенного обновления новости. Попадает в dateModified JSON-LD. Оставьте пустым, если новость не редактировалась.',
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
      name: 'topic',
      title: 'Тема / Topic',
      type: 'string',
      description: 'Категория новости для фильтрации в разделе Новости',
      options: {
        list: [
          { title: 'Регулирование / Regulation', value: 'regulation' },
          { title: 'DeFi & Web3', value: 'defi' },
          { title: 'Bitcoin', value: 'bitcoin' },
          { title: 'Рынок / Market', value: 'market' },
          { title: 'Технологии / Technology', value: 'technology' },
          { title: 'Безопасность / Security', value: 'security' },
          { title: 'Обучение / Education', value: 'education' },
          { title: 'AI & Машинное обучение / AI & ML', value: 'ai' },
          { title: 'Пресс-релиз / Press Release', value: 'press-release' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'ownBadge',
      title: '⚡ Значок «Наш материал» / Own story badge',
      type: 'boolean',
      initialValue: true,
      description: 'Показывать молнию «Наш материал» в ленте новостей. По умолчанию включено для всех наших публикаций.',
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
