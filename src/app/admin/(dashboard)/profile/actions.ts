'use server';

import { redirect } from 'next/navigation';
import { getAdminSession, verifyPassword, hashPassword } from '@/lib/admin/auth';
import { fetchAdminUserPasswordHash, updateAdminUserPassword } from '@/lib/admin/data';

export async function changeOwnPasswordAction(formData: FormData) {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');

  const currentPassword = String(formData.get('currentPassword') || '');
  const newPassword = String(formData.get('newPassword') || '');
  const newPasswordConfirm = String(formData.get('newPasswordConfirm') || '');

  const currentHash = await fetchAdminUserPasswordHash(session.sub);
  if (!currentHash || !(await verifyPassword(currentPassword, currentHash))) {
    redirect('/admin/profile?error=current');
  }
  if (newPassword.length < 8) {
    redirect('/admin/profile?error=short');
  }
  if (newPassword !== newPasswordConfirm) {
    redirect('/admin/profile?error=mismatch');
  }

  const newHash = await hashPassword(newPassword);
  await updateAdminUserPassword(session.sub, newHash);
  redirect('/admin/profile?success=1');
}
