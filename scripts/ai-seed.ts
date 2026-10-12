/**
 * Наполнение каталога AI-сервисов: задачи, признаки фильтра, карточки.
 *
 * Запуск:
 *   node --experimental-strip-types scripts/ai-seed.ts          # только проверка
 *   node --experimental-strip-types scripts/ai-seed.ts --write  # запись
 *
 * Идемпотентно: _id детерминированный (ai-job-<slug>, ai-service-<slug>),
 * поэтому второй запуск правит, а не плодит копии.
 *
 * Перед записью прогоняется проверка связности. Она нужна не для красоты:
 * галочка у сервиса, которой нет ни в одной группе признаков его задачи,
 * нигде не покажется и молча потеряется. Такую ошибку в Studio не видно.
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { JOBS } from './ai-seed-jobs.ts';
import { SERVICES } from './ai-seed-services.ts';

const WRITE = process.argv.includes('--write');

/** Ключи, которые код выводит из тарифов. Руками их ставить нельзя. */
const DERIVED = new Set(['free', 'nofree', 'cheap', 'mid', 'pricey', 'perseat', 'usage']);

/* ── Проверка связности ──────────────────────────────────────────── */

const problems: string[] = [];
const notes: string[] = [];

const jobSlugs = new Set(JOBS.map(j => j.slug));
if (jobSlugs.size !== JOBS.length) problems.push('задачи: slug повторяется');

// Все признаки по задачам: свои плюс общие, собранные из любой задачи.
const globalKeys = new Set<string>();
for (const job of JOBS)
  for (const g of job.facetGroups)
    if (g.scope === 'global') for (const f of g.items) globalKeys.add(f.key);

const keysForJob = new Map<string, Set<string>>();
for (const job of JOBS) {
  const own = new Set(globalKeys);
  for (const g of job.facetGroups)
    if (g.scope === 'task') for (const f of g.items) own.add(f.key);
  keysForJob.set(job.slug, own);
}

// Один ключ не должен значить разное в разных группах.
const labelOf = new Map<string, string>();
for (const job of JOBS)
  for (const g of job.facetGroups)
    for (const f of g.items) {
      const was = labelOf.get(f.key);
      if (was && was !== f.label.ru)
        problems.push(`признак ${f.key}: две разные подписи — «${was}» и «${f.label.ru}»`);
      labelOf.set(f.key, f.label.ru);
      if (!/^[a-z0-9_-]{1,24}$/.test(f.key)) problems.push(`признак ${f.key}: ключ не проходит валидацию схемы`);
    }

const seenSlug = new Set<string>();
for (const s of SERVICES) {
  if (seenSlug.has(s.slug)) problems.push(`сервис ${s.slug}: slug повторяется`);
  seenSlug.add(s.slug);

  if (!jobSlugs.has(s.job)) problems.push(`сервис ${s.slug}: задачи «${s.job}» нет`);
  const allowed = keysForJob.get(s.job) ?? new Set();
  for (const k of s.facets) {
    if (DERIVED.has(k)) problems.push(`сервис ${s.slug}: признак ${k} выводится из тарифов, ставить руками нельзя`);
    else if (!allowed.has(k)) problems.push(`сервис ${s.slug}: признак ${k} не заведён ни в задаче «${s.job}», ни в общих группах`);
  }
  if (new Set(s.facets).size !== s.facets.length) problems.push(`сервис ${s.slug}: признак повторяется`);

  // Обязательное для публикации карточки.
  if (!s.highlight.ru || !s.highlight.en) problems.push(`сервис ${s.slug}: не заполнено «чем выделяется»`);
  if (!s.tagline.ru || !s.tagline.en) problems.push(`сервис ${s.slug}: нет подзаголовка`);
  if (s.features.ru.length < 3 || s.features.en.length < 3) problems.push(`сервис ${s.slug}: меньше трёх фишек`);
  if (s.features.ru.length !== s.features.en.length) problems.push(`сервис ${s.slug}: число фишек в RU и EN не совпало`);
  if (!s.about.ru || !s.about.en) problems.push(`сервис ${s.slug}: нет текста о компании`);
  if (!/^#[0-9a-f]{6}$/i.test(s.brandColor)) problems.push(`сервис ${s.slug}: цвет ${s.brandColor} не HEX`);
  if (!s.plans.length) problems.push(`сервис ${s.slug}: ни одного тарифа`);
  if (!s.sources.length) problems.push(`сервис ${s.slug}: нет источника`);

  // Цена сверена — значит у тарифов есть числа. Иначе дата ни о чём.
  const hasNumber = s.plans.some(p => typeof p.price === 'number');
  // Цифры может не быть вовсе: оплата идёт за объём, прайс не опубликован или
  // цену назначает магазин приложений. Тогда дата сверки относится к условию,
  // а не к числу, и это нормально — но это стоит видеть в отчёте.
  if (s.priceCheckedAt && !hasNumber) notes.push(`${s.slug} — цифры нет, сверено само условие оплаты`);
  if (!s.priceCheckedAt) notes.push(`${s.slug} — цена не сверена, поле даты оставлено пустым`);
}

// Задача без сервисов нарисует пустую полосу.
for (const job of JOBS) {
  const n = SERVICES.filter(s => s.job === job.slug).length;
  if (n === 0) problems.push(`задача ${job.slug}: ни одного сервиса`);
  else notes.push(`${job.slug}: сервисов ${n}`);
}

console.log(`Задач: ${JOBS.length}, сервисов: ${SERVICES.length}`);
console.log(`Признаков всего: ${labelOf.size}, из них общих: ${globalKeys.size}`);
console.log(`Цена сверена у ${SERVICES.filter(s => s.priceCheckedAt).length} из ${SERVICES.length}`);
for (const n of notes) console.log(`  · ${n}`);

if (problems.length) {
  console.error(`\nОшибок: ${problems.length}`);
  for (const p of problems) console.error(`  ✗ ${p}`);
  process.exit(1);
}
console.log('\nПроверка пройдена.');

if (!WRITE) {
  console.log('Сухой прогон. Для записи добавьте --write.');
  process.exit(0);
}

/* ── Запись ──────────────────────────────────────────────────────── */

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const client = createClient({
  projectId: env.SANITY_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const jobId = (slug: string) => `ai-job-${slug}`;
const svcId = (slug: string) => `ai-service-${slug}`;

let tx = client.transaction();
for (const j of JOBS) {
  tx = tx.createOrReplace({
    _id: jobId(j.slug),
    _type: 'aiJob',
    name: j.name,
    slug: { _type: 'slug', current: j.slug },
    icon: j.icon,
    order: j.order,
    intro: j.intro,
    sortedBy: j.sortedBy,
    hidden: false,
    facetGroups: j.facetGroups.map((g, gi) => ({
      _key: `g${gi}`,
      _type: 'aiFacetGroup',
      title: g.title,
      scope: g.scope,
      openByDefault: Boolean(g.openByDefault),
      items: g.items.map(f => ({ _key: f.key, _type: 'aiFacet', key: f.key, label: f.label })),
    })),
  });
}
await tx.commit();
console.log(`Задач записано: ${JOBS.length}`);

// Карточки пишутся патчем по полям, а не createOrReplace: логотип, плашки
// sponsored/pinned и загруженную редакцией картинку перезапись бы снесла.
// Первый прогон создаёт документ, второй правит только наши поля.
const existing = new Set<string>(
  await client.fetch<string[]>('*[_type == "aiService"]._id')
);

let written = 0;
for (const s of SERVICES) {
  const id = svcId(s.slug);
  const fields: Record<string, unknown> = {
    name: s.name,
    slug: { _type: 'slug', current: s.slug },
    monogram: s.monogram,
    brandColor: s.brandColor,
    job: { _type: 'reference', _ref: jobId(s.job) },
    rank: s.rank,
    website: s.website,
    pricingUrl: s.pricingUrl,
    plans: s.plans.map((p, i) => ({
      _key: `p${i}`,
      _type: 'aiPlan',
      name: p.name,
      price: p.price,
      currency: p.currency ?? 'USD',
      unit: p.unit ?? 'month',
      includes: p.includes,
      recommended: Boolean(p.recommended),
    })),
    facets: s.facets,
    tagline: s.tagline,
    highlight: s.highlight,
    features: s.features,
    about: s.about,
    seoTitle: {
      ru: `${s.name}: тарифы, возможности и для чего подходит`,
      en: `${s.name}: plans, features and what it is for`,
    },
    seoDescription: {
      ru: `${s.tagline.ru}. Тарифы ${s.name} с датой сверки, основные возможности и признаки для фильтра каталога.`,
      en: `${s.tagline.en}. ${s.name} plans with the date they were checked, core features and the catalogue facets.`,
    },
    sources: s.sources,
  };
  if (s.foundedYear) fields.foundedYear = s.foundedYear;
  // Пустое поле честнее выдуманной даты: где не сверяли, дату не ставим и
  // старую, если она была, убираем.
  const unset = s.priceCheckedAt ? [] : ['priceCheckedAt'];
  if (s.priceCheckedAt) fields.priceCheckedAt = s.priceCheckedAt;

  if (!existing.has(id)) {
    await client.create({ _id: id, _type: 'aiService', hidden: false, ...fields });
  } else {
    let patch = client.patch(id).set(fields);
    if (unset.length) patch = patch.unset(unset);
    await patch.commit();
  }
  written += 1;
}
console.log(`Карточек записано: ${written}`);

let secret: string | undefined = env.REVALIDATE_SECRET;
if (!secret) {
  try {
    const home = readFileSync(`${process.env.HOME}/Desktop/AI/.env`, 'utf8');
    secret = home.match(/^REVALIDATE_SECRET=(.*)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '') || undefined;
  } catch {
    // Файла нет — кэш сбрасывается вручную, об этом сказано ниже.
  }
}
if (secret) {
  // Секрет маршрут читает из строки запроса, а не из тела: см.
  // src/app/api/revalidate/route.ts. В теле он молча даёт 401.
  const res = await fetch(
    `https://intokened.com/api/revalidate?secret=${encodeURIComponent(secret)}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ type: 'ai' }),
    }
  );
  console.log(`Сброс кэша: ${res.status}`);
} else {
  console.log('REVALIDATE_SECRET не найден — кэш сбросьте вручную.');
}
