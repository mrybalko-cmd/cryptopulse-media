import '../globals.css';

export const metadata = {
  title: 'CryptoPulse Admin',
  robots: { index: false, follow: false },
};

// Same mechanism and the same colors as the public site's own theme system
// (src/components/layout/ThemeToggle.tsx + the html.light rules in
// globals.css): a plain `html.light` class, toggled client-side. Persisted
// under its OWN `admin-theme` localStorage key (deliberately separate from
// the public site's `theme` key) — the admin is a shared panel used by
// multiple staff members, each free to pick their own theme, and that
// choice must never leak to or from the public site sharing the same
// origin. --admin-* is still its own token set (the admin layout has more
// surface tiers than the site does — a raised "input" background, a
// dimmer fourth text tier for uppercase labels) but every value below is
// taken directly from the site's --background/--foreground/--muted/
// --border/--card/--card-hover/--accent so switching either theme looks
// and behaves identically.
const THEME_STYLE = `
  html {
    color-scheme: dark;
    --admin-bg: #1d1d1f;
    --admin-bg-alt: #202023;
    --admin-panel: #28282b;
    --admin-input: #313135;
    --admin-border: #313135;
    --admin-text: #ffffff;
    --admin-text-secondary: #d4d5da;
    --admin-text-muted: #bdc0c7;
    --admin-text-dim: #8b8d94;
    --admin-focus: #06b6d4;
  }
  html.light {
    color-scheme: light;
    --admin-bg: #ffffff;
    --admin-bg-alt: #f5f5f6;
    --admin-panel: #ffffff;
    --admin-input: #f5f5f6;
    --admin-border: #dadce1;
    --admin-text: #1d1d1f;
    --admin-text-secondary: #4a4b50;
    --admin-text-muted: #68696d;
    --admin-text-dim: #9a9ba0;
    --admin-focus: #0891b2;
  }

  /* Every form control gets a deliberate focus ring in the theme's own accent
     color instead of the browser's default (often light/white) ring, which is
     what read as "white outlines around everything" after switching themes. */
  html input,
  html select,
  html textarea,
  html button {
    outline: none;
  }
  html input:focus-visible,
  html select:focus-visible,
  html textarea:focus-visible,
  html button:focus-visible {
    outline: 2px solid var(--admin-focus);
    outline-offset: 1px;
  }
  html input[type="checkbox"],
  html input[type="radio"] {
    accent-color: var(--admin-focus);
  }
`;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <style dangerouslySetInnerHTML={{ __html: THEME_STYLE }} />
        <script
          // Pre-hydration, same mechanism as [locale]/layout.tsx's own snippet
          // but reading the admin's own `admin-theme` key so the page never
          // flashes the wrong theme.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('admin-theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
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
