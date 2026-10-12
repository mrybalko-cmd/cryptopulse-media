'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import type { AdminAiService, AdminAiJob, AdminFacetGroup } from '@/lib/admin/aiData';
import SubmitButton from '../_shared/SubmitButton';
import SavedMark from '../_shared/SavedMark';

/**
 * Карточка AI-сервиса целиком.
 *
 * Признаки фильтра — галочки из набора задачи, а не свободный текст. Это
 * главное решение формы: стоит дать поле ввода, и через месяц в фильтре будут
 * «4K», «4к» и «разрешение 4K» тремя разными пунктами. Набор правится в
 * соседнем разделе, здесь только отмечается.
 *
 * Цена на карточке и ступень фильтра считаются из тарифов и отдельным полем
 * не хранятся — одно место правды. Поэтому сводка внизу блока тарифов
 * показывает, что именно увидит читатель, пока редактор ещё печатает.
 */

const FIELD = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 text-[13px]';
const LABEL = 'block text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] mb-1.5 font-bold';
const HINT = 'text-[11px] text-[var(--admin-text-muted)] mt-1 leading-relaxed';
const SECTION = 'mt-8 pt-7 border-t border-[var(--admin-border)]';

const UNITS: { value: string; label: string }[] = [
  { value: 'month', label: 'в месяц' },
  { value: 'seat', label: 'в месяц за человека' },
  { value: 'usage', label: 'за объём' },
  { value: 'once', label: 'единоразово' },
];

interface PlanRow {
  key: string; name: string; price: string; currency: string; unit: string;
  incRu: string; incEn: string;
}

export default function AiServiceForm({
  service,
  jobs,
  facetGroups,
  action,
  deleteAction,
}: {
  service?: AdminAiService;
  jobs: AdminAiJob[];
  facetGroups: AdminFacetGroup[];
  action: (formData: FormData) => void;
  deleteAction?: () => void;
}) {
  const nextKey = useRef(0);
  const [plans, setPlans] = useState<PlanRow[]>(() =>
    service?.plans.length
      ? service.plans.map((p, i) => ({
          key: p._key || `pl${i}`,
          name: p.name ?? '',
          price: p.price === null || p.price === undefined ? '' : String(p.price),
          currency: p.currency ?? 'USD',
          unit: p.unit ?? 'month',
          incRu: p.includes?.ru ?? '',
          incEn: p.includes?.en ?? '',
        }))
      : [{ key: 'pl0', name: '', price: '', currency: 'USD', unit: 'month', incRu: '', incEn: '' }]
  );
  const [recommended, setRecommended] = useState(
    String(service?.plans.findIndex(p => p.recommended) ?? -1)
  );
  const [jobId, setJobId] = useState(service?.jobId ?? jobs[0]?._id ?? '');
  const [brand, setBrand] = useState(service?.brandColor ?? '#111827');
  const [onDark, setOnDark] = useState(service?.logoOnDark ?? false);

  const set = (key: string, patch: Partial<PlanRow>) =>
    setPlans(v => v.map(p => (p.key === key ? { ...p, ...patch } : p)));

  // Ступень и цена «от» считаются той же логикой, что на сайте: повторяющиеся
  // платежи, без разовых и без оплаты за объём.
  const recurring = plans
    .filter(p => p.name.trim() && p.unit !== 'usage' && p.unit !== 'once')
    .map(p => Number(p.price.replace(',', '.')))
    .filter(v => Number.isFinite(v) && v > 0);
  const from = recurring.length ? Math.min(...recurring) : null;
  const hasFree = plans.some(p => p.name.trim() && Number(p.price.replace(',', '.')) === 0 && p.price.trim() !== '');
  const band = from === null ? '—' : from < 12 ? 'до $12' : from <= 25 ? '$12–25' : 'от $25';

  return (
    <form action={action} className="max-w-[940px]">
      {/* ── Основное ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL} htmlFor="name">Название</label>
          <input id="name" name="name" required defaultValue={service?.name} className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="slug">Адрес</label>
          <input id="slug" name="slug" required defaultValue={service?.slug} className={FIELD}
            pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="midjourney" />
          <p className={HINT}>
            Латиницей через дефис. У опубликованной карточки менять нельзя:
            старая ссылка перестанет открываться.
          </p>
        </div>

        <div>
          <label className={LABEL} htmlFor="jobId">Задача</label>
          <select id="jobId" name="jobId" value={jobId} className={FIELD}
            onChange={e => setJobId(e.target.value)}>
            {jobs.map(j => <option key={j._id} value={j._id}>{j.nameRu || j.slug}</option>)}
          </select>
          <p className={HINT}>
            От неё зависит, какие признаки фильтра доступны карточке. Сменили
            задачу — сохраните, и список галочек ниже обновится.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={LABEL} htmlFor="rank">Место в рейтинге</label>
            <input id="rank" name="rank" inputMode="numeric" defaultValue={service?.rank ?? ''} className={FIELD} />
          </div>
          <div>
            <label className={LABEL} htmlFor="foundedYear">Год основания</label>
            <input id="foundedYear" name="foundedYear" inputMode="numeric"
              defaultValue={service?.foundedYear ?? ''} className={FIELD} />
          </div>
        </div>

        <div>
          <label className={LABEL} htmlFor="website">Сайт</label>
          <input id="website" name="website" type="url" defaultValue={service?.website} className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="pricingUrl">Ссылка «Детали»</label>
          <input id="pricingUrl" name="pricingUrl" type="url" defaultValue={service?.pricingUrl} className={FIELD} />
          <p className={HINT}>Прайс компании. Пусто — ссылка на карточке не рисуется.</p>
        </div>
      </div>

      {/* ── Логотип ───────────────────────────────────────────── */}
      <div className={SECTION}>
        <h2 className="text-[15px] font-bold mb-3">Логотип</h2>
        <div className="flex gap-4 items-start flex-wrap">
          <span
            className="w-[76px] h-[76px] rounded-xl grid place-items-center overflow-hidden shrink-0 border border-[var(--admin-border)]"
            style={{ background: service?.logoUrl ? (onDark ? '#15161a' : '#ffffff') : brand }}
          >
            {service?.logoUrl ? (
              <Image src={service.logoUrl} alt="" width={76} height={76} className="w-full h-full object-contain p-2.5" />
            ) : (
              <b className="text-white text-[22px] tracking-tight">
                {(service?.monogram || service?.name?.slice(0, 2) || 'AI').toUpperCase()}
              </b>
            )}
          </span>
          <div className="flex-1 min-w-[260px]">
            <input type="file" name="logo" accept=".png,.svg,.webp" className="text-[12.5px]" />
            <p className={HINT}>
              Квадрат, минимум 256×256, прозрачный фон. Пока файла нет, рисуется
              монограмма на фирменном цвете — раздел не ломается из-за
              отсутствующей картинки.
            </p>
            <label className="flex items-center gap-2.5 text-[12.5px] font-semibold mt-3">
              <input type="checkbox" name="logoOnDark" checked={onDark}
                onChange={e => setOnDark(e.target.checked)} />
              Знак светлый — нужна тёмная подложка
            </label>
            <p className={HINT}>
              Белый знак на белой плашке исчезает, тёмный на тёмной — тоже.
              При загрузке скриптом ставится само по яркости знака.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-[220px]">
            <div>
              <label className={LABEL} htmlFor="monogram">Монограмма</label>
              <input id="monogram" name="monogram" maxLength={3}
                defaultValue={service?.monogram} className={FIELD} />
            </div>
            <div>
              <label className={LABEL} htmlFor="brandColor">Цвет плашки</label>
              <input id="brandColor" name="brandColor" value={brand}
                onChange={e => setBrand(e.target.value)}
                pattern="#[0-9a-fA-F]{6}" className={FIELD} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Тарифы ────────────────────────────────────────────── */}
      <div className={SECTION}>
        <h2 className="text-[15px] font-bold mb-1.5">Тарифы</h2>
        <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-3 max-w-[76ch]">
          Цена на карточке и ступень фильтра считаются отсюда. Ноль — бесплатный
          тариф, пустая цена — «по запросу». Разовые платежи и оплата за объём
          в цену «от» не входят: иначе доплата за единицу работы встала бы на
          место месячной подписки.
        </p>

        <div className="border border-[var(--admin-border)] rounded-xl overflow-hidden mb-3">
          <table className="w-full text-[12.5px] border-collapse">
            <thead>
              <tr className="bg-[var(--admin-input)] text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)]">
                <th className="text-left font-bold px-2.5 py-2.5 w-[150px]">Название</th>
                <th className="text-left font-bold px-2.5 py-2.5 w-[90px]">Цена</th>
                <th className="text-left font-bold px-2.5 py-2.5 w-[80px]">Валюта</th>
                <th className="text-left font-bold px-2.5 py-2.5 w-[150px]">За что</th>
                <th className="text-left font-bold px-2.5 py-2.5">Что входит · RU / EN</th>
                <th className="w-[56px] text-center font-bold px-1 py-2.5 text-[10px]">Чаще берут</th>
                <th className="w-[40px]" />
              </tr>
            </thead>
            <tbody>
              {plans.map((p, i) => (
                <tr key={p.key} className="border-t border-[var(--admin-border)] align-top">
                  <td className="px-2 py-2">
                    <input name="plan_name" value={p.name} aria-label={`Название тарифа ${i + 1}`}
                      className={FIELD} onChange={e => set(p.key, { name: e.target.value })} />
                  </td>
                  <td className="px-2 py-2">
                    <input name="plan_price" value={p.price} inputMode="decimal"
                      aria-label={`Цена тарифа ${i + 1}`} className={`${FIELD} tabular-nums`}
                      onChange={e => set(p.key, { price: e.target.value })} />
                  </td>
                  <td className="px-2 py-2">
                    <select name="plan_currency" value={p.currency} aria-label={`Валюта тарифа ${i + 1}`}
                      className={FIELD} onChange={e => set(p.key, { currency: e.target.value })}>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <select name="plan_unit" value={p.unit} aria-label={`За что платят, тариф ${i + 1}`}
                      className={FIELD} onChange={e => set(p.key, { unit: e.target.value })}>
                      {UNITS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2">
                    <input name="plan_inc_ru" value={p.incRu} placeholder="без лимита, свой словарь"
                      aria-label={`Что входит, русский, тариф ${i + 1}`} className={`${FIELD} mb-1.5`}
                      onChange={e => set(p.key, { incRu: e.target.value })} />
                    <input name="plan_inc_en" value={p.incEn} placeholder="unlimited, custom dictionary"
                      aria-label={`Что входит, английский, тариф ${i + 1}`} className={FIELD}
                      onChange={e => set(p.key, { incEn: e.target.value })} />
                  </td>
                  <td className="px-1 py-2 text-center">
                    <input type="radio" name="plan_recommended" value={String(i)}
                      aria-label={`Пометить тариф ${i + 1} как «чаще берут»`}
                      checked={recommended === String(i)} onChange={() => setRecommended(String(i))} />
                  </td>
                  <td className="px-1 py-2 text-center">
                    <button type="button" aria-label={`Убрать тариф ${i + 1}`} disabled={plans.length === 1}
                      onClick={() => setPlans(v => v.filter(x => x.key !== p.key))}
                      className="w-7 h-7 rounded-md border border-[var(--admin-border)] text-[var(--admin-text-muted)] disabled:opacity-35">
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" disabled={plans.length >= 6}
            onClick={() => setPlans(v => [...v, {
              key: `new${nextKey.current++}`, name: '', price: '', currency: 'USD',
              unit: 'month', incRu: '', incEn: '',
            }])}
            className="border border-[var(--admin-border)] text-[12.5px] font-bold rounded-lg px-3.5 py-2 disabled:opacity-40">
            + Добавить тариф
          </button>
          <span className="text-[12px] text-[var(--admin-text-muted)]">
            На карточке покажется: <b className="text-[var(--admin-text)]">{from === null ? 'по запросу' : `от ${from}`}</b>
            {' · '}ступень фильтра: <b className="text-[var(--admin-text)]">{band}</b>
            {' · '}{hasFree ? 'есть бесплатный тариф' : 'бесплатного тарифа нет'}
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mt-5">
          <div>
            <label className={LABEL} htmlFor="priceCheckedAt">Цена сверена</label>
            <input id="priceCheckedAt" name="priceCheckedAt" type="date"
              defaultValue={service?.priceCheckedAt ?? ''} className={FIELD} />
            <p className={HINT}>
              Пусто — карточка честно напишет «цена не сверена». Пустое поле
              честнее выдуманной даты.
            </p>
          </div>
          <div>
            <label className={LABEL} htmlFor="sources">Источники</label>
            <textarea id="sources" name="sources" rows={3} className={FIELD}
              defaultValue={(service?.sources ?? []).join('\n')} placeholder="https://..." />
            <p className={HINT}>По ссылке на строку. Откуда взяты цифры.</p>
          </div>
        </div>
      </div>

      {/* ── Фильтры ───────────────────────────────────────────── */}
      <div className={SECTION}>
        <h2 className="text-[15px] font-bold mb-1.5">К каким фильтрам относится</h2>
        <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-4 max-w-[76ch]">
          Набор задаётся в разделе «AI filters», здесь только отмечается.
          Непроверенное не отмечаем: галочка — это утверждение о сервисе.
          Цена, бесплатный тариф и оплата за человека выводятся из тарифов сами
          и в списке не показаны.
        </p>
        {facetGroups.length === 0 ? (
          <p className="text-[13px] text-[var(--admin-text-muted)]">
            У этой задачи нет ни одной группы признаков. Заведите их в разделе «AI filters».
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {facetGroups.map(g => (
              <fieldset key={`${g.titleRu}-${g.scope}`} className="m-0 p-0 border-0">
                <legend className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-dim)] mb-1.5 font-bold">
                  {g.titleRu}
                  {g.scope === 'global' && <span className="normal-case tracking-normal font-semibold"> · общая</span>}
                </legend>
                {g.items.map(f => (
                  <label key={f.key} className="flex items-start gap-2.5 py-1 text-[12.5px] leading-[1.35]">
                    <input type="checkbox" name="facets" value={f.key}
                      defaultChecked={service?.facets.includes(f.key)} className="mt-0.5" />
                    <span>
                      {f.labelRu}
                      <span className="text-[var(--admin-text-dim)] font-mono text-[10.5px]"> {f.key}</span>
                    </span>
                  </label>
                ))}
              </fieldset>
            ))}
          </div>
        )}
      </div>

      {/* ── Тексты ────────────────────────────────────────────── */}
      <div className={SECTION}>
        <h2 className="text-[15px] font-bold mb-1.5">Тексты</h2>
        <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-4 max-w-[76ch]">
          Русский и английский пишутся отдельно, не переводом друг друга.
        </p>
        <Bilingual id="tagline" label="Подзаголовок" hint="Одна строка под названием на карточке." value={service?.tagline} />
        <Bilingual id="highlight" label="Чем выделяется" rows={2}
          hint="Одна фраза про то, что умеет только этот сервис. Карточка без неё бессмысленна: всё остальное есть у соседей."
          value={service?.highlight} />
        <BilingualList id="features" label="Основные фишки"
          hint="По пункту на строку, три-пять. Первые три выводятся прямо на карточке в хабе."
          value={service?.features} />
        <Bilingual id="about" label="О компании" rows={7}
          hint="Четыре-семь предложений: когда основана, кто основатели, как растёт, что делает."
          value={service?.about} />
        <BilingualList id="pros" label="Плюсы" hint="По пункту на строку." value={service?.pros} />
        <BilingualList id="cons" label="Минусы" hint="По пункту на строку." value={service?.cons} />
      </div>

      {/* ── Поиск ─────────────────────────────────────────────── */}
      <div className={SECTION}>
        <h2 className="text-[15px] font-bold mb-4">Для поиска</h2>
        <Bilingual id="seoTitle" label="Заголовок" value={service?.seoTitle} />
        <Bilingual id="seoDescription" label="Описание" rows={3} value={service?.seoDescription} />
      </div>

      {/* ── Служебное ─────────────────────────────────────────── */}
      <div className={SECTION}>
        <h2 className="text-[15px] font-bold mb-3">Положение в разделе</h2>
        <div className="grid gap-2.5">
          <label className="flex items-center gap-2.5 text-[12.5px] font-semibold">
            <input type="checkbox" name="pinned" defaultChecked={service?.pinned} />
            Закрепить в начале списка
          </label>
          <label className="flex items-center gap-2.5 text-[12.5px] font-semibold">
            <input type="checkbox" name="sponsored" defaultChecked={service?.sponsored} />
            Размещение оплачено
          </label>
          <label className="flex items-center gap-2.5 text-[12.5px] font-semibold">
            <input type="checkbox" name="hidden" defaultChecked={service?.hidden} />
            Скрыть карточку с сайта
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-8">
        <SubmitButton className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
          Сохранить
        </SubmitButton>
        <SavedMark />
        <Link href="/admin/ai" className="text-[12.5px] text-[var(--admin-text-muted)]">Отмена</Link>
        {deleteAction && (
          <button type="submit" formAction={deleteAction}
            className="ml-auto text-[12.5px] font-bold text-red-400 border border-red-400/30 rounded-lg px-3.5 py-2">
            Удалить карточку
          </button>
        )}
      </div>
    </form>
  );
}

function Bilingual({
  id, label, hint, rows, value,
}: { id: string; label: string; hint?: string; rows?: number; value?: { ru?: string; en?: string } }) {
  const Tag = rows ? 'textarea' : 'input';
  return (
    <div className="mb-5">
      <span className={LABEL}>{label}</span>
      <div className="grid gap-3 sm:grid-cols-2">
        <Tag id={`${id}_ru`} name={`${id}_ru`} rows={rows} defaultValue={value?.ru ?? ''}
          aria-label={`${label}, русский`} placeholder="Русский" className={FIELD} />
        <Tag id={`${id}_en`} name={`${id}_en`} rows={rows} defaultValue={value?.en ?? ''}
          aria-label={`${label}, английский`} placeholder="English" className={FIELD} />
      </div>
      {hint && <p className={HINT}>{hint}</p>}
    </div>
  );
}

function BilingualList({
  id, label, hint, value,
}: { id: string; label: string; hint?: string; value?: { ru?: string[]; en?: string[] } }) {
  return (
    <div className="mb-5">
      <span className={LABEL}>{label}</span>
      <div className="grid gap-3 sm:grid-cols-2">
        <textarea id={`${id}_ru`} name={`${id}_ru`} rows={4} defaultValue={(value?.ru ?? []).join('\n')}
          aria-label={`${label}, русский`} placeholder="Русский, по пункту на строку" className={FIELD} />
        <textarea id={`${id}_en`} name={`${id}_en`} rows={4} defaultValue={(value?.en ?? []).join('\n')}
          aria-label={`${label}, английский`} placeholder="English, one item per line" className={FIELD} />
      </div>
      {hint && <p className={HINT}>{hint}</p>}
    </div>
  );
}
