import type { AdminAuthorDoc } from '@/lib/admin/data';
import SlugInput from '../_shared/SlugInput';
import ImageField from '../_shared/ImageField';
import SubmitButton from '../_shared/SubmitButton';
import SavedMark from '../_shared/SavedMark';

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
        <ImageField name="photo" label="Фото" currentUrl={author?.photo} size={120} hint="Квадрат 1:1, рекомендуется 400×400 px, JPG или WebP." />
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

      <div className="border border-[var(--admin-border)] rounded-xl p-4 mb-5">
        <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-1">Написание по языкам</h2>
        <p className="text-[11px] text-[var(--admin-text-dim)] mb-3.5">
          Необязательно. Пусто — на обоих языках показывается «Имя и фамилия» сверху.
          Фамилию можно не заполнять: у части авторов её просто нет.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Имя (RU)</label>
            <input name="firstNameRu" defaultValue={author?.firstNameRu} placeholder="Максим" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Фамилия (RU)</label>
            <input name="lastNameRu" defaultValue={author?.lastNameRu} placeholder="Рыбалко" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>First name (EN)</label>
            <input name="firstNameEn" defaultValue={author?.firstNameEn} placeholder="Maks" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Last name (EN)</label>
            <input name="lastNameEn" defaultValue={author?.lastNameEn} placeholder="Rybalko" className={inputCls} />
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
          <label className={labelCls}>◎ Instagram</label>
          <input name="instagram" type="url" defaultValue={author?.instagram} placeholder="https://instagram.com/username" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>⌂ Сайт автора</label>
          <input name="website" type="url" defaultValue={author?.website} placeholder="https://example.com" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>✉ Email</label>
          <input name="email" type="email" defaultValue={author?.email} className={inputCls} />
        </div>
      </div>

      <label className="flex items-start gap-3 border border-[var(--admin-border)] rounded-xl p-4 mb-6 cursor-pointer">
        <input
          type="checkbox"
          name="hidden"
          defaultChecked={author?.hidden}
          className="mt-0.5 w-4 h-4 accent-amber-500 shrink-0"
        />
        <span>
          <span className="block text-[13px] font-bold">Скрыть из списка авторов</span>
          <span className="block text-[11px] text-[var(--admin-text-dim)] leading-relaxed mt-0.5">
            Автор пропадает со страницы «Авторы», из подборки на главной и из карты сайта.
            Материалы остаются на сайте, подпись под ними и страница автора продолжают работать.
          </span>
        </span>
      </label>

      <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
        {author ? 'Сохранить' : 'Создать автора'}
      </SubmitButton>
          <SavedMark />
    </form>
  );
}
