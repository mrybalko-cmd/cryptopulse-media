import type { AdminAuthorDoc } from '@/lib/admin/data';
import SlugInput from '../_shared/SlugInput';
import ImageField from '../_shared/ImageField';
import SubmitButton from '../_shared/SubmitButton';

const inputCls = 'w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]';
const labelCls = 'text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block';

export default function AuthorForm({
  author,
  action,
}: {
  author?: AdminAuthorDoc;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-2xl">
      <div className="grid grid-cols-[120px_1fr] gap-5 mb-5">
        <ImageField name="photo" label="Фото" currentUrl={author?.photo} size={120} />
        <div className="grid grid-cols-2 gap-4 content-start">
          <div className="col-span-2">
            <label className={labelCls}>Имя и фамилия</label>
            <input name="name" defaultValue={author?.name} required className={inputCls} />
          </div>
          <div className="col-span-2">
            <SlugInput name="slug" titleInputName="name" defaultValue={author?.slug} />
          </div>
          <div>
            <label className={labelCls}>Должность (RU)</label>
            <input name="roleRu" defaultValue={author?.roleRu} placeholder="Аналитик, Обозреватель, Редактор…" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Role (EN)</label>
            <input name="roleEn" defaultValue={author?.roleEn} placeholder="Analyst, Correspondent, Editor…" className={inputCls} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <label className={labelCls}>Биография (RU)</label>
          <textarea name="bioRu" defaultValue={author?.bioRu} rows={4} placeholder="2–4 предложения" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Bio (EN)</label>
          <textarea name="bioEn" defaultValue={author?.bioEn} rows={4} placeholder="2–4 sentences" className={inputCls} />
        </div>
      </div>

      <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Соцсети и контакты</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className={labelCls}>✈️ Telegram</label>
          <input name="telegram" type="url" defaultValue={author?.telegram} placeholder="https://t.me/username" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>𝕏 / Twitter</label>
          <input name="twitter" type="url" defaultValue={author?.twitter} placeholder="https://x.com/username" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>in LinkedIn</label>
          <input name="linkedin" type="url" defaultValue={author?.linkedin} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>f Facebook</label>
          <input name="facebook" type="url" defaultValue={author?.facebook} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>✉ Email</label>
          <input name="email" type="email" defaultValue={author?.email} className={inputCls} />
        </div>
      </div>

      <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
        {author ? 'Сохранить' : 'Создать автора'}
      </SubmitButton>
    </form>
  );
}
