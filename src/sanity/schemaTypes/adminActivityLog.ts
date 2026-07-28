import { defineField, defineType } from 'sanity';

// Written only by the custom admin panel (src/lib/admin/activityLog.ts),
// never by Studio itself — a lightweight audit trail for the two riskiest
// action classes (deletions, permission changes), since the admin panel's
// writes all share one Sanity API token and Sanity's own document history
// can't attribute an edit to a specific staff member.
export const adminActivityLogType = defineType({
  name: 'adminActivityLog',
  title: 'Admin Activity Log',
  type: 'document',
  fields: [
    defineField({ name: 'action', title: 'Action', type: 'string' }),
    defineField({ name: 'entityType', title: 'Entity type', type: 'string' }),
    defineField({ name: 'entityTitle', title: 'Entity title', type: 'string' }),
    defineField({ name: 'entityId', title: 'Entity ID', type: 'string' }),
    defineField({ name: 'adminName', title: 'Admin name', type: 'string' }),
    defineField({ name: 'adminEmail', title: 'Admin email', type: 'string' }),
    defineField({ name: 'timestamp', title: 'Timestamp', type: 'datetime' }),
  ],
  preview: {
    select: { action: 'action', entityTitle: 'entityTitle', adminName: 'adminName' },
    prepare({ action, entityTitle, adminName }: { action?: string; entityTitle?: string; adminName?: string }) {
      return { title: `${action ?? ''} — ${entityTitle ?? ''}`, subtitle: adminName };
    },
  },
  orderings: [{ title: 'Newest first', name: 'timestampDesc', by: [{ field: 'timestamp', direction: 'desc' }] }],
});
