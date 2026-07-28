'use server';

import { redirect } from 'next/navigation';
import { requireOwner, hashPassword } from '@/lib/admin/auth';
import { createAdminUser, updateAdminUser, updateAdminUserPassword, fetchAdminUserByEmail } from '@/lib/admin/data';
import { PERMISSIONS, type Permission } from '@/lib/admin/permissions';
import { logActivity } from '@/lib/admin/activityLog';

function parsePermissions(formData: FormData): Permission[] {
  return PERMISSIONS.map(p => p.key).filter(key => formData.get(`perm_${key}`) === 'on');
}

export async function createUserAction(formData: FormData) {
  const session = await requireOwner();
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim().toLowerCase();
  const password = String(formData.get('password') || '');
  const isOwner = formData.get('isOwner') === 'on';

  if (!name || !email || password.length < 8) redirect('/admin/users/new?error=1');

  const existing = await fetchAdminUserByEmail(email);
  if (existing) redirect('/admin/users/new?error=exists');

  const passwordHash = await hashPassword(password);
  const user = await createAdminUser({ name, email, passwordHash, isOwner, permissions: parsePermissions(formData) });
  await logActivity(session, { action: 'user_created', entityType: 'adminUser', entityTitle: `${name} (${email})`, entityId: user._id });
  redirect('/admin/users');
}

export async function updateUserAction(id: string, formData: FormData) {
  const session = await requireOwner();
  const name = String(formData.get('name') || '').trim();
  const isOwner = formData.get('isOwner') === 'on';
  const active = formData.get('active') === 'on';
  const newPassword = String(formData.get('newPassword') || '');
  const permissions = parsePermissions(formData);

  await updateAdminUser(id, { name, isOwner, active, permissions });
  if (newPassword.length >= 8) {
    await updateAdminUserPassword(id, await hashPassword(newPassword));
  }
  await logActivity(session, {
    action: 'permissions_changed',
    entityType: 'adminUser',
    entityTitle: `${name} — ${isOwner ? 'владелец (все права)' : permissions.join(', ') || 'без прав'}`,
    entityId: id,
  });
  redirect('/admin/users');
}
