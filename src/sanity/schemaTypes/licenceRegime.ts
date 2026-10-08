import { defineField, defineType } from 'sanity';

/**
 * Один лицензионный режим: MiCA, VARA, CySEC, Дія City.
 *
 * Страна отвечает на вопрос «можно ли здесь держать криптовалюту и сколько с
 * неё берут». Режим отвечает на другой — «что нужно, чтобы здесь работать с
 * клиентами»: кто выдаёт разрешение, сколько оно стоит, сколько ждать и как
 * проверить чужое. Это разные читатели, и складывать их в одну страницу
 * значило бы написать её вполовину для каждого.
 *
 * Режим не обязан совпадать со страной. MiCA накрывает двадцать семь стран
 * сразу, а Дія City — вообще не лицензия, а налоговый режим, которым крипто-
 * команды пользуются, пока закон о виртуальных активах стоит между чтениями.
 * Поэтому `country` — необязательная ссылка: она рисует врезку на странице
 * страны там, где такая страна одна.
 */

/** Каждый текст существует дважды. Английский пишется, а не переводится. */
function bilingual(name: string, title: string, description: string, rows: number) {
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

export const licenceRegimeType = defineType({
  name: 'licenceRegime',
  title: 'Регулирование: лицензия',
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
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Адрес (slug)',
      description: 'Общий для обоих языков, как у стран: /regulation/licences/<slug>',
      type: 'slug',
      options: { source: 'name.en', maxLength: 60 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      /* Логотипы регуляторов сюда не кладём намеренно. Эмблема CySEC или VARA
         на стороннем сайте читается как заявление об аккредитации, и сами
         регуляторы ведут списки таких сайтов. Знак режима — наш: монограмма в
         его цвете плюс флаг юрисдикции уголком. */
      name: 'monogram',
      title: 'Знак',
      description: 'До пяти символов: VARA, MiCA, ДІЯ. Печатается в цветном квадрате на карточке.',
      type: 'string',
      validation: Rule => Rule.required().max(5),
    }),
    defineField({
      name: 'jurisdictionFlag',
      title: 'Флаг юрисдикции',
      description: 'Эмодзи уголком знака: 🇦🇪, 🇪🇺, 🇨🇾, 🇺🇦',
      type: 'string',
      validation: Rule => Rule.max(8),
    }),
    defineField({
      name: 'accent',
      title: 'Цвет режима',
      description: 'Те же семь цветов, что у карточек участников.',
      type: 'string',
      initialValue: 'cyan',
      options: {
        list: [
          { title: 'Бирюзовый', value: 'cyan' },
          { title: 'Янтарный', value: 'amber' },
          { title: 'Фиолетовый', value: 'violet' },
          { title: 'Синий', value: 'blue' },
          { title: 'Изумрудный', value: 'emerald' },
          { title: 'Розовый', value: 'pink' },
          { title: 'Оранжевый', value: 'orange' },
        ],
      },
    }),
    defineField({
      name: 'authority',
      title: 'Кто выдаёт',
      description: 'Полное название органа: Virtual Assets Regulatory Authority',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'scope',
      title: 'Где действует',
      type: 'object',
      description: 'Короткая строка под названием: «Дубай, ОАЭ» или «27 стран ЕС».',
      fields: [
        { name: 'ru', title: 'Русский', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
    }),
    defineField({
      /* Ссылка на страну рисует врезку на её странице. У MiCA страны нет: он
         накрывает весь союз, и привязка к одной из них была бы неправдой. */
      name: 'country',
      title: 'Страна (необязательно)',
      description: 'Поставьте, если режим принадлежит одной стране — тогда на её странице появится врезка со ссылкой сюда.',
      type: 'reference',
      to: [{ type: 'regulationCountry' }],
    }),
    defineField({
      name: 'status',
      title: 'Состояние режима',
      type: 'string',
      initialValue: 'active',
      options: {
        list: [
          { title: 'Действует', value: 'active' },
          { title: 'Переходный период', value: 'transition' },
          { title: 'Проект / не принят', value: 'draft' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Порядок в хабе',
      description: 'Меньше — выше. При равных значениях сортируются по названию.',
      type: 'number',
      initialValue: 50,
    }),
    bilingual(
      'headline',
      'Три цифры карточки',
      'По строке: МЕТКА | значение. Ровно три — больше в карточку не помещается.',
      4
    ),
    bilingual('intro', 'Коротко', 'Прямой ответ на «что это за режим». 60–90 слов.', 4),
    bilingual(
      'figures',
      'Плитки цифр',
      'По строке: МЕТКА | значение | подпись | ok либо warn либо no',
      8
    ),
    bilingual(
      'feeTable',
      'Таблица стоимости',
      'Первая строка — заголовки. Дальше по строке: что | сколько | сколько ежегодно',
      10
    ),
    bilingual(
      'steps',
      'Как проходит заявка',
      'По шагу на строку. Нумерация проставляется сама.',
      7
    ),
    bilingual(
      'body',
      'Разделы',
      'Абзацы разделяются пустой строкой. «## » — заголовок раздела. Ссылка: [якорь](https://…)',
      20
    ),
    bilingual('timeline', 'Хронология', 'По строке: дата | что произошло. Звёздочка в начале выделяет главное.', 8),
    bilingual('faq', 'Частые вопросы', 'По строке на пару: Вопрос? | Ответ', 10),
    bilingual('sources', 'Источники', 'По строке: Название | https://…', 6),
    bilingual('related', 'Наши материалы', 'По одному slug на строку. У русской и английской версии slug разные.', 5),
    bilingual('seoTitle', 'Заголовок для поиска', 'Если пусто — берётся название режима.', 2),
    bilingual('seoDescription', 'Описание для поиска', 'Если пусто — берётся «Коротко».', 3),
    defineField({
      name: 'publishedAt',
      title: 'Дата публикации',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
    }),
    defineField({
      name: 'checkedAt',
      title: 'Когда проверяли',
      description: 'Показывается читателю дважды: пилюлей в шапке и строкой внизу страницы.',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'reviewedBy',
      title: 'Кто проверял',
      description: 'Участник, сверявший данные с источниками регулятора. Попадёт в разметку как reviewedBy.',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    defineField({
      name: 'hidden',
      title: 'Скрыть режим',
      description: 'Пропадает из хаба, виджета главной и врезки на странице страны. Адрес отдаёт 404.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  orderings: [
    { title: 'Порядок в хабе', name: 'order', by: [{ field: 'order', direction: 'asc' }] },
    { title: 'Давно не проверяли', name: 'stale', by: [{ field: 'checkedAt', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'name.ru', monogram: 'monogram', authority: 'authority', checkedAt: 'checkedAt', hidden: 'hidden' },
    prepare({ title, monogram, authority, checkedAt, hidden }) {
      return {
        title: `${hidden ? '• скрыт — ' : ''}${monogram ?? ''} ${title ?? ''}`.trim(),
        subtitle: `${authority ?? '—'} · проверено ${checkedAt ?? '—'}`,
      };
    },
  },
});
