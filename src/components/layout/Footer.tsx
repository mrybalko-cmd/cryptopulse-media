import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { ADVERTISING_EMAIL, LINKEDIN_PROFILE_URL } from '@/lib/constants';
import EmailSubscribeForm from '@/components/ui/EmailSubscribeForm';
import FooterNavGroup from '@/components/layout/FooterNavGroup';
import FooterTopButton from '@/components/layout/FooterTopButton';
import { SITE_BRAND, SITE_NAME, SITE_ZONE } from '@/lib/site';
import BrandMarkSvg from '@/components/ui/BrandMarkSvg';

/**
 * Футер: знак с абзацем о проекте, шесть колонок ссылок, строка иконок и подпись.
 *
 * Двадцать ссылок разложены по смыслу, а не по одному длинному столбцу:
 * «Инструменты» — то, чем считают, «Справочники» — то, где смотрят. AI стоит
 * отдельной колонкой, потому что это теперь самостоятельный раздел, а не
 * ещё один инструмент.
 *
 * Абзац о проекте — тот же текст, что стоит на странице «О нас», в RSS и в
 * llms.txt. Он живёт в словаре, чтобы четвёртая копия не разъехалась с
 * остальными тремя при первой же правке.
 */

// The official "in" glyph, drawn rather than pulled from an icon set: lucide
// has no brand marks, and LinkedIn's guidelines do not allow redrawing it.
function LinkedInLogo({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 448 512" fill="currentColor" aria-hidden="true">
      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
    </svg>
  );
}

/** Ссылка колонки: подпись и адрес, остальное одинаково у всех двадцати. */
function L({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="ft-link">{children}</Link>
    </li>
  );
}

export default async function Footer() {
  const t = await getTranslations('footer');
  const locale = await getLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-20" aria-label="Site footer">

      {/* Подписка. Серой полосы вокруг больше нет: панель сама стеклянная,
          и плашка за её спиной глушила бы и ореолы, и прозрачность. */}
      <div className="mx-auto max-w-7xl px-4 pb-2 pt-8 sm:px-6">
        <EmailSubscribeForm locale={locale} source="footer" variant="footer" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Знак и абзац о проекте */}
        <div className="flex flex-wrap items-start gap-x-7 gap-y-4 py-8">
          <Link href={`/${locale}`} className="inline-flex shrink-0 items-center gap-1.5">
            <BrandMarkSvg className="h-5 w-auto shrink-0" />
            <span className="text-[15px] font-semibold">
              {SITE_BRAND}<span className="text-muted">{SITE_ZONE}</span>
            </span>
          </Link>
          <p className="m-0 min-w-0 flex-1 basis-80 text-[13px] leading-relaxed text-muted">
            {t('blurb')}
          </p>
        </div>

        <div className="border-t border-dashed border-border" />

        {/* Шесть колонок. Ниже lg каждая превращается в раскрывающийся пункт:
            шесть столбцов на телефоне легли бы в шесть экранов подряд. */}
        <div className="grid grid-cols-1 gap-x-6 gap-y-4 py-8 sm:grid-cols-2 lg:grid-cols-6">

          <FooterNavGroup title={t('content')}>
            <L href={`/${locale}/news`}>{t('news')}</L>
            <L href={`/${locale}/articles`}>{t('articles')}</L>
            <L href={`/${locale}/authors`}>{t('authors')}</L>
          </FooterNavGroup>

          <FooterNavGroup title={t('tools')}>
            <L href={`/${locale}/calculators`}>{t('calculators')}</L>
            <L href={`/${locale}/calculators/converter`}>{t('converter')}</L>
            <L href={`/${locale}/calculators/wealth`}>{t('wealthCalc')}</L>
            <L href={`/${locale}/calendar`}>{t('calendar')}</L>
          </FooterNavGroup>

          <FooterNavGroup title={t('refs')}>
            <L href={`/${locale}/assets`}>{t('assets')}</L>
            <L href={`/${locale}/glossary`}>{t('glossary')}</L>
            <L href={`/${locale}/regulation`}>{t('regulation')}</L>
            <L href={`/${locale}/faq`}>{t('faq')}</L>
          </FooterNavGroup>

          <FooterNavGroup title={t('aiGroup')}>
            <L href={`/${locale}/ai/tools`}>{t('aiTools')}</L>
            <L href={`/${locale}/ai/glossary`}>{t('aiGlossary')}</L>
          </FooterNavGroup>

          <FooterNavGroup title={t('project')}>
            <L href={`/${locale}/about`}>{t('aboutUs')}</L>
            <L href={`/${locale}/advertising`}>{t('advertising')}</L>
            <L href={`/${locale}/editorial-policy`}>{t('editorialPolicy')}</L>
            <li>
              <address className="not-italic">
                <a href={`mailto:${ADVERTISING_EMAIL}`} className="ft-link">{t('contact')}</a>
              </address>
            </li>
          </FooterNavGroup>

          <FooterNavGroup title={t('legal')}>
            <L href={`/${locale}/privacy`}>{t('privacy')}</L>
            <L href={`/${locale}/disclaimer`}>{t('disclaimer')}</L>
            <L href={`/${locale}/security`}>{t('security')}</L>
            <L href={`/${locale}/terms`}>{t('terms')}</L>
          </FooterNavGroup>

        </div>

        <div className="border-t border-dashed border-border" />

        {/* Строка иконок. Только то, что у нас действительно есть и работает. */}
        <div className="flex flex-wrap justify-center gap-2.5 pt-7">
          <a
            href={LINKEDIN_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t('followLinkedIn')}
            title={t('followLinkedIn')}
            className="ft-sq ft-sq-li"
          >
            <LinkedInLogo size={17} />
          </a>
          <a href={`mailto:${ADVERTISING_EMAIL}`} aria-label={t('email')} title={t('email')} className="ft-sq">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="2.5" y="5" width="19" height="14" rx="3" />
              <path d="m3.5 7 8.5 6 8.5-6" />
            </svg>
          </a>
          <a href="/rss.xml" aria-label={t('rss')} title={t('rss')} className="ft-sq">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
              <path d="M5 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
              <path d="M5 12a7 7 0 0 1 7 7M5 5a14 14 0 0 1 14 14" />
            </svg>
          </a>
          <FooterTopButton label={t('toTop')} />
        </div>

        <p className="mx-auto mt-6 max-w-[80ch] text-center text-xs leading-relaxed text-muted">
          © {year} {SITE_NAME} · {t('rights')} {t('disclaimerText')}
        </p>

        {/* Ad disclosure — relevant now that the sidebar can show partner banners */}
        <div className="mb-10 mt-6 rounded-lg border border-dashed border-border px-4 py-3">
          <p className="text-xs leading-relaxed text-muted">
            <span className="font-semibold text-foreground">{t('disclosureTitle')}</span> {t('disclosureText')}
          </p>
        </div>

      </div>
    </footer>
  );
}
