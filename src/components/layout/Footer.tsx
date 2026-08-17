import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { Mail } from 'lucide-react';
import { CONTACT_EMAIL, LINKEDIN_PROFILE_URL } from '@/lib/constants';
import EmailSubscribeForm from '@/components/ui/EmailSubscribeForm';
import FooterNavGroup from '@/components/layout/FooterNavGroup';
import { SITE_BRAND, SITE_NAME, SITE_ZONE } from '@/lib/site';
import BrandMarkSvg from '@/components/ui/BrandMarkSvg';

// The official "in" glyph, drawn rather than pulled from an icon set: lucide
// has no brand marks, and LinkedIn's guidelines do not allow redrawing it.
function LinkedInLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
    </svg>
  );
}

export default async function Footer() {
  const t = await getTranslations('footer');
  const locale = await getLocale();

  return (
    <footer className="border-t border-border mt-20" aria-label="Site footer">

      {/* Subscribe bar — full-bleed strip above the column grid */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <EmailSubscribeForm locale={locale} source="footer" variant="footer" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Single column on mobile (accordion groups), 4-column grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-6">

          {/* Brand — extra bottom margin on mobile so the first accordion
              below doesn't crowd the follow button */}
          <div className="mb-6 lg:mb-0">
            <Link href={`/${locale}`} className="inline-flex items-center gap-1 mb-3">
              <BrandMarkSvg className="h-5 w-auto shrink-0" />
              <span className="font-semibold text-sm">
                {SITE_BRAND}<span className="text-muted">{SITE_ZONE}</span>
              </span>
            </Link>
            <p className="text-muted text-xs leading-relaxed max-w-52 mb-4">{t('tagline')}</p>
            <a
              href={LINKEDIN_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-lg border border-border px-3 py-2 hover:border-[#0A66C2]/50 hover:bg-[#0A66C2]/[0.07] transition-colors group max-w-52"
            >
              {/* Brand blue rather than the site accent: LinkedIn asks that the
                  mark keep its own colour, and one saturated square reads as a
                  logo where a graphite circle read as another icon. */}
              <span className="w-7 h-7 rounded-[7px] bg-[#0A66C2] text-white flex items-center justify-center shrink-0 shadow-[0_1px_3px_rgba(10,102,194,0.45)] group-hover:shadow-[0_2px_8px_rgba(10,102,194,0.55)] transition-shadow">
                <LinkedInLogo size={13} />
              </span>
              <span className="flex flex-col leading-tight min-w-0">
                <span className="text-xs font-semibold text-foreground truncate">{t('followLinkedIn')}</span>
                <span className="text-[11px] text-muted truncate">{t('followLinkedInHandle')}</span>
              </span>
            </a>
          </div>

          {/* Content */}
          <FooterNavGroup title={t('content')}>
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
              <Link href={`/${locale}/authors`} className="text-sm text-muted hover:text-foreground transition-colors">
                {t('authors')}
              </Link>
            </li>
          </FooterNavGroup>

          {/* Tools */}
          <FooterNavGroup title={t('tools')}>
            <li>
              <Link href={`/${locale}/calculators`} className="text-sm text-muted hover:text-foreground transition-colors">
                {t('calculators')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/calculators/wealth`} className="text-sm text-muted hover:text-foreground transition-colors">
                {t('wealthCalc')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/calculators/converter`} className="text-sm text-muted hover:text-foreground transition-colors">
                {t('converter')}
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
              <Link href={`/${locale}/ai/glossary`} className="text-sm text-muted hover:text-foreground transition-colors">
                {t('aiGlossary')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/calendar`} className="text-sm text-muted hover:text-foreground transition-colors">
                {t('calendar')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/regulation`} className="text-sm text-muted hover:text-foreground transition-colors">
                {t('regulation')}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/faq`} className="text-sm text-muted hover:text-foreground transition-colors">
                {t('faq')}
              </Link>
            </li>
          </FooterNavGroup>

          {/* Legal */}
          <FooterNavGroup title={t('legal')}>
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
          </FooterNavGroup>

        </div>

        {/* Ad disclosure — relevant now that the sidebar can show partner banners */}
        <div className="mt-10 border border-dashed border-border rounded-lg px-4 py-3">
          <p className="text-xs text-muted leading-relaxed">
            <span className="font-semibold text-foreground">{t('disclosureTitle')}</span> {t('disclosureText')}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-6 pt-6 border-t border-border flex flex-col sm:flex-row justify-between gap-3">
          <p className="text-xs text-muted">{t('disclaimerText')}</p>
          <p className="text-xs text-muted shrink-0">
            © {new Date().getFullYear()} ${SITE_NAME} · {t('rights')}
          </p>
        </div>

      </div>
    </footer>
  );
}
