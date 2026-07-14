import type { ReactNode } from 'react';
import Link from 'next/link';
import CoinCalculator from './CoinCalculator';
import type { CoinGuideData } from '@/lib/coinGuides';

// Shared shell for every /assets/[slug] guide page — breadcrumb, hero stats,
// calculator, history article, FAQ, and glossary links. Keeps the mechanical
// wiring (JSON-LD is built by the caller since it needs page-specific
// headline/description) in one place instead of duplicated across 10+ pages;
// each page.tsx only supplies its own bespoke history prose and guide data.
export default function CoinGuideLayout({
  locale,
  slug,
  name,
  symbol,
  icon,
  coingeckoId,
  tagline,
  historyTitle,
  historyContent,
  guide,
}: {
  locale: string;
  slug: string;
  name: string;
  symbol: string;
  icon: string;
  coingeckoId: string;
  tagline: string;
  historyTitle: string;
  historyContent: ReactNode;
  guide: CoinGuideData;
}) {
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';
  const glossaryBase = `/${locale}/glossary`;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">{isRu ? 'Главная' : 'Home'}</Link>
        <span>›</span>
        <Link href={`/${locale}/assets`} className="hover:text-accent transition-colors">{isRu ? 'Крипто-активы' : 'Crypto Assets'}</Link>
        <span>›</span>
        <span className="text-foreground">{name} ({symbol})</span>
      </nav>

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              {name} <span className="text-muted font-normal text-2xl">{symbol}</span>
            </h1>
            <p className="text-muted text-sm mt-1">{tagline}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {guide.stats.map(s => (
            <div key={s.label[loc]} className="bg-card border border-border rounded-lg p-3">
              <p className="text-xs text-muted mb-1">{s.label[loc]}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-14">
        <CoinCalculator locale={locale} coingeckoId={coingeckoId} symbol={symbol} reference={guide.investmentReference} />
      </div>

      <article className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-8">{historyTitle}</h2>
        <div className="prose prose-invert prose-sm max-w-none
          prose-headings:text-foreground prose-headings:font-semibold
          prose-p:text-muted prose-p:leading-relaxed
          prose-strong:text-foreground
          prose-a:text-accent prose-a:no-underline hover:prose-a:underline
          prose-li:text-muted">
          {historyContent}
        </div>
      </article>

      <section className="mb-14">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {isRu ? `Часто задаваемые вопросы о ${name}` : `Frequently Asked Questions About ${name}`}
        </h2>
        <div className="flex flex-col gap-4">
          {guide.faq.map((item, i) => (
            <details key={i} className="group bg-card border border-border rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer select-none font-semibold text-sm text-foreground list-none">
                {item.question[loc]}
                <span className="text-muted group-open:rotate-180 transition-transform shrink-0 ml-3">▾</span>
              </summary>
              <div className="px-4 pb-4 pt-0 text-sm text-muted leading-relaxed border-t border-border">
                <p className="pt-3">{item.answer[loc]}</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-bold text-foreground mb-3">
          {isRu ? 'Изучите термины в глоссарии' : 'Learn the terms in our glossary'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {guide.glossaryTerms.map(t => (
            <Link
              key={t.slug}
              href={`${glossaryBase}#${t.slug}`}
              className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              {t.label[loc]}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
