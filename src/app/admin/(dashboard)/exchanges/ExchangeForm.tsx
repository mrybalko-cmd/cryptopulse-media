import type { AdminExchangeDoc } from '@/lib/admin/data';
import SlugInput from '../_shared/SlugInput';
import ImageField from '../_shared/ImageField';
import RichTextEditor from '../_shared/RichTextEditor';
import SubmitButton from '../_shared/SubmitButton';
import ProductsRepeater from './ProductsRepeater';
import BadgesRepeater from './BadgesRepeater';
import RegionsRepeater from './RegionsRepeater';

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
  return (
    <form action={action} className="max-w-3xl">
      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Основное</h2>
      <div className="mb-5">
        <label className={labelCls}>Название</label>
        <input name="name" defaultValue={exchange?.name} required className={inputCls} />
      </div>

      <div className="mb-5 grid grid-cols-2 gap-4">
        <ImageField name="logo" label="Логотип" currentUrl={exchange?.logo} size={100} hint="Квадрат 1:1, рекомендуется 200×200 px, PNG с прозрачным фоном." />
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
          <RichTextEditor name="descriptionRu" originalBlocks={exchange?.descriptionRu} rows={6} simple hidePreview />
        </div>
        <div>
          <label className={labelCls}>EN</label>
          <RichTextEditor name="descriptionEn" originalBlocks={exchange?.descriptionEn} rows={6} simple hidePreview />
        </div>
      </div>

      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Продукты</h2>
      <ProductsRepeater existing={exchange?.products ?? []} />
      <div className="mb-4" />

      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Плашки</h2>
      <BadgesRepeater existing={exchange?.badges ?? []} />
      <div className="mb-4" />

      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Статус по регионам</h2>
      <RegionsRepeater existing={exchange?.regions ?? []} />
      <div className="mb-2" />

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
