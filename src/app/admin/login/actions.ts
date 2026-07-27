'use server';

import { redirect } from 'next/navigation';
import { fetchAdminUserByEmail } from '@/lib/admin/data';
import { verifyPassword, createSessionCookie } from '@/lib/admin/auth';
import type { Permission } from '@/lib/admin/permissions';

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  if (!email || !password) redirect('/admin/login?error=1');

  const user = await fetchAdminUserByEmail(email);
  // Same generic error whether the account doesn't exist, is disabled, or
  // the password is wrong — never reveal which one to an unauthenticated caller.
  if (!user || !user.active || !user.passwordHash) redirect('/admin/login?error=1');

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) redirect('/admin/login?error=1');

  await createSessionCookie({
    sub: user._id,
    email: user.email,
    name: user.name,
    isOwner: user.isOwner,
    permissions: user.permissions as Permission[],
  });

  redirect('/admin');
}
