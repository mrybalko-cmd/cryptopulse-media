import type { AdminNewsDoc, AdminAuthorOption } from '@/lib/admin/data';
import { pragueLocalInput } from '@/lib/admin/timezone';
import SlugInput from '../_shared/SlugInput';
import ImageField from '../_shared/ImageField';
import CoverImageField from '../_shared/CoverImageField';
import RichTextEditor from '../_shared/RichTextEditor';
import SubmitButton from '../_shared/SubmitButton';
import ChipPicker from '../_shared/ChipPicker';
import TagChipsInput from '../_shared/TagChipsInput';
import LanguageTabs from '../_shared/LanguageTabs';
import AuthorPicker from '../_shared/AuthorPicker';
import TranslationPicker from '../_shared/TranslationPicker';
import HistoryPanel from '../_shared/HistoryPanel';
import SerpPreview from '../_shared/SerpPreview';
import { getNewsHistoryAction, restoreNewsRevisionAction } from './actions';

const TOPICS = [
  { value: 'regulation', label: 'Регулирование' },
  { value: 'defi', label: 'DeFi & Web3' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'market', label: 'Рынок', color: 'cyan' as const },
  { value: 'technology', label: 'Технологии' },
  { value: 'security', label: 'Безопасность' },
  { value: 'education', label: 'Обучение' },
  { value: 'ai', label: 'AI' },
  { value: 'press-release', label: 'Пресс-релиз' },
];

const BADGES = [
  { value: 'promo', label: 'Промо', color: 'amber' as const },
  { value: 'companyNews', label: 'Новости компании', color: 'slate' as const },
];



export default function NewsForm({
  news,
  authors,
  translationCandidates,
  action,
}: {
  news?: AdminNewsDoc;
  authors: AdminAuthorOption[];
  translationCandidates: { _id: string; title: string; coverImage: string | null }[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-start">
      <div className="min-w-0">
        <LanguageTabs
          key={news?._id ?? 'new'}
          name="language"
          defaultValue={news?.language ?? 'ru'}
          mode={news?._id ? 'edit' : 'create'}
          translationHref={news?.translationRefId ? `/admin/news/${news.translationRefId}` : undefined}
        />

        {news?._id && (
          <HistoryPanel docId={news._id} listAction={getNewsHistoryAction} restoreAction={restoreNewsRevisionAction} />
        )}

        <div className="mb-5">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Заголовок</label>
          <input name="title" defaultValue={news?.title} required className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>

        <div className="mb-5">
          <SlugInput name="slug" titleInputName="title" defaultValue={news?.slug} />
        </div>

        <div className="mb-5">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Краткое описание (для карточек)</label>
          <textarea name="excerpt" defaultValue={news?.excerpt} rows={2} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>

        <div className="mb-5">
          <CoverImageField
            name="coverImage"
            currentUrl={news?.coverImage}
            breakingDefault={news?.breaking ?? false}
            ownBadgeDefault={news?.ownBadge ?? false}
          />
        </div>
        <div className="mb-5">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Alt-текст обложки</label>
          <input name="coverImageAlt" defaultValue={news?.coverImageAlt} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>

        <div className="mb-5">
          <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Публикация (при нажатии «Опубликовать»)</div>
          <div className="flex gap-4 mb-3">
            {(['now', 'scheduled'] as const).map(v => (
              <label key={v} className="flex items-center gap-1.5 text-[12.5px]">
                <input type="radio" name="publishTiming" value={v} defaultChecked={(news?.publishTiming === 'scheduled' ? 'scheduled' : 'now') === v} />
                {v === 'now' ? 'Сейчас' : 'Запланировать'}
              </label>
            ))}
          </div>
          <input name="publishedAt" type="datetime-local" defaultValue={pragueLocalInput(news?.publishedAt)} className="bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
          <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">Заполняется только если выбрано «Запланировать». Кнопка «Сохранить черновик» ниже игнорирует эти настройки.</p>
        </div>

        <div className="mb-5">
          <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Текст новости</div>
          <RichTextEditor name="body" originalBlocks={news?.body} rows={16} />
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div>
            <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Источник (название, необязательно)</label>
            <input name="sourceName" defaultValue={news?.sourceName} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
          </div>
          <div>
            <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Источник (ссылка, необязательно)</label>
            <input name="sourceUrl" type="url" defaultValue={news?.sourceUrl} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
          </div>
        </div>

        <div className="mb-5">
          <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">Тема</div>
          <ChipPicker name="topic" options={TOPICS} defaultValue={news?.topic} />
        </div>
        <div className="mb-5">
          <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">Плашка (те же, что в Studio)</div>
          <ChipPicker name="badge" options={BADGES} defaultValue={news?.badge !== 'none' ? news?.badge : undefined} />
        </div>

        <div className="mb-5">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Закрепить в топе до (необязательно)</label>
          <input name="pinnedUntil" type="datetime-local" defaultValue={pragueLocalInput(news?.pinnedUntil)} className="bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>

        <div className="mb-5">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Перевод на другом языке</label>
          <TranslationPicker candidates={translationCandidates} defaultValue={news?.translationRefId} />
        </div>

        <details className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl mb-6" open>
          <summary className="text-[12.5px] font-bold px-4 py-3 cursor-pointer select-none">SEO — полный набор</summary>
          <div className="px-4 pb-4 border-t border-[var(--admin-border)] pt-4">
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Фокусный запрос</label>
              <input name="seoFocusKeyphrase" defaultValue={news?.seoFocusKeyphrase} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
            </div>
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Meta Title</label>
              <input name="seoMetaTitle" defaultValue={news?.seoMetaTitle} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
            </div>
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Meta Description</label>
              <textarea name="seoMetaDescription" defaultValue={news?.seoMetaDescription} rows={2} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
            </div>
            <div className="mb-4">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Превью в поиске Google</label>
              <SerpPreview section="news" />
            </div>
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Ключевые слова</label>
              <TagChipsInput name="seoKeywords" defaultValue={news?.seoKeywords ? news.seoKeywords.split(',').map(s => s.trim()).filter(Boolean) : []} minRecommended={10} />
            </div>
            <div className="mb-3">
              <ImageField name="seoOgImage" label="OG Image (соцсети, 1200×630)" currentUrl={news?.seoOgImage} size={100} />
            </div>
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Canonical URL (при синдикации)</label>
              <input name="seoCanonicalUrl" type="url" defaultValue={news?.seoCanonicalUrl} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
            </div>
            <label className="flex items-center gap-2 text-[12.5px]">
              <input type="checkbox" name="seoNoIndex" defaultChecked={news?.seoNoIndex ?? false} />
              🚫 Скрыть из поисковиков (noindex)
            </label>
          </div>
        </details>

        <div className="flex gap-2.5">
          <SubmitButton
            name="intent"
            value="draft"
            pendingLabel="Сохраняем черновик…"
            className="border border-[var(--admin-border)] text-[var(--admin-text-secondary)] font-bold text-[12.5px] rounded-lg px-5 py-2.5"
          >
            Сохранить черновик
          </SubmitButton>
          <SubmitButton
            name="intent"
            value="publish"
            className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5"
          >
            {news ? 'Сохранить и опубликовать' : 'Опубликовать'}
          </SubmitButton>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-3.5">
          <h4 className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Автор</h4>
          <AuthorPicker authors={authors} defaultValue={news?.authorId} />
        </div>
        <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-3.5">
          <h4 className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Настройки</h4>
          <label className="flex items-center gap-2 text-[12.5px]">
            <input type="checkbox" name="commentsEnabled" defaultChecked={news?.commentsEnabled ?? true} />
            Комментарии включены
          </label>
        </div>
        {news && (
          <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-3.5">
            <h4 className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">Статистика</h4>
            <p className="text-[12px] text-[var(--admin-text-muted)] m-0">👁 {news.views ?? 0} · ❤ {news.likes ?? 0}</p>
          </div>
        )}
      </div>
    </form>
  );
}
