import type { AdminExchangeDoc } from '@/lib/admin/data';
import SlugInput from '../_shared/SlugInput';
import ImageField from '../_shared/ImageField';
import RichTextEditor from '../_shared/RichTextEditor';
import SubmitButton from '../_shared/SubmitButton';

const BADGE_TONES = [
  { value: 'license', label: '🔵 Лицензия (регуляторная)' },
  { value: 'gold', label: '🏆 Золотой / корпоративный статус' },
  { value: 'warn', label: '🟡 Предупреждение / ограничение' },
  { value: 'ok', label: '🟢 Ок' },
  { value: 'off', label: '⚪ Нейтральный' },
];

const REGION_TONES = [
  { value: 'ok', label: '🟢 Разрешена' },
  { value: 'warn', label: '🟡 Предупреждение' },
  { value: 'off', label: '⚪ Недоступна' },
];

const inputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]';
const smallInputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]';
const labelCls = 'text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block';

export default function ExchangeForm({
  exchange,
  action,
}: {
  exchange?: AdminExchangeDoc;
  action: (formData: FormData) => void;
}) {
  const productRows = Math.max((exchange?.products.length ?? 0) + 3, 6);
  const badgeRows = Math.max((exchange?.badges.length ?? 0) + 4, 8);
  const regionRows = Math.max((exchange?.regions.length ?? 0) + 4, 8);

  return (
    <form action={action} className="max-w-3xl">
      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Основное</h2>
      <div className="mb-5">
        <label className={labelCls}>Название</label>
        <input name="name" defaultValue={exchange?.name} required className={inputCls} />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4">
        <ImageField name="logo" label="Логотип" currentUrl={exchange?.logo} size={100} />
        <div>
          <label className={labelCls}>Цвет подложки логотипа (HEX)</label>
          <input name="logoBg" defaultValue={exchange?.logoBg ?? '#3b82f6'} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <SlugInput name="slugRu" titleInputName="name" defaultValue={exchange?.slugRu} label="Slug (RU)" />
        <SlugInput name="slugEn" titleInputName="name" defaultValue={exchange?.slugEn} label="Slug (EN)" />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        <div>
          <label className={labelCls}>Год основания</label>
          <input name="foundedYear" type="number" defaultValue={exchange?.foundedYear} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>CoinGecko exchange ID</label>
          <input name="coingeckoId" defaultValue={exchange?.coingeckoId} className={inputCls} />
        </div>
        <div>
          <div className={labelCls}>Тип</div>
          <div className="flex gap-3 pt-2">
            {(['CEX', 'DEX', 'P2P'] as const).map(t => (
              <label key={t} className="flex items-center gap-1.5 text-[12.5px]">
                <input type="checkbox" name="type" value={t} defaultChecked={exchange?.type?.includes(t) ?? t === 'CEX'} />
                {t}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-5">
        <label className={labelCls}>Сайт биржи</label>
        <input name="website" type="url" defaultValue={exchange?.website} required className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className={labelCls}>Текст ссылки на странице (необязательно)</label>
          <input name="linkLabel" defaultValue={exchange?.linkLabel} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Ссылка с UTM для текста-ссылки</label>
          <input name="trackingUrl" type="url" defaultValue={exchange?.trackingUrl} className={inputCls} />
        </div>
      </div>

      <div className="mb-5">
        <label className={labelCls}>Ссылка для кнопки «Торговать»</label>
        <input name="tradeUrl" type="url" defaultValue={exchange?.tradeUrl} className={inputCls} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className={labelCls}>Краткое описание, RU</label>
          <input name="taglineRu" defaultValue={exchange?.taglineRu} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Краткое описание, EN</label>
          <input name="taglineEn" defaultValue={exchange?.taglineEn} className={inputCls} />
        </div>
      </div>

      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Описание («Обзор»)</h2>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className={labelCls}>RU</label>
          <RichTextEditor name="descriptionRu" originalBlocks={exchange?.descriptionRu} rows={6} simple />
        </div>
        <div>
          <label className={labelCls}>EN</label>
          <RichTextEditor name="descriptionEn" originalBlocks={exchange?.descriptionEn} rows={6} simple />
        </div>
      </div>

      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-1">Продукты</h2>
      <p className="text-[11px] text-[var(--admin-text-muted)] mb-3">Оставьте название пустым, чтобы не создавать продукт в этой строке.</p>
      <div className="flex flex-col gap-3 mb-6">
        {Array.from({ length: productRows }).map((_, i) => {
          const p = exchange?.products[i];
          return (
            <div key={i} className="border border-[var(--admin-border)] rounded-lg p-3 bg-[var(--admin-panel)]">
              <div className="grid grid-cols-2 gap-3 mb-2">
                <input name={`product_nameRu_${i}`} defaultValue={p?.nameRu} placeholder="Название, RU" className={smallInputCls} />
                <input name={`product_nameEn_${i}`} defaultValue={p?.nameEn} placeholder="Название, EN" className={smallInputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <input name={`product_shortRu_${i}`} defaultValue={p?.shortRu} placeholder="Короткое описание, RU" className={smallInputCls} />
                <input name={`product_shortEn_${i}`} defaultValue={p?.shortEn} placeholder="Короткое описание, EN" className={smallInputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-2">
                <textarea name={`product_longRu_${i}`} defaultValue={p?.longRu} placeholder="Полное описание, RU" rows={2} className={smallInputCls} />
                <textarea name={`product_longEn_${i}`} defaultValue={p?.longEn} placeholder="Полное описание, EN" rows={2} className={smallInputCls} />
              </div>
              <ImageField name={`product_image_${i}`} label="Картинка продукта (~1600×800)" currentUrl={p?.image} size={72} />
            </div>
          );
        })}
      </div>

      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-1">Плашки</h2>
      <p className="text-[11px] text-[var(--admin-text-muted)] mb-3">Оставьте текст пустым, чтобы не создавать плашку в этой строке.</p>
      <div className="flex flex-col gap-2 mb-6">
        {Array.from({ length: badgeRows }).map((_, i) => {
          const b = exchange?.badges[i];
          return (
            <div key={i} className="grid grid-cols-4 gap-2 border border-[var(--admin-border)] rounded-lg p-2.5 bg-[var(--admin-panel)]">
              <input name={`badge_textRu_${i}`} defaultValue={b?.textRu} placeholder="Текст, RU" className={smallInputCls} />
              <input name={`badge_textEn_${i}`} defaultValue={b?.textEn} placeholder="Текст, EN" className={smallInputCls} />
              <select name={`badge_tone_${i}`} defaultValue={b?.tone ?? 'off'} className={smallInputCls}>
                {BADGE_TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input name={`badge_link_${i}`} defaultValue={b?.link} placeholder="Ссылка (необяз.)" className={smallInputCls} />
            </div>
          );
        })}
      </div>

      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-1">Статус по регионам</h2>
      <p className="text-[11px] text-[var(--admin-text-muted)] mb-3">Оставьте регион пустым, чтобы не создавать строку.</p>
      <div className="flex flex-col gap-2 mb-6">
        {Array.from({ length: regionRows }).map((_, i) => {
          const r = exchange?.regions[i];
          return (
            <div key={i} className="grid grid-cols-5 gap-2 border border-[var(--admin-border)] rounded-lg p-2.5 bg-[var(--admin-panel)]">
              <input name={`region_regionRu_${i}`} defaultValue={r?.regionRu} placeholder="Регион, RU" className={smallInputCls} />
              <input name={`region_regionEn_${i}`} defaultValue={r?.regionEn} placeholder="Регион, EN" className={smallInputCls} />
              <select name={`region_tone_${i}`} defaultValue={r?.tone ?? 'ok'} className={smallInputCls}>
                {REGION_TONES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <input name={`region_noteRu_${i}`} defaultValue={r?.noteRu} placeholder="Комментарий, RU" className={smallInputCls} />
              <input name={`region_noteEn_${i}`} defaultValue={r?.noteEn} placeholder="Комментарий, EN" className={smallInputCls} />
            </div>
          );
        })}
      </div>

      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Рейтинг и закрепление</h2>
      <div className="mb-3">
        <label className="flex items-center gap-2 text-[12.5px]">
          <input type="checkbox" name="pinned" defaultChecked={exchange?.pinned ?? false} />
          Закрепить сверху (партнёрское размещение)
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className={labelCls}>Позиция закрепления</label>
          <select name="pinPosition" defaultValue={exchange?.pinPosition ?? 1} className={inputCls}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Закреплено до (необязательно)</label>
          <input name="pinUntil" type="datetime-local" defaultValue={exchange?.pinUntil?.slice(0, 16)} className={inputCls} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-[12.5px] mb-6">
        <input type="checkbox" name="reviewsEnabled" defaultChecked={exchange?.reviewsEnabled ?? true} />
        Отзывы включены
      </label>

      <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-4 mb-6">
        <div className="text-[12.5px] font-bold mb-3">SEO</div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <input name="seoMetaTitleRu" defaultValue={exchange?.seoMetaTitleRu} placeholder="Meta Title, RU" className={smallInputCls} />
          <input name="seoMetaTitleEn" defaultValue={exchange?.seoMetaTitleEn} placeholder="Meta Title, EN" className={smallInputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <textarea name="seoMetaDescriptionRu" defaultValue={exchange?.seoMetaDescriptionRu} placeholder="Meta Description, RU" rows={2} className={smallInputCls} />
          <textarea name="seoMetaDescriptionEn" defaultValue={exchange?.seoMetaDescriptionEn} placeholder="Meta Description, EN" rows={2} className={smallInputCls} />
        </div>
        <label className="flex items-center gap-2 text-[12.5px]">
          <input type="checkbox" name="seoNoIndex" defaultChecked={exchange?.seoNoIndex ?? false} />
          🚫 Скрыть из поисковиков (noindex)
        </label>
      </div>

      <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
        {exchange ? 'Сохранить' : 'Создать биржу'}
      </SubmitButton>
    </form>
  );
}
