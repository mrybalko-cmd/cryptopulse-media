import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { Zap, Mail } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/constants';

export default async function Footer() {
  const t = await getTranslations('footer');
  const locale = await getLocale();

  return (
    <footer className="border-t border-border mt-20" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* 4-column grid: Brand | Content | Tools | Legal */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">

          {/* Col 1 — Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href={`/${locale}`} className="inline-flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center shrink-0">
                <Zap size={12} className="text-yellow-400" fill="currentColor" />
              </div>
              <span className="font-semibold text-sm">
                CryptoPulse<span className="text-accent">.media</span>
              </span>
            </Link>
            <p className="text-muted text-xs leading-relaxed max-w-52">{t('tagline')}</p>
          </div>

          {/* Col 2 — Content */}
          <nav aria-label="Content navigation">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              {t('content')}
            </h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              <li>
                <Link href={`/${locale}/news`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('news')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/articles`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('articles')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/interviews`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('interviews')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Col 3 — Tools */}
          <nav aria-label="Tools navigation">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              {t('tools')}
            </h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              <li>
                <Link href={`/${locale}/calculators`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('calculators')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/assets`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('assets')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/glossary`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('glossary')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/calendar`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('calendar')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/faq`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('faq')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Col 4 — Legal */}
          <nav aria-label="Legal navigation">
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
              {t('legal')}
            </h4>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              <li>
                <Link href={`/${locale}/about`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('aboutUs')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/advertising`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('advertising')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/editorial-policy`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('editorialPolicy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/privacy`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('privacy')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/disclaimer`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('disclaimer')}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/security`} className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('security')}
                </Link>
              </li>
              <li>
                <address className="not-italic">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <Mail size={13} aria-hidden="true" />
                    {t('contact')}
                  </a>
                </address>
              </li>
            </ul>
          </nav>

        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-xs text-muted">{t('disclaimerText')}</p>
          <p className="text-xs text-muted shrink-0">
            © {new Date().getFullYear()} CryptoPulse.media · {t('rights')}
          </p>
        </div>

      </div>
    </footer>
  );
}
