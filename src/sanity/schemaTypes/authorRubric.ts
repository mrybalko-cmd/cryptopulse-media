import { defineField, defineType } from 'sanity';
import { TagIcon } from '@sanity/icons';

/**
 * Рубрика карточки в разделе авторов.
 *
 * Фильтры над списком авторов собираются из этих документов, а не из
 * перечисления в коде: добавили рубрику в админке — она появилась на сайте,
 * пересобирать ничего не нужно. У карточки может быть несколько рубрик, и она
 * попадёт в каждый из этих фильтров.
 *
 * Чего здесь сознательно НЕТ: признака «человек или организация». Он живёт
 * отдельным полем на самой карточке, потому что определяет не фильтр, а
 * устройство: круглое фото против плитки с логотипом и какую разметку отдать
 * поисковику, Person или Organization. Ошибка в нём стоит позиций в выдаче,
 * поэтому редактировать его как обычную рубрику нельзя.
 */
export const authorRubricType = defineType({
  name: 'authorRubric',
  title: 'Рубрики авторов',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'titleRu',
      title: 'Название (RU)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (EN)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Ключ',
      type: 'slug',
      description: 'Попадает в адрес фильтра, например /authors?rubric=editorial',
      options: { source: 'titleEn', maxLength: 40 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'visibility',
      title: 'Показ на сайте',
      type: 'string',
      initialValue: 'auto',
      options: {
        list: [
          { title: 'Авто — пока в рубрике есть хоть одна карточка', value: 'auto' },
          { title: 'Всегда — показывать даже пустую', value: 'always' },
          { title: 'Никогда — только для сортировки в админке', value: 'never' },
        ],
        layout: 'radio',
      },
      description:
        'При «авто» опустевшая рубрика исчезает с сайта сама и возвращается сама, ' +
        'как только в ней появится участник. «Никогда» — внутренний ярлык: ' +
        'читатель такой рубрики не увидит, а вы сможете по ней сортировать.',
    }),
    defineField({
      name: 'order',
      title: 'Порядок',
      type: 'number',
      initialValue: 100,
      description: 'Чем меньше число, тем левее кнопка фильтра',
    }),
    defineField({
      name: 'note',
      title: 'Заметка для редакции',
      type: 'string',
      description: 'На сайт не выводится',
    }),
  ],
  orderings: [{ title: 'По порядку', name: 'byOrder', by: [{ field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'titleRu', subtitle: 'titleEn', visibility: 'visibility', order: 'order' },
    prepare({ title, subtitle, visibility, order }) {
      const mark = visibility === 'never' ? ' · только внутри'
        : visibility === 'always' ? ' · всегда видна' : '';
      return { title: `${title}${mark}`, subtitle: `${order ?? '—'} · ${subtitle}` };
    },
  },
});
