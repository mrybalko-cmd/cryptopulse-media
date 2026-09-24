import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Globe, Mail } from 'lucide-react';
import { TelegramIcon, LinkedInIcon, InstagramIcon, FacebookIcon, XIcon } from '@/components/ui/socialIcons';
import type { AuthorFeedItem as AuthorFeedItemType, AuthorStats } from '@/lib/sanity';
import { authorName, authorInitial } from '@/lib/authorName';
import AuthorMaterials from './AuthorMaterials';

type Author = {
  name: string;
  firstNameRu?: string; lastNameRu?: string;
  firstNameEn?: string; lastNameEn?: string;
  roleRu?: string; roleEn?: string;
  bioRu?: string; bioEn?: string;
  photo?: string;
  entityKind?: 'person' | 'organization';
  sponsored?: boolean;
  haloColor?: 'violet' | 'cyan' | 'pink';
  email?: string;
  telegram?: string;
  linkedin?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
};

type Props = {
  locale: string;
  slug: string;
  author: Author;
  items: AuthorFeedItemType[];
  stats: AuthorStats;
  page: number;
  pageSize: number;
};

const HALO: Record<string, string> = {
  violet: 'var(--halo-violet)',
  cyan: 'var(--halo-cyan)',
  pink: 'var(--halo-pink)',
};

/** Голый адрес без протокола и завершающей косой: кнопке нужно имя, не URL. */
function hostOf(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
}

export default function AuthorPageBody({ locale, slug, author, items, stats, page, pageSize }: Props) {
  const isRu = locale === 'ru';
  const display = authorName(author, locale);
  const role = (isRu ? author.roleRu : author.roleEn) || (isRu ? author.roleEn : author.roleRu);
  const bio = (isRu ? author.bioRu : author.bioEn) || (isRu ? author.bioEn : author.bioRu);
  const isOrg = author.entityKind === 'organization';

  // Ссылка на сайт участника подписана его доменом, а не словом «сайт»:
  // партнёр платит за то, чтобы его адрес было видно.
  const links = [
    author.telegram && { href: author.telegram, label: 'Telegram', Icon: TelegramIcon },
    author.linkedin && { href: author.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    author.instagram && { href: author.instagram, label: 'Instagram', Icon: InstagramIcon },
    author.facebook && { href: author.facebook, label: 'Facebook', Icon: FacebookIcon },
    author.twitter && { href: author.twitter, label: 'X', Icon: XIcon },
    author.website && { href: author.website, label: hostOf(author.website), Icon: Globe },
  ].filter(Boolean) as { href: string; label: string; Icon: (p: { size?: number }) => React.ReactElement }[];

  // У даты два написания: на телефоне в колонке шириной в треть экрана
  // «July 2026» переносится на две строки и ломает ряд, цифрами — нет.
  const facts: { value: string; short?: string; label: string }[] = [
    { value: String(stats.total), label: isRu ? plural(stats.total, 'материал', 'материала', 'материалов') : stats.total === 1 ? 'story' : 'stories' },
    ...(stats.articles ? [{ value: String(stats.articles), label: isRu ? plural(stats.articles, 'статья', 'статьи', 'статей') : stats.articles === 1 ? 'article' : 'articles' }] : []),
    ...(stats.news ? [{ value: String(stats.news), label: isRu ? plural(stats.news, 'новость', 'новости', 'новостей') : stats.news === 1 ? 'news story' : 'news stories' }] : []),
    ...(stats.views ? [{ value: stats.views.toLocaleString(isRu ? 'ru-RU' : 'en-GB'), label: isRu ? 'просмотров' : 'views' }] : []),
    ...(stats.firstAt ? [{
      value: new Intl.DateTimeFormat(isRu ? 'ru-RU' : 'en-GB', { month: 'long', year: 'numeric' }).format(new Date(stats.firstAt)),
      short: new Intl.DateTimeFormat('en-GB', { month: '2-digit', year: 'numeric' })
        .format(new Date(stats.firstAt)).replace('/', '.'),
      label: isRu ? 'первый материал' : 'first story',
    }] : []),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 overflow-x-clip">
      <Link href={`/${locale}/authors`}
        className="inline-flex items-center gap-[7px] text-[13.5px] font-semibold text-muted
          hover:text-accent transition-colors mb-[22px]">
        <ArrowLeft size={14} />
        {isRu ? 'Все авторы и партнёры' : 'All authors and partners'}
      </Link>

      <div className="relative mb-11">
        {/* Ореолы держим внутри блока: вылезая наружу, они уводили страницу
            вбок на телефоне. Без них прозрачная панель неотличима от матовой. */}
        <span aria-hidden className="pointer-events-none absolute left-0 -top-8 w-[300px] h-[300px]
          rounded-full blur-[80px] opacity-90 z-0"
          style={{ background: HALO[author.haloColor || 'violet'] || HALO.violet }} />
        <span aria-hidden className="pointer-events-none absolute right-0 top-10 w-[230px] h-[230px]
          rounded-full blur-[70px] opacity-55 z-0" style={{ background: HALO.cyan }} />

        <div className="author-glass relative z-[1] rounded-[26px] p-6 sm:p-[30px] sm:pb-[26px] overflow-hidden">
          {/* На телефоне фото стоит рядом с именем, а не над ним: колонкой
              шапка занимала весь первый экран, и до материалов надо было
              долистать. Описание, ссылки и цифры идут под ними во всю ширину. */}
          <div className="grid grid-cols-[76px_1fr] sm:grid-cols-[132px_1fr]
            gap-x-4 sm:gap-x-[26px] gap-y-3.5 sm:gap-y-0 items-start">
            {author.photo ? (
              <Image
                src={author.photo}
                alt={isRu ? `${display} — фото` : `${display} — photo`}
                width={132} height={132}
                className={`w-[76px] h-[76px] sm:w-[132px] sm:h-[132px] object-cover border-[3px]
                  ${isOrg ? 'rounded-[26px]' : 'rounded-full'}`}
                style={{ borderColor: 'var(--glass-edge)' }}
              />
            ) : (
              <span className={`w-[76px] h-[76px] sm:w-[132px] sm:h-[132px] flex items-center justify-center
                text-[26px] sm:text-[42px] font-extrabold border-[3px]
                ${isOrg ? 'rounded-[26px]' : 'rounded-full'}`}
                style={{ background: 'var(--glass-clear-2)', borderColor: 'var(--glass-edge)' }}>
                {authorInitial(author, locale)}
              </span>
            )}

            <div className="min-w-0 self-center sm:self-start">
              <h1 className="text-[23px] sm:text-[34px] font-extrabold tracking-[-.025em] leading-[1.1] m-0">
                {display}
                {page > 1 && (
                  <span className="text-muted font-normal text-[18px] ml-2">
                    — {isRu ? 'страница' : 'page'} {page}
                  </span>
                )}
              </h1>
              {role && <p className="text-[13.5px] sm:text-[14.5px] text-accent font-semibold mt-[5px] mb-0">{role}</p>}
            </div>

            <div className="col-span-2 sm:col-span-1 sm:col-start-2 min-w-0">
              {bio && (
                <p className="text-[15px] sm:text-[15.5px] text-muted leading-[1.62] max-w-[64ch] mt-3.5 mb-0">
                  {bio}
                </p>
              )}

              {links.length > 0 || author.email ? (
                <div className="flex flex-wrap gap-[9px] mt-[22px]">
                  {links.map(({ href, label, Icon }) => (
                    <a key={label} href={href} target="_blank"
                      rel={author.sponsored ? 'sponsored noopener noreferrer' : 'noopener noreferrer'}
                      className="glass-control inline-flex items-center gap-2 text-[13.5px] font-semibold
                        rounded-[11px] px-3.5 py-2.5 transition-colors">
                      <span className="text-muted flex"><Icon size={15} /></span>
                      {label}
                    </a>
                  ))}
                  {author.email && (
                    <a href={`mailto:${author.email}`}
                      className="glass-control inline-flex items-center gap-2 text-[13.5px] font-semibold
                        rounded-[11px] px-3.5 py-2.5 transition-colors">
                      <span className="text-muted flex"><Mail size={15} /></span>
                      {author.email}
                    </a>
                  )}
                </div>
              ) : null}

              {facts.length > 0 && (
                <div className="grid grid-cols-3 sm:flex sm:flex-wrap gap-x-4 sm:gap-x-[30px]
                  gap-y-3.5 border-t glass-divider mt-6 pt-[18px]">
                  {facts.map(f => (
                    <div key={f.label}>
                      <b className="block text-[19px] sm:text-[21px] font-extrabold tracking-[-.02em] tabular-nums">
                        {f.short ? (
                          <>
                            <span className="sm:hidden">{f.short}</span>
                            <span className="hidden sm:inline">{f.value}</span>
                          </>
                        ) : f.value}
                      </b>
                      <span className="text-[12px] text-muted">{f.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {stats.total > 0 ? (
        <AuthorMaterials
          slug={slug}
          locale={locale}
          seed={items}
          total={stats.total}
          page={page}
          pageSize={pageSize}
          articles={stats.articles}
          news={stats.news}
        />
      ) : (
        <p className="text-[14px] text-muted">
          {isRu ? 'Материалы участника появятся здесь.' : 'Materials will appear here.'}
        </p>
      )}
    </div>
  );
}

function plural(n: number, one: string, few: string, many: string) {
  const d = Math.abs(n) % 100;
  if (d >= 11 && d <= 14) return many;
  const u = d % 10;
  return u === 1 ? one : u >= 2 && u <= 4 ? few : many;
}
