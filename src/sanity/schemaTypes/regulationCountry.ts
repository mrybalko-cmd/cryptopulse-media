import { defineField, defineType } from 'sanity';

/**
 * One country on the crypto regulation map.
 *
 * These 46 records used to live in src/lib/regulationData.ts, which meant every
 * correction — a lifted ban, a new tax rule — was a commit and a deploy. Law
 * changes faster than we ship, and the file proved it: Bolivia sat marked
 * `banned` for two years after the ban was lifted, and its own description said
 * so, right under the wrong badge.
 *
 * `region` is a field here rather than a list of codes in the map component.
 * That list is why Russia disappeared: it existed in the data and in no region,
 * so nothing rendered it and nothing complained. A country carries its own
 * region now, and a new one cannot be silently invisible.
 */
export const regulationCountryType = defineType({
  name: 'regulationCountry',
  title: 'Регулирование: страна',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Название',
      type: 'object',
      fields: [
        { name: 'ru', title: 'Русский', type: 'string', validation: Rule => Rule.required() },
        { name: 'en', title: 'English', type: 'string', validation: Rule => Rule.required() },
      ],
    }),
    defineField({
      name: 'iso2',
      title: 'Код ISO (2 буквы)',
      description: 'DE, US, RU — заглавными. Уникален.',
      type: 'string',
      validation: Rule => Rule.required().uppercase().length(2),
    }),
    defineField({
      name: 'isoNum',
      title: 'Номер ISO (3 цифры)',
      description: 'Нужен для сопоставления с географией, когда появится настоящая карта.',
      type: 'string',
      validation: Rule => Rule.required().length(3),
    }),
    defineField({
      name: 'slug',
      title: 'Адрес (slug)',
      type: 'slug',
      options: { source: 'name.en', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Статус',
      type: 'string',
      options: {
        list: [
          { title: 'Разрешено', value: 'legal' },
          { title: 'С ограничениями', value: 'restricted' },
          { title: 'Запрещено', value: 'banned' },
          { title: 'Нет данных / серая зона', value: 'unclear' },
        ],
        layout: 'radio',
      },
      initialValue: 'unclear',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Регион на карте',
      type: 'string',
      options: {
        list: [
          { title: 'Европа', value: 'eu' },
          { title: 'Америка', value: 'americas' },
          { title: 'Азия', value: 'asia' },
          { title: 'Ближний Восток / Африка', value: 'mena' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Краткое описание',
      description: 'Показывается в карточке страны на карте.',
      type: 'object',
      fields: [
        { name: 'ru', title: 'Русский', type: 'text', rows: 3, validation: Rule => Rule.required() },
        { name: 'en', title: 'English', type: 'text', rows: 3, validation: Rule => Rule.required() },
      ],
    }),
    defineField({
      name: 'details',
      title: 'Подробности',
      description: 'Раскрывается по клику на страну.',
      type: 'object',
      fields: [
        { name: 'ru', title: 'Русский', type: 'text', rows: 5, validation: Rule => Rule.required() },
        { name: 'en', title: 'English', type: 'text', rows: 5, validation: Rule => Rule.required() },
      ],
    }),
    defineField({
      name: 'taxNote',
      title: 'Налоги (необязательно)',
      description: 'Самая читаемая часть карточки — у большинства конкурентов её нет.',
      type: 'object',
      fields: [
        { name: 'ru', title: 'Русский', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'factNote',
      title: 'Любопытный факт (необязательно)',
      description: 'Событие, компания, случай — то, ради чего страницу дочитывают. Один-два предложения.',
      type: 'object',
      fields: [
        { name: 'ru', title: 'Русский', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'regulatorName',
      title: 'Регулятор',
      description: 'BaFin, SEC, ЦБ РФ — орган, который принимает правила.',
      type: 'string',
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Ссылка на источник',
      description: 'Страница регулятора или сам документ. Читателю — проверить, поиску — подтвердить.',
      type: 'url',
      validation: Rule => Rule.uri({ scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'checkedAt',
      title: 'Когда проверяли',
      description: 'Заменяет прежний «год данных»: живая дата у каждой страны.',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
      validation: Rule => Rule.required(),
    }),
  ],
  orderings: [
    { title: 'По названию', name: 'nameRu', by: [{ field: 'name.ru', direction: 'asc' }] },
    { title: 'Давно не проверяли', name: 'stale', by: [{ field: 'checkedAt', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name.ru', subtitle: 'iso2', status: 'status', checkedAt: 'checkedAt' },
    prepare({ title, subtitle, status, checkedAt }) {
      const label: Record<string, string> = {
        legal: 'Разрешено', restricted: 'С ограничениями',
        banned: 'Запрещено', unclear: 'Серая зона',
      };
      return {
        title: `${title} · ${subtitle}`,
        subtitle: `${label[status] ?? status} · проверено ${checkedAt ?? '—'}`,
      };
    },
  },
});
