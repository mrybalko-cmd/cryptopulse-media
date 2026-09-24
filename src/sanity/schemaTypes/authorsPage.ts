import { defineField, defineType } from 'sanity';
import { UsersIcon } from '@sanity/icons';

/**
 * Настройки страницы авторов. Один документ на весь сайт.
 *
 * Заведён затем, чтобы на странице не осталось ни строки текста, зашитой в
 * код: заголовок, подзаголовок и поля для поисковика правятся в админке, как
 * и всё остальное на этом разделе.
 */
export const authorsPageType = defineType({
  name: 'authorsPage',
  title: 'Страница авторов',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({ name: 'headingRu', title: 'Заголовок (RU)', type: 'string' }),
    defineField({ name: 'headingEn', title: 'Heading (EN)', type: 'string' }),
    defineField({ name: 'ledeRu', title: 'Подзаголовок (RU)', type: 'text', rows: 2 }),
    defineField({ name: 'ledeEn', title: 'Lede (EN)', type: 'text', rows: 2 }),
    defineField({ name: 'seoTitleRu', title: 'Заголовок для поиска (RU)', type: 'string' }),
    defineField({ name: 'seoTitleEn', title: 'SEO title (EN)', type: 'string' }),
    defineField({ name: 'seoDescriptionRu', title: 'Описание для поиска (RU)', type: 'text', rows: 2 }),
    defineField({ name: 'seoDescriptionEn', title: 'SEO description (EN)', type: 'text', rows: 2 }),
    defineField({
      name: 'sort',
      title: 'Сортировка по умолчанию',
      type: 'string',
      initialValue: 'manual',
      options: {
        list: [
          { title: 'Вручную, как расставлено', value: 'manual' },
          { title: 'По числу материалов', value: 'materials' },
          { title: 'По алфавиту', value: 'alphabet' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: { prepare: () => ({ title: 'Страница авторов' }) },
});
