import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminHomeSettings, fetchAuthorOptions, fetchAllMaterialOptions } from '@/lib/admin/data';
import { updateHomeSettingsAction } from './actions';
import HomeAuthorColumnsEditor from './HomeAuthorColumnsEditor';
import SubmitButton from '../_shared/SubmitButton';

const HOME_AUTHOR_SLOTS = 4;

export default async function AdminHomepagePage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  await requireAdminPermission('homepage');
  const { success } = await searchParams;
  const [settings, authors, materialsRu, materialsEn] = await Promise.all([
    fetchAdminHomeSettings(),
    fetchAuthorOptions(),
    fetchAllMaterialOptions('ru'),
    fetchAllMaterialOptions('en'),
  ]);

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Главная страница</h1>

      {success === '1' && <p className="text-[12.5px] text-[#22c55e] mb-4">Настройки сохранены.</p>}

      <form action={updateHomeSettingsAction}>
        <div className="max-w-3xl">
          <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-3">Разделы</h2>
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

          <h2 className="text-[13px] font-bold text-[var(--admin-text-secondary)] mb-1">Авторские колонки</h2>
          <p className="text-[11px] text-[var(--admin-text-muted)] mb-3">
            На главной помещается ровно {HOME_AUTHOR_SLOTS} колонки в ряд — автор + материал на RU + материал на EN.
            Стрелки слева меняют порядок строк = порядок на сайте. Материалы в списке — только те, что принадлежат
            выбранному автору. Оставьте автора пустым, чтобы не показывать эту строку.
          </p>
        </div>

        {/* Unconstrained by max-w-3xl above — the material picker columns need
            far more horizontal room than the plain checkbox settings do. Its
            own overflow-x-auto wrapper handles narrower viewports. */}
        <HomeAuthorColumnsEditor
          slotCount={HOME_AUTHOR_SLOTS}
          authors={authors}
          materialsRu={materialsRu}
          materialsEn={materialsEn}
          initialSlots={settings.featuredAuthors}
        />

        <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
          Сохранить
        </SubmitButton>
      </form>
    </div>
  );
}
