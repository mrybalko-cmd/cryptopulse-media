import type { Metadata } from 'next';
import { buildOg, BASE } from '@/lib/metadata';
import { FAQ } from '@/lib/faq';


type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu ? 'FAQ — частые вопросы о криптовалюте' : 'FAQ — Frequently Asked Questions About Crypto';
  const description = isRu
    ? 'Короткие и понятные ответы на самые частые вопросы о криптовалюте: сети и комиссии, кошельки, биржи, безопасность, трейдинг и налоги.'
    : 'Short, clear answers to the most common questions about cryptocurrency: networks and fees, wallets, exchanges, security, trading, and taxes.';

  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/faq`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/faq`,
      languages: { ru: `${BASE}/ru/faq`, en: `${BASE}/en/faq`, 'x-default': `${BASE}/en/faq` },
    },
  };
}

export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const loc = (isRu ? 'ru' : 'en') as 'ru' | 'en';

  const categories = [...new Set(FAQ.map((f) => f.category[loc]))];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.question[loc],
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer[loc],
      },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
        {isRu ? 'Частые вопросы' : 'Frequently Asked Questions'}
      </h1>
      <p className="text-muted text-sm mb-8 leading-relaxed">
        {isRu
          ? 'Собрали короткие и понятные ответы на вопросы, которые чаще всего ищут читатели о криптовалюте — от комиссий и кошельков до безопасности и налогов.'
          : "We've collected short, clear answers to the questions readers search for most often about crypto — from fees and wallets to security and taxes."}
      </p>

      <div className="space-y-8">
        {categories.map((category) => (
          <section key={category}>
            <h2 className="text-xs font-bold uppercase tracking-widest text-accent mb-3">{category}</h2>
            <div className="space-y-2">
              {FAQ.filter((f) => f.category[loc] === category).map((f) => (
                <details
                  key={f.slug}
                  id={f.slug}
                  className="group bg-card border border-border rounded-lg px-4 py-3 open:border-accent/40 scroll-mt-24"
                >
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-3 text-sm font-semibold text-foreground">
                    {f.question[loc]}
                    <span className="text-muted text-xs shrink-0 mt-0.5 group-open:rotate-180 transition-transform">▾</span>
                  </summary>
                  <p className="text-muted text-sm leading-relaxed mt-2">{f.answer[loc]}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
