import { defineField, defineType } from 'sanity';
import { LockedSlugInput } from '../components/LockedSlugInput';

const RU_SLUGIFY: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',
  н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'sch',
  ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
};
function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[а-яёА-ЯЁ]/g, c => RU_SLUGIFY[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

// One document per exchange (not one-per-language like article/news) — the
// logo, products, badges, regions and ranking are the same regardless of
// language, only the text needs a translation. Duplicating a full document
// per language here would mean re-uploading the same logo/product photos
// twice and keeping two pin/volume states in sync for no benefit.
const descriptionBlock = {
  type: 'array' as const,
  of: [
    {
      type: 'block',
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [{ name: 'href', type: 'url', title: 'URL', validation: (Rule: any) => Rule.required() }],
          },
        ],
      },
    },
  ],
};

export const exchangeType = defineType({
  name: 'exchange',
  title: 'Криптобиржа / Exchange',
  type: 'document',
  groups: [
    { name: 'main', title: 'Основное' },
    { name: 'content', title: 'Описание и продукты' },
    { name: 'trust', title: 'Плашки и регионы' },
    { name: 'ranking', title: 'Рейтинг и закрепление' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'name', title: 'Название', type: 'string', group: 'main', validation: Rule => Rule.required() }),
    defineField({
      name: 'logo',
      title: 'Логотип',
      type: 'image',
      group: 'main',
      description: 'SVG/PNG с прозрачным фоном, рекомендуется минимум 256×256.',
    }),
    defineField({
      name: 'logoBg',
      title: 'Цвет подложки логотипа',
      type: 'string',
      group: 'main',
      description: 'HEX-цвет (например #F0B90B), используется как фон под логотипом с прозрачными краями и как фон буквенной заглушки, пока логотип не загружен.',
      initialValue: '#3b82f6',
    }),
    defineField({
      name: 'slugRu',
      title: 'Slug (RU)',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 96, slugify },
      validation: Rule => Rule.required(),
      components: { input: LockedSlugInput },
    }),
    defineField({
      name: 'slugEn',
      title: 'Slug (EN)',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 96, slugify },
      validation: Rule => Rule.required(),
      components: { input: LockedSlugInput },
    }),
    defineField({
      name: 'foundedYear', title: 'Год основания', type: 'number', group: 'main',
    }),
    defineField({
      name: 'website', title: 'Сайт биржи', type: 'url', group: 'main', validation: Rule => Rule.required(),
      description: 'Официальный сайт — используется для JSON-LD и для автоматического поиска материалов, ссылающихся на биржу. Не редактируйте это поле ради UTM-меток, для этого ниже есть отдельные поля.',
    }),
    defineField({
      name: 'linkLabel',
      title: 'Текст ссылки на странице (необязательно)',
      type: 'string',
      group: 'main',
      description: 'То, что видно на странице, например "binance.com". Если не заполнено — показывается домен из поля «Сайт биржи» выше.',
    }),
    defineField({
      name: 'trackingUrl',
      title: 'Ссылка с UTM-метками (необязательно)',
      type: 'url',
      group: 'main',
      description: 'Куда реально ведёт клик — используется в тексте-ссылке и в кнопке «Торговать». Показанный текст ссылки при этом не меняется, UTM-метки видны только в адресной строке после перехода.',
    }),
    defineField({
      name: 'coingeckoId',
      title: 'CoinGecko exchange ID',
      type: 'string',
      group: 'main',
      description: 'ID биржи в справочнике CoinGecko (например "binance") — используется только для автоматического обновления объёма торгов раз в сутки.',
    }),
    defineField({
      name: 'type',
      title: 'Тип',
      type: 'array',
      group: 'main',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'CEX', value: 'CEX' },
          { title: 'DEX', value: 'DEX' },
          { title: 'P2P', value: 'P2P' },
        ],
        layout: 'grid',
      },
      validation: Rule => Rule.required().min(1),
    }),
    defineField({ name: 'taglineRu', title: 'Краткое описание, RU', type: 'string', group: 'main' }),
    defineField({ name: 'taglineEn', title: 'Краткое описание, EN', type: 'string', group: 'main' }),

    defineField({ name: 'descriptionRu', title: 'Описание («Обзор»), RU', group: 'content', ...descriptionBlock }),
    defineField({ name: 'descriptionEn', title: 'Описание («Обзор»), EN', group: 'content', ...descriptionBlock }),
    defineField({
      name: 'products',
      title: 'Продукты',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'exchangeProduct',
          fields: [
            defineField({
              name: 'image',
              title: 'Картинка продукта',
              type: 'image',
              options: { hotspot: true },
              validation: Rule => Rule.required(),
              description: 'Широкий прямоугольный кадр, например 1600×800 (соотношение примерно 2:1) — используется на всех размерах экрана.',
            }),
            defineField({ name: 'nameRu', title: 'Название, RU', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'nameEn', title: 'Название, EN', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'shortRu', title: 'Короткое описание (для плитки), RU', type: 'string' }),
            defineField({ name: 'shortEn', title: 'Короткое описание (для плитки), EN', type: 'string' }),
            defineField({ name: 'longRu', title: 'Полное описание (для разворота на мобильном), RU', type: 'text', rows: 3 }),
            defineField({ name: 'longEn', title: 'Полное описание (для разворота на мобильном), EN', type: 'text', rows: 3 }),
          ],
          preview: { select: { title: 'nameRu', media: 'image' } },
        },
      ],
    }),

    defineField({
      name: 'badges',
      title: 'Плашки',
      type: 'array',
      group: 'trust',
      description: 'Произвольные метки на карточке биржи — без ограничения по количеству или смыслу.',
      of: [
        {
          type: 'object',
          name: 'exchangeBadge',
          fields: [
            defineField({ name: 'textRu', title: 'Текст, RU', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'textEn', title: 'Текст, EN', type: 'string', validation: Rule => Rule.required() }),
            defineField({
              name: 'tone',
              title: 'Тон',
              type: 'string',
              description: 'Цвет закреплён за смыслом факта — используйте «Лицензия» для любой регуляторной лицензии (MiCA и другие), чтобы у всех бирж она была одного цвета.',
              options: {
                list: [
                  { title: '🔵 Лицензия (регуляторная)', value: 'license' },
                  { title: '🏆 Золотой / корпоративный статус', value: 'gold' },
                  { title: '🟡 Предупреждение / ограничение', value: 'warn' },
                  { title: '🟢 Ок (зелёный)', value: 'ok' },
                  { title: '⚪ Нейтральный (серый)', value: 'off' },
                ],
              },
              initialValue: 'off',
              validation: Rule => Rule.required(),
            }),
            defineField({ name: 'link', title: 'Ссылка (необязательно)', type: 'url' }),
          ],
          preview: { select: { title: 'textRu', subtitle: 'tone' } },
        },
      ],
    }),
    defineField({
      name: 'regions',
      title: 'Статус по регионам',
      type: 'array',
      group: 'trust',
      of: [
        {
          type: 'object',
          name: 'exchangeRegion',
          fields: [
            defineField({ name: 'regionRu', title: 'Регион, RU', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'regionEn', title: 'Регион, EN', type: 'string', validation: Rule => Rule.required() }),
            defineField({
              name: 'tone',
              title: 'Тон',
              type: 'string',
              options: {
                list: [
                  { title: '🟢 Разрешена', value: 'ok' },
                  { title: '🟡 Предупреждение', value: 'warn' },
                  { title: '⚪ Недоступна', value: 'off' },
                ],
              },
              initialValue: 'ok',
              validation: Rule => Rule.required(),
            }),
            defineField({ name: 'noteRu', title: 'Комментарий, RU', type: 'string' }),
            defineField({ name: 'noteEn', title: 'Комментарий, EN', type: 'string' }),
          ],
          preview: { select: { title: 'regionRu', subtitle: 'tone' } },
        },
      ],
    }),

    defineField({
      name: 'volume24h',
      title: 'Объём торгов, 24ч ($)',
      type: 'number',
      group: 'ranking',
      readOnly: true,
      description: 'Только для чтения — обновляется автоматически раз в сутки из CoinGecko по полю coingeckoId выше. Ручное редактирование не влияет на органический рейтинг.',
    }),
    defineField({
      name: 'volumeUpdatedAt',
      title: 'Обновлено',
      type: 'datetime',
      group: 'ranking',
      readOnly: true,
    }),
    defineField({
      name: 'pinned',
      title: 'Закрепить сверху (партнёрское размещение)',
      type: 'boolean',
      group: 'ranking',
      initialValue: false,
      description: 'Единственный ручной рычаг влияния на порядок в списке — для платного размещения. Органический рейтинг по объёму торгов при этом не меняется, остальные позиции просто сдвигаются вниз.',
    }),
    defineField({
      name: 'pinPosition',
      title: 'Позиция закрепления',
      type: 'number',
      group: 'ranking',
      hidden: ({ document }) => !document?.pinned,
      options: { list: [1, 2, 3] },
      validation: Rule => Rule.custom((value, context) => {
        const doc = context.document as { pinned?: boolean } | undefined;
        if (doc?.pinned && !value) return 'Укажите позицию закрепления (1, 2 или 3)';
        return true;
      }),
    }),
    defineField({
      name: 'pinUntil',
      title: 'Закреплено до (необязательно)',
      type: 'datetime',
      group: 'ranking',
      hidden: ({ document }) => !document?.pinned,
      description: 'После этой даты биржа автоматически возвращается в органический рейтинг.',
    }),

    defineField({ name: 'reviewsEnabled', title: 'Отзывы включены', type: 'boolean', group: 'main', initialValue: true }),

    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'seo',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'metaTitleRu', title: 'Meta Title, RU', type: 'string' }),
        defineField({ name: 'metaTitleEn', title: 'Meta Title, EN', type: 'string' }),
        defineField({ name: 'metaDescriptionRu', title: 'Meta Description, RU', type: 'text', rows: 3 }),
        defineField({ name: 'metaDescriptionEn', title: 'Meta Description, EN', type: 'text', rows: 3 }),
        defineField({ name: 'noIndex', title: '🚫 No-index', type: 'boolean', initialValue: false }),
      ],
    }),
  ],
  preview: {
    select: { title: 'name', media: 'logo', pinned: 'pinned', volume24h: 'volume24h' },
    prepare({ title, media, pinned, volume24h }) {
      return {
        title: `${pinned ? '📌 ' : ''}${title}`,
        subtitle: typeof volume24h === 'number' ? `Объём 24ч: $${(volume24h / 1e9).toFixed(1)}B` : undefined,
        media,
      };
    },
  },
});
