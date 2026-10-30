import type { AdminAssetCtaDoc } from '@/lib/admin/data';
import { pragueLocalInput } from '@/lib/admin/timezone';
import { COIN_REGISTRY, COIN_SLUGS } from '@/lib/coinRegistry';
import { inkOn } from '@/lib/assetCtaShared';
import SubmitButton from '../_shared/SubmitButton';
import SavedMark from '../_shared/SavedMark';

const FIELD =
  'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]';
const LABEL =
  'text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block';
const GROUP =
  'text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5';

/**
 * Палитра. Бирюзового здесь нет намеренно: это цвет наших собственных ссылок
 * и кнопок, и красить им рекламу значит стирать границу между своим и
 * купленным. Первым идёт фирменный цвет монеты — он подставляется сам, если
 * поле оставить пустым.
 */
const SWATCHES = [
  '#4f46e5', '#7c3aed', '#db2777', '#e11d48',
  '#c2410c', '#f59e0b', '#047857', '#3f3f46',
];

export default function AssetCtaForm({
  cta,
  action,
  taken,
}: {
  cta?: AdminAssetCtaDoc;
  action: (formData: FormData) => void;
  taken?: string;
}) {
  const places = cta?.places ?? { cards: true, table: true, page: true, sticky: true };

  return (
    <form action={action} className="max-w-xl">
      {taken && (
        <p className="mb-5 text-[12.5px] rounded-lg px-3 py-2.5 bg-red-500/10 text-red-400">
          У монеты <b>{taken}</b> уже есть кнопка. Одна монета — один партнёр:
          откройте существующую запись и правьте её.
        </p>
      )}

      <div className="mb-5">
        <label className={LABEL} htmlFor="coinSlug">Монета</label>
        <select id="coinSlug" name="coinSlug" defaultValue={cta?.coinSlug ?? ''} required className={FIELD}>
          <option value="" disabled>— выберите монету —</option>
          {COIN_SLUGS.map(slug => (
            <option key={slug} value={slug}>
              {COIN_REGISTRY[slug].name} · {COIN_REGISTRY[slug].symbol}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <div className={GROUP}>Какие кнопки</div>
        <div className="flex flex-wrap gap-4">
          {([
            ['buy', 'Только «Купить»'],
            ['sell', 'Только «Продать»'],
            ['both', 'Купить и продать'],
            ['custom', 'Свой текст'],
          ] as const).map(([v, label]) => (
            <label key={v} className="flex items-center gap-1.5 text-[12.5px]">
              <input type="radio" name="mode" value={v} defaultChecked={(cta?.mode ?? 'buy') === v} />
              {label}
            </label>
          ))}
        </div>
        <p className="text-[11px] text-[var(--admin-text-dim)] mt-2">
          «Свой текст» — например «Торговать» или «Обменять». До 24 знаков, иначе
          две кнопки не помещаются на телефоне.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className={LABEL} htmlFor="labelRu">Свой текст, RU</label>
          <input id="labelRu" name="labelRu" defaultValue={cta?.labelRu} maxLength={24} className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="labelEn">Свой текст, EN</label>
          <input id="labelEn" name="labelEn" defaultValue={cta?.labelEn} maxLength={24} className={FIELD} />
        </div>
      </div>

      <div className="mb-5">
        <label className={LABEL} htmlFor="url">Ссылка партнёра</label>
        <input id="url" name="url" type="url" defaultValue={cta?.url} required placeholder="https://…" className={FIELD} />
        <p className="text-[11px] text-[var(--admin-text-dim)] mt-1.5">
          Метки кампании сайт допишет сам: utm_source=intokened, utm_medium=coin_button,
          utm_campaign — slug монеты. Руками их добавлять не нужно.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className={LABEL} htmlFor="sellUrl">Ссылка «Продать», если отличается</label>
          <input id="sellUrl" name="sellUrl" type="url" defaultValue={cta?.sellUrl} className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="partner">Название партнёра</label>
          <input id="partner" name="partner" defaultValue={cta?.partner} className={FIELD} />
        </div>
      </div>

      <div className="mb-5">
        <div className={GROUP}>Цвет кнопки</div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {SWATCHES.map(c => (
            <label
              key={c}
              className="w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center text-[10px] font-black border-2 border-transparent has-[:checked]:border-[var(--admin-text)]"
              style={{ background: c, color: inkOn(c) }}
              title={c}
            >
              <input type="radio" name="color" value={c} defaultChecked={cta?.color === c} className="sr-only" />
              Aa
            </label>
          ))}
          <label className="flex items-center gap-1.5 text-[12px] text-[var(--admin-text-muted)]">
            <input type="radio" name="color" value="" defaultChecked={!cta?.color} />
            цвет монеты
          </label>
        </div>
        <p className="text-[11px] text-[var(--admin-text-dim)]">
          Цвет надписи сайт подбирает сам по яркости фона — белый или чёрный.
          Бирюзового в списке нет: им покрашены наши собственные ссылки.
        </p>
      </div>

      <div className="mb-5">
        <div className={GROUP}>Где показывать</div>
        <div className="flex flex-col gap-2">
          {([
            ['placeCards', 'Витрина: карточки и топ-3', places.cards],
            ['placeTable', 'Витрина: таблица', places.table],
            ['placePage', 'Страница монеты', places.page],
            ['placeSticky', 'Нижняя панель на телефоне', places.sticky],
          ] as const).map(([name, label, checked]) => (
            <label key={name} className="flex items-center gap-2 text-[12.5px]">
              <input type="checkbox" name={name} defaultChecked={checked} />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className={GROUP}>Язык показа</div>
        <div className="flex gap-4">
          {(['all', 'ru', 'en'] as const).map(v => (
            <label key={v} className="flex items-center gap-1.5 text-[12.5px]">
              <input type="radio" name="language" value={v} defaultChecked={(cta?.language ?? 'all') === v} />
              {v === 'all' ? 'Оба языка' : v === 'ru' ? 'Только RU' : 'Только EN'}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className={LABEL} htmlFor="startAt">Показывать с</label>
          <input id="startAt" name="startAt" type="datetime-local" defaultValue={pragueLocalInput(cta?.startAt)} className={FIELD} />
        </div>
        <div>
          <label className={LABEL} htmlFor="endAt">Показывать до</label>
          <input id="endAt" name="endAt" type="datetime-local" defaultValue={pragueLocalInput(cta?.endAt)} className={FIELD} />
          <p className="text-[11px] text-[var(--admin-text-dim)] mt-1">
            Пусто — без срока. Срок вышел — кнопка гаснет сама.
          </p>
        </div>
      </div>

      <label className="flex items-center gap-2 text-[12.5px] mb-3">
        <input type="checkbox" name="active" defaultChecked={cta?.active ?? true} />
        Кнопка показывается
      </label>
      <label className="flex items-center gap-2 text-[12.5px] mb-6">
        <input type="checkbox" name="showAdLabel" defaultChecked={cta?.showAdLabel ?? false} />
        Пометка «Реклама · Партнёр» под кнопкой
      </label>

      {cta && (
        <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-3.5 mb-6 flex flex-wrap gap-5 text-[11px] text-[var(--admin-text-muted)]">
          <span>🖱 <b className="text-[var(--admin-text)]">{cta.clicks.toLocaleString('ru-RU')}</b> кликов по «Купить»</span>
          <span>🖱 <b className="text-[var(--admin-text)]">{cta.sellClicks.toLocaleString('ru-RU')}</b> по «Продать»</span>
          <span className="w-full text-[var(--admin-text-dim)]">
            Считает переходы по кнопке. Показы не считаем: это потребовало бы
            запроса с каждой карточки витрины.
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
          {cta ? 'Сохранить' : 'Создать кнопку'}
        </SubmitButton>
        <SavedMark />
      </div>
    </form>
  );
}
