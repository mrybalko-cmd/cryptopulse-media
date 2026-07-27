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
    --admin-bg: var(--admin-bg);
    --admin-bg-alt: var(--admin-bg-alt);
    --admin-panel: var(--admin-panel);
    --admin-input: var(--admin-input);
    --admin-border: var(--admin-border);
    --admin-text: var(--admin-text);
    --admin-text-secondary: var(--admin-text-secondary);
    --admin-text-muted: var(--admin-text-muted);
    --admin-text-dim: var(--admin-text-dim);
  }
  html[data-theme="light"] {
    --admin-bg: #f3f4f6;
    --admin-bg-alt: #e9ebef;
    --admin-panel: #ffffff;
    --admin-input: #f1f2f5;
    --admin-border: #dfe2e8;
    --admin-text: #14161a;
    --admin-text-secondary: #3f4552;
    --admin-text-muted: #6b7280;
    --admin-text-dim: #9aa1ad;
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
