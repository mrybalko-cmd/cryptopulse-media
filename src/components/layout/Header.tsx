'use client';

import { useState } from 'react';
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

  const otherLocale = locale === 'ru' ? 'en' : 'ru';
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const navLinks = [
    { href: `/${locale}/news`, label: t('news') },
    { href: `/${locale}/articles`, label: t('articles') },
    { href: `/${locale}/interviews`, label: t('interviews') },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded bg-accent flex items-center justify-center">
            <Zap size={14} className="text-background" fill="currentColor" />
          </div>
          <span className="font-semibold text-sm tracking-tight">
            CryptoPulse<span className="text-accent">.media</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded text-sm transition-colors ${
                isActive(link.href)
                  ? 'text-foreground bg-card'
                  : 'text-muted hover:text-foreground hover:bg-card'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:flex p-1.5 text-muted hover:text-foreground hover:bg-card rounded transition-colors" />
          <Link
            href={switchPath}
            className="hidden md:flex px-3 py-1.5 text-xs font-medium border border-border rounded text-muted hover:text-foreground hover:border-accent transition-colors"
          >
            {t('switchLang')}
          </Link>
          <button
            className="md:hidden p-1.5 text-muted hover:text-foreground"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded text-sm ${
                isActive(link.href) ? 'text-foreground bg-card' : 'text-muted'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={switchPath}
            onClick={() => setMenuOpen(false)}
            className="mt-1 px-3 py-2 text-sm text-muted border-t border-border"
          >
            {t('switchLang')}
          </Link>
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-muted">
            <ThemeToggle />
            <span>{locale === 'ru' ? 'Тема оформления' : 'Theme'}</span>
          </div>
        </div>
      )}
    </header>
  );
}
