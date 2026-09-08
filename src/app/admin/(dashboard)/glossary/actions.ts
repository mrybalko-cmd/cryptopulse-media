'use server';

import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';
import { requireAdminPermission } from '@/lib/admin/auth';
import { logActivity } from '@/lib/admin/activityLog';
import {
  createGlossaryTerm, updateGlossaryTerm, deleteGlossaryTerm,
  glossarySlugTaken, fetchAdminGlossaryTerm,
  type GlossaryTermInput, type GlossaryKind,
} from '@/lib/admin/glossary';

/** Страницы глоссария читают через unstable_cache на пять минут. Без сброса
 *  редактор сохранил бы термин, обновил страницу, увидел старый текст
 *  и решил бы, что сохранение не сработало. */
function publishNow() {
  revalidateTag('glossary', { expire: 0 });
}


/**
 * Приводит разделы к тому виду, в котором их хранит база.
 *
 * Форма создаёт новый раздел с `_key`, но без `_type`, и Sanity сохраняет его
 * как есть: содержимое цело, сайт рисует, а в Studio раздел становится
 * объектом неизвестного типа и расходится с перенесёнными. Патч идёт
 * с `autoGenerateArrayKeys: false`, поэтому ключи тоже проставляем здесь,
 * а не надеемся на клиента.
 */
function normalizeSections(raw: unknown): unknown[] {
  const key = (i: number, p = 's') => `${p}${i}_${Math.random().toString(36).slice(2, 8)}`;
  const keyed = (arr: unknown, prefix: string) =>
    Array.isArray(arr) && arr.length
      ? arr.map((x, i) => ({ ...(x as object), _key: (x as any)?._key || key(i, prefix) }))
      : undefined;

  if (!Array.isArray(raw)) return [];
  return raw.map((s: any, i: number) => {
    const example = s?.example
      ? {
          ...s.example,
          rows: keyed(s.example.rows, 'r') || [],
        }
      : undefined;
    return {
      _type: 'section',
      _key: s?._key || key(i),
      heading: s?.heading || {},
      ...(keyed(s?.paragraphs, 'p') ? { paragraphs: keyed(s.paragraphs, 'p') } : {}),
      ...(keyed(s?.bullets, 'b') ? { bullets: keyed(s.bullets, 'b') } : {}),
      ...(example ? { example } : {}),
    };
  });
}

function parseInput(formData: FormData): GlossaryTermInput {
  const s = (k: string) => String(formData.get(k) || '').trim();
  const tags = (k: string) =>
    s(k).split(',').map(x => x.trim()).filter(Boolean);

  // Разделы приходят одним полем JSON: их редактирует клиентский компонент,
  // и собирать вложенные массивы из плоских имён формы было бы хрупко.
  let sections: unknown[] = [];
  try {
    sections = JSON.parse(String(formData.get('sectionsJson') || '[]'));
  } catch {
    throw new Error('Разделы не удалось разобрать. Обновите страницу и попробуйте снова.');
  }

  return {
    kind: (s('kind') || 'crypto') as GlossaryKind,
    termLinkUrl: s('termLinkUrl'),
    termLinkRel: (s('termLinkRel') || 'nofollow') as 'nofollow' | 'dofollow',
    slug: s('slug'),
    termRu: s('termRu'),
    termEn: s('termEn'),
    definitionRu: s('definitionRu'),
    definitionEn: s('definitionEn'),
    category: s('category'),
    aliasesRu: tags('aliasesRu'),
    aliasesEn: tags('aliasesEn'),
    autolink: formData.get('autolink') === 'on',
    updated: s('updated'),
    relatedIds: String(formData.get('relatedIds') || '').split(',').map(x => x.trim()).filter(Boolean),
    sections: normalizeSections(sections),
  };
}

export async function createGlossaryTermAction(formData: FormData) {
  await requireAdminPermission('glossary');
  const input = parseInput(formData);
  if (!input.slug) throw new Error('Адрес обязателен.');
  if (await glossarySlugTaken(input.kind, input.slug)) {
    throw new Error(`Термин с адресом ${input.slug} в этом словаре уже есть.`);
  }
  const doc = await createGlossaryTerm(input);
  publishNow();
  redirect(`/admin/glossary/${doc._id}?saved=1`);
}

export async function updateGlossaryTermAction(id: string, formData: FormData) {
  await requireAdminPermission('glossary');
  const input = parseInput(formData);
  if (await glossarySlugTaken(input.kind, input.slug, id)) {
    throw new Error(`Адрес ${input.slug} занят другим термином этого словаря.`);
  }
  await updateGlossaryTerm(id, input);
  publishNow();
  redirect(`/admin/glossary/${id}?saved=1`);
}

export async function deleteGlossaryTermAction(id: string) {
  const session = await requireAdminPermission('glossary');
  const doc = await fetchAdminGlossaryTerm(id);
  await deleteGlossaryTerm(id);
  await logActivity(session, {
    action: 'delete',
    entityType: 'glossaryTerm',
    entityTitle: doc?.term?.ru ? `${doc.term.ru} (${doc.slug})` : id,
    entityId: id,
  });
  publishNow();
  redirect('/admin/glossary');
}
