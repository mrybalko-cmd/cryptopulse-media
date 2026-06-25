import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { Zap, Mail } from 'lucide-react';
import { CONTACT_EMAIL } from '@/lib/constants';

export default async function Footer() {
  const t = await getTranslations('footer');
  const locale = await getLocale();

  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-accent flex items-center justify-center">
                <Zap size={12} className="text-background" fill="currentColor" />
              </div>
              <span className="font-semibold text-sm">
                CryptoPulse<span className="text-accent">.media</span>
              </span>
            </Link>
            <p className="text-muted text-xs leading-relaxed max-w-48">{t('tagline')}</p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">{t('links')}</h4>
            <div className="flex flex-col gap-2">
              <Link href={`/${locale}/news`} className="text-sm text-muted hover:text-foreground transition-colors">
                {locale === 'ru' ? 'Новости' : 'News'}
              </Link>
              <Link href={`/${locale}/articles`} className="text-sm text-muted hover:text-foreground transition-colors">
                {locale === 'ru' ? 'Статьи' : 'Articles'}
              </Link>
              <Link href={`/${locale}/interviews`} className="text-sm text-muted hover:text-foreground transition-colors">
                {locale === 'ru' ? 'Интервью' : 'Interviews'}
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">{t('legal')}</h4>
            <div className="flex flex-col gap-2">
              <Link href={`/${locale}/disclaimer`} className="text-sm text-muted hover:text-foreground transition-colors">
                {t('disclaimer')}
              </Link>
              <Link href={`/${locale}/privacy`} className="text-sm text-muted hover:text-foreground transition-colors">
                {t('privacy')}
              </Link>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
              >
                <Mail size={14} />
                {t('contact')}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border">
          <h4 className="text-xs font-semibold uppercase tracking-widest text-muted mb-2">{t('aboutTitle')}</h4>
          <p className="text-muted text-xs leading-relaxed max-w-2xl">{t('about')}</p>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-xs text-muted">{t('disclaimerText')}</p>
          <p className="text-xs text-muted shrink-0">© {new Date().getFullYear()} CryptoPulse.media. {t('rights')}</p>
        </div>
      </div>
    </footer>
  );
}
