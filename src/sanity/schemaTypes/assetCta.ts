import { defineField, defineType } from 'sanity';

/**
 * Кнопка партнёра на монете.
 *
 * Список монет живёт в коде (`src/lib/coins.ts`), поэтому кнопка не может
 * быть полем монеты: её пришлось бы деплоить. Вместо этого — отдельный
 * документ, привязанный к монете по slug. Редакция заводит и снимает кнопки
 * из админки, деплой не нужен.
 *
 * Пара «одна монета — один документ» держится проверкой в админке, а не
 * уникальным индексом: в Sanity его нет. Чтение всё равно берёт первый
 * подходящий документ, поэтому дубль не ломает страницу.
 */
export const assetCtaType = defineType({
  name: 'assetCta',
  title: 'Кнопка монеты',
  type: 'document',
  fields: [
    defineField({
      name: 'coinSlug',
      title: 'Монета',
      description: 'Slug монеты из раздела активов: bitcoin, ethereum, solana…',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Показывать кнопку',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'stoppedAt',
      title: 'Остановлена',
      type: 'datetime',
      readOnly: true,
      description: 'Ставится кнопкой «Остановить» в админке. Клики при этом сохраняются.',
    }),
    defineField({
      name: 'mode',
      title: 'Какие кнопки',
      type: 'string',
      options: {
        list: [
          { title: 'Только «Купить»', value: 'buy' },
          { title: 'Только «Продать»', value: 'sell' },
          { title: 'Купить и продать', value: 'both' },
          { title: 'Свой текст', value: 'custom' },
        ],
        layout: 'radio',
      },
      initialValue: 'buy',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'labelRu',
      title: 'Свой текст, RU',
      description: 'Только для режима «Свой текст». До 24 знаков.',
      type: 'string',
      validation: Rule => Rule.max(24),
    }),
    defineField({
      name: 'labelEn',
      title: 'Свой текст, EN',
      type: 'string',
      validation: Rule => Rule.max(24),
    }),
    defineField({
      name: 'url',
      title: 'Ссылка партнёра',
      type: 'url',
      validation: Rule => Rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'sellUrl',
      title: 'Ссылка для «Продать», если отличается',
      type: 'url',
      validation: Rule => Rule.uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'partner',
      title: 'Название партнёра',
      description: 'Показывается в пометке «Реклама», если она включена.',
      type: 'string',
    }),
    defineField({
      name: 'color',
      title: 'Цвет кнопки',
      description: 'HEX вида #f7931a. Пусто — берётся фирменный цвет монеты.',
      type: 'string',
      validation: Rule =>
        Rule.regex(/^#[0-9a-fA-F]{6}$/, { name: 'HEX вида #f7931a' }),
    }),
    defineField({
      name: 'showAdLabel',
      title: 'Пометка «Реклама»',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'language',
      title: 'Язык показа',
      type: 'string',
      options: {
        list: [
          { title: 'Оба языка', value: 'all' },
          { title: 'Только RU', value: 'ru' },
          { title: 'Только EN', value: 'en' },
        ],
      },
      initialValue: 'all',
    }),
    defineField({
      name: 'places',
      title: 'Где показывать',
      type: 'object',
      options: { columns: 2 },
      fields: [
        defineField({ name: 'cards', title: 'Витрина: карточки', type: 'boolean', initialValue: true }),
        defineField({ name: 'table', title: 'Витрина: таблица', type: 'boolean', initialValue: true }),
        defineField({ name: 'page', title: 'Страница монеты', type: 'boolean', initialValue: true }),
        defineField({ name: 'sticky', title: 'Нижняя панель на телефоне', type: 'boolean', initialValue: true }),
      ],
    }),
    defineField({ name: 'startAt', title: 'Показывать с', type: 'datetime' }),
    defineField({ name: 'endAt', title: 'Показывать до', type: 'datetime' }),

    // Счётчики. Пишет их только маршрут /api/coin-cta-click, руками не
    // трогаем: форма эти поля не отправляет и patch их не перетирает.
    defineField({
      name: 'clicks',
      title: 'Кликов по «Купить»',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'sellClicks',
      title: 'Кликов по «Продать»',
      type: 'number',
      initialValue: 0,
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: 'coinSlug', subtitle: 'partner', active: 'active' },
    prepare: ({ title, subtitle, active }) => ({
      title: title || 'без монеты',
      subtitle: `${active ? 'включена' : 'выключена'}${subtitle ? ` · ${subtitle}` : ''}`,
    }),
  },
});
