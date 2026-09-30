'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { updateAdminHomeSettings, type HomeSettingsInput, fetchMaterialOptionsForAuthors } from '@/lib/admin/data';

export async function updateHomeSettingsAction(formData: FormData) {
  await requireAdminPermission('homepage');

  const featuredAuthors: HomeSettingsInput['featuredAuthors'] = [];
  let i = 0;
  while (formData.has(`slot_authorId_${i}`)) {
    const authorId = String(formData.get(`slot_authorId_${i}`) || '');
    const materialRuId = String(formData.get(`slot_materialRuId_${i}`) || '');
    const materialEnId = String(formData.get(`slot_materialEnId_${i}`) || '');
    if (authorId && materialRuId && materialEnId) {
      featuredAuthors.push({ authorId, materialRuId, materialEnId });
    }
    i++;
  }

  const input: HomeSettingsInput = {
    showNews: formData.get('showNews') === 'on',
    showArticles: formData.get('showArticles') === 'on',
    showAuthorColumns: formData.get('showAuthorColumns') === 'on',
    featuredAuthors,
  };

  await updateAdminHomeSettings(input);
  revalidateTag('homeSettings', { expire: 0 });
  redirect('/admin/homepage?success=1');
}

/**
 * Материалы одного автора для подборщика колонок на главной.
 *
 * Страница отдаёт при загрузке только материалы тех авторов, что уже стоят
 * в колонках. Стоит редактору сменить автора в колонке — список подтягивается
 * этим действием, а не приезжает заранее весь архив на две тысячи записей.
 */
export async function loadAuthorMaterialsAction(authorId: string) {
  await requireAdminPermission('homepage');
  if (!authorId) return { ru: [], en: [] };
  const [ru, en] = await Promise.all([
    fetchMaterialOptionsForAuthors('ru', [authorId]),
    fetchMaterialOptionsForAuthors('en', [authorId]),
  ]);
  return { ru, en };
}
