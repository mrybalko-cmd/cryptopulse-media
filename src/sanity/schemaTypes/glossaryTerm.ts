import { defineField, defineType } from 'sanity';

/**
 * Один термин глоссария — криптовалютного или по искусственному интеллекту.
 *
 * 87 записей жили в src/lib/glossary.ts и src/lib/aiGlossary.ts, десять тысяч
 * строк на двоих. Любая правка определения означала коммит и деплой, а деплой
 * при 2384 адресах сбрасывает кэш данных и стоит квоты. Терминология меняется
 * быстрее, чем имеет смысл выкатывать релиз.
 *
 * Оба словаря описываются одним типом, потому что в коде они и так делили один
 * интерфейс GlossaryTerm. Различает их поле `kind`: от него зависит только
 * адрес страницы, /glossary/ или /ai/glossary/.
 *
 * Поле `aliases` — новое, в коде его не было. Автоматическая простановка ссылок
 * искала точное совпадение слова, поэтому «стейблкоины» не находили термин
 * «стейблкоин», и материал уходил в публикацию вообще без ссылок на глоссарий.
 * Молча: хелпер отрабатывал без ошибки. Словоформы лечат именно это.
 */

/** Каждый редактируемый текст существует дважды, по разу на язык. Английская
 *  версия пишется, а не переводится, поэтому это два равных поля, а не одно
 *  исходное и одно производное. */
function bilingualString(name: string, title: string, required = false) {
  return {
    name,
    title,
    type: 'object' as const,
    fields: [
      {
        name: 'ru', title: 'Русский', type: 'string',
        ...(required ? { validation: (Rule: any) => Rule.required() } : {}),
      },
      {
        name: 'en', title: 'English', type: 'string',
        ...(required ? { validation: (Rule: any) => Rule.required() } : {}),
      },
    ],
  };
}

function bilingualText(name: string, title: string, rows: number, description?: string) {
  return {
    name,
    title,
    ...(description ? { description } : {}),
    type: 'object' as const,
    fields: [
      { name: 'ru', title: 'Русский', type: 'text', rows },
      { name: 'en', title: 'English', type: 'text', rows },
    ],
  };
}

/** Разбор с числами. Термин становится понятным ровно в тот момент, когда
 *  к нему привязаны настоящие суммы, и этот же кусок чаще всего цитируют
 *  поисковики и ассистенты. Значения двуязычные, потому что запись чисел
 *  не нейтральна: по-русски 10 000,00 там, где по-английски 10,000.00. */
const exampleObject = {
  name: 'example',
  title: 'Разбор с числами',
  type: 'object' as const,
  fields: [
    bilingualText('setup', 'Условие', 2, 'С чего начинаем: «Держим 10 000 USDC, курс уходит на $0,97».'),
    {
      name: 'rows',
      title: 'Строки расчёта',
      type: 'array' as const,
      of: [{
        type: 'object' as const,
        fields: [
          bilingualString('label', 'Название строки'),
          bilingualString('value', 'Значение'),
        ],
        preview: {
          select: { title: 'label.ru', subtitle: 'value.ru' },
        },
      }],
    },
    {
      name: 'total',
      title: 'Итоговая строка',
      description: 'Необязательна. Показывается отдельно, под чертой.',
      type: 'object' as const,
      fields: [
        bilingualString('label', 'Название'),
        bilingualString('value', 'Значение'),
      ],
    },
    bilingualText('outcome', 'Вывод', 2, 'Что из расчёта следует, одной-двумя фразами.'),
  ],
};

/** Раздел развёрнутой статьи. Всё, кроме заголовка, необязательно: раздел
 *  бывает прозой, списком, разбором или их сочетанием. Загонять «Whitepaper»
 *  и «Проскальзывание» в одну форму нельзя — у первого нечего считать,
 *  второе почти целиком расчёт. */
const sectionObject = {
  type: 'object' as const,
  name: 'section',
  fields: [
    bilingualString('heading', 'Заголовок раздела', true),
    {
      name: 'paragraphs',
      title: 'Абзацы',
      type: 'array' as const,
      of: [{
        type: 'object' as const,
        fields: [
          { name: 'ru', title: 'Русский', type: 'text', rows: 4 },
          { name: 'en', title: 'English', type: 'text', rows: 4 },
        ],
        preview: { select: { title: 'ru' } },
      }],
    },
    {
      name: 'bullets',
      title: 'Список',
      type: 'array' as const,
      of: [{
        type: 'object' as const,
        fields: [
          bilingualString('title', 'Пункт'),
          bilingualText('text', 'Пояснение', 3),
        ],
        preview: { select: { title: 'title.ru', subtitle: 'text.ru' } },
      }],
    },
    exampleObject,
  ],
  preview: {
    select: { title: 'heading.ru', subtitle: 'heading.en' },
  },
};

export const glossaryTermType = defineType({
  name: 'glossaryTerm',
  title: 'Термин глоссария',
  type: 'document',
  fields: [
    defineField({
      name: 'kind',
      title: 'Словарь',
      description: 'Определяет адрес страницы: криптовалютный лежит на /glossary/, по ИИ — на /ai/glossary/.',
      type: 'string',
      options: {
        list: [
          { title: 'Криптовалюты', value: 'crypto' },
          { title: 'Искусственный интеллект', value: 'ai' },
        ],
        layout: 'radio',
      },
      initialValue: 'crypto',
      validation: Rule => Rule.required(),
    }),
    defineField(bilingualString('term', 'Термин', true)),
    defineField({
      name: 'termLink',
      title: 'Ссылка на названии термина',
      description: 'Название термина на его странице станет ссылкой. Для партнёрских и клиентских размещений. Оставьте пустым, если ссылка не нужна.',
      type: 'object',
      fields: [
        { name: 'url', title: 'Адрес', type: 'url',
          validation: (Rule: any) => Rule.uri({ scheme: ['http', 'https'], allowRelative: true }) },
        {
          name: 'rel', title: 'Передавать вес страницы', type: 'string',
          description: 'Для платных и партнёрских размещений выбирайте nofollow: передача веса по оплаченной ссылке нарушает правила поисковиков.',
          options: { list: [
            { title: 'Нет, nofollow', value: 'nofollow' },
            { title: 'Да, dofollow', value: 'dofollow' },
          ], layout: 'radio' },
          initialValue: 'nofollow',
        },
      ],
    }),
    defineField({
      name: 'slug',
      title: 'Адрес (slug)',
      description: 'По нему стоят ссылки в уже вышедших материалах. Менять только осознанно.',
      type: 'slug',
      options: { source: 'term.en', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField(bilingualText(
      'definition', 'Короткое определение', 4,
      'Самодостаточный ответ в двух-трёх предложениях. Идёт в описание страницы, в разметку и в цитату, которую поднимает ассистент. Развёрнутое — в разделы ниже.',
    )),
    defineField({
      name: 'category',
      title: 'Категория',
      description: 'Только для криптовалютного словаря. Даёт плашку и подбор связанных терминов, когда они не заданы вручную.',
      type: 'string',
      options: {
        list: [
          { title: 'Основы', value: 'basics' },
          { title: 'Кошельки', value: 'wallets' },
          { title: 'Торговля', value: 'trading' },
          { title: 'DeFi', value: 'defi' },
          { title: 'Технологии', value: 'tech' },
          { title: 'Регулирование', value: 'compliance' },
          { title: 'Токены', value: 'tokens' },
          { title: 'Сленг', value: 'slang' },
          { title: 'Безопасность', value: 'security' },
        ],
      },
      hidden: ({ document }) => document?.kind === 'ai',
    }),
    defineField({
      name: 'sections',
      title: 'Развёрнутая статья',
      description: 'Разделы идут в том порядке, в каком стоят здесь. Термин без разделов показывает только короткое определение — это допустимо.',
      type: 'array',
      of: [sectionObject],
    }),
    defineField({
      name: 'aliases',
      title: 'Словоформы и синонимы',
      description: 'По ним автоматическая простановка ссылок узнаёт термин в тексте. Для «стейблкоин» это «стейблкоины», «стейблкоина», «стейблкоинов». Без них ссылка не встанет: поиск идёт по точному слову.',
      type: 'object',
      fields: [
        {
          name: 'ru', title: 'Русские формы', type: 'array',
          of: [{ type: 'string' }], options: { layout: 'tags' },
        },
        {
          name: 'en', title: 'English forms', type: 'array',
          of: [{ type: 'string' }], options: { layout: 'tags' },
        },
      ],
    }),
    defineField({
      name: 'autolink',
      title: 'Участвует в автоссылках',
      description: 'Снимите, если термин слишком общий и ссылка на него в тексте будет мешать.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'related',
      title: 'Связанные термины',
      description: 'Показываются внизу страницы. Если пусто, подставятся другие термины той же категории.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'glossaryTerm' }] }],
    }),
    defineField({
      name: 'updated',
      title: 'Дата последней правки текста',
      description: 'Ставится, когда переписан текст самого термина. Читателю показывается как «проверено», и в карту сайта идёт та же дата.',
      type: 'date',
      options: { dateFormat: 'DD.MM.YYYY' },
    }),
  ],
  orderings: [
    {
      title: 'По термину, А-Я',
      name: 'termRuAsc',
      by: [{ field: 'term.ru', direction: 'asc' }],
    },
    {
      title: 'Сначала недавно правленные',
      name: 'updatedDesc',
      by: [{ field: 'updated', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'term.ru', en: 'term.en', kind: 'kind', slug: 'slug.current' },
    prepare({ title, en, kind, slug }) {
      const dict = kind === 'ai' ? 'ИИ' : 'Крипто';
      return {
        title: `${title || '(без названия)'} · ${en || ''}`.trim(),
        subtitle: `${dict} · /${kind === 'ai' ? 'ai/glossary' : 'glossary'}/${slug || '—'}`,
      };
    },
  },
});
