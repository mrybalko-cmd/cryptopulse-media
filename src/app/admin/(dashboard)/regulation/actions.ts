'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import {
  createRegulationCountry,
  updateRegulationCountry,
  deleteRegulationCountry,
  fetchAdminRegulationCountryById,
  regulationIso2Taken,
  REG_PAGE_FIELDS,
  type RegulationCountryInput,
  type RegPageText,
} from '@/lib/admin/data';
import { logActivity } from '@/lib/admin/activityLog';

function parseInput(formData: FormData): RegulationCountryInput {
  const s = (k: string) => String(formData.get(k) || '').trim();

  // The page textareas are named `page.<field>.<lang>`, so one loop covers all
  // twenty-two of them and a new section needs no change here.
  const page: RegPageText = {};
  for (const f of REG_PAGE_FIELDS) {
    const ru = s(`page.${f}.ru`);
    const en = s(`page.${f}.en`);
    if (ru || en) page[f] = { ...(ru ? { ru } : {}), ...(en ? { en } : {}) };
  }

  return {
    iso2: s('iso2').toUpperCase(),
    isoNum: s('isoNum'),
    slug: s('slug'),
    status: s('status') as RegulationCountryInput['status'],
    region: s('region') as RegulationCountryInput['region'],
    nameRu: s('nameRu'),
    nameEn: s('nameEn'),
    summaryRu: s('summaryRu'),
    summaryEn: s('summaryEn'),
    detailsRu: s('detailsRu'),
    detailsEn: s('detailsEn'),
    taxNoteRu: s('taxNoteRu'),
    taxNoteEn: s('taxNoteEn'),
    factNoteRu: s('factNoteRu'),
    factNoteEn: s('factNoteEn'),
    regulatorName: s('regulatorName'),
    sourceUrl: s('sourceUrl'),
    checkedAt: s('checkedAt'),
    hasPage: formData.get('hasPage') === 'on',
    page,
  };
}

/**
 * The public map caches its read for five minutes. Without this an editor would
 * fix a country, reload the page, see the old text and reasonably conclude the
 * save had not worked.
 */
function publishNow() {
  revalidateTag('regulation', { expire: 0 });
}

export async function createRegulationCountryAction(formData: FormData) {
  await requireAdminPermission('regulation');
  const input = parseInput(formData);
  if (await regulationIso2Taken(input.iso2)) {
    throw new Error(`Страна с кодом ${input.iso2} уже есть на карте.`);
  }
  const doc = await createRegulationCountry(input);
  publishNow();
  redirect(`/admin/regulation/${doc._id}`);
}

export async function updateRegulationCountryAction(id: string, formData: FormData) {
  await requireAdminPermission('regulation');
  const input = parseInput(formData);
  if (await regulationIso2Taken(input.iso2, id)) {
    throw new Error(`Код ${input.iso2} занят другой страной.`);
  }
  await updateRegulationCountry(id, input);
  publishNow();
  redirect(`/admin/regulation/${id}`);
}

export async function deleteRegulationCountryAction(id: string) {
  const session = await requireAdminPermission('regulation');
  const doc = await fetchAdminRegulationCountryById(id);
  await deleteRegulationCountry(id);
  await logActivity(session, {
    action: 'delete',
    entityType: 'regulationCountry',
    entityTitle: doc ? `${doc.nameRu} (${doc.iso2})` : id,
    entityId: id,
  });
  publishNow();
  redirect('/admin/regulation');
}
