import type { AdminExchangeDoc } from '@/lib/admin/data';
import SlugInput from '../_shared/SlugInput';
import ImageField from '../_shared/ImageField';
import RichTextEditor from '../_shared/RichTextEditor';
import SubmitButton from '../_shared/SubmitButton';
import SavedMark from '../_shared/SavedMark';
import ProductsRepeater from './ProductsRepeater';
import BadgesRepeater from './BadgesRepeater';
import RegionsRepeater from './RegionsRepeater';
import RegulatorsRepeater from './RegulatorsRepeater';
import { BROKER_TEXT_FIELDS } from '@/lib/brokerFields';
import { VENUE_BUTTON_COLORS, venueButtonColor } from '@/lib/exchangePlacements';

const inputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]';
const smallInputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-2.5 py-2 text-[12.5px]';
const labelCls = 'text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block';
const panelCls = 'bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-4 mb-4';
const SWATCHES = { violet: '#7c3aed', orange: '#c2410c', green: '#047857' } as const;

export default function ExchangeForm({
  exchange,
  action,
  kind = 'exchange',
}: {
  exchange?: AdminExchangeDoc;
  action: (formData: FormData) => void;
  kind?: 'exchange' | 'broker';
}) {
  const isBroker = kind === 'broker';
  return (
    <form action={action} className="max-w-3xl">
      <input type="hidden" name="venueKind" value={kind} />
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
        {!isBroker && (
          <>
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
          </>
        )}
      </div>

      <div className="mb-5">
        <label className={labelCls}>{isBroker ? 'Сайт брокера' : 'Сайт биржи'}</label>
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

      {isBroker ? (
        <>
          <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-1">Регуляция</h2>
          <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-3">
            Впишите то, что есть у этого брокера на самом деле: регулятора, компанию группы, номер и ссылку на реестр. Строк сколько нужно, шаблонов нет.
          </p>
          <RegulatorsRepeater existing={exchange?.regulators ?? []} />
          <div className="mb-4" />

          <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-1">Условия и паспорт</h2>
          <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-3">Пустое поле на странице показывается как «нет подтверждённых данных».</p>
          <div className={panelCls}>
            <div className="flex flex-wrap gap-4 mb-3">
              <label className="flex items-center gap-2 text-[12.5px]">
                <input type="checkbox" name="offersCoins" defaultChecked={exchange?.offersCoins ?? false} />
                Реальные монеты
              </label>
              <label className="flex items-center gap-2 text-[12.5px]">
                <input type="checkbox" name="offersCfd" defaultChecked={exchange?.offersCfd ?? false} />
                CFD на криптовалюту
              </label>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div>
                <label className={labelCls}>Мин. депозит</label>
                <input name="minDeposit" defaultValue={exchange?.minDeposit} placeholder="$50" className={smallInputCls} />
              </div>
              <div>
                <label className={labelCls}>Теряют деньги, %</label>
                <input name="lossPercent" defaultValue={exchange?.lossPercent} placeholder="61%" className={smallInputCls} />
              </div>
              <div>
                <label className={labelCls}>Дата проверки</label>
                <input name="verifiedAt" type="date" defaultValue={exchange?.verifiedAt} className={smallInputCls} />
              </div>
            </div>
            <div className="mb-3">
              <label className={labelCls}>Ссылка на демо-счёт (необязательно)</label>
              <input name="demoUrl" type="url" defaultValue={exchange?.demoUrl} className={smallInputCls} />
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5">
              {BROKER_TEXT_FIELDS.flatMap(field => [
                <div key={`${field.key}Ru`}>
                  <label className={labelCls}>{field.label}, RU</label>
                  <input name={`${field.key}Ru`} defaultValue={exchange?.brokerText?.[`${field.key}Ru`] ?? ''} placeholder={field.hint} className={smallInputCls} />
                </div>,
                <div key={`${field.key}En`}>
                  <label className={labelCls}>{field.label}, EN</label>
                  <input name={`${field.key}En`} defaultValue={exchange?.brokerText?.[`${field.key}En`] ?? ''} className={smallInputCls} />
                </div>,
              ])}
            </div>
          </div>
        </>
      ) : (
        <>
          <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Продукты</h2>
          <ProductsRepeater existing={exchange?.products ?? []} />
          <div className="mb-4" />

          <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Плашки</h2>
          <BadgesRepeater existing={exchange?.badges ?? []} />
          <div className="mb-4" />

          <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Статус по регионам</h2>
          <RegionsRepeater existing={exchange?.regions ?? []} />
          <div className="mb-2" />
        </>
      )}

      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-1">Размещения и кнопки</h2>
      <p className="text-[11.5px] text-[var(--admin-text-muted)] mb-3">
        Место в рейтинге считается только по обороту, эти настройки на него не влияют. Пустой срок значит «пока не выключат вручную».
      </p>

      <fieldset className="mb-4">
        <legend className={labelCls}>Цвет кнопок площадки</legend>
        <div className="flex flex-wrap gap-4">
          {VENUE_BUTTON_COLORS.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2 text-[12.5px]">
              <input type="radio" name="buttonColor" value={value} defaultChecked={venueButtonColor(exchange?.buttonColor) === value} />
              <span aria-hidden className="w-4 h-4 rounded" style={{ background: SWATCHES[value] }} />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={panelCls}>
        <div className="text-[12.5px] font-bold mb-3">Партнёрская ссылка в таблице</div>
        <div className="grid grid-cols-[1fr_170px] gap-3">
          <div>
            <label className={labelCls}>Ссылка кнопки «{isBroker ? 'Открыть счёт' : 'Торговать'}»</label>
            <input name="tradeUrl" type="url" defaultValue={exchange?.tradeUrl} className={inputCls} />
            <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">Пусто или срок истёк: серая «Подробнее» ведёт на страницу площадки.</p>
          </div>
          <div>
            <label className={labelCls}>Действует до</label>
            <input name="tradeUntil" type="date" defaultValue={exchange?.tradeUntil?.slice(0, 10)} className={inputCls} />
          </div>
        </div>
      </div>

      <div className={panelCls}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <label className="flex items-center gap-2 text-[12.5px] font-bold">
            <input type="checkbox" name="extendedEnabled" defaultChecked={exchange?.extendedEnabled ?? false} />
            Расширенный профиль: выделенная строка в таблице
          </label>
          <input name="extendedUntil" type="date" aria-label="Расширенный профиль действует до" defaultValue={exchange?.extendedUntil?.slice(0, 10)} className={`${smallInputCls} !w-[170px]`} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input name="extendedPerkRu" defaultValue={exchange?.extendedPerkRu} placeholder="Строка с преимуществом, RU" className={smallInputCls} />
          <input name="extendedPerkEn" defaultValue={exchange?.extendedPerkEn} placeholder="Строка с преимуществом, EN" className={smallInputCls} />
          <input name="extendedFactsRu" defaultValue={exchange?.extendedFactsRu} placeholder="Три факта через запятую, RU" className={smallInputCls} />
          <input name="extendedFactsEn" defaultValue={exchange?.extendedFactsEn} placeholder="Три факта через запятую, EN" className={smallInputCls} />
        </div>
      </div>

      <div className={panelCls}>
        <div className="flex items-center justify-between gap-3 mb-3">
          <label className="flex items-center gap-2 text-[12.5px] font-bold">
            <input type="checkbox" name="adEnabled" defaultChecked={exchange?.adEnabled ?? false} />
            Рекламный блок над рейтингом, всегда с ярлыком «Реклама»
          </label>
          <input name="adUntil" type="date" aria-label="Рекламный блок действует до" defaultValue={exchange?.adUntil?.slice(0, 10)} className={`${smallInputCls} !w-[170px]`} />
        </div>
        <div className="mb-3">
          <input name="adUrl" type="url" defaultValue={exchange?.adUrl} placeholder="Ссылка кнопки блока (без неё блок не показывается)" className={smallInputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input name="adTextRu" defaultValue={exchange?.adTextRu} placeholder="Текст блока, RU" className={smallInputCls} />
          <input name="adTextEn" defaultValue={exchange?.adTextEn} placeholder="Текст блока, EN" className={smallInputCls} />
          <input name="adOfferRu" defaultValue={exchange?.adOfferRu} placeholder="Акция, заголовок, RU (необязательно)" className={smallInputCls} />
          <input name="adOfferEn" defaultValue={exchange?.adOfferEn} placeholder="Акция, заголовок, EN (необязательно)" className={smallInputCls} />
          <input name="adOfferNoteRu" defaultValue={exchange?.adOfferNoteRu} placeholder="Акция, условия и срок, RU" className={smallInputCls} />
          <input name="adOfferNoteEn" defaultValue={exchange?.adOfferNoteEn} placeholder="Акция, условия и срок, EN" className={smallInputCls} />
          <input name="adButtonRu" defaultValue={exchange?.adButtonRu} placeholder="Текст кнопки, RU (по умолчанию «Торговать»)" className={smallInputCls} />
          <input name="adButtonEn" defaultValue={exchange?.adButtonEn} placeholder="Текст кнопки, EN (по умолчанию Trade)" className={smallInputCls} />
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
        {exchange ? 'Сохранить' : isBroker ? 'Создать брокера' : 'Создать биржу'}
      </SubmitButton>
          <SavedMark />
    </form>
  );
}
