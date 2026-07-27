import { cookies } from 'next/headers';
import '../globals.css';

export const metadata = {
  title: 'CryptoPulse Admin',
  robots: { index: false, follow: false },
};

// Admin uses its own bespoke palette (via CSS custom properties, switched by
// [data-theme]) independent of the public site's --background/--foreground
// tokens in globals.css — keeps the two theme systems from fighting.
const THEME_STYLE = `
  html[data-theme="dark"] {
    color-scheme: dark;
    --admin-bg: #0f1115;
    --admin-bg-alt: #131725;
    --admin-panel: #161922;
    --admin-input: #1c202b;
    --admin-border: #262b38;
    --admin-text: #eef0f4;
    --admin-text-secondary: #c3c9d6;
    --admin-text-muted: #8b93a7;
    --admin-text-dim: #525a6b;
    --admin-focus: #22d3ee;
  }
  html[data-theme="light"] {
    color-scheme: light;
    --admin-bg: #f3f4f6;
    --admin-bg-alt: #e9ebef;
    --admin-panel: #ffffff;
    --admin-input: #f8f9fb;
    --admin-border: #dfe2e8;
    --admin-text: #14161a;
    --admin-text-secondary: #3f4552;
    --admin-text-muted: #6b7280;
    --admin-text-dim: #9aa1ad;
    --admin-focus: #0891b2;
  }

  /* Every form control gets a deliberate focus ring in the theme's own accent
     color instead of the browser's default (often light/white) ring, which is
     what read as "white outlines around everything" after switching themes. */
  html[data-theme] input,
  html[data-theme] select,
  html[data-theme] textarea,
  html[data-theme] button {
    outline: none;
  }
  html[data-theme] input:focus-visible,
  html[data-theme] select:focus-visible,
  html[data-theme] textarea:focus-visible,
  html[data-theme] button:focus-visible {
    outline: 2px solid var(--admin-focus);
    outline-offset: 1px;
  }
  html[data-theme] input[type="checkbox"],
  html[data-theme] input[type="radio"] {
    accent-color: var(--admin-focus);
  }
`;

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get('admin_theme')?.value === 'light' ? 'light' : 'dark';

  return (
    <html lang="ru" data-theme={theme}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: THEME_STYLE }} />
      </head>
      <body
        className="bg-[var(--admin-bg)] text-[var(--admin-text)]"
        style={{ fontFamily: '-apple-system,"Segoe UI",Roboto,sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
