import Image from 'next/image';
import Link from 'next/link';
import { Mail } from 'lucide-react';

interface Author {
  name: string;
  slug?: string;
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
}

interface Props {
  author: Author;
  locale: string;
}

export default function AuthorCard({ author, locale }: Props) {
  const isRu = locale === 'ru';
  const hasSocials = author.email || author.telegram || author.linkedin || author.facebook || author.twitter;
  const authorHref = author.slug ? `/${locale}/authors/${author.slug}` : undefined;

  return (
    <div className="flex gap-4 rounded-xl bg-card border border-border p-5 my-8">
      {author.photo ? (
        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-border">
          <Image
            src={author.photo}
            alt={author.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full shrink-0 bg-accent/10 border-2 border-border flex items-center justify-center">
          <span className="text-2xl font-bold text-accent">
            {author.name.charAt(0)}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-0.5">
          {isRu ? 'Автор' : 'Author'}
        </p>
        {authorHref ? (
          <Link href={authorHref} className="font-bold text-foreground text-sm hover:text-accent transition-colors">
            {author.name}
          </Link>
        ) : (
          <p className="font-bold text-foreground text-sm">{author.name}</p>
        )}
        {(isRu ? author.roleRu : author.roleEn) && (
          <p className="text-xs text-accent mb-2">{isRu ? author.roleRu : author.roleEn}</p>
        )}
        {(isRu ? author.bioRu : author.bioEn) && (
          <p className="text-xs text-muted leading-relaxed mt-1">{isRu ? author.bioRu : author.bioEn}</p>
        )}
        {hasSocials && (
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {author.email && (
              <a href={`mailto:${author.email}`}
                className="inline-flex items-center gap-1 text-xs text-muted hover:text-accent transition-colors border border-border rounded px-2 py-0.5"
                title={author.email}>
                <Mail size={11} />
                {author.email}
              </a>
            )}
            {author.telegram && (
              <a href={author.telegram} target="_blank" rel="noopener noreferrer"
                className="text-xs text-muted hover:text-accent transition-colors border border-border rounded px-2 py-0.5">
                Telegram
              </a>
            )}
            {author.linkedin && (
              <a href={author.linkedin} target="_blank" rel="noopener noreferrer"
                className="text-xs text-muted hover:text-accent transition-colors border border-border rounded px-2 py-0.5">
                LinkedIn
              </a>
            )}
            {author.facebook && (
              <a href={author.facebook} target="_blank" rel="noopener noreferrer"
                className="text-xs text-muted hover:text-accent transition-colors border border-border rounded px-2 py-0.5">
                Facebook
              </a>
            )}
            {author.twitter && (
              <a href={author.twitter} target="_blank" rel="noopener noreferrer"
                className="text-xs text-muted hover:text-accent transition-colors border border-border rounded px-2 py-0.5">
                X / Twitter
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
