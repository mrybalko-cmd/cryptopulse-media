'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { Menu, X, Zap } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [linkedTranslationHref, setLinkedTranslationHref] = useState<string | null>(null);

  const otherLocale = locale === 'ru' ? 'en' : 'ru';
  // Articles/news exist as separate per-language documents with unrelated
  // slugs. If the current article/news has a linked translation, jump
  // straight to it; otherwise fall back to the section's listing page
  // instead of guessing a slug that doesn't exist.
  const detailMatch = pathname.match(/^\/[a-z]{2}\/(articles|news)\/(.+)/);

  // Driven solely by pathname (kept perfectly in sync by the router on every
  // navigation), instead of a page-to-layout context relay whose set/reset
  // effects could race during client-side navigation between two detail pages.
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
  ];

  const isActive = (href: string) =>
    href.endsWith('/calculators') || href.endsWith('/assets')
      ? pathname.startsWith(href)
      : pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 grid grid-cols-3 items-center">
        <div />

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center justify-center gap-2 sm:gap-3 group">
          <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-red-600 flex items-center justify-center shrink-0">
            <Zap size={15} className="text-yellow-400 sm:hidden" fill="currentColor" />
            <Zap size={20} className="text-yellow-400 hidden sm:block" fill="currentColor" />
          </div>
          <span className="font-bold text-base sm:text-2xl md:text-3xl tracking-tight whitespace-nowrap">
            CryptoPulse<span className="text-accent">.media</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center justify-end gap-2">
          <ThemeToggle className="hidden md:flex p-1.5 text-muted hover:text-foreground hover:bg-card rounded transition-colors" />
          <Link
            href={switchPath}
            className="hidden md:flex px-3 py-1.5 text-xs font-medium border border-border rounded text-muted hover:text-foreground hover:border-accent transition-colors"
          >
            {t('switchLang')}
          </Link>
          <button
            className="md:hidden p-2 rounded-lg bg-card border border-border text-foreground hover:border-accent transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Desktop nav row */}
      <nav className="hidden md:flex items-center justify-center gap-1 h-11 border-t border-border bg-card">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded text-sm transition-colors ${
              isActive(link.href)
                ? 'text-foreground font-semibold'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? 'text-foreground bg-card border border-border'
                  : 'text-muted hover:text-foreground hover:bg-card/50'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-border">
            <Link
              href={switchPath}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 text-sm text-muted border border-border rounded-lg hover:text-foreground transition-colors"
            >
              {t('switchLang')}
            </Link>
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  );
}
