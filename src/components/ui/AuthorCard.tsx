import Image from 'next/image';

interface Author {
  name: string;
  role?: string;
  bio?: string;
  photo?: string;
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
  const hasSocials = author.telegram || author.linkedin || author.facebook || author.twitter;

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
        <p className="font-bold text-foreground text-sm">{author.name}</p>
        {author.role && (
          <p className="text-xs text-accent mb-2">{author.role}</p>
        )}
        {author.bio && (
          <p className="text-xs text-muted leading-relaxed mt-1">{author.bio}</p>
        )}
        {hasSocials && (
          <div className="flex items-center gap-3 mt-3 flex-wrap">
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
