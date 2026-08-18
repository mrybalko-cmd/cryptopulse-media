import type { AdminRegulationCountryDoc, RegPageText } from '@/lib/admin/data';
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

/**
 * One bilingual field of the long page. Both languages sit side by side because
 * the English text is written, not translated — seeing them together is what
 * stops one side quietly falling behind the other.
 */
function PageField({
  name, title, hint, rows = 4, example, page,
}: {
  name: string;
  title: string;
  hint: string;
  rows?: number;
  example?: string;
  page?: RegPageText;
}) {
  const key = name as keyof RegPageText;
  return (
    <div className="mb-5">
      <div className="flex items-baseline gap-2 mb-1.5">
        <span className="text-[11.5px] font-bold text-[var(--admin-text-secondary)]">{title}</span>
        <span className="text-[11px] text-[var(--admin-text-dim)]">{hint}</span>
      </div>
      {example && (
        <pre className="text-[11px] text-[var(--admin-text-dim)] bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2 mb-2 whitespace-pre-wrap font-mono">
{example}
        </pre>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-[10.5px] uppercase tracking-wider text-[var(--admin-text-dim)] mb-1 block">Русский</label>
          <textarea name={`page.${name}.ru`} defaultValue={page?.[key]?.ru ?? ''} rows={rows} className={areaCls} />
        </div>
        <div>
          <label className="text-[10.5px] uppercase tracking-wider text-[var(--admin-text-dim)] mb-1 block">English</label>
          <textarea name={`page.${name}.en`} defaultValue={page?.[key]?.en ?? ''} rows={rows} className={areaCls} />
        </div>
      </div>
    </div>
  );
}

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

          <div className={cardCls}>
            <div className={cardTitleCls}>Любопытный факт</div>
            <label className={labelCls}>По-русски</label>
            <textarea name="factNoteRu" defaultValue={country?.factNoteRu} rows={3} className={areaCls} />
            <div className="h-4" />
            <label className={labelCls}>In English</label>
            <textarea name="factNoteEn" defaultValue={country?.factNoteEn} rows={3} className={areaCls} />
            <p className={hintCls}>Событие, компания, случай — то, ради чего страницу дочитывают. Одно-два предложения, без него блок не появится.</p>
          </div>

          {/* ── the long page ──────────────────────────────────── */}
          <details className={cardCls} open={Boolean(country?.hasPage)}>
            <summary className="cursor-pointer list-none flex items-center justify-between gap-3">
              <span className={`${cardTitleCls} mb-0`}>Отдельная страница страны</span>
              <span className="text-[11px] text-[var(--admin-text-dim)]">развернуть ▾</span>
            </summary>

            <p className="text-[12px] text-[var(--admin-text-dim)] leading-relaxed mt-4 mb-5">
              Это содержимое живёт на <b className="text-[var(--admin-text-secondary)]">/regulation/{country?.slug || '<адрес>'}</b> и
              показывается, только когда включена галка «Своя страница» справа. Ориентир — 900–1100 слов на каждом языке.
              Английскую версию пишем отдельно, а не переводом.
            </p>

            <PageField
              name="intro" title="Коротко" rows={4} page={country?.page}
              hint="прямой ответ, 60–80 слов — его забирают ИИ-ответы и сниппет"
            />
            <PageField
              name="figures" title="Цифры" rows={7} page={country?.page}
              hint="по строке на плитку, шесть штук"
              example={'НАЛОГ ФИЗЛИЦ | 0% | на доход и на прирост\nЛИЦЕНЗИЯ БИРЖ | Обязательна | VARA, FSRA или CMA'}
            />
            <PageField
              name="body" title="Разделы" rows={16} page={country?.page}
              hint="основной текст: кто регулирует, налоги подробно"
              example={'## Кто и как регулирует\nАбзац текста. Ссылка внутри — [якорь](https://vara.ae).\n\n### Подзаголовок\nЕщё абзац.'}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <PageField name="allowed" title="Что разрешено" rows={5} page={country?.page} hint="по пункту на строку" />
              <PageField name="restricted" title="Что ограничено" rows={5} page={country?.page} hint="по пункту на строку" />
            </div>
            <PageField
              name="timeline" title="Хронология" rows={6} page={country?.page}
              hint="как страна пришла к нынешнему положению"
              example={'Март 2022 | Дубай создаёт VARA\n* Май 2022 | Bybit переносит штаб-квартиру  ← звёздочка выделяет главное'}
            />
            <PageField
              name="faq" title="Частые вопросы" rows={7} page={country?.page}
              hint="пять пар — уходят в разметку FAQPage"
              example={'Нужно ли платить налог? | Нет, для физлиц ставка ноль.'}
            />
            <PageField
              name="sources" title="Источники" rows={5} page={country?.page}
              hint="регулятор и налоговая — читателю проверить, поиску подтвердить"
              example={'VARA — Virtual Assets Regulatory Authority | https://www.vara.ae/'}
            />
            <PageField
              name="related" title="Наши материалы" rows={4} page={country?.page}
              hint="по одному slug на строку; у русской и английской версии slug разные"
              example={'deribit-spot-ordera-coinbase-dubai-litsenziya'}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <PageField name="seoTitle" title="Заголовок для поиска" rows={2} page={country?.page} hint="пусто — берётся заголовок страницы" />
              <PageField name="seoDescription" title="Описание для поиска" rows={3} page={country?.page} hint="пусто — берётся «Коротко»" />
            </div>
          </details>
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
            <div className={cardTitleCls}>Своя страница</div>
            <label className="flex items-start gap-2.5 text-[12.5px] cursor-pointer">
              <input type="checkbox" name="hasPage" defaultChecked={Boolean(country?.hasPage)} className="mt-0.5" />
              <span>Открыть /regulation/{country?.slug || '<адрес>'}</span>
            </label>
            <p className={hintCls}>
              Включает адрес на обоих языках, ссылку «Подробно» на карте и строку в sitemap.
              Включайте, когда длинные тексты слева заполнены: пустая страница хуже её отсутствия.
            </p>
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
