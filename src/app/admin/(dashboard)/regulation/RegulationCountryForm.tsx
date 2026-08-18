import type { AdminRegulationCountryDoc } from '@/lib/admin/data';
import SlugInput from '../_shared/SlugInput';
import SubmitButton from '../_shared/SubmitButton';

const inputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]';
const areaCls = `${inputCls} leading-relaxed`;
const labelCls = 'text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block';
const hintCls = 'text-[11px] text-[var(--admin-text-dim)] mt-1';
const cardCls = 'border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] p-4 mb-5';
const cardTitleCls = 'text-[11px] font-bold uppercase tracking-wider text-[var(--admin-text-dim)] mb-4';

const STATUS_OPTIONS = [
  { value: 'legal', label: 'Разрешено', color: '#22c55e' },
  { value: 'restricted', label: 'С ограничениями', color: '#f59e0b' },
  { value: 'banned', label: 'Запрещено', color: '#ef4444' },
  { value: 'unclear', label: 'Нет данных / серая зона', color: '#6b7280' },
];

const REGION_OPTIONS = [
  { value: 'eu', label: 'Европа' },
  { value: 'americas', label: 'Америка' },
  { value: 'asia', label: 'Азия' },
  { value: 'mena', label: 'Ближний Восток / Африка' },
];

export default function RegulationCountryForm({
  country,
  action,
}: {
  country?: AdminRegulationCountryDoc;
  action: (formData: FormData) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

        {/* ── texts ───────────────────────────────────────────── */}
        <div>
          <div className={cardCls}>
            <div className={cardTitleCls}>Название</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>По-русски</label>
                <input name="nameRu" defaultValue={country?.nameRu} required className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>In English</label>
                <input name="nameEn" defaultValue={country?.nameEn} required className={inputCls} />
              </div>
            </div>
          </div>

          <div className={cardCls}>
            <div className={cardTitleCls}>Краткое описание — показывается в карточке на карте</div>
            <label className={labelCls}>По-русски</label>
            <textarea name="summaryRu" defaultValue={country?.summaryRu} required rows={3} className={areaCls} />
            <div className="h-4" />
            <label className={labelCls}>In English</label>
            <textarea name="summaryEn" defaultValue={country?.summaryEn} required rows={3} className={areaCls} />
          </div>

          <div className={cardCls}>
            <div className={cardTitleCls}>Подробности — раскрываются по клику на страну</div>
            <label className={labelCls}>По-русски</label>
            <textarea name="detailsRu" defaultValue={country?.detailsRu} required rows={5} className={areaCls} />
            <div className="h-4" />
            <label className={labelCls}>In English</label>
            <textarea name="detailsEn" defaultValue={country?.detailsEn} required rows={5} className={areaCls} />
          </div>

          <div className={cardCls}>
            <div className={cardTitleCls}>Налоги — самая читаемая часть карточки</div>
            <label className={labelCls}>По-русски</label>
            <textarea name="taxNoteRu" defaultValue={country?.taxNoteRu} rows={3} className={areaCls} />
            <div className="h-4" />
            <label className={labelCls}>In English</label>
            <textarea name="taxNoteEn" defaultValue={country?.taxNoteEn} rows={3} className={areaCls} />
            <p className={hintCls}>Можно оставить пустым — тогда блок про налоги у страны не появится.</p>
          </div>
        </div>

        {/* ── properties ──────────────────────────────────────── */}
        <div>
          <div className={cardCls}>
            <div className={cardTitleCls}>Статус на карте</div>
            <div className="flex flex-col gap-2">
              {STATUS_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-2 text-[12.5px] cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    defaultChecked={(country?.status ?? 'unclear') === opt.value}
                    required
                  />
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: opt.color }} />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <div className={cardCls}>
            <div className={cardTitleCls}>Источник</div>
            <label className={labelCls}>Регулятор</label>
            <input name="regulatorName" defaultValue={country?.regulatorName} placeholder="BaFin, SEC, ЦБ РФ" className={inputCls} />
            <div className="h-4" />
            <label className={labelCls}>Ссылка на документ или страницу регулятора</label>
            <input name="sourceUrl" type="url" defaultValue={country?.sourceUrl} placeholder="https://" className={inputCls} />
            <p className={hintCls}>Читателю — чем проверить, поиску — чем подтвердить. Сейчас ссылок нет ни у одной страны.</p>
            <div className="h-4" />
            <label className={labelCls}>Когда проверяли</label>
            <input name="checkedAt" type="date" defaultValue={country?.checkedAt ?? today} required className={inputCls} />
            <p className={hintCls}>Эта дата показывается на карте и уходит в разметку страницы.</p>
          </div>

          <div className={cardCls}>
            <div className={cardTitleCls}>Служебное</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Код ISO</label>
                <input
                  name="iso2"
                  defaultValue={country?.iso2}
                  required
                  maxLength={2}
                  pattern="[A-Za-z]{2}"
                  className={`${inputCls} uppercase`}
                />
              </div>
              <div>
                <label className={labelCls}>Номер ISO</label>
                <input name="isoNum" defaultValue={country?.isoNum} required maxLength={3} pattern="[0-9]{3}" className={inputCls} />
              </div>
            </div>
            <p className={hintCls}>Код должен быть уникальным — по нему страна опознаётся на карте.</p>
            <div className="h-4" />
            <label className={labelCls}>Регион</label>
            <select name="region" defaultValue={country?.region ?? 'eu'} required className={inputCls}>
              {REGION_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            <p className={hintCls}>Без региона страна не попадёт в сетку на карте.</p>
            <div className="h-4" />
            <SlugInput name="slug" titleInputName="nameEn" defaultValue={country?.slug} />
          </div>

          <SubmitButton>{country ? 'Сохранить' : 'Добавить страну'}</SubmitButton>
        </div>
      </div>
    </form>
  );
}
