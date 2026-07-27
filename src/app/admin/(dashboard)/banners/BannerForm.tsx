import type { AdminBannerDoc } from '@/lib/admin/data';
import SubmitButton from '../_shared/SubmitButton';

function toLocalInput(iso?: string) {
  if (!iso) return '';
  return iso.slice(0, 16);
}

export default function BannerForm({
  banner,
  action,
}: {
  banner?: AdminBannerDoc;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-xl">
      <div className="mb-5">
        <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Внутреннее название (не показывается на сайте)</label>
        <input name="title" defaultValue={banner?.title} required className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
      </div>

      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Картинка (квадрат 1:1, мин. 600×600)</div>
        {banner?.image && (
          <img src={`${banner.image}?w=320&h=320&fit=crop`} alt="" className="w-40 h-40 rounded-lg object-cover mb-2 border border-[var(--admin-border)]" />
        )}
        <input name="image" type="file" accept="image/*" className="w-full text-[12.5px] text-[var(--admin-text-muted)]" />
        <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">{banner ? 'Оставьте пустым, чтобы не менять текущую картинку.' : ''}</p>
      </div>

      <div className="mb-5">
        <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Alt-текст</label>
        <input name="altText" defaultValue={banner?.altText} required className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px] mb-3" />
        <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Ссылка (с UTM-метками)</label>
        <input name="link" type="url" defaultValue={banner?.link} required className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
      </div>

      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Язык показа</div>
        <div className="flex gap-4">
          {(['all', 'ru', 'en'] as const).map(v => (
            <label key={v} className="flex items-center gap-1.5 text-[12.5px]">
              <input type="radio" name="language" value={v} defaultChecked={(banner?.language ?? 'all') === v} />
              {v === 'all' ? 'Оба языка' : v === 'ru' ? 'Только RU' : 'Только EN'}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Вес ротации (1–100)</label>
          <input name="weight" type="number" min={1} max={100} defaultValue={banner?.weight ?? 1} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>
        <div></div>
        <div>
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Показывать с</label>
          <input name="startAt" type="datetime-local" defaultValue={toLocalInput(banner?.startAt)} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>
        <div>
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Показывать до</label>
          <input name="endAt" type="datetime-local" defaultValue={toLocalInput(banner?.endAt)} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-[12.5px] mb-6">
        <input type="checkbox" name="active" defaultChecked={banner?.active ?? true} />
        Активен (участвует в ротации)
      </label>

      {banner && (
        <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-3.5 mb-6 flex gap-5 text-[11px] text-[var(--admin-text-muted)]">
          <span>👁 {banner.impressions.toLocaleString('ru-RU')} показов</span>
          <span>🖱 {banner.clicks.toLocaleString('ru-RU')} кликов</span>
          <span>CTR {banner.impressions > 0 ? ((banner.clicks / banner.impressions) * 100).toFixed(2) : '0.00'}%</span>
        </div>
      )}

      <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
        {banner ? 'Сохранить' : 'Создать баннер'}
      </SubmitButton>
    </form>
  );
}
