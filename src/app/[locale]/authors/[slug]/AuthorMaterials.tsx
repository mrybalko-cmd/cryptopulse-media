'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, List, LayoutGrid, Loader2 } from 'lucide-react';
import AuthorMaterialRow from '@/components/ui/AuthorMaterialRow';
import Pagination from '@/components/ui/Pagination';
import { sanityImageTransform } from '@/lib/sanityImage';
import type { AuthorFeedItem } from '@/lib/sanity';
import { loadAuthorFeed } from './actions';

type Kind = 'all' | 'article' | 'news';

/**
 * Лента материалов участника: поиск, тип, вид.
 *
 * Пока читатель ничего не трогал, на экране лежит то, что пришло с сервера в
 * HTML, и рядом обычная постраничная навигация ссылками — робот проходит
 * архив целиком. Первое же нажатие уводит в поиск по базе: у самого
 * плодовитого автора 1836 материалов, и фильтровать открытые двадцать строк
 * значило бы показывать человеку не то, о чём он спросил.
 */
export default function AuthorMaterials({
  slug,
  locale,
  seed,
  total,
  page,
  pageSize,
  articles,
  news,
}: {
  slug: string;
  locale: string;
  seed: AuthorFeedItem[];
  total: number;
  page: number;
  pageSize: number;
  articles: number;
  news: number;
}) {
  const isRu = locale === 'ru';
  const [kind, setKind] = useState<Kind>('all');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [found, setFound] = useState<{ items: AuthorFeedItem[]; total: number } | null>(null);
  const [pending, startTransition] = useTransition();
  const firstRender = useRef(true);

  // Каждое нажатие клавиши в базу не уходит: запрос отправляется через треть
  // секунды после того, как человек перестал печатать.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const q = query.trim();
    if (kind === 'all' && !q) {
      setFound(null);
      return;
    }
    const timer = setTimeout(() => {
      startTransition(async () => {
        setFound(await loadAuthorFeed(slug, locale, kind, q, 0, pageSize));
      });
    }, 330);
    return () => clearTimeout(timer);
  }, [kind, query, slug, locale, pageSize]);

  const items = found ? found.items : seed;
  const shownTotal = found ? found.total : total;
  const filtering = found !== null;

  async function loadMore() {
    startTransition(async () => {
      const next = await loadAuthorFeed(slug, locale, kind, query.trim(), items.length, pageSize);
      setFound(prev => ({
        items: [...(prev?.items || []), ...next.items],
        total: next.total,
      }));
    });
  }

  const tabs: { key: Kind; label: string; count: number }[] = [
    { key: 'all', label: isRu ? 'Все' : 'All', count: total },
    { key: 'article', label: isRu ? 'Статьи' : 'Articles', count: articles },
    { key: 'news', label: isRu ? 'Новости' : 'News', count: news },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
        <div>
          <h2 className="text-[21px] sm:text-[23px] font-extrabold tracking-[-.02em] mb-1">
            {isRu ? 'Все материалы' : 'All materials'}
          </h2>
          <p className="text-[13.5px] text-muted">
            {pending
              ? (isRu ? 'Ищем…' : 'Searching…')
              : `${shownTotal} ${isRu ? plural(shownTotal, 'публикация', 'публикации', 'публикаций') : shownTotal === 1 ? 'publication' : 'publications'}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="glass-control flex items-center gap-2 h-[38px] px-3 rounded-[11px]">
            {pending
              ? <Loader2 size={15} className="text-muted shrink-0 animate-spin" />
              : <Search size={15} className="text-muted shrink-0" />}
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={isRu ? 'Поиск по заголовку' : 'Search by title'}
              autoComplete="off"
              aria-label={isRu ? 'Поиск по заголовку' : 'Search by title'}
              className="bg-transparent border-0 outline-none text-[13.5px] w-[150px] sm:w-[180px] placeholder:text-muted"
            />
          </label>

          <div className="glass-control flex h-[38px] p-[3px] rounded-[11px]">
            {tabs.map(t => (
              <button key={t.key} type="button" onClick={() => setKind(t.key)}
                aria-pressed={kind === t.key}
                className={`px-3 rounded-lg text-[12.5px] font-bold transition-colors
                  ${kind === t.key ? 'bg-foreground text-background' : 'text-muted hover:text-foreground'}`}>
                {t.label}
              </button>
            ))}
          </div>

          <div className="glass-control hidden sm:flex h-[38px] p-[3px] rounded-[11px]">
            <ViewButton on={view === 'list'} onClick={() => setView('list')}
              label={isRu ? 'Списком' : 'List view'}><List size={15} /></ViewButton>
            <ViewButton on={view === 'grid'} onClick={() => setView('grid')}
              label={isRu ? 'Плитками' : 'Grid view'}><LayoutGrid size={15} /></ViewButton>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-[14px] text-muted py-12 text-center border border-border rounded-2xl">
          {isRu ? 'По этому запросу ничего не нашлось.' : 'Nothing matches this search.'}
        </p>
      ) : view === 'list' ? (
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          {items.map(item => (
            <AuthorMaterialRow key={item._id} item={item} locale={locale} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <MaterialTile key={item._id} item={item} locale={locale} />
          ))}
        </div>
      )}

      {/* Пока фильтр не тронут, листается ссылками: так архив обходит робот.
          В отфильтрованной ленте ссылок быть не может — её нет по адресу. */}
      {!filtering ? (
        <Pagination
          basePath={`/${locale}/authors/${slug}`}
          currentPage={page}
          totalPages={Math.max(1, Math.ceil(total / pageSize))}
          locale={locale}
        />
      ) : items.length < shownTotal ? (
        <button type="button" onClick={loadMore} disabled={pending}
          className="block w-full mt-5 py-3.5 rounded-xl border border-border text-[13.5px]
            font-bold text-accent hover:border-accent/40 transition-colors disabled:opacity-50">
          {pending ? (isRu ? 'Загружаем…' : 'Loading…') : (isRu ? 'Показать ещё' : 'Show more')}
        </button>
      ) : null}
    </>
  );
}

function ViewButton({ on, onClick, label, children }:
  { on: boolean; onClick: () => void; label: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} title={label} aria-label={label}
      className={`px-2.5 rounded-lg flex items-center transition-colors
        ${on ? 'bg-foreground text-background' : 'text-muted hover:text-foreground'}`}>
      {children}
    </button>
  );
}

function MaterialTile({ item, locale }: { item: AuthorFeedItem; locale: string }) {
  const isRu = locale === 'ru';
  const isArticle = item._type === 'article';
  const cover = sanityImageTransform(item.coverImage, { width: 520, height: 292 });
  const date = new Date(item.publishedAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-GB', {
    day: '2-digit', month: '2-digit', year: '2-digit',
  });
  return (
    <Link href={`/${locale}/${isArticle ? 'articles' : 'news'}/${item.slug.current}`}
      className="group block rounded-[15px] overflow-hidden bg-card border border-border
        hover:border-accent hover:-translate-y-[3px] transition-all duration-200">
      <span className="block aspect-video overflow-hidden bg-background">
        {cover && (
          <Image src={cover} alt={item.coverImageAlt || ''} width={520} height={292} unoptimized
            className="w-full h-full object-cover" />
        )}
      </span>
      <span className="block px-3.5 pt-3 pb-3.5">
        <span className="flex items-center gap-2 text-[10.5px] uppercase tracking-[.09em]">
          <b className="text-accent font-extrabold">
            {isArticle ? (isRu ? 'Статья' : 'Article') : (isRu ? 'Новость' : 'News')}
          </b>
          <i className="not-italic text-muted font-semibold tabular-nums">{date}</i>
        </span>
        <span className="mt-1.5 mb-2 text-[14.2px] font-semibold leading-[1.36] line-clamp-3">
          {item.title}
        </span>
        <span className="block text-[11.5px] text-muted tabular-nums">
          {(item.views ?? 0).toLocaleString(isRu ? 'ru-RU' : 'en-GB')}{' '}
          {isRu ? 'просмотров' : 'views'}
        </span>
      </span>
    </Link>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const d = Math.abs(n) % 100;
  if (d >= 11 && d <= 14) return many;
  const u = d % 10;
  return u === 1 ? one : u >= 2 && u <= 4 ? few : many;
}
