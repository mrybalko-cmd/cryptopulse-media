import { defineField, defineType } from 'sanity';

/**
 * Карточка AI-сервиса в каталоге /ai/tools.
 *
 * Устройство повторяет `exchange`, который уже работает: логотип с фоном под
 * него, тэглайн, массив продуктов, бейджи, закрепление. Переписывать то, что
 * живёт в проде второй год, смысла нет.
 *
 * Своего здесь четыре вещи, и они же отличают раздел от сотни каталогов:
 *
 * 1. `highlight` — одна строка про то, что умеет только этот сервис. Её
 *    нельзя сгенерировать, её пишут руками, попробовав. Карточка без неё не
 *    публикуется.
 * 2. `plans[]` — тарифы. Из минимального платного считаются и цена на
 *    карточке, и ступень фильтра «дешёвый / средний / дорогой». Редактор
 *    меняет тариф — меняется везде, без деплоя.
 * 3. `facets[]` — ключи признаков из `aiJob`. Не свободный текст: иначе у
 *    каждого редактора появятся свои формулировки одного и того же.
 * 4. `priceCheckedAt` — дата, когда цену сверили с официальным прайсом.
 *    Пусто означает «не сверяли», и карточка честно это показывает. Пустое
 *    поле честнее выдуманного.
 */

function bilingualString(name: string, title: string, description?: string) {
  return {
    name,
    title,
    ...(description ? { description } : {}),
    type: 'object' as const,
    fields: [
      { name: 'ru', title: 'Русский', type: 'string' },
      { name: 'en', title: 'English', type: 'string' },
    ],
  };
}

function bilingualText(name: string, title: string, description: string, rows: number) {
  return {
    name,
    title,
    description,
    type: 'object' as const,
    fields: [
      { name: 'ru', title: 'Русский', type: 'text', rows },
      { name: 'en', title: 'English', type: 'text', rows },
    ],
  };
}

export const aiPlanType = defineType({
  name: 'aiPlan',
  title: 'Тариф',
  type: 'object',
  fields: [
    defineField({ name: 'name', title: 'Название', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'price',
      title: 'Цена',
      type: 'number',
      description: 'Ноль — бесплатный тариф. Пусто — «по запросу».',
      validation: Rule => Rule.min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Валюта',
      type: 'string',
      initialValue: 'USD',
      options: { list: ['USD', 'EUR'], layout: 'radio' },
      description: 'Ставьте ту, в которой вендор публикует прайс, а не пересчитанную.',
    }),
    defineField({
      name: 'unit',
      title: 'За что',
      type: 'string',
      initialValue: 'month',
      options: {
        list: [
          { title: 'в месяц', value: 'month' },
          { title: 'в месяц за человека', value: 'seat' },
          { title: 'за объём', value: 'usage' },
          { title: 'единоразово', value: 'once' },
        ],
      },
    }),
    defineField(bilingualString('includes', 'Что входит', 'Коротко: «без лимита, свой словарь, история».')),
    defineField({
      name: 'recommended',
      title: 'Пометить «чаще берут»',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { name: 'name', price: 'price', cur: 'currency', unit: 'unit' },
    prepare: ({ name, price, cur, unit }) => ({
      title: name,
      subtitle:
        price === undefined || price === null
          ? 'по запросу'
          : `${price === 0 ? 'бесплатно' : `${price} ${cur ?? 'USD'}`}${unit === 'seat' ? ' / чел.' : ''}`,
    }),
  },
});

export const aiServiceType = defineType({
  name: 'aiService',
  title: 'AI: сервис',
  type: 'document',
  groups: [
    { name: 'main', title: 'Основное', default: true },
    { name: 'money', title: 'Тарифы' },
    { name: 'filters', title: 'Фильтры' },
    { name: 'text', title: 'Тексты' },
    { name: 'proof', title: 'Проверка' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Название',
      type: 'string',
      group: 'main',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Адрес',
      type: 'slug',
      group: 'main',
      options: { source: 'name', maxLength: 48 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Логотип',
      type: 'image',
      group: 'main',
      options: { accept: '.svg,.png' },
      description:
        'Квадрат, минимум 256×256, прозрачный фон. Пока файла нет, рисуется ' +
        'монограмма на фирменном цвете — раздел не ломается из-за отсутствующей картинки.',
    }),
    defineField({
      name: 'logoOnDark',
      title: 'Знак светлый — нужна тёмная подложка',
      type: 'boolean',
      group: 'main',
      initialValue: false,
      description:
        'Ставится само при загрузке логотипа: скрипт считает среднюю яркость ' +
        'непрозрачных пикселей. Белый знак на белой плашке исчезает, тёмный ' +
        'на тёмной — тоже. Если автомат ошибся, переключите руками.',
    }),
    defineField({
      name: 'monogram',
      title: 'Монограмма',
      type: 'string',
      group: 'main',
      description: 'Две буквы. Используется, пока логотип не загружен.',
      validation: Rule => Rule.max(3),
    }),
    defineField({
      name: 'brandColor',
      title: 'Цвет плашки',
      type: 'string',
      group: 'main',
      initialValue: '#111827',
      description: 'HEX. Фон под монограммой и подложка логотипа в ряду внизу раздела.',
      validation: Rule => Rule.regex(/^#[0-9a-fA-F]{6}$/, { name: 'HEX вида #1d1d1f' }),
    }),
    defineField({
      name: 'job',
      title: 'Задача',
      type: 'reference',
      to: [{ type: 'aiJob' }],
      group: 'main',
      description: 'Одна основная. По ней сервис попадает в полосу задач и в подборку.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'rank',
      title: 'Место в рейтинге a16z',
      type: 'number',
      group: 'main',
      description: 'Если сервис в рейтинге топ-50 по выручке. Пусто — значит вне рейтинга.',
      validation: Rule => Rule.min(1).max(200),
    }),
    defineField({
      name: 'website',
      title: 'Сайт',
      type: 'url',
      group: 'main',
    }),
    defineField({
      name: 'pricingUrl',
      title: 'Ссылка «Детали»',
      type: 'url',
      group: 'main',
      description: 'Прайс компании. Пусто — ссылка на карточке не рисуется.',
    }),
    defineField({
      name: 'foundedYear',
      title: 'Год основания',
      type: 'number',
      group: 'main',
      validation: Rule => Rule.min(1990).max(2100),
    }),

    defineField({
      name: 'plans',
      title: 'Тарифы',
      type: 'array',
      of: [{ type: 'aiPlan' }],
      group: 'money',
      description:
        'От трёх до пяти ступеней. Из минимального платного считаются цена на ' +
        'карточке и ступень фильтра «дешёвый / средний / дорогой».',
      validation: Rule => Rule.max(6),
    }),

    defineField({
      name: 'facets',
      title: 'К каким фильтрам относится',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'filters',
      description:
        'Ключи признаков из задачи: 4k, lip, fcomm. Набор задаётся в разделе ' +
        '«Фильтры и задачи», здесь только отмечается. Непроверенное не отмечаем.',
    }),

    defineField(bilingualString('tagline', 'Подзаголовок', 'Одна строка под названием на карточке.')),
    defineField(
      bilingualString(
        'highlight',
        'Чем выделяется',
        'Одна фраза про то, что умеет только этот сервис. Обязательно: карточка без неё не публикуется.'
      )
    ),
    defineField({
      name: 'features',
      title: 'Основные фишки',
      type: 'object',
      group: 'text',
      description: 'Три-пять пунктов. Первые три выводятся прямо на карточке в хабе.',
      fields: [
        { name: 'ru', title: 'Русский', type: 'array', of: [{ type: 'string' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
    defineField(
      bilingualText(
        'about',
        'О компании',
        'Четыре-семь предложений: когда основана, кто основатели, как растёт, что делает. RU и EN пишутся отдельно, не переводом.',
        7
      )
    ),
    defineField({
      name: 'pros',
      title: 'Сильнее альтернатив',
      type: 'object',
      group: 'text',
      fields: [
        { name: 'ru', title: 'Русский', type: 'array', of: [{ type: 'string' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
    defineField({
      name: 'cons',
      title: 'Слабее альтернатив',
      type: 'object',
      group: 'text',
      description: 'Обязательно наравне с плюсами: без минусов плюсам не верят, и компания получает страницу, на которую не стыдно сослаться самой.',
      fields: [
        { name: 'ru', title: 'Русский', type: 'array', of: [{ type: 'string' }] },
        { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
      ],
    }),
    defineField(bilingualString('seoTitle', 'Заголовок для поиска')),
    defineField(bilingualString('seoDescription', 'Описание для поиска')),

    defineField({
      name: 'priceCheckedAt',
      title: 'Цена сверена',
      type: 'date',
      group: 'proof',
      description:
        'Дата, когда тарифы сверили с официальным прайсом. Пусто означает ' +
        '«не сверяли», и карточка честно это показывает.',
    }),
    defineField({
      name: 'sources',
      title: 'Источники',
      type: 'array',
      of: [{ type: 'url' }],
      group: 'proof',
      description: 'Страницы прайса, по которым сверяли.',
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Данные проверил',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'proof',
    }),
    defineField({
      name: 'sponsored',
      title: 'Платное размещение',
      type: 'boolean',
      initialValue: false,
      group: 'proof',
      description: 'Рисует явную плашку. Порядок в выдаче не меняет никогда — место в подборках не продаётся.',
    }),
    defineField({ name: 'pinned', title: 'Закрепить', type: 'boolean', initialValue: false, group: 'proof' }),
    defineField({ name: 'hidden', title: 'Скрыть', type: 'boolean', initialValue: false, group: 'proof' }),
  ],
  orderings: [
    { title: 'Место в рейтинге', name: 'rank', by: [{ field: 'rank', direction: 'asc' }] },
    { title: 'Давно не сверяли цену', name: 'stale', by: [{ field: 'priceCheckedAt', direction: 'asc' }] },
  ],
  preview: {
    select: { name: 'name', rank: 'rank', checked: 'priceCheckedAt', logo: 'logo', hidden: 'hidden' },
    prepare: ({ name, rank, checked, logo, hidden }) => ({
      title: `${rank ? `${rank}. ` : ''}${name}${hidden ? ' · скрыт' : ''}`,
      subtitle: checked ? `цена сверена ${checked}` : 'цена не сверена',
      media: logo,
    }),
  },
});
