import { adminClient, writeClient } from '@/lib/sanity';

/**
 * Слой данных админки для глоссария.
 *
 * Читает через adminClient (без CDN), потому что редактор должен видеть
 * собственную правку сразу, а не через пять минут кэша.
 */

export type GlossaryKind = 'crypto' | 'ai';

export interface AdminGlossaryRow {
  _id: string;
  kind: GlossaryKind;
  slug: string;
  termRu: string;
  termEn: string;
  category?: string;
  updated?: string;
  sectionCount: number;
  exampleCount: number;
  aliasCount: number;
  autolink: boolean;
}

const ROW_FIELDS = `
  _id, kind, category, updated,
  "slug": slug.current,
  "termRu": term.ru,
  "termEn": term.en,
  "sectionCount": count(sections),
  "exampleCount": count(sections[defined(example)]),
  "aliasCount": count(aliases.ru) + count(aliases.en),
  "autolink": coalesce(autolink, true)
`;

export async function fetchAdminGlossary(): Promise<AdminGlossaryRow[]> {
  const rows = await adminClient.fetch<AdminGlossaryRow[]>(
    `*[_type=="glossaryTerm"] | order(term.ru asc){${ROW_FIELDS}}`,
  );
  return (rows || []).map(r => ({
    ...r,
    sectionCount: r.sectionCount || 0,
    exampleCount: r.exampleCount || 0,
    aliasCount: r.aliasCount || 0,
  }));
}

export async function fetchAdminGlossaryTerm(id: string) {
  return adminClient.fetch(
    `*[_type=="glossaryTerm" && _id==$id][0]{
       ..., "slug": slug.current,
       "relatedRefs": related[]{ "id": @->_id, "termRu": @->term.ru, "kind": @->kind, "slug": @->slug.current }
     }`,
    { id },
  );
}

/** Кандидаты для поля «связанные термины» и для выбора ссылки в редакторе.
 *  Один и тот же список: и там и там нужно найти термин по слову. */
export interface GlossaryPickerOption {
  _id: string;
  kind: GlossaryKind;
  slug: string;
  termRu: string;
  termEn: string;
  aliasesRu: string[];
  aliasesEn: string[];
}

export async function fetchGlossaryOptions(): Promise<GlossaryPickerOption[]> {
  const rows = await adminClient.fetch<GlossaryPickerOption[]>(
    `*[_type=="glossaryTerm"] | order(term.ru asc){
       _id, kind, "slug": slug.current,
       "termRu": term.ru, "termEn": term.en,
       "aliasesRu": coalesce(aliases.ru, []), "aliasesEn": coalesce(aliases.en, [])
     }`,
  );
  return rows || [];
}

/** Сколько материалов уже ссылаются на этот адрес. Показывается рядом с полем
 *  адреса: сменить slug у термина, на который стоит тридцать ссылок, —
 *  это тридцать битых ссылок, и знать об этом надо до, а не после. */
export async function countGlossaryMentions(kind: GlossaryKind, slug: string): Promise<number> {
  const base = kind === 'ai' ? 'ai/glossary' : 'glossary';
  const needle = `/${base}/${slug}`;
  return adminClient.fetch<number>(
    `count(*[_type in ["news","article"] && count(body[].markDefs[@.href match $needle]) > 0])`,
    { needle: `*${needle}*` },
  );
}

export async function glossarySlugTaken(kind: GlossaryKind, slug: string, exceptId?: string) {
  const n = await adminClient.fetch<number>(
    `count(*[_type=="glossaryTerm" && kind==$kind && slug.current==$slug && _id != $except])`,
    { kind, slug, except: exceptId || 'none' },
  );
  return n > 0;
}

export interface GlossaryTermInput {
  kind: GlossaryKind;
  termLinkUrl: string;
  termLinkRel: 'nofollow' | 'dofollow';
  slug: string;
  termRu: string;
  termEn: string;
  definitionRu: string;
  definitionEn: string;
  category?: string;
  aliasesRu: string[];
  aliasesEn: string[];
  autolink: boolean;
  updated?: string;
  relatedIds: string[];
  sections: unknown[];
}

function setFields(input: GlossaryTermInput) {
  return {
    kind: input.kind,
    slug: { _type: 'slug', current: input.slug },
    term: { ru: input.termRu, en: input.termEn },
    termLink: input.termLinkUrl
      ? { url: input.termLinkUrl, rel: input.termLinkRel }
      : undefined,
    definition: { ru: input.definitionRu, en: input.definitionEn },
    category: input.kind === 'ai' ? undefined : input.category || undefined,
    aliases: { ru: input.aliasesRu, en: input.aliasesEn },
    autolink: input.autolink,
    updated: input.updated || undefined,
    related: input.relatedIds.map((id, i) => ({ _key: `rel${i}`, _type: 'reference', _ref: id })),
    sections: input.sections,
  };
}

export async function createGlossaryTerm(input: GlossaryTermInput) {
  return writeClient.create({ _type: 'glossaryTerm', ...setFields(input) } as never);
}

export async function updateGlossaryTerm(id: string, input: GlossaryTermInput) {
  await writeClient.patch(id).set(setFields(input) as never).commit({ autoGenerateArrayKeys: false });
}

/** База не даст удалить документ, на который кто-то ссылается, поэтому сначала
 *  снимаем его из чужих списков «связанные термины», а потом удаляем. */
export async function deleteGlossaryTerm(id: string) {
  const referrers = await adminClient.fetch<{ _id: string }[]>(
    `*[_type=="glossaryTerm" && references($id)]{_id}`, { id },
  );
  for (const r of referrers) {
    await writeClient.patch(r._id).unset([`related[_ref=="${id}"]`]).commit();
  }
  await writeClient.delete(id);
}
