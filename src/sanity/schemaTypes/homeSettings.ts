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
  ],
  preview: {
    prepare() {
      return { title: 'Настройки главной страницы' };
    },
  },
});
