import type { AdminArticleDoc, AdminAuthorOption } from '@/lib/admin/data';
import SlugInput from '../_shared/SlugInput';
import ImageField from '../_shared/ImageField';
import CoverImageField from '../_shared/CoverImageField';
import RichTextEditor from '../_shared/RichTextEditor';
import SubmitButton from '../_shared/SubmitButton';
import ChipPicker from '../_shared/ChipPicker';
import TagChipsInput from '../_shared/TagChipsInput';
import LanguageTabs from '../_shared/LanguageTabs';
import AuthorPicker from '../_shared/AuthorPicker';

const TOPICS = [
  { value: 'regulation', label: 'Регулирование' },
  { value: 'defi', label: 'DeFi & Web3' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'market', label: 'Рынок', color: 'cyan' as const },
  { value: 'technology', label: 'Технологии' },
  { value: 'security', label: 'Безопасность' },
  { value: 'education', label: 'Обучение' },
  { value: 'ai', label: 'AI' },
];

const BADGES = [
  { value: 'editorsChoice', label: 'Выбор редакции', color: 'purple' as const },
  { value: 'trending', label: 'Актуально', color: 'orange' as const },
  { value: 'promo', label: 'Промо', color: 'amber' as const },
  { value: 'companyNews', label: 'Новости компании', color: 'slate' as const },
];

function toLocalInput(iso?: string) {
  if (!iso) return '';
  return iso.slice(0, 16);
}

export default function ArticleForm({
  article,
  authors,
  translationCandidates,
  action,
}: {
  article?: AdminArticleDoc;
  authors: AdminAuthorOption[];
  translationCandidates: { _id: string; title: string }[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6 items-start">
      <div className="min-w-0">
        <LanguageTabs name="language" defaultValue={article?.language ?? 'ru'} />

        <div className="mb-5">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Заголовок</label>
          <input name="title" defaultValue={article?.title} required className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>

        <div className="mb-5">
          <SlugInput name="slug" titleInputName="title" defaultValue={article?.slug} />
        </div>

        <div className="mb-5">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Краткое описание (для карточек)</label>
          <textarea name="excerpt" defaultValue={article?.excerpt} rows={2} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>

        <div className="mb-5">
          <CoverImageField name="coverImage" currentUrl={article?.coverImage} />
        </div>
        <div className="mb-5">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Alt-текст обложки</label>
          <input name="coverImageAlt" defaultValue={article?.coverImageAlt} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>

        <div className="mb-5">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Время чтения (минуты)</label>
          <input name="readingTime" type="number" min={1} defaultValue={article?.readingTime} className="w-full max-w-[140px] bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        </div>

        <div className="mb-5">
          <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Публикация (при нажатии «Опубликовать»)</div>
          <div className="flex gap-4 mb-3">
            {(['now', 'scheduled'] as const).map(v => (
              <label key={v} className="flex items-center gap-1.5 text-[12.5px]">
                <input type="radio" name="publishTiming" value={v} defaultChecked={(article?.publishTiming === 'scheduled' ? 'scheduled' : 'now') === v} />
                {v === 'now' ? 'Сейчас' : 'Запланировать'}
              </label>
            ))}
          </div>
          <input name="publishedAt" type="datetime-local" defaultValue={toLocalInput(article?.publishedAt)} className="bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
          <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">Заполняется только если выбрано «Запланировать». Кнопка «Сохранить черновик» ниже игнорирует эти настройки.</p>
        </div>

        <div className="mb-5">
          <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Текст статьи</div>
          <RichTextEditor name="body" originalBlocks={article?.body} rows={20} />
        </div>

        <div className="mb-5">
          <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">Тема</div>
          <ChipPicker name="topic" options={TOPICS} defaultValue={article?.topic} />
        </div>
        <div className="mb-5">
          <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">Плашка</div>
          <ChipPicker name="badge" options={BADGES} defaultValue={article?.badge !== 'none' ? article?.badge : undefined} />
        </div>

        <div className="mb-5">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Перевод на другом языке</label>
          <select name="translationRefId" defaultValue={article?.translationRefId ?? ''} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]">
            <option value="">— нет —</option>
            {translationCandidates.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>

        <details className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl mb-6" open>
          <summary className="text-[12.5px] font-bold px-4 py-3 cursor-pointer select-none">SEO — полный набор</summary>
          <div className="px-4 pb-4 border-t border-[var(--admin-border)] pt-4">
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Фокусный запрос</label>
              <input name="seoFocusKeyphrase" defaultValue={article?.seoFocusKeyphrase} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
            </div>
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Meta Title</label>
              <input name="seoMetaTitle" defaultValue={article?.seoMetaTitle} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
            </div>
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Meta Description</label>
              <textarea name="seoMetaDescription" defaultValue={article?.seoMetaDescription} rows={2} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
            </div>
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Ключевые слова</label>
              <TagChipsInput name="seoKeywords" defaultValue={article?.seoKeywords ? article.seoKeywords.split(',').map(s => s.trim()).filter(Boolean) : []} />
            </div>
            <div className="mb-3">
              <ImageField name="seoOgImage" label="OG Image (соцсети, 1200×630)" currentUrl={article?.seoOgImage} size={100} />
            </div>
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Тип структурированных данных (Schema.org)</label>
              <select name="seoSchemaType" defaultValue={article?.seoSchemaType ?? 'BlogPosting'} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]">
                <option value="BlogPosting">BlogPosting — аналитика, обзоры</option>
                <option value="NewsArticle">NewsArticle — новостные статьи</option>
                <option value="Article">Article — нейтральный тип</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Canonical URL (при синдикации)</label>
              <input name="seoCanonicalUrl" type="url" defaultValue={article?.seoCanonicalUrl} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
            </div>
            <label className="flex items-center gap-2 text-[12.5px]">
              <input type="checkbox" name="seoNoIndex" defaultChecked={article?.seoNoIndex ?? false} />
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
            {article ? 'Сохранить и опубликовать' : 'Опубликовать'}
          </SubmitButton>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-3.5">
          <h4 className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Автор</h4>
          <AuthorPicker authors={authors} defaultValue={article?.authorId} />
        </div>
        <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-3.5">
          <h4 className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Настройки</h4>
          <label className="flex items-center gap-2 text-[12.5px]">
            <input type="checkbox" name="commentsEnabled" defaultChecked={article?.commentsEnabled ?? true} />
            Комментарии включены
          </label>
        </div>
        {article && (
          <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-3.5">
            <h4 className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2">Статистика</h4>
            <p className="text-[12px] text-[var(--admin-text-muted)] m-0">👁 {article.views ?? 0} · ❤ {article.likes ?? 0}</p>
          </div>
        )}
      </div>
    </form>
  );
}
