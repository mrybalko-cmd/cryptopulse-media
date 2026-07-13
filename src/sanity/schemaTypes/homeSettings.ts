import { defineField, defineType } from 'sanity';
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
      title: 'Авторы в авторских колонках / Featured authors',
      description:
        'Выберите и упорядочите авторов для блока «Авторские колонки» на главной. Порядок в списке = порядок на сайте. Пусто = блок не показывается, даже если переключатель выше включён.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'author' }] }],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Настройки главной страницы' };
    },
  },
});
