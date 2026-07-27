'use server';

import { redirect } from 'next/navigation';
import { clearSessionCookie } from '@/lib/admin/auth';

export async function logoutAction() {
  await clearSessionCookie();
  redirect('/admin/login');
}
