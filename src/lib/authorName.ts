/**
 * Как зовут автора на конкретном языке.
 *
 * Поле `name` остаётся основным и работает всегда. Написание по языкам —
 * надстройка: заполнили русское, на русской версии показывается оно, не
 * заполнили — берётся `name`.
 *
 * Разбивка необязательна намеренно. В базе есть авторы без фамилии («Maks»,
 * под которым 1818 материалов, «Jonathan») и авторы, которые вообще не люди
 * («Intokened.com», «Sonic News»). Обязательные имя и фамилия сломали бы
 * четыре карточки из десяти.
 */
export interface AuthorNameFields {
  name: string;
  firstNameRu?: string | null;
  lastNameRu?: string | null;
  firstNameEn?: string | null;
  lastNameEn?: string | null;
}

export function authorName(author: AuthorNameFields | null | undefined, locale: string): string {
  if (!author) return '';
  const ru = locale === 'ru';
  const first = (ru ? author.firstNameRu : author.firstNameEn)?.trim();
  const last = (ru ? author.lastNameRu : author.lastNameEn)?.trim();
  if (first) return last ? `${first} ${last}` : first;
  // Фамилия без имени — половина карточки: показывать её одну хуже, чем
  // вернуться к основному полю.
  return author.name?.trim() || '';
}

/** Первая буква для кружка-заглушки, когда фото нет. */
export function authorInitial(author: AuthorNameFields | null | undefined, locale: string): string {
  return authorName(author, locale).charAt(0) || '?';
}
