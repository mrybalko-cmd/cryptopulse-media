import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ExternalLink, Mail } from 'lucide-react';
import AuthorFeedItem from '@/components/ui/AuthorFeedItem';
import Pagination from '@/components/ui/Pagination';
import type { AuthorFeedItem as AuthorFeedItemType } from '@/lib/sanity';

type Author = {
  name: string;
  roleRu?: string;
  roleEn?: string;
  bioRu?: string;
  bioEn?: string;
  photo?: string;
  email?: string;
  telegram?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
};

type Props = {
  locale: string;
  slug: string;
  author: Author;
  items: AuthorFeedItemType[];
  total: number;
  page: number;
  pageSize: number;
};

export default function AuthorPageBody({ locale, slug, author, items, total, page, pageSize }: Props) {
  const isRu = locale === 'ru';
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <Link
        href={`/${locale}/authors`}
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        {isRu ? 'Все авторы' : 'All authors'}
      </Link>

      {/* Author profile */}
      <div className="flex flex-col sm:flex-row gap-6 bg-card border border-border rounded-2xl p-6 sm:p-8 mb-10">
        {author.photo ? (
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-2 border-border self-center sm:self-start">
            <Image src={author.photo} alt={author.name} fill className="object-cover" sizes="128px" />
          </div>
        ) : (
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full shrink-0 bg-accent/10 border-2 border-border flex items-center justify-center self-center sm:self-start">
            <span className="text-4xl font-bold text-accent">{author.name.charAt(0)}</span>
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">
            {isRu ? 'Автор' : 'Author'}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{author.name}</h1>
          {(isRu ? author.roleRu : author.roleEn) && (
            <p className="text-sm text-accent mb-3">{isRu ? author.roleRu : author.roleEn}</p>
          )}
          {(isRu ? author.bioRu : author.bioEn) && (
            <p className="text-sm text-muted leading-relaxed mb-4">{isRu ? author.bioRu : author.bioEn}</p>
          )}

          {(author.email || author.telegram || author.linkedin || author.facebook || author.twitter) && (
            <div className="flex items-center gap-2 flex-wrap">
              {author.email && (
                <a href={`mailto:${author.email}`}
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-colors"
                  title={author.email}>
                  <Mail size={11} />
                </a>
              )}
              {author.telegram && (
                <a href={author.telegram} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-colors">
                  <ExternalLink size={11} /> Telegram
                </a>
              )}
              {author.linkedin && (
                <a href={author.linkedin} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-colors">
                  <ExternalLink size={11} /> LinkedIn
                </a>
              )}
              {author.facebook && (
                <a href={author.facebook} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-colors">
                  <ExternalLink size={11} /> Facebook
                </a>
              )}
              {author.twitter && (
                <a href={author.twitter} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent border border-border hover:border-accent/40 rounded-lg px-3 py-1.5 transition-colors">
                  <ExternalLink size={11} /> X / Twitter
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-6 text-xs text-muted mb-8">
        <span className="flex items-center gap-1.5">
          <span className="font-bold text-foreground text-base">{total}</span>
          {isRu ? 'материалов' : 'publications'}
        </span>
        {totalPages > 1 && (
          <span>
            {isRu ? 'Страница' : 'Page'} {page} {isRu ? 'из' : 'of'} {totalPages}
          </span>
        )}
      </div>

      {/* Unified chronological feed — articles and news mixed, visually tagged */}
      {items.length > 0 ? (
        <>
          <div className="flex flex-col">
            {items.map((item) => (
              <AuthorFeedItem key={item._id} item={item} locale={locale} />
            ))}
          </div>
          <Pagination
            basePath={`/${locale}/authors/${slug}`}
            currentPage={page}
            totalPages={totalPages}
            locale={locale}
          />
        </>
      ) : (
        <p className="text-muted text-sm">
          {isRu ? 'Материалы автора появятся скоро.' : 'Author publications coming soon.'}
        </p>
      )}
    </div>
  );
}
