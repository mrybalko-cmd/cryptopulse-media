import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminHomeSettings, fetchAuthorOptions, fetchMaterialOptionsForAuthors,
  fetchRecentMaterialOptions, fetchMaterialOptionsByIds, fetchRegulationPickOptions } from '@/lib/admin/data';
import { updateHomeSettingsAction } from './actions';
import HomeAuthorColumnsEditor from './HomeAuthorColumnsEditor';
import HomeAuthorsWidgetEditor from './HomeAuthorsWidgetEditor';
import HomeRegulationWidgetEditor from './HomeRegulationWidgetEditor';
import SubmitButton from '../_shared/SubmitButton';
import SavedMark from '../_shared/SavedMark';

const HOME_AUTHOR_SLOTS = 4;

export default async function AdminHomepagePage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  await requireAdminPermission('homepage');
  const { success } = await searchParams;
  // Сначала настройки: из них видно, чьи материалы вообще понадобятся
  // подборщику. Тянуть весь архив, чтобы отфильтровать его в браузере до
  // одного автора, страница больше не будет.
  const settings = await fetchAdminHomeSettings();
  const regulationOptions = await fetchRegulationPickOptions();
  const columnAuthorIds = [...new Set(
    (settings.featuredAuthors || []).map(s => s.authorId).filter(Boolean) as string[],
  )];

  // Уже выбранное в блоке может быть старше окна «свежих» — догружаем точечно,
  // иначе строка в форме выглядела бы пустой.
  const widgetPicked = [
    settings.widgetHero?.ruId, settings.widgetHero?.enId,
    ...(settings.widgetItems || []).flatMap(s => [s.ruId, s.enId]),
    ...(settings.widgetReading || []).flatMap(s => [s.ruId, s.enId]),
  ].filter((x): x is string => !!x);

  const [authors, materialsRu, materialsEn, recentRu, recentEn, pickedOptions] = await Promise.all([
    fetchAuthorOptions(),
    fetchMaterialOptionsForAuthors('ru', columnAuthorIds),
    fetchMaterialOptionsForAuthors('en', columnAuthorIds),
    // Подборщикам блока участников нужен не архив автора, а просто свежие
    // материалы: внутри пикера есть поиск по заголовку.
    fetchRecentMaterialOptions('ru'),
    fetchRecentMaterialOptions('en'),
    fetchMaterialOptionsByIds(widgetPicked),
  ]);

  const dedupe = (list: typeof recentRu, extra: typeof pickedOptions) => {
    const seen = new Set(list.map(m => m._id));
    return [...list, ...extra.filter(m => !seen.has(m._id))];
  };

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

        <div className="mt-8 pt-7 border-t border-[var(--admin-border)]">
          <HomeAuthorsWidgetEditor
            settings={settings}
            authors={authors}
            materialsRu={dedupe(recentRu, pickedOptions)}
            materialsEn={dedupe(recentEn, pickedOptions)}
          />
        </div>

        <div className="mt-8 pt-7 border-t border-[var(--admin-border)]">
          <HomeRegulationWidgetEditor
            show={settings.showRegulationWidget}
            countries={regulationOptions.countries}
            regimes={regulationOptions.regimes}
            pickedCountries={(settings.regulationCountries || []).map(c => c.id)}
            pickedRegimes={(settings.regulationRegimes || []).map(r => r.id)}
          />
        </div>

        <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
          Сохранить
        </SubmitButton>
          <SavedMark param="success" />
      </form>
    </div>
  );
}
