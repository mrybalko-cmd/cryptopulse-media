import { defineArrayMember, defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons';

// Singleton (fixed document ID "homeSettings", enforced via the custom
// structure in sanity.config.ts) — controls what shows on the public
// homepage without touching code: section on/off toggles, and which
// authors appear in the "author columns" widget (and in what order).
export const homeSettingsType = defineType({
  name: 'homeSettings',
  title: 'Настройки главной / Homepage Settings',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'showNews',
      title: 'Показывать ленту новостей / Show news rail',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showArticles',
      title: 'Показывать ряды статей / Show article rows',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'showAuthorColumns',
      title: 'Показывать авторские колонки / Show author columns',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featuredAuthors',
      title: 'Авторские колонки / Author columns',
      description:
        'Каждая карточка — автор + ссылка на его материал. Сначала выберите автора — поля «Материал» ниже покажут только то, что написал именно он. Сайт двуязычный, поэтому для RU и EN версии материал указывается отдельно — иначе на английской версии могла бы показаться ссылка на русский текст. Порядок в списке = порядок на сайте. Пусто = блок не показывается, даже если переключатель выше включён.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featuredAuthorSlot',
          fields: [
            defineField({
              name: 'author',
              title: 'Автор / Author',
              type: 'reference',
              to: [{ type: 'author' }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'materialRu',
              title: 'Материал (RU) / Material (RU)',
              description: 'Статья или новость этого автора на русском — выберите автора выше, чтобы список заполнился.',
              type: 'reference',
              to: [{ type: 'article' }, { type: 'news' }],
              options: {
                filter: (context) => {
                  const parent = context.parent as { author?: { _ref?: string } } | undefined;
                  const authorRef = parent?.author?._ref;
                  if (!authorRef) return { filter: 'false' };
                  return { filter: 'author._ref == $authorRef && language == "ru"', params: { authorRef } };
                },
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'materialEn',
              title: 'Материал (EN) / Material (EN)',
              description: 'Статья или новость этого автора на английском — выберите автора выше, чтобы список заполнился.',
              type: 'reference',
              to: [{ type: 'article' }, { type: 'news' }],
              options: {
                filter: (context) => {
                  const parent = context.parent as { author?: { _ref?: string } } | undefined;
                  const authorRef = parent?.author?._ref;
                  if (!authorRef) return { filter: 'false' };
                  return { filter: 'author._ref == $authorRef && language == "en"', params: { authorRef } };
                },
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { authorName: 'author.name', materialTitle: 'materialRu.title', media: 'author.photo' },
            prepare({ authorName, materialTitle, media }) {
              return {
                title: authorName || 'Автор не выбран',
                subtitle: materialTitle || 'Материал не выбран',
                media,
              };
            },
          },
        }),
      ],
    }),

    defineField({
      name: 'showAuthorsWidget',
      title: 'Показывать блок авторов внизу / Show authors widget',
      type: 'boolean',
      initialValue: true,
      description: 'Блок под криптокалендарём: крупная работа, три публикации колонками и «Сейчас читают» справа.',
    }),
    defineField({
      name: 'authorsWidgetHero',
      title: 'Блок авторов · крупная работа / Authors widget · hero',
      type: 'object',
      description: 'Пусто = берётся последняя статья участника с обложкой. Заполнено = показывается то, что выбрали.',
      fields: [
        defineField({
          name: 'ru',
          title: 'Материал (RU)',
          type: 'reference',
          to: [{ type: 'article' }, { type: 'news' }],
          options: { filter: 'language == "ru"' },
        }),
        defineField({
          name: 'en',
          title: 'Материал (EN)',
          type: 'reference',
          to: [{ type: 'article' }, { type: 'news' }],
          options: { filter: 'language == "en"' },
        }),
      ],
    }),
    defineField({
      name: 'authorsWidgetItems',
      title: 'Блок авторов · три публикации / Authors widget · three columns',
      type: 'array',
      description: 'Порядок в списке = порядок на сайте. Пусто = берутся последние работы других участников.',
      validation: (Rule) => Rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'widgetSlot',
          fields: [
            defineField({ name: 'ru', title: 'Материал (RU)', type: 'reference',
              to: [{ type: 'article' }, { type: 'news' }], options: { filter: 'language == "ru"' } }),
            defineField({ name: 'en', title: 'Материал (EN)', type: 'reference',
              to: [{ type: 'article' }, { type: 'news' }], options: { filter: 'language == "en"' } }),
          ],
          preview: {
            select: { title: 'ru.title', subtitle: 'en.title' },
            prepare({ title, subtitle }) {
              return { title: title || 'Материал не выбран', subtitle: subtitle || '' };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'authorsWidgetReading',
      title: 'Блок авторов · «Сейчас читают» / Authors widget · reading now',
      type: 'array',
      description: 'Правая колонка. Пусто = четыре материала с наибольшим числом просмотров.',
      validation: (Rule) => Rule.max(6),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'readingSlot',
          fields: [
            defineField({ name: 'ru', title: 'Материал (RU)', type: 'reference',
              to: [{ type: 'article' }, { type: 'news' }], options: { filter: 'language == "ru"' } }),
            defineField({ name: 'en', title: 'Материал (EN)', type: 'reference',
              to: [{ type: 'article' }, { type: 'news' }], options: { filter: 'language == "en"' } }),
          ],
          preview: {
            select: { title: 'ru.title', subtitle: 'en.title' },
            prepare({ title, subtitle }) {
              return { title: title || 'Материал не выбран', subtitle: subtitle || '' };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'showRegulationWidget',
      title: 'Показывать блок регуляции внизу / Show regulation widget',
      type: 'boolean',
      initialValue: true,
      description: 'Самый нижний блок главной: карта мира, выбранные страны и лицензионные режимы.',
    }),
    defineField({
      /* Страна здесь одна на оба языка — у документа страны обе версии внутри,
         в отличие от материалов, где русский и английский это разные записи. */
      name: 'regulationWidgetCountries',
      title: 'Блок регуляции · страны / Regulation widget · countries',
      type: 'array',
      description: 'Середина блока. Порядок в списке = порядок на сайте. Пусто = страны с самой свежей проверкой.',
      validation: (Rule) => Rule.max(5),
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'regulationCountry' }] })],
    }),
    defineField({
      name: 'regulationWidgetRegimes',
      title: 'Блок регуляции · лицензии / Regulation widget · licensing',
      type: 'array',
      description: 'Правая колонка. Пусто = режимы по порядку из хаба.',
      validation: (Rule) => Rule.max(4),
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'licenceRegime' }] })],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Настройки главной страницы' };
    },
  },
});
