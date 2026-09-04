import { SITE_BRAND } from '@/lib/site';
/** Общий ящик редакции: приватность, дисклеймер, безопасность, редполитика,
 *  поля managingEditor и webMaster в RSS. Реклама живёт отдельно, ниже. */
export const CONTACT_EMAIL = 'info@intokened.com';
/** Отдельный ящик для рекламодателей, заведён в Workspace на своём домене.
 *  CONTACT_EMAIL выше остаётся редакционным и остальных страниц не меняет. */
export const ADVERTISING_EMAIL = 'advertising@intokened.com';
export const SITE_NAME = `${SITE_BRAND} Media`;
export const X_PROFILE_URL = 'https://x.com/cryptopuls_news';
/** Company page — where the editorial posts go. Linked from the footer;
 *  the X account above is still live and still posted to. */
export const LINKEDIN_PROFILE_URL = 'https://www.linkedin.com/company/cryptopulse-media';
