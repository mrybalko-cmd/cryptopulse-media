'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { updateAdminHomeSettings, type HomeSettingsInput } from '@/lib/admin/data';

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
