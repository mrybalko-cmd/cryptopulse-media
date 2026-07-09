'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SiteSearch from '@/components/ui/SiteSearch';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [linkedTranslationHref, setLinkedTranslationHref] = useState<string | null>(null);

  const otherLocale = locale === 'ru' ? 'en' : 'ru';
  const detailMatch = pathname.match(/^\/[a-z]{2}\/(articles|news)\/(.+)/);

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
    { href: `/${locale}/interviews`, label: t('interviews') },
    { href: `/${locale}/calculators`, label: t('calculators') },
    { href: `/${locale}/calendar`, label: t('calendar') },
    { href: `/${locale}/assets`, label: t('assets') },
    { href: `/${locale}/ai`, label: 'AI', ai: true },
  ];

  const isActive = (href: string) =>
    href.endsWith('/calculators') || href.endsWith('/assets') || href.endsWith('/ai')
      ? pathname.startsWith(href)
      : pathname === href;

  return (
    <header role="banner" className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      {/* ── Main bar: logo centered, controls right ────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 grid grid-cols-[1fr_auto_1fr] items-center gap-4">

        {/* Left — empty (keeps logo centered) */}
        <div />

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 sm:gap-2.5 group">
          <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-red-600 flex items-center justify-center shrink-0">
            <Zap size={13} className="text-yellow-400 sm:hidden" fill="currentColor" />
            <Zap size={17} className="text-yellow-400 hidden sm:block" fill="currentColor" />
          </div>
          <span className="font-bold text-sm sm:text-xl tracking-tight whitespace-nowrap">
            CryptoPulse<span className="text-accent">.media</span>
          </span>
        </Link>

        {/* Right controls */}
        <div className="flex items-center justify-end gap-1.5">
          {/* Search icon — desktop + mobile */}
          <SiteSearch locale={locale} iconOnly />

          {/* Theme toggle — desktop only */}
          <ThemeToggle className="hidden md:flex p-2 rounded-lg border border-border text-muted hover:text-foreground hover:bg-card transition-colors" />

          {/* Language switcher — always visible, including mobile (was reachable only via the burger menu before) */}
          <Link
            href={switchPath}
            className="flex px-2 sm:px-3 py-1.5 text-xs font-semibold border border-border rounded-lg text-muted hover:text-foreground hover:border-accent/40 transition-colors"
            hrefLang={otherLocale}
          >
            {t('switchLang')}
          </Link>

          {/* Burger — mobile only */}
          <button
            className="md:hidden p-2 rounded-lg border border-border text-foreground hover:border-accent transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Desktop nav row ───────────────────────────────── */}
      <nav
        aria-label={locale === 'ru' ? 'Главная навигация' : 'Main navigation'}
        className="hidden md:block border-t border-border bg-card"
      >
        <ul className="max-w-7xl mx-auto px-4 sm:px-6 flex items-stretch h-11 list-none gap-0">
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
                  <Zap size={11} className="text-blue-400 -ml-0.5 shrink-0" fill="currentColor" />
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
                      <Zap size={12} className="text-blue-400 -ml-0.5 shrink-0" fill="currentColor" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center justify-end px-8 py-4 border-t border-border">
            <ThemeToggle className="p-2 rounded-lg border border-border text-muted hover:text-foreground hover:bg-card transition-colors" />
          </div>
        </div>
      )}
    </header>
  );
}
