import { defineField, defineType } from 'sanity';

export const exchangeReviewType = defineType({
  name: 'exchangeReview',
  title: 'Отзыв о бирже',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: Rule => Rule.required().min(1).max(60),
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      options: { list: [1, 2, 3, 4, 5] },
      validation: Rule => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      validation: Rule => Rule.required().min(2).max(2000),
    }),
    defineField({
      name: 'exchange',
      title: 'Биржа',
      type: 'reference',
      to: [{ type: 'exchange' }],
      weak: true,
      validation: Rule => Rule.required(),
    }),
    // Отклонение — отдельное состояние, а не просто «не одобрено».
    // Раньше кнопка «Отклонить» у неодобренного отзыв проставляла
    // approved: false тому, у кого он и так false: в базе ничего не
    // менялось, запись оставалась в очереди, и со стороны это выглядело
    // как неработающая кнопка. Отклонённое уходит из очереди, но не
    // удаляется — решение можно пересмотреть.
    defineField({
      name: 'rejected',
      title: 'Rejected',
      type: 'boolean',
      initialValue: false,
      description: 'Отклонено модератором: не в очереди и не на сайте.',
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Отзывы скрыты на сайте, пока не одобрены здесь.',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created at',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'ipHash',
      title: 'IP hash (internal, for rate-limiting)',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: { title: 'authorName', subtitle: 'text', approved: 'approved', rating: 'rating' },
    prepare({ title, subtitle, approved, rating }) {
      return {
        title: `${approved ? '✅' : '⏳'} ${title} — ${'★'.repeat(rating || 0)}`,
        subtitle: subtitle?.slice(0, 80),
      };
    },
  },
});
