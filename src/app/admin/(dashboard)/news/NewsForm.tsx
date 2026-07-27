import type { AdminNewsDoc, AdminAuthorOption } from '@/lib/admin/data';
import { blocksToText } from '@/lib/admin/portableText';
import SlugInput from '../_shared/SlugInput';
import ImageField from '../_shared/ImageField';
import CoverImageField from '../_shared/CoverImageField';
import RichTextEditor from '../_shared/RichTextEditor';
import SubmitButton from '../_shared/SubmitButton';

const TOPICS = [
  { value: '', label: '— без темы —' },
  { value: 'regulation', label: 'Регулирование' },
  { value: 'defi', label: 'DeFi & Web3' },
  { value: 'bitcoin', label: 'Bitcoin' },
  { value: 'market', label: 'Рынок' },
  { value: 'technology', label: 'Технологии' },
  { value: 'security', label: 'Безопасность' },
  { value: 'education', label: 'Обучение' },
  { value: 'ai', label: 'AI & Машинное обучение' },
  { value: 'press-release', label: 'Пресс-релиз' },
];

function toLocalInput(iso?: string) {
  if (!iso) return '';
  return iso.slice(0, 16);
}

export default function NewsForm({
  news,
  authors,
  translationCandidates,
  action,
}: {
  news?: AdminNewsDoc;
  authors: AdminAuthorOption[];
  translationCandidates: { _id: string; title: string }[];
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="max-w-2xl">
      <div className="mb-5">
        <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Язык</label>
        <div className="flex gap-4 pt-1">
          {(['ru', 'en'] as const).map(v => (
            <label key={v} className="flex items-center gap-1.5 text-[12.5px]">
              <input type="radio" name="language" value={v} defaultChecked={(news?.language ?? 'ru') === v} />
              {v.toUpperCase()}
            </label>
          ))}
        </div>
      </div>

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
        <CoverImageField name="coverImage" currentUrl={news?.coverImage} breakingDefault={news?.breaking ?? false} />
      </div>
      <div className="mb-5">
        <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Alt-текст обложки</label>
        <input name="coverImageAlt" defaultValue={news?.coverImageAlt} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
      </div>

      <div className="mb-5">
        <div className="text-[10.5px] uppercase tracking-wide text-[var(--admin-text-muted)] font-bold mb-2.5">Публикация</div>
        <div className="flex gap-4 mb-3">
          {(['now', 'scheduled'] as const).map(v => (
            <label key={v} className="flex items-center gap-1.5 text-[12.5px]">
              <input type="radio" name="publishTiming" value={v} defaultChecked={(news?.publishTiming ?? 'now') === v} />
              {v === 'now' ? 'Сейчас' : 'Запланировать'}
            </label>
          ))}
        </div>
        <input name="publishedAt" type="datetime-local" defaultValue={toLocalInput(news?.publishedAt)} className="bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
        <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">Заполняется только если выбрано «Запланировать».</p>
      </div>

      <div className="mb-5">
        <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Текст новости</label>
        <RichTextEditor name="body" defaultValue={blocksToText(news?.body)} rows={16} />
        <p className="text-[11px] text-[var(--admin-text-muted)] mt-1">
          Абзацы — через пустую строку. Кнопки вставляют разметку в месте курсора.
          Строки вида ⟦N: …⟧ — картинки/цитаты/embed из Sanity, не редактируются здесь и сохранятся как есть; сложные вставки — через /studio.
        </p>
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

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Тема</label>
          <select name="topic" defaultValue={news?.topic ?? ''} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]">
            {TOPICS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Плашка</label>
          <select name="badge" defaultValue={news?.badge ?? 'none'} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]">
            <option value="none">Нет</option>
            <option value="promo">Промо (коммерческая публикация)</option>
            <option value="companyNews">Новости компании</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <label className="flex items-center gap-2 text-[12.5px]">
          <input type="checkbox" name="ownBadge" defaultChecked={news?.ownBadge ?? true} />
          ⚡ Значок «Наш материал»
        </label>
        <label className="flex items-center gap-2 text-[12.5px]">
          <input type="checkbox" name="commentsEnabled" defaultChecked={news?.commentsEnabled ?? true} />
          Комментарии включены
        </label>
      </div>

      <div className="mb-5">
        <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Закрепить в топе до (необязательно)</label>
        <input name="pinnedUntil" type="datetime-local" defaultValue={toLocalInput(news?.pinnedUntil)} className="bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div>
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Автор</label>
          <select name="authorId" defaultValue={news?.authorId ?? ''} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]">
            <option value="">— без автора —</option>
            {authors.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Перевод на другом языке</label>
          <select name="translationRefId" defaultValue={news?.translationRefId ?? ''} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]">
            <option value="">— нет —</option>
            {translationCandidates.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-[var(--admin-panel)] border border-[var(--admin-border)] rounded-xl p-4 mb-6">
        <div className="text-[12.5px] font-bold mb-3">SEO</div>
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
        <div className="mb-3">
          <label className="text-[11.5px] font-bold text-[var(--admin-text-secondary)] mb-1.5 block">Ключевые слова (через запятую)</label>
          <input name="seoKeywords" defaultValue={news?.seoKeywords} className="w-full bg-[var(--admin-input)] border border-[var(--admin-border)] rounded-lg px-3 py-2.5 text-[13px]" />
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

      <SubmitButton className="bg-[#22c55e] text-[#06210f] font-extrabold text-[12.5px] rounded-lg px-5 py-2.5">
        {news ? 'Сохранить' : 'Опубликовать новость'}
      </SubmitButton>
    </form>
  );
}
