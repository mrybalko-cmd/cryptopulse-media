import { defineField, defineType } from 'sanity';

export const commentType = defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'authorName',
      title: 'Author name',
      type: 'string',
      validation: (Rule) => Rule.required().min(1).max(60),
    }),
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required().min(2).max(2000),
    }),
    defineField({
      name: 'target',
      title: 'Article or News item',
      type: 'reference',
      to: [{ type: 'article' }, { type: 'news' }],
      weak: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'parentComment',
      title: 'Reply to (optional)',
      type: 'reference',
      to: [{ type: 'comment' }],
      weak: true,
      description: 'Set this if the comment is a reply to another comment on the same page.',
    }),
    defineField({
      name: 'approved',
      title: 'Approved',
      type: 'boolean',
      initialValue: false,
      description: 'Comments are hidden from the site until approved here.',
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
    select: { title: 'authorName', subtitle: 'text', approved: 'approved' },
    prepare({ title, subtitle, approved }) {
      return {
        title: `${approved ? '✅' : '⏳'} ${title}`,
        subtitle: subtitle?.slice(0, 80),
      };
    },
  },
});
