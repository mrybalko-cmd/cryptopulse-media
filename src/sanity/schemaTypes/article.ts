import { defineField, defineType } from 'sanity';
import { LockedSlugInput } from '../components/LockedSlugInput';
import { publishStatusDot } from '../lib/publishStatus';

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
      description: 'Short summary shown in article cards',
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
          description: 'Краткое описание изображения — для SEO и скринридеров. Пример: "Биткоин достигает ATH в 2026 году". Если пусто — используется заголовок статьи.',
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
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
    }),
    defineField({
      name: 'topic',
      title: 'Тема / Topic',
      type: 'string',
      description: 'Категория статьи для фильтрации в разделе Статьи',
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
        ],
        layout: 'radio',
      },
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
      name: 'updatedAt',
      title: 'Обновлено / Last Updated',
      type: 'datetime',
      description: 'Дата последнего существенного обновления материала. Попадает в dateModified JSON-LD — сигнал свежести для Google. Оставьте пустым, если материал не обновлялся.',
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
      name: 'likes',
      title: 'Likes',
      type: 'number',
      readOnly: true,
      initialValue: 0,
      description: 'Reader like counter, toggled from the like button on the article page',
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
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
              { title: 'Крупный текст / Large', value: 'large' },
              { title: 'Мелкий текст / Small', value: 'small' },
            ],
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
        { type: 'quoteBlock' },
        { type: 'youtubeEmbed' },
        { type: 'tweetEmbed' },
      ],
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
          description: 'Главное ключевое слово или фраза, под которую оптимизирован материал. Пример: "биткоин халвинг 2026". Используется только для редакционного контроля.',
        }),
        defineField({
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          description: 'Overrides the page title shown in search results. Falls back to the article title if empty. Optimal: 50–60 characters.',
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
          description: 'Secondary keywords. Not a direct ranking factor, but helps with internal categorisation.',
        }),
        defineField({
          name: 'ogImage',
          title: '📸 OG Image (соцсети) / Social Sharing Image',
          type: 'image',
          options: { hotspot: true },
          description: 'Картинка для предпросмотра в соцсетях и мессенджерах. Рекомендуемый размер: 1200×630 px. Если пусто — используется обложка статьи.',
        }),
        defineField({
          name: 'schemaType',
          title: '🏷️ Тип структурированных данных / Schema.org Type',
          type: 'string',
          description: 'Влияет на то, как Google отображает материал. NewsArticle — для актуальных новостных статей (попадает в Top Stories). BlogPosting — для аналитики и вечнозелёного контента. Article — нейтральный тип.',
          options: {
            list: [
              { title: 'BlogPosting — аналитика, обзоры, evergreen', value: 'BlogPosting' },
              { title: 'NewsArticle — новостные статьи (Top Stories, Google News)', value: 'NewsArticle' },
              { title: 'Article — нейтральный тип', value: 'Article' },
            ],
            layout: 'radio',
          },
          initialValue: 'BlogPosting',
        }),
        defineField({
          name: 'canonicalUrl',
          title: '🔗 Canonical URL (при синдикации)',
          type: 'url',
          description: 'Укажите, только если этот материал — перепечатка с другого ресурса, и вы хотите передать SEO-вес оригиналу. Обычно оставляйте пустым.',
        }),
        defineField({
          name: 'noIndex',
          title: '🚫 Скрыть из поисковиков / No-index',
          type: 'boolean',
          initialValue: false,
          description: 'Включите для рекламных материалов, черновиков или контента, который не должен индексироваться. По умолчанию — выключено (страница индексируется).',
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', language: 'language', media: 'coverImage', publishedAt: 'publishedAt', id: '_id' },
    prepare({ title, language, media, publishedAt, id }) {
      return { title: `${publishStatusDot(id, publishedAt)} ${title}`, subtitle: language?.toUpperCase(), media };
    },
  },
});
