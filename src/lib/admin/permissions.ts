// Подписи английские и слово в слово совпадают с боковым меню: сотрудник
// видит «Calendar events» в форме прав и «Calendar events» в меню, а не
// «Календарь событий» в одном месте и Calendar в другом.
//
// Право exchanges открывает два раздела меню — сами биржи и отзывы о них.
// Это одна зона ответственности, поэтому подпись говорит про оба.
export const PERMISSIONS = [
  { key: 'news', label: 'News' },
  { key: 'articles', label: 'Articles' },
  { key: 'banners', label: 'Banners' },
  { key: 'exchanges', label: 'Exchanges + reviews' },
  { key: 'comments', label: 'Comments' },
  { key: 'homepage', label: 'Homepage' },
  { key: 'authors', label: 'Authors' },
  { key: 'calendar', label: 'Calendar events' },
  { key: 'regulation', label: 'Regulation map' },
  { key: 'glossary', label: 'Glossary' },
  { key: 'pulse', label: 'Pulse' },
  { key: 'subscribers', label: 'Subscribers' },
] as const;

export type Permission = (typeof PERMISSIONS)[number]['key'];

export interface AdminSession {
  sub: string;
  email: string;
  name: string;
  isOwner: boolean;
  permissions: Permission[];
}

export function hasPermission(session: AdminSession | null, permission: Permission): boolean {
  if (!session) return false;
  return session.isOwner || session.permissions.includes(permission);
}
