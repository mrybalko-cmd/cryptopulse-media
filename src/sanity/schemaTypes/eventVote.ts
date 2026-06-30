import { defineField, defineType } from 'sanity';

export const eventVoteType = defineType({
  name: 'eventVote',
  title: 'Event Vote (internal)',
  type: 'document',
  fields: [
    defineField({
      name: 'event',
      title: 'Event',
      type: 'reference',
      to: [{ type: 'calendarEvent' }],
      weak: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'ipHash',
      title: 'IP hash',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'vote',
      title: 'Vote',
      type: 'string',
      options: { list: ['like', 'dislike'] },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { vote: 'vote', ipHash: 'ipHash' },
    prepare({ vote, ipHash }) {
      return { title: vote, subtitle: ipHash?.slice(0, 12) };
    },
  },
});
