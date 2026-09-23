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
    // Написание по языкам — надстройка над полем name, а не замена ему.
    // В базе есть авторы без фамилии («Maks», под которым 1818 материалов,
    // «Jonathan») и авторы, которые вообще не люди («Intokened.com»,
    // «Sonic News»). Обязательная разбивка сломала бы четыре карточки из
    // десяти, поэтому всё здесь необязательно: пусто — берём name.
    defineField({
      name: 'firstNameRu',
      title: 'Имя (RU)',
      type: 'string',
      description: 'Русское написание. Пусто — везде показывается поле выше',
    }),
    defineField({
      name: 'lastNameRu',
      title: 'Фамилия (RU)',
      type: 'string',
    }),
    defineField({
      name: 'firstNameEn',
      title: 'First name (EN)',
      type: 'string',
    }),
    defineField({
      name: 'lastNameEn',
      title: 'Last name (EN)',
      type: 'string',
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
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      description: 'https://instagram.com/username',
    }),
    defineField({
      name: 'website',
      title: 'Сайт автора / Personal site',
      type: 'url',
      description: 'Личный сайт, портфолио или блог',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Публичный email автора — будет показан как иконка конверта под материалами',
      validation: Rule => Rule.email(),
    }),
    // Скрытие мягкое: автор уходит из списка авторов, из подборки на главной
    // и из карты сайта. Подпись под материалами и его собственная страница
    // продолжают работать — на них ведут ссылки из тысяч материалов, и рвать
    // их ради галочки нельзя. Материал без автора к тому же хуже ранжируется.
    defineField({
      name: 'hidden',
      title: 'Скрыть из списка авторов',
      type: 'boolean',
      initialValue: false,
      description: 'Материалы остаются на сайте, подпись и страница автора работают',
    }),
  ],
  preview: {
    select: { title: 'name', subtitleRu: 'roleRu', subtitleEn: 'roleEn', media: 'photo', hidden: 'hidden' },
    prepare({ title, subtitleRu, subtitleEn, media, hidden }) {
      const role = subtitleRu || subtitleEn || '';
      return { title: hidden ? `${title} · скрыт` : title, subtitle: role, media };
    },
  },
});
