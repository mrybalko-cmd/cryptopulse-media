import { defineField, defineType } from 'sanity';

/**
 * Задача, под которую читатель ищет инструмент: «сделать видео», «расшифровать
 * созвон», «надиктовать текст».
 *
 * Задача — главный вход в раздел, а не категория. Человек приходит не за
 * «AI writing tools», он приходит с работой, которую надо сделать, и
 * раскладка по задачам совпадает с тем, как он формулирует запрос в поиске.
 *
 * Здесь же живёт набор признаков фильтра. Он лежит в задаче, а не в сервисе,
 * и это главное решение схемы: иначе у каждого редактора появятся свои
 * формулировки одного и того же, и фильтр развалится на синонимы. Сервис
 * только ставит галочки против готовых ключей.
 *
 * Ключ признака (`key`) отделён от подписи (`label`) намеренно. Подпись
 * редактор правит когда угодно, и она меняется сразу везде; ключ остаётся
 * прежним, поэтому уже расставленные у компаний галочки не слетают.
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

export const aiFacetType = defineType({
  name: 'aiFacet',
  title: 'Признак фильтра',
  type: 'object',
  fields: [
    defineField({
      name: 'key',
      title: 'Ключ',
      type: 'string',
      description:
        'Латиницей, без пробелов: 4k, lip, fcomm. По нему сервис помечается, ' +
        'поэтому после публикации ключ лучше не менять — иначе галочки у ' +
        'компаний перестанут совпадать. Подпись меняйте сколько угодно.',
      validation: Rule =>
        Rule.required()
          .regex(/^[a-z0-9_-]+$/, { name: 'латиница, цифры, дефис' })
          .max(24),
    }),
    defineField(bilingualString('label', 'Подпись')),
  ],
  preview: {
    select: { ru: 'label.ru', key: 'key' },
    prepare: ({ ru, key }) => ({ title: ru || key, subtitle: key }),
  },
});

export const aiFacetGroupType = defineType({
  name: 'aiFacetGroup',
  title: 'Группа признаков',
  type: 'object',
  fields: [
    defineField(bilingualString('title', 'Заголовок группы')),
    defineField({
      name: 'scope',
      title: 'Где показывается',
      type: 'string',
      initialValue: 'task',
      options: {
        list: [
          { title: 'Только у этой задачи', value: 'task' },
          { title: 'У всех задач — общая группа', value: 'global' },
        ],
        layout: 'radio',
      },
      description:
        'Общие группы («Цена», «Европа», «Проверено редакцией») достаточно ' +
        'завести один раз в любой задаче: они собираются в один список и ' +
        'показываются везде.',
    }),
    defineField({
      name: 'items',
      title: 'Признаки',
      type: 'array',
      of: [{ type: 'aiFacet' }],
      validation: Rule => Rule.min(2).error('В группе меньше двух признаков — фильтровать нечем'),
    }),
    defineField({
      name: 'openByDefault',
      title: 'Раскрыта сразу',
      type: 'boolean',
      initialValue: false,
      description: 'Раскрытой имеет смысл держать одну группу — ту, ради которой на страницу и пришли.',
    }),
  ],
  preview: {
    select: { ru: 'title.ru', scope: 'scope', items: 'items' },
    prepare: ({ ru, scope, items }) => ({
      title: ru || 'Без заголовка',
      subtitle: `${scope === 'global' ? 'общая' : 'своя'} · признаков: ${items?.length ?? 0}`,
    }),
  },
});

export const aiJobType = defineType({
  name: 'aiJob',
  title: 'AI: задача',
  type: 'document',
  fields: [
    defineField(bilingualString('name', 'Название', 'Как в полосе задач: «Видео», «Расшифровка».')),
    defineField({
      name: 'slug',
      title: 'Адрес',
      type: 'slug',
      options: { source: 'name.en', maxLength: 40 },
      description: 'Общий для обоих языков, как у регуляции. Из него собирается /ai/best/<адрес>.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'icon',
      title: 'Иконка',
      type: 'string',
      initialValue: 'grid',
      options: {
        list: [
          { title: 'Перо — текст', value: 'pen' },
          { title: 'Микрофон — голосовой ввод', value: 'mic' },
          { title: 'Волна — расшифровка', value: 'wave' },
          { title: 'Картинка — изображения', value: 'image' },
          { title: 'Плёнка — видео', value: 'film' },
          { title: 'Рупор — креативы', value: 'mega' },
          { title: 'Динамик — озвучка', value: 'volume' },
          { title: 'Человек — аватары', value: 'user' },
          { title: 'Скобки — код', value: 'code' },
          { title: 'Экран — презентации', value: 'deck' },
          { title: 'Молния — автоматизация', value: 'zap' },
          { title: 'Лупа — поиск', value: 'search' },
          { title: 'Сетка — прочее', value: 'grid' },
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Порядок в полосе',
      type: 'number',
      initialValue: 100,
      description: 'Меньше — левее. Шаг в десять, чтобы можно было вставить между.',
    }),
    defineField({
      name: 'facetGroups',
      title: 'Группы признаков',
      type: 'array',
      of: [{ type: 'aiFacetGroup' }],
      description:
        'Чем фильтруют внутри этой задачи. У видео — длина ролика и 4K, ' +
        'у изображений — разрешение и вектор. Общие группы помечайте «у всех задач».',
    }),
    defineField({
      name: 'intro',
      title: 'Текст подборки',
      description: 'Выводится на /ai/best/<адрес>. RU и EN пишутся отдельно, не переводом.',
      type: 'object',
      fields: [
        { name: 'ru', title: 'Русский', type: 'text', rows: 4 },
        { name: 'en', title: 'English', type: 'text', rows: 4 },
      ],
    }),
    defineField({
      name: 'sortedBy',
      title: 'По какому критерию отсортирована подборка',
      type: 'object',
      description:
        'Пишется на странице открытым текстом. Рейтингов «9,2 из 10» у нас нет: ' +
        'своих замеров нет, а выдуманная оценка — ложь, из-за которой перестают ' +
        'верить и всему остальному.',
      fields: [
        { name: 'ru', title: 'Русский', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
    defineField({
      name: 'hidden',
      title: 'Скрыть задачу',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [{ title: 'Порядок в полосе', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { ru: 'name.ru', en: 'name.en', groups: 'facetGroups', hidden: 'hidden' },
    prepare: ({ ru, en, groups, hidden }) => ({
      title: `${ru || en || 'Без названия'}${hidden ? ' · скрыта' : ''}`,
      subtitle: `групп признаков: ${groups?.length ?? 0}`,
    }),
  },
});
