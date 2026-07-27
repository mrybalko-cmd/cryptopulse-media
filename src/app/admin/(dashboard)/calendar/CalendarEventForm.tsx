import type { AdminCalendarEventDoc } from '@/lib/admin/data';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/lib/calendarMeta';
import SlugInput from '../_shared/SlugInput';
import ImageField from '../_shared/ImageField';
import SubmitButton from '../_shared/SubmitButton';

const inputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]';
const labelCls = 'text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block';

const IMPORTANCE_OPTIONS = [
  { value: 'low', label: 'Низкая' },
  { value: 'medium', label: 'Средняя' },
  { value: 'high', label: 'Высокая' },
];

export default function CalendarEventForm({
  event,
  action,
}: {
  event?: AdminCalendarEventDoc;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-2xl">
      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelCls}>Заголовок (RU)</label>
          <input name="titleRu" defaultValue={event?.titleRu} required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Title (EN)</label>
          <input name="titleEn" defaultValue={event?.titleEn} required className={inputCls} />
        </div>
      </div>

      <div className="mb-5">
        <SlugInput name="slug" titleInputName="titleEn" defaultValue={event?.slug} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelCls}>Дата</label>
          <input name="date" type="date" defaultValue={event?.date} required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Категория</label>
          <select name="category" defaultValue={event?.category ?? CATEGORY_ORDER[0]} className={inputCls}>
            {CATEGORY_ORDER.map(cat => (
              <option key={cat} value={cat}>{CATEGORY_LABELS[cat].ru} / {CATEGORY_LABELS[cat].en}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-5">
        <div className={labelCls}>Важность</div>
        <div className="flex gap-4 pt-1">
          {IMPORTANCE_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-1.5 text-[12.5px]">
              <input type="radio" name="importance" value={opt.value} defaultChecked={(event?.importance ?? 'medium') === opt.value} />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelCls}>Описание, RU (необязательно)</label>
          <textarea name="descriptionRu" defaultValue={event?.descriptionRu} rows={3} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Description, EN (optional)</label>
          <textarea name="descriptionEn" defaultValue={event?.descriptionEn} rows={3} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className={labelCls}>Ссылка на источник (необязательно)</label>
          <input name="sourceUrl" type="url" defaultValue={event?.sourceUrl} className={inputCls} />
        </div>
        <ImageField name="icon" label="Свой значок (необязательно — иначе эмодзи категории)" currentUrl={event?.icon} size={72} />
      </div>

      {event && (
        <div className="flex gap-4 mb-6 text-[12px] text-[var(--admin-text-muted)]">
          <span>❤ {event.likes} лайков</span>
          <span>👎 {event.dislikes} дизлайков</span>
          <span className="text-[var(--admin-text-dim)]">— считаются голосами читателей, недоступны для редактирования</span>
        </div>
      )}

      <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
        {event ? 'Сохранить' : 'Создать событие'}
      </SubmitButton>
    </form>
  );
}
