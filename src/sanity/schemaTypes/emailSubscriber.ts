import { defineField, defineType } from 'sanity';
import { EnvelopeIcon } from '@sanity/icons';

export const emailSubscriberType = defineType({
  name: 'emailSubscriber',
  title: 'Email Subscribers',
  type: 'document',
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: Rule => Rule.required().email(),
    }),
    defineField({
      name: 'locale',
      title: 'Language',
      type: 'string',
      options: { list: [{ title: 'Russian', value: 'ru' }, { title: 'English', value: 'en' }] },
      initialValue: 'ru',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description: 'Where the user subscribed from (article, news, footer)',
      readOnly: true,
    }),
    defineField({
      name: 'subscribedAt',
      title: 'Subscribed At',
      type: 'datetime',
      readOnly: true,
    }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Uncheck to unsubscribe this address',
    }),
  ],
  preview: {
    select: { title: 'email', subtitle: 'locale', description: 'source' },
    prepare({ title, subtitle, description }) {
      return { title, subtitle: `${subtitle?.toUpperCase()} · ${description || ''}` };
    },
  },
  orderings: [
    { title: 'Newest first', name: 'subscribedAtDesc', by: [{ field: 'subscribedAt', direction: 'desc' }] },
  ],
});
