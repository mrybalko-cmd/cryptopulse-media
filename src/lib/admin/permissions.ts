export const PERMISSIONS = [
  { key: 'news', label: 'Новости' },
  { key: 'articles', label: 'Статьи' },
  { key: 'banners', label: 'Баннеры' },
  { key: 'exchanges', label: 'Криптобиржи' },
  { key: 'comments', label: 'Комментарии' },
  { key: 'homepage', label: 'Главная страница' },
  { key: 'authors', label: 'Авторы' },
  { key: 'calendar', label: 'Календарь событий' },
  { key: 'pulse', label: 'Pulse' },
  { key: 'subscribers', label: 'Подписчики' },
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
