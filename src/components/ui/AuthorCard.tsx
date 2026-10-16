import Image from 'next/image';
import Link from 'next/link';
import { Globe, Mail } from 'lucide-react';
import { authorName, type AuthorNameFields } from '@/lib/authorName';
import { TelegramIcon, LinkedInIcon, InstagramIcon, FacebookIcon, XIcon } from '@/components/ui/socialIcons';

interface Author extends AuthorNameFields {
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
  instagram?: string;
  website?: string;
}

interface Props {
  author: Author;
  locale: string;
}

export default function AuthorCard({ author, locale }: Props) {
  const isRu = locale === 'ru';
  const display = authorName(author, locale);
  const authorHref = author.slug ? `/${locale}/authors/${author.slug}` : undefined;

  /** Контакты одним списком: каждый — значок, подпись только для доступности. */
  const contacts = [
    author.email && {
      href: `mailto:${author.email}`,
      label: isRu ? `Написать ${display}` : `Email ${display}`,
      Icon: Mail,
      external: false,
    },
    author.telegram && { href: author.telegram, label: 'Telegram', Icon: TelegramIcon, external: true },
    author.linkedin && { href: author.linkedin, label: 'LinkedIn', Icon: LinkedInIcon, external: true },
    author.facebook && { href: author.facebook, label: 'Facebook', Icon: FacebookIcon, external: true },
    author.twitter && { href: author.twitter, label: 'X', Icon: XIcon, external: true },
    author.instagram && { href: author.instagram, label: 'Instagram', Icon: InstagramIcon, external: true },
    author.website && {
      href: author.website,
      label: isRu ? 'Сайт' : 'Website',
      Icon: Globe,
      external: true,
    },
  ].filter(Boolean) as {
    href: string;
    label: string;
    Icon: (p: { size?: number }) => React.ReactElement;
    external: boolean;
  }[];
  const hasSocials = contacts.length > 0;

  return (
    <div className="flex gap-4 rounded-xl bg-card border border-border p-5 my-8">
      {author.photo ? (
        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-border">
          <Image
            src={author.photo}
            alt={display}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full shrink-0 bg-article-accent-tint border-2 border-border flex items-center justify-center">
          <span className="text-2xl font-bold text-article-accent">
            {display.charAt(0)}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-0.5">
          {isRu ? 'Автор' : 'Author'}
        </p>
        {authorHref ? (
          <Link href={authorHref} className="font-bold text-foreground text-sm hover:text-article-accent transition-colors">
            {display}
          </Link>
        ) : (
          <p className="font-bold text-foreground text-sm">{display}</p>
        )}
        {(isRu ? author.roleRu : author.roleEn) && (
          <p className="text-xs text-article-accent mb-2">{isRu ? author.roleRu : author.roleEn}</p>
        )}
        {(isRu ? author.bioRu : author.bioEn) && (
          <p className="text-xs text-muted leading-relaxed mt-1">{isRu ? author.bioRu : author.bioEn}</p>
        )}
        {hasSocials && (
          /* Только значки. Подписи разной длины превращали ряд в список, а
             адрес почты в подсказке читался так же открыто, как в строке:
             рассыльщику спама хватает и подсказки. Куда ведёт кнопка,
             говорит подпись для чтения с экрана. */
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {contacts.map(({ href, label, Icon, external }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                title={label}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="grid size-7 place-items-center rounded-md border border-border text-muted
                  transition-colors hover:border-article-accent hover:text-article-accent"
              >
                <Icon size={12} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
