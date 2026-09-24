/**
 * Значки соцсетей.
 *
 * Рисуем сами: lucide в нашей версии брендовые иконки больше не поставляет,
 * а тянуть ради пяти картинок отдельный пакет незачем. Лежат отдельным файлом,
 * потому что нужны и витрине авторов, и странице участника.
 */
type P = { size?: number };

export const TelegramIcon = ({ size = 15 }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden>
    <path d="M21.9 4.3 18.6 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6.1 13.1 1.2 11.6c-1.1-.3-1.1-1 .2-1.5l19.1-7.4c.9-.3 1.7.2 1.4 1.6z" />
  </svg>
);

export const LinkedInIcon = ({ size = 15 }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden>
    <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.82-2.05 3.75-2.05C20.4 8.65 21 11 21 14.1V21h-4v-6.1c0-1.45-.03-3.3-2-3.3s-2.3 1.57-2.3 3.2V21H9z" />
  </svg>
);

export const InstagramIcon = ({ size = 15 }: P) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={size} height={size} aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const FacebookIcon = ({ size = 15 }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden>
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6c-.3-.04-1.3-.13-2.45-.13-2.43 0-4.1 1.48-4.1 4.2v2.23H7.45V13h2.7v8z" />
  </svg>
);

export const XIcon = ({ size = 15 }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size} aria-hidden>
    <path d="M17.5 3h3.2l-7 8 8.2 10h-6.4l-5-6.2-5.8 6.2H1.5l7.5-8.5L1.2 3h6.6l4.5 5.7zm-1.1 16.1h1.8L7.7 4.8H5.8z" />
  </svg>
);
