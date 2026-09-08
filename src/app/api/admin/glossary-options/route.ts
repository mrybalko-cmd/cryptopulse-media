import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin/auth';
import { fetchGlossaryOptions } from '@/lib/admin/glossary';

/**
 * Список терминов для выбора ссылки в редакторе.
 *
 * Отдаётся только вошедшему в админку: сам по себе список не секрет, но
 * открытая ручка над базой — лишняя поверхность без всякой пользы.
 */
export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const options = await fetchGlossaryOptions();
  return NextResponse.json({ options });
}
