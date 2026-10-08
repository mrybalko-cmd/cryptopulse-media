import { SITE_BRAND } from '@/lib/site';
/** Общий ящик редакции: приватность, дисклеймер, безопасность, редполитика,
 *  поля managingEditor и webMaster в RSS. Реклама живёт отдельно, ниже. */
export const CONTACT_EMAIL = 'info@intokened.com';
/** Отдельный ящик для рекламодателей, заведён в Workspace на своём домене.
 *  CONTACT_EMAIL выше остаётся редакционным и остальных страниц не меняет. */
export const ADVERTISING_EMAIL = 'advertising@intokened.com';
export const SITE_NAME = `${SITE_BRAND} Media`;
/**
 * Страница компании в LinkedIn — единственная соцсеть издания.
 *
 * Адрес держится здесь один раз и отсюда же уходит в `sameAs` разметки
 * организации. До 08.10.2026 он существовал в двух местах, и футер остался
 * на снятом бренде: ссылка вела на cryptopulse-media, которая после
 * переименования отдаёт 301, а разметка уже называла intokened. Второго
 * экземпляра больше нет.
 */
export const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/company/intokened';
