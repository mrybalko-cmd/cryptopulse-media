'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import type { GlossaryPickerOption } from '@/lib/admin/glossary';
import SubmitButton from '../_shared/SubmitButton';
import SavedMark from '../_shared/SavedMark';

/**
 * Правка одного термина глоссария.
 *
 * Разделы — вложенная структура: раздел содержит абзацы, список и разбор
 * с числами, и любое из трёх может отсутствовать. Собрать это из плоских
 * имён формы нельзя, поэтому состояние живёт в React, а на сервер уходит
 * одним полем JSON. Прочие поля остаются обычными input'ами: их разбирает
 * тот же parseInput, что и в остальных разделах админки.
 */

type Bi = { ru?: string; en?: string };
type Bullet = { _key?: string; title?: Bi; text?: Bi };
type Row = { _key?: string; label?: Bi; value?: Bi };
type Example = { setup?: Bi; rows?: Row[]; total?: { label?: Bi; value?: Bi }; outcome?: Bi };
type Section = { _key?: string; heading?: Bi; paragraphs?: (Bi & { _key?: string })[]; bullets?: Bullet[]; example?: Example };

const CATEGORIES: [string, string][] = [
  ['basics', 'Основы'], ['wallets', 'Кошельки'], ['trading', 'Торговля'],
  ['defi', 'DeFi'], ['tech', 'Технологии'], ['compliance', 'Регулирование'],
  ['tokens', 'Токены'], ['slang', 'Сленг'], ['security', 'Безопасность'],
];

const inp =
  'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px] text-[var(--admin-text)] focus:border-[var(--admin-focus)] focus:outline-none';
const lbl = 'text-[11.5px] font-bold text-[var(--admin-text-secondary)]';
const hint = 'text-[11px] text-[var(--admin-text-dim)]';
const ghost =
  'text-[11.5px] font-bold rounded-lg px-3 py-2 border border-dashed border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:text-[var(--admin-text)] transition-colors';
const tiny =
  'text-[11px] font-bold text-[var(--admin-text-dim)] hover:text-red-400 transition-colors';

const key = () => Math.random().toString(36).slice(2, 9);


/**
 * Текстовое поле, в которое можно поставить ссылку.
 *
 * Хранится всё той же строкой, ссылка записывается как `[текст](адрес)` —
 * ровно та запись, что уже принята в редакторе новостей, и ровно та, что
 * разбирается при выводе термина. Поле контролируемое, поэтому вставка идёт
 * через onChange, а не правкой value у элемента.
 */
function LinkableField({
  value, onChange, options, rows = 3, placeholder, mono = false,
}: {
  value: string;
  onChange: (v: string) => void;
  options: GlossaryPickerOption[];
  rows?: number;
  placeholder?: string;
  mono?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [picking, setPicking] = useState(false);
  const [q, setQ] = useState('');

  function wrap(url: string, dofollow = false) {
    const el = ref.current;
    if (!el) return;
    const a = el.selectionStart, b = el.selectionEnd;
    const sel = value.slice(a, b) || 'текст ссылки';
    // Пометка пишется только для dofollow: без неё внешняя ссылка
    // по умолчанию nofollow, и большинство ссылок остаются короткими.
    const suffix = dofollow ? ' "dofollow"' : '';
    onChange(value.slice(0, a) + `[${sel}](${url}${suffix})` + value.slice(b));
    setPicking(false); setQ('');
  }

  const found = q.trim()
    ? options.filter(o => {
        const n = q.trim().toLowerCase();
        return o.termRu.toLowerCase().includes(n) || o.termEn.toLowerCase().includes(n) || o.slug.includes(n);
      }).slice(0, 6)
    : [];

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        ref={ref} rows={rows} placeholder={placeholder}
        className={`${inp} leading-relaxed ${mono ? 'font-mono' : ''}`}
        value={value} onChange={e => onChange(e.target.value)}
      />
      <div className="flex items-center gap-2">
        <button
          type="button" className={tiny}
          onClick={() => {
            const url = window.prompt('Адрес ссылки. Внешняя откроется в новой вкладке.');
            if (!url?.trim()) return;
            const external = !url.trim().startsWith('/');
            // Выбор нужен только для внешних: своя страница всегда dofollow.
            const dofollow = external
              ? window.confirm('Передавать вес страницы по этой ссылке?\n\nOK — dofollow, Отмена — nofollow (обычный выбор для платных и партнёрских).')
              : true;
            wrap(url.trim(), external && dofollow);
          }}
        >
          + ссылка
        </button>
        <button type="button" className={tiny} onClick={() => setPicking(!picking)}>
          + на термин
        </button>
        <span className={hint}>Выделите слово, потом нажмите.</span>
      </div>
      {picking && (
        <div className="flex flex-col gap-1.5">
          <input
            autoFocus className={inp} value={q} placeholder="Найти термин"
            onChange={e => setQ(e.target.value)}
          />
          {found.length > 0 && (
            <div className="border border-[var(--admin-border)] rounded-lg divide-y divide-[var(--admin-border)] overflow-hidden">
              {found.map(o => {
                const path = `/ru/${o.kind === 'ai' ? 'ai/glossary' : 'glossary'}/${o.slug}`;
                return (
                  <button
                    key={o._id} type="button"
                    className="w-full text-left px-3 py-2 text-[12.5px] hover:bg-[var(--admin-input)] flex items-center gap-2"
                    onClick={() => wrap(path)}
                  >
                    <span className="flex-1">{o.termRu}</span>
                    <span className="text-[10px] font-mono text-[var(--admin-text-dim)]">{path}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GlossaryTermForm({
  action, initial, options, mentions,
}: {
  action: (fd: FormData) => void;
  initial?: Record<string, any>;
  options: GlossaryPickerOption[];
  mentions?: number;
}) {
  const [lang, setLang] = useState<'ru' | 'en'>('ru');
  const [kind, setKind] = useState<'crypto' | 'ai'>(initial?.kind || 'crypto');
  const [sections, setSections] = useState<Section[]>(initial?.sections || []);
  const [related, setRelated] = useState<{ id: string; label: string }[]>(
    (initial?.relatedRefs || []).map((r: any) => ({ id: r.id, label: r.termRu })),
  );
  const [relQuery, setRelQuery] = useState('');
  // Термин и определение держим в состоянии, а не в defaultValue: при
  // переключении языка React переиспользует тот же <input>, и текст одного
  // языка утёк бы в поле другого. Скрытые поля ниже отправляют оба языка.
  const [term, setTerm] = useState<Bi>(initial?.term || {});
  const [definition, setDefinition] = useState<Bi>(initial?.definition || {});

  const L = lang === 'ru' ? 'Русский' : 'English';
  const set = (fn: (draft: Section[]) => void) => {
    const next = structuredClone(sections);
    fn(next);
    setSections(next);
  };

  const relResults = relQuery.trim()
    ? options
        .filter(o => o._id !== initial?._id && !related.some(r => r.id === o._id))
        .filter(o => {
          const q = relQuery.trim().toLowerCase();
          return o.termRu.toLowerCase().includes(q) || o.termEn.toLowerCase().includes(q) || o.slug.includes(q);
        })
        .slice(0, 8)
    : [];

  return (
    <form action={action} className="max-w-5xl flex flex-col gap-5">
      <input type="hidden" name="sectionsJson" value={JSON.stringify(sections)} />
      <input type="hidden" name="relatedIds" value={related.map(r => r.id).join(',')} />
      <input type="hidden" name="kind" value={kind} />

      {/* язык */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex gap-0.5 bg-[var(--admin-input)] rounded-lg p-0.5 w-max">
          {(['ru', 'en'] as const).map(l => (
            <button
              key={l} type="button" onClick={() => setLang(l)}
              className={`text-[12px] font-bold px-4 py-1.5 rounded-md transition-colors ${
                lang === l
                  ? 'bg-[var(--admin-panel)] text-[var(--admin-text)] shadow-sm'
                  : 'text-[var(--admin-text-muted)]'
              }`}
            >
              {l === 'ru' ? 'Русский' : 'English'}
            </button>
          ))}
        </div>
        <div className="flex gap-0.5 bg-[var(--admin-input)] rounded-lg p-0.5 w-max">
          {([['crypto', 'Криптовалюты'], ['ai', 'Искусственный интеллект']] as const).map(([k, t]) => (
            <button
              key={k} type="button" onClick={() => setKind(k)}
              className={`text-[12px] font-bold px-4 py-1.5 rounded-md transition-colors ${
                kind === k
                  ? 'bg-[var(--admin-panel)] text-[var(--admin-text)] shadow-sm'
                  : 'text-[var(--admin-text-muted)]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* термин и адрес */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <span className={lbl}>Термин · {L}</span>
          <input
            className={inp} value={term[lang] || ''} required
            onChange={e => setTerm({ ...term, [lang]: e.target.value })}
          />
          <input type="hidden" name="termRu" value={term.ru || ''} />
          <input type="hidden" name="termEn" value={term.en || ''} />
          <div className="flex flex-col gap-1.5 mt-1">
            <span className={hint}>
              Ссылка на самом названии термина — для клиентских и партнёрских размещений.
            </span>
            <input
              className={`${inp} font-mono text-[12px]`} name="termLinkUrl"
              defaultValue={initial?.termLink?.url || ''}
              placeholder="https://клиент.example — пусто, если ссылка не нужна"
            />
            <select className={inp} name="termLinkRel" defaultValue={initial?.termLink?.rel || 'nofollow'}>
              <option value="nofollow">Не передавать вес страницы (nofollow)</option>
              <option value="dofollow">Передавать вес страницы (dofollow)</option>
            </select>
            <span className={hint}>
              Для платных размещений оставляйте nofollow: передача веса по оплаченной ссылке нарушает правила поисковиков.
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <span className={lbl}>Адрес</span>
          <input className={`${inp} font-mono`} name="slug" defaultValue={initial?.slug || ''} required />
          <span className={hint}>
            /{kind === 'ai' ? 'ai/glossary' : 'glossary'}/…
            {typeof mentions === 'number' && mentions > 0 && (
              <b className="text-amber-400"> · на этот адрес ссылаются {mentions} материалов, смена сломает ссылки</b>
            )}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {kind === 'crypto' && (
          <div className="flex flex-col gap-1.5">
            <span className={lbl}>Категория</span>
            <select className={inp} name="category" defaultValue={initial?.category || ''}>
              <option value="">не выбрана</option>
              {CATEGORIES.map(([v, t]) => <option key={v} value={v}>{t}</option>)}
            </select>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <span className={lbl}>Дата последней правки текста</span>
          <input className={inp} type="date" name="updated" defaultValue={initial?.updated || ''} />
          <span className={hint}>Показывается читателю как «проверено» и идёт в карту сайта.</span>
        </div>
      </div>

      {/* определение */}
      <div className="flex flex-col gap-1.5">
        <span className={lbl}>Короткое определение · {L}</span>
        <LinkableField
          rows={4} options={options}
          value={definition[lang] || ''}
          onChange={v => setDefinition({ ...definition, [lang]: v })}
        />
        <input type="hidden" name="definitionRu" value={definition.ru || ''} />
        <input type="hidden" name="definitionEn" value={definition.en || ''} />
        <span className={hint}>
          Два-три предложения. Идёт в описание страницы, в разметку и в цитату, которую поднимает ассистент.
        </span>
      </div>

      {/* словоформы */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <span className={lbl}>Словоформы, русские</span>
          <input
            className={inp} name="aliasesRu"
            defaultValue={(initial?.aliases?.ru || []).join(', ')}
            placeholder="стейблкоины, стейблкоина, стейблкоинов"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className={lbl}>Словоформы, английские</span>
          <input
            className={inp} name="aliasesEn"
            defaultValue={(initial?.aliases?.en || []).join(', ')}
            placeholder="stablecoins"
          />
        </div>
        <span className={`${hint} md:col-span-2`}>
          Через запятую. По ним автоматическая простановка узнаёт термин в тексте: без формы
          «стейблкоины» ссылка на «стейблкоин» не встанет, и материал выйдет вообще без ссылок на глоссарий.
        </span>
      </div>

      <label className="flex items-center gap-2.5 text-[12.5px]">
        <input type="checkbox" name="autolink" defaultChecked={initial?.autolink !== false} className="w-4 h-4 accent-cyan-500" />
        Участвует в автоматической простановке ссылок
      </label>

      {/* разделы */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className={lbl}>Развёрнутая статья · {sections.length} разд.</span>
        </div>

        {sections.map((s, i) => (
          <div key={s._key || i} className="border border-[var(--admin-border)] rounded-xl bg-[var(--admin-panel)] overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-[var(--admin-bg-alt)] border-b border-[var(--admin-border)]">
              <input
                className="flex-1 bg-transparent text-[12.5px] font-bold text-[var(--admin-text)] focus:outline-none"
                value={s.heading?.[lang] || ''}
                placeholder={`Заголовок раздела · ${L}`}
                onChange={e => set(d => { d[i].heading = { ...d[i].heading, [lang]: e.target.value }; })}
              />
              <button type="button" className={tiny} disabled={i === 0}
                onClick={() => set(d => { [d[i - 1], d[i]] = [d[i], d[i - 1]]; })}>↑</button>
              <button type="button" className={tiny} disabled={i === sections.length - 1}
                onClick={() => set(d => { [d[i + 1], d[i]] = [d[i], d[i + 1]]; })}>↓</button>
              <button type="button" className={tiny}
                onClick={() => set(d => { d.splice(i, 1); })}>удалить</button>
            </div>

            <div className="p-3 flex flex-col gap-3">
              {(s.paragraphs || []).map((p, j) => (
                <div key={p._key || j} className="flex gap-2 items-start">
                  <div className="flex-1">
                    <LinkableField
                      options={options} placeholder={`Абзац · ${L}`}
                      value={p[lang] || ''}
                      onChange={v => set(d => { d[i].paragraphs![j] = { ...d[i].paragraphs![j], [lang]: v }; })}
                    />
                  </div>
                  <button type="button" className={`${tiny} mt-2`}
                    onClick={() => set(d => { d[i].paragraphs!.splice(j, 1); })}>×</button>
                </div>
              ))}

              {(s.bullets || []).map((b, j) => (
                <div key={b._key || j} className="flex gap-2 items-start">
                  <div className="flex-1 grid gap-1.5">
                    <input
                      className={inp} value={b.title?.[lang] || ''} placeholder={`Пункт списка · ${L}`}
                      onChange={e => set(d => { d[i].bullets![j].title = { ...d[i].bullets![j].title, [lang]: e.target.value }; })}
                    />
                    <LinkableField
                      options={options} rows={2} placeholder="Пояснение"
                      value={b.text?.[lang] || ''}
                      onChange={v => set(d => { d[i].bullets![j].text = { ...d[i].bullets![j].text, [lang]: v }; })}
                    />
                  </div>
                  <button type="button" className={`${tiny} mt-2`}
                    onClick={() => set(d => { d[i].bullets!.splice(j, 1); })}>×</button>
                </div>
              ))}

              {s.example && (
                <div className="border border-[var(--admin-border)] rounded-lg p-3 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className={lbl}>Разбор с числами</span>
                    <button type="button" className={tiny}
                      onClick={() => set(d => { delete d[i].example; })}>убрать разбор</button>
                  </div>
                  <textarea
                    className={`${inp} min-h-[60px]`} rows={2} value={s.example.setup?.[lang] || ''}
                    placeholder={`Условие · ${L}`}
                    onChange={e => set(d => { d[i].example!.setup = { ...d[i].example!.setup, [lang]: e.target.value }; })}
                  />
                  {(s.example.rows || []).map((r, k) => (
                    <div key={r._key || k} className="flex gap-2">
                      <input
                        className={inp} value={r.label?.[lang] || ''} placeholder="Название строки"
                        onChange={e => set(d => { d[i].example!.rows![k].label = { ...d[i].example!.rows![k].label, [lang]: e.target.value }; })}
                      />
                      <input
                        className={`${inp} font-mono max-w-[190px]`} value={r.value?.[lang] || ''} placeholder="Значение"
                        onChange={e => set(d => { d[i].example!.rows![k].value = { ...d[i].example!.rows![k].value, [lang]: e.target.value }; })}
                      />
                      <button type="button" className={tiny}
                        onClick={() => set(d => { d[i].example!.rows!.splice(k, 1); })}>×</button>
                    </div>
                  ))}
                  <button type="button" className={ghost}
                    onClick={() => set(d => { d[i].example!.rows = [...(d[i].example!.rows || []), { _key: key() }]; })}>
                    + строка расчёта
                  </button>
                  <textarea
                    className={`${inp} min-h-[60px]`} rows={2} value={s.example.outcome?.[lang] || ''}
                    placeholder={`Вывод · ${L}`}
                    onChange={e => set(d => { d[i].example!.outcome = { ...d[i].example!.outcome, [lang]: e.target.value }; })}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <button type="button" className={ghost}
                  onClick={() => set(d => { d[i].paragraphs = [...(d[i].paragraphs || []), { _key: key() }]; })}>
                  + абзац
                </button>
                <button type="button" className={ghost}
                  onClick={() => set(d => { d[i].bullets = [...(d[i].bullets || []), { _key: key() }]; })}>
                  + пункт списка
                </button>
                {!s.example && (
                  <button type="button" className={ghost}
                    onClick={() => set(d => { d[i].example = { rows: [] }; })}>
                    + разбор с числами
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button type="button" className={ghost}
          onClick={() => setSections([...sections, { _key: key(), heading: {}, paragraphs: [{ _key: key() }] }])}>
          + добавить раздел
        </button>
      </div>

      {/* связанные */}
      <div className="flex flex-col gap-2">
        <span className={lbl}>Связанные термины</span>
        <div className="flex flex-wrap gap-2">
          {related.map(r => (
            <span key={r.id}
              className="text-[11.5px] font-bold rounded-full px-3 py-1.5 bg-cyan-500 text-[#06222b] flex items-center gap-1.5">
              {r.label}
              <button type="button" onClick={() => setRelated(related.filter(x => x.id !== r.id))}>×</button>
            </span>
          ))}
        </div>
        <input
          className={inp} value={relQuery} placeholder="Найти термин и добавить"
          onChange={e => setRelQuery(e.target.value)}
        />
        {relResults.length > 0 && (
          <div className="border border-[var(--admin-border)] rounded-lg divide-y divide-[var(--admin-border)] overflow-hidden">
            {relResults.map(o => (
              <button
                key={o._id} type="button"
                className="w-full text-left px-3 py-2 text-[12.5px] hover:bg-[var(--admin-input)] flex items-center gap-2"
                onClick={() => { setRelated([...related, { id: o._id, label: o.termRu }]); setRelQuery(''); }}
              >
                <span className="flex-1">{o.termRu} <span className="text-[var(--admin-text-dim)]">· {o.termEn}</span></span>
                <span className="text-[10px] font-mono text-[var(--admin-text-dim)]">
                  /{o.kind === 'ai' ? 'ai/glossary' : 'glossary'}/{o.slug}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <SubmitButton className="bg-cyan-500 text-[#06222b] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
          Сохранить
        </SubmitButton>
          <SavedMark />
        <Link href="/admin/glossary" className="text-[12.5px] text-[var(--admin-text-muted)]">Отмена</Link>
        {initial?.slug && (
          <a
            href={`/${lang}/${kind === 'ai' ? 'ai/glossary' : 'glossary'}/${initial.slug}`}
            target="_blank" rel="noopener noreferrer"
            className="text-[12.5px] text-[var(--admin-text-muted)] ml-auto"
          >
            Открыть на сайте ↗
          </a>
        )}
      </div>
    </form>
  );
}
