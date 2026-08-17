'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SiteSearch from '@/components/ui/SiteSearch';
import { SITE_BRAND, SITE_ZONE } from '@/lib/site';
import BoltIcon from '@/components/ui/BoltIcon';
import BrandMarkSvg from '@/components/ui/BrandMarkSvg';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [linkedTranslationHref, setLinkedTranslationHref] = useState<string | null>(null);

  const otherLocale = locale === 'ru' ? 'en' : 'ru';
  const detailMatch = pathname.match(/^\/[a-z]{2}\/(articles|news|exchanges)\/(.+)/);

  useEffect(() => {
    if (!detailMatch) {
      setLinkedTranslationHref(null);
      return;
    }
    const [, type, slug] = detailMatch;
    let cancelled = false;
    fetch(`/api/translation-link?type=${type}&slug=${encodeURIComponent(slug)}&locale=${locale}`)
      .then(res => res.json())
      .then(data => { if (!cancelled) setLinkedTranslationHref(data.href || null); })
      .catch(() => { if (!cancelled) setLinkedTranslationHref(null); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const switchPath = linkedTranslationHref
    ? linkedTranslationHref
    : detailMatch
    ? `/${otherLocale}/${detailMatch[1]}`
    : pathname.replace(`/${locale}`, `/${otherLocale}`);

  const navLinks = [
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/articles`, label: t('articles') },
    { href: `/${locale}/calculators`, label: t('calculators') },
    { href: `/${locale}/calendar`, label: t('calendar') },
    { href: `/${locale}/assets`, label: t('assets') },
    { href: `/${locale}/ai`, label: 'AI', ai: true },
    { href: `/${locale}/rates`, label: t('rates') },
    { href: `/${locale}/exchanges`, label: t('exchanges') },
  ];

  const isActive = (href: string) =>
    href.endsWith('/calculators') || href.endsWith('/assets') || href.endsWith('/ai') || href.endsWith('/rates') || href.endsWith('/exchanges')
      ? pathname.startsWith(href)
      : pathname === href;

  return (
    <header role="banner" className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      {/* ── Main bar: logo centered, controls right ────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 grid grid-cols-[1fr_auto_1fr] items-center gap-4">

        {/* Left — burger + theme toggle on mobile (theme sits right next to the
            menu button so it's reachable without opening the drawer); empty
            spacer on desktop where the theme toggle lives on the right. */}
        <div className="flex items-center gap-1.5">
          <button
            className="tap-target md:hidden p-2 rounded-lg border border-border text-foreground hover:border-accent transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <ThemeToggle className="tap-target md:hidden p-2 rounded-lg border border-border text-muted hover:text-foreground hover:bg-card transition-colors" />
        </div>

        {/* Logo */}
        <Link
          href={`/${locale}`}
          onClick={(e) => {
            setMenuOpen(false);
            // Already on the homepage: a Link to the current route is a no-op
            // for Next, so scroll back to the top ourselves (mobile + desktop).
            if (pathname === `/${locale}`) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-1 group"
        >
          {/* Height only: the mark is 45:47, and a square box would stretch it.
              Smaller than the 48px it used to be because the frame no longer
              carries 6px of empty margin on each side — the drawing itself is
              the same size on screen, it just stopped being padded. */}
          <BrandMarkSvg className="h-6 sm:h-8 w-auto shrink-0" />
          <span className="font-bold text-sm sm:text-xl tracking-tight whitespace-nowrap">
            {SITE_BRAND}<span className="text-muted">{SITE_ZONE}</span>
          </span>
        </Link>

        {/* Right controls — burger moved to the left, so language switcher + search now have room to breathe */}
        <div className="flex items-center justify-end gap-1.5">
          {/* Theme toggle — desktop only */}
          <ThemeToggle className="tap-target hidden md:flex p-2 rounded-lg border border-border text-muted hover:text-foreground hover:bg-card transition-colors" />

          {/* Language switcher — always visible, including mobile (was reachable only via the burger menu before) */}
          <Link
            href={switchPath}
            className="tap-target flex items-center px-2 sm:px-3 py-1.5 text-xs font-semibold border border-border rounded-lg text-muted hover:text-foreground hover:border-accent/40 transition-colors"
            hrefLang={otherLocale}
          >
            {t('switchLang')}
          </Link>

          {/* Search icon — desktop + mobile */}
          <SiteSearch locale={locale} iconOnly />
        </div>
      </div>

      {/* ── Desktop nav row ───────────────────────────────── */}
      <nav
        aria-label={locale === 'ru' ? 'Главная навигация' : 'Main navigation'}
        className="hidden md:block border-t border-border bg-card"
      >
        <ul className="max-w-7xl mx-auto px-4 sm:px-6 flex items-stretch justify-center h-11 list-none gap-0">
          {navLinks.map(link => (
            <li key={link.href} className="flex items-stretch">
              <Link
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={`flex items-center gap-1 px-4 text-sm border-b-2 transition-colors whitespace-nowrap ${
                  isActive(link.href)
                    ? 'text-foreground font-semibold border-accent'
                    : 'text-muted hover:text-foreground border-transparent hover:border-border'
                } ${'ai' in link && link.ai ? 'hover:text-yellow-400' : ''}`}
              >
                {link.label}
                {'ai' in link && link.ai && (
                  <BoltIcon size={11} className="text-blue-400 -ml-0.5 shrink-0" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Mobile drawer ─────────────────────────────────── */}
      {menuOpen && (
        <div id="mobile-nav" className="md:hidden border-t border-border bg-background">
          <nav aria-label={locale === 'ru' ? 'Мобильная навигация' : 'Mobile navigation'}>
            <ul className="list-none px-4 py-3 flex flex-col gap-0.5">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={`flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? 'text-foreground bg-card border border-border'
                        : 'text-muted hover:text-foreground hover:bg-card/50'
                    } ${'ai' in link && link.ai ? 'hover:text-yellow-400' : ''}`}
                  >
                    {link.label}
                    {'ai' in link && link.ai && (
                      <BoltIcon size={12} className="text-blue-400 -ml-0.5 shrink-0" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
