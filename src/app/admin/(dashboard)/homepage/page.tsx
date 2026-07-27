import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminHomeSettings, fetchAuthorOptions, fetchAllMaterialOptions } from '@/lib/admin/data';
import { updateHomeSettingsAction } from './actions';

const selectCls = 'w-full bg-[#1c202b] border border-[#262b38] rounded-lg px-2.5 py-2 text-[12.5px]';

export default async function AdminHomepagePage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  await requireAdminPermission('homepage');
  const { success } = await searchParams;
  const [settings, authors, materialsRu, materialsEn] = await Promise.all([
    fetchAdminHomeSettings(),
    fetchAuthorOptions(),
    fetchAllMaterialOptions('ru'),
    fetchAllMaterialOptions('en'),
  ]);

  const rows = Math.max(settings.featuredAuthors.length + 3, 4);

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Главная страница</h1>

      {success === '1' && <p className="text-[12.5px] text-[#22c55e] mb-4">Настройки сохранены.</p>}

      <form action={updateHomeSettingsAction} className="max-w-3xl">
        <h2 className="text-[13px] font-bold text-[#c3c9d6] mb-3">Разделы</h2>
        <div className="flex flex-col gap-2 mb-6">
          <label className="flex items-center gap-2 text-[12.5px]">
            <input type="checkbox" name="showNews" defaultChecked={settings.showNews} />
            Показывать ленту новостей
          </label>
          <label className="flex items-center gap-2 text-[12.5px]">
            <input type="checkbox" name="showArticles" defaultChecked={settings.showArticles} />
            Показывать ряды статей
          </label>
          <label className="flex items-center gap-2 text-[12.5px]">
            <input type="checkbox" name="showAuthorColumns" defaultChecked={settings.showAuthorColumns} />
            Показывать авторские колонки
          </label>
        </div>

        <h2 className="text-[13px] font-bold text-[#c3c9d6] mb-1">Авторские колонки</h2>
        <p className="text-[11px] text-[#8b93a7] mb-3">
          Каждая строка — автор + материал на RU + материал на EN. Порядок строк = порядок на сайте.
          Оставьте автора пустым, чтобы не показывать эту строку.
        </p>
        <div className="flex flex-col gap-2 mb-6">
          {Array.from({ length: rows }).map((_, i) => {
            const slot = settings.featuredAuthors[i];
            return (
              <div key={i} className="grid grid-cols-3 gap-2 border border-[#262b38] rounded-lg p-2.5 bg-[#161922]">
                <select name={`slot_authorId_${i}`} defaultValue={slot?.authorId ?? ''} className={selectCls}>
                  <option value="">— автор —</option>
                  {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
                <select name={`slot_materialRuId_${i}`} defaultValue={slot?.materialRuId ?? ''} className={selectCls}>
                  <option value="">— материал RU —</option>
                  {materialsRu.map(m => <option key={m._id} value={m._id}>{m.authorName ? `${m.authorName} — ` : ''}{m.title}</option>)}
                </select>
                <select name={`slot_materialEnId_${i}`} defaultValue={slot?.materialEnId ?? ''} className={selectCls}>
                  <option value="">— материал EN —</option>
                  {materialsEn.map(m => <option key={m._id} value={m._id}>{m.authorName ? `${m.authorName} — ` : ''}{m.title}</option>)}
                </select>
              </div>
            );
          })}
        </div>

        <button type="submit" className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
          Сохранить
        </button>
      </form>
    </div>
  );
}
