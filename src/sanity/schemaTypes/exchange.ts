import { defineField, defineType } from 'sanity';
import { LockedSlugInput } from '../components/LockedSlugInput';
import { BROKER_TEXT_FIELDS } from '../../lib/brokerFields';

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
    { name: 'ranking', title: 'Рейтинг' },
    { name: 'placements', title: 'Размещения и кнопки' },
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
      title: 'Ссылка с UTM-метками для текста-ссылки (необязательно)',
      type: 'url',
      group: 'main',
      description: 'Куда реально ведёт клик по ссылке рядом с логотипом. Показанный текст ссылки при этом не меняется, UTM-метки видны только в адресной строке после перехода.',
    }),
    defineField({
      name: 'tradeUrl',
      title: 'Ссылка для кнопки «Торговать» (необязательно)',
      type: 'url',
      group: 'main',
      description: 'Независимо от ссылки выше. Если заполнено, в таблице кнопка «Торговать» в цвете площадки. Если пусто, серая «Подробнее» ведёт на страницу площадки.',
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
      name: 'buttonColor',
      title: 'Цвет кнопок площадки',
      type: 'string',
      group: 'placements',
      options: {
        list: [
          { title: 'Фиолетовый', value: 'violet' },
          { title: 'Оранжевый', value: 'orange' },
          { title: 'Зелёный', value: 'green' },
        ],
        layout: 'radio',
      },
      initialValue: 'violet',
    }),
    defineField({ name: 'tradeUntil', title: 'Партнёрская ссылка действует до', type: 'datetime', group: 'placements' }),

    defineField({ name: 'extendedEnabled', title: 'Расширенный профиль включён', type: 'boolean', group: 'placements', initialValue: false }),
    defineField({ name: 'extendedUntil', title: 'Расширенный профиль действует до', type: 'datetime', group: 'placements' }),
    defineField({ name: 'extendedPerkRu', title: 'Строка с преимуществом, RU', type: 'string', group: 'placements' }),
    defineField({ name: 'extendedPerkEn', title: 'Строка с преимуществом, EN', type: 'string', group: 'placements' }),
    defineField({ name: 'extendedFactsRu', title: 'Три факта через запятую, RU', type: 'string', group: 'placements' }),
    defineField({ name: 'extendedFactsEn', title: 'Три факта через запятую, EN', type: 'string', group: 'placements' }),

    defineField({ name: 'adEnabled', title: 'Рекламный блок включён', type: 'boolean', group: 'placements', initialValue: false }),
    defineField({ name: 'adUntil', title: 'Рекламный блок действует до', type: 'datetime', group: 'placements' }),
    defineField({ name: 'adUrl', title: 'Ссылка кнопки рекламного блока', type: 'url', group: 'placements' }),
    defineField({ name: 'adTextRu', title: 'Текст блока, RU', type: 'string', group: 'placements' }),
    defineField({ name: 'adTextEn', title: 'Текст блока, EN', type: 'string', group: 'placements' }),
    defineField({ name: 'adOfferRu', title: 'Акция, заголовок, RU', type: 'string', group: 'placements' }),
    defineField({ name: 'adOfferEn', title: 'Акция, заголовок, EN', type: 'string', group: 'placements' }),
    defineField({ name: 'adOfferNoteRu', title: 'Акция, условия и срок, RU', type: 'string', group: 'placements' }),
    defineField({ name: 'adOfferNoteEn', title: 'Акция, условия и срок, EN', type: 'string', group: 'placements' }),
    defineField({ name: 'adButtonRu', title: 'Текст кнопки, RU', type: 'string', group: 'placements' }),
    defineField({ name: 'adButtonEn', title: 'Текст кнопки, EN', type: 'string', group: 'placements' }),

    // Прежнее закрепление. На порядок больше не влияет, поля оставлены скрытыми,
    // пока значения не сотрутся при сохранении биржи.
    defineField({ name: 'pinned', type: 'boolean', hidden: true }),
    defineField({ name: 'pinPosition', type: 'number', hidden: true }),
    defineField({ name: 'pinUntil', type: 'datetime', hidden: true }),

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
    select: { title: 'name', media: 'logo', volume24h: 'volume24h' },
    prepare({ title, media, volume24h }) {
      return {
        title,
        subtitle: typeof volume24h === 'number' ? `Объём 24ч: $${(volume24h / 1e9).toFixed(1)}B` : undefined,
        media,
      };
    },
  },
});

const EXCHANGE_ONLY_FIELDS = new Set(['coingeckoId', 'type', 'volume24h', 'volumeUpdatedAt', 'pinned', 'pinPosition', 'pinUntil', 'products', 'badges', 'regions']);

// Брокер отдельным типом: старые запросы по "exchange" его не видят, поэтому он
// не может попасть в рейтинг бирж по обороту. Общие поля те же, форма в админке одна.
export const brokerType = defineType({
  name: 'broker',
  title: 'Брокер / Broker',
  type: 'document',
  groups: [
    { name: 'main', title: 'Основное' },
    { name: 'content', title: 'Описание' },
    { name: 'regulation', title: 'Регуляция и условия' },
    { name: 'placements', title: 'Размещения и кнопки' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    ...exchangeType.fields.filter(field => !EXCHANGE_ONLY_FIELDS.has(field.name)),
    defineField({
      name: 'regulators',
      title: 'Регуляция',
      type: 'array',
      group: 'regulation',
      description: 'Пишется вручную, ровно так, как есть у брокера.',
      of: [
        {
          type: 'object',
          name: 'brokerRegulator',
          fields: [
            defineField({ name: 'name', title: 'Регулятор', type: 'string', validation: Rule => Rule.required() }),
            defineField({ name: 'entity', title: 'Компания группы', type: 'string' }),
            defineField({ name: 'licence', title: 'Номер лицензии', type: 'string' }),
            defineField({ name: 'noteRu', title: 'Пояснение, RU', type: 'string' }),
            defineField({ name: 'noteEn', title: 'Пояснение, EN', type: 'string' }),
            defineField({ name: 'url', title: 'Ссылка на реестр', type: 'url' }),
            defineField({ name: 'tier1', title: 'Первый уровень (влияет на порядок)', type: 'boolean', initialValue: false }),
          ],
          preview: { select: { title: 'name', subtitle: 'licence' } },
        },
      ],
    }),
    defineField({ name: 'offersCoins', title: 'Реальные монеты', type: 'boolean', group: 'regulation', initialValue: false }),
    defineField({ name: 'offersCfd', title: 'CFD на криптовалюту', type: 'boolean', group: 'regulation', initialValue: false }),
    defineField({ name: 'minDeposit', title: 'Минимальный депозит', type: 'string', group: 'regulation' }),
    defineField({ name: 'lossPercent', title: 'Доля счетов, теряющих деньги', type: 'string', group: 'regulation' }),
    defineField({ name: 'demoUrl', title: 'Ссылка на демо-счёт', type: 'url', group: 'placements' }),
    defineField({ name: 'verifiedAt', title: 'Дата проверки', type: 'date', group: 'regulation' }),
    ...BROKER_TEXT_FIELDS.flatMap(field => [
      defineField({ name: `${field.key}Ru`, title: `${field.label}, RU`, type: 'string', group: 'regulation' }),
      defineField({ name: `${field.key}En`, title: `${field.label}, EN`, type: 'string', group: 'regulation' }),
    ]),
  ],
  preview: { select: { title: 'name', media: 'logo' } },
});
