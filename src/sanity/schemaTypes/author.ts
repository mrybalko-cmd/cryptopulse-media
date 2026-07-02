import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';

export const authorType = defineType({
  name: 'author',
  title: 'Authors',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Full name / Имя и фамилия',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 64 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Photo / Фото',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'role',
      title: 'Role / Должность',
      type: 'string',
      description: 'e.g. "Аналитик", "Редактор", "Обозреватель"',
    }),
    defineField({
      name: 'bio',
      title: 'Bio / О себе',
      type: 'text',
      rows: 4,
      description: 'Short biography shown under articles (2–4 sentences)',
    }),
    defineField({
      name: 'telegram',
      title: 'Telegram URL',
      type: 'url',
      description: 'https://t.me/username',
    }),
    defineField({
      name: 'linkedin',
      title: 'LinkedIn URL',
      type: 'url',
    }),
    defineField({
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    }),
    defineField({
      name: 'twitter',
      title: 'X / Twitter URL',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'photo' },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle || '', media };
    },
  },
});
