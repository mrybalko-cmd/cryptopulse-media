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
      name: 'roleRu',
      title: 'Должность (RU)',
      type: 'string',
      description: 'Например: «Аналитик», «Обозреватель», «Редактор»',
    }),
    defineField({
      name: 'roleEn',
      title: 'Role (EN)',
      type: 'string',
      description: 'e.g. "Analyst", "Correspondent", "Editor"',
    }),
    defineField({
      name: 'bioRu',
      title: 'Биография (RU)',
      type: 'text',
      rows: 4,
      description: '2–4 предложения, отображается под статьёй на русской версии сайта',
    }),
    defineField({
      name: 'bioEn',
      title: 'Bio (EN)',
      type: 'text',
      rows: 4,
      description: '2–4 sentences, shown under articles on the English version of the site',
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
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Публичный email автора — будет показан как иконка конверта под материалами',
      validation: Rule => Rule.email(),
    }),
  ],
  preview: {
    select: { title: 'name', subtitleRu: 'roleRu', subtitleEn: 'roleEn', media: 'photo' },
    prepare({ title, subtitleRu, subtitleEn, media }) {
      return { title, subtitle: subtitleRu || subtitleEn || '', media };
    },
  },
});
