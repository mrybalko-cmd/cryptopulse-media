import Link from 'next/link';
import Image from 'next/image';
import { Eye } from 'lucide-react';
import type { AuthorFeedItem } from '@/lib/sanity';
import { sanityImageTransform } from '@/lib/sanityImage';

/**
 * Одна строка в списке материалов автора.
 *
 * Строкой, а не плиткой с крупной обложкой: у самого плодовитого автора 1836
 * публикаций, и сеткой обложек такой архив не листается — три штуки в ряд,
 * и поиск глазами превращается в работу. Строка занимает 56 пикселей вместо
 * трёхсот, то есть на экран помещается десять материалов вместо трёх.
 *
 * Миниатюра всё-таки есть: обложки у издания сильные, и по ним материал
 * узнаётся быстрее, чем по заголовку.
 */
export default function AuthorMaterialRow({
  item,
  locale,
}: {
  item: AuthorFeedItem;
  locale: string;
}) {
  const isRu = locale === 'ru';
  const section = item._type === 'article' ? 'articles' : 'news';
  const kind = item._type === 'article'
    ? (isRu ? 'Статья' : 'Article')
    : (isRu ? 'Новость' : 'News');
  const date = item.publishedAt
    ? new Intl.DateTimeFormat(isRu ? 'ru-RU' : 'en-GB', {
        day: '2-digit', month: '2-digit', year: '2-digit',
      }).format(new Date(item.publishedAt))
    : '';
  const thumb = sanityImageTransform(item.coverImage, { width: 160, height: 96 });

  return (
    <Link
      href={`/${locale}/${section}/${item.slug.current}`}
      className="group grid grid-cols-[56px_1fr] sm:grid-cols-[64px_1fr_auto_auto_auto]
        gap-3 sm:gap-3.5 items-center px-3 sm:px-3.5 py-2.5
        border-t border-border first:border-t-0 hover:bg-card-hover transition-colors"
    >
      <span className="block w-14 sm:w-16 h-[34px] sm:h-[38px] rounded-[7px] overflow-hidden bg-card shrink-0">
        {thumb && (
          <Image src={thumb} alt="" width={64} height={38} unoptimized
            className="w-full h-full object-cover" />
        )}
      </span>

      <span className="text-[14px] font-semibold leading-[1.35] line-clamp-2 sm:line-clamp-1
        group-hover:text-accent transition-colors">
        {item.title}
      </span>

      {/* На узком экране остаются только миниатюра и заголовок: тип, дата и
          просмотры туда не помещаются, не ужав заголовок до нечитаемого. */}
      <span className="hidden sm:block text-[11px] font-bold uppercase tracking-[.05em]
        text-muted w-[66px] text-right">{kind}</span>
      <span className="hidden sm:block text-[12.5px] text-muted w-[72px] text-right tabular-nums">{date}</span>
      {/* Со значком: голая цифра в конце строки рядом с датой читается как
          что угодно — от номера до процента. */}
      <span className="hidden sm:flex items-center justify-end gap-1.5 text-[12.5px]
        text-muted w-[64px] tabular-nums">
        <Eye size={12} className="shrink-0 opacity-70" />
        {(item.views ?? 0).toLocaleString(isRu ? 'ru-RU' : 'en-GB')}
      </span>
    </Link>
  );
}
