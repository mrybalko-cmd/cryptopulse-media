import { defineField, defineType } from 'sanity';
import { PERMISSIONS } from '@/lib/admin/permissions';

// Backs the custom /admin panel's own login + permissions — independent of
// Sanity's own project-member accounts. Owners can grant/revoke access to
// each admin section per person without touching Sanity's member list.
export const adminUserType = defineType({
  name: 'adminUser',
  title: 'Admin: пользователь',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Имя', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'email', title: 'Email (логин)', type: 'string', validation: Rule => Rule.required().email() }),
    defineField({
      name: 'passwordHash',
      title: 'Password hash',
      type: 'string',
      hidden: true,
      description: 'Устанавливается через /admin — не редактируйте вручную.',
    }),
    defineField({
      name: 'isOwner',
      title: 'Владелец (все права + управление пользователями)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'permissions',
      title: 'Права доступа',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        // Taken from the one list the app checks against, not retyped. This
        // copy had already fallen four sections behind — authors, calendar,
        // pulse and subscribers existed in code and could not be granted here,
        // so the only way to give someone those rights was to make them owner.
        list: PERMISSIONS.map(p => ({ title: p.label, value: p.key })),
        layout: 'grid',
      },
      hidden: ({ document }) => Boolean(document?.isOwner),
    }),
    defineField({
      name: 'active',
      title: 'Активен (может войти)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({ name: 'createdAt', title: 'Создан', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  preview: {
    select: { name: 'name', email: 'email', isOwner: 'isOwner', active: 'active' },
    prepare({ name, email, isOwner, active }) {
      return {
        title: `${active ? '' : '⛔ '}${name}${isOwner ? ' · владелец' : ''}`,
        subtitle: email,
      };
    },
  },
});
