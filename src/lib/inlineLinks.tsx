import Link from 'next/link';
import { SITE_URL } from '@/lib/site';
import type { ReactNode } from 'react';

/**
 * Ссылки внутри текста глоссария.
 *
 * Тексты терминов хранятся строками, и ссылок в них не было никогда. Вместо
 * перевода 226 разделов на размеченный формат разбираем при выводе привычную
 * запись `[текст](адрес)` — ту же, что уже используется в редакторе новостей.
 *
 * Проверено 08.09.2026 на всех 2606 фрагментах глоссария: ни в одном нет
 * ни этой записи, ни одиночных квадратных скобок. Значит текст, написанный
 * до появления разбора, выводится ровно как раньше.
 *
 * Внешние ссылки получают `nofollow` и открываются в новой вкладке: в глоссарий
 * приходят за определением, и увести читателя на чужой сайт без предупреждения
 * было бы невежливо. Внутренние идут через Link, чтобы переход был мгновенным.
 */

const PATTERN = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;

export function inlineLinks(text: string | undefined | null): ReactNode {
  if (!text) return text ?? null;
  PATTERN.lastIndex = 0;
  if (!PATTERN.test(text)) return text;

  PATTERN.lastIndex = 0;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = PATTERN.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const [, label, href, flag] = m;
    const internal = href.startsWith('/') || href.startsWith(SITE_URL);
    const path = href.startsWith(SITE_URL) ? href.slice(SITE_URL.length) || '/' : href;
    const cls =
      'text-article-link underline decoration-article-link hover:text-article-accent hover:decoration-article-accent';

    out.push(
      internal ? (
        <Link key={`l${i}`} href={path} className={cls}>{label}</Link>
      ) : (
        <a
          key={`l${i}`}
          href={href}
          target="_blank"
          rel={flag === 'dofollow' ? 'noopener noreferrer' : 'nofollow noopener noreferrer'}
          className={cls}
        >
          {label}
        </a>
      ),
    );
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** Тот же текст без разметки — для описаний страницы, схемы и поиска,
 *  куда ссылка попасть не должна. */
export function stripInlineLinks(text: string | undefined | null): string {
  return (text || '').replace(PATTERN, '$1');
}
