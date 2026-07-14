import { getTranslations, setRequestLocale} from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/constants';


type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });
  return {
    title: t('editorialPolicyTitle'),
    openGraph: buildOg({ url: `${BASE}/${locale}/editorial-policy`, title: t('editorialPolicyTitle'), description: '', locale }),
    alternates: {
      canonical: `${BASE}/${locale}/editorial-policy`,
      languages: { ru: `${BASE}/ru/editorial-policy`, en: `${BASE}/en/editorial-policy` },
    },
  };
}

export default async function EditorialPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const isRu = locale === 'ru';

  const lastUpdated = new Date().toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isRu ? 'Редакционная политика' : 'Editorial Policy', item: `${BASE}/${locale}/editorial-policy` },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t('editorialPolicyTitle')}</h1>
      <p className="text-muted text-xs mb-8">{t('lastUpdated')}: {lastUpdated}</p>

      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:text-foreground prose-headings:font-semibold
        prose-p:text-muted prose-p:leading-relaxed
        prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
        prose-li:text-muted prose-strong:text-foreground
      ">
        {isRu ? (
          <>
            <h2>Кто мы</h2>
            <p>
              {SITE_NAME} (cryptopulse.media) — независимый медиапроект о криптовалютах и блокчейне.
              Мы публикуем собственные материалы: авторские новости, статьи и обзоры
              — на русском и английском языках.
            </p>

            <h2>Редакционная независимость</h2>
            <p>
              Решения о том, какие материалы публиковать, принимаются исключительно редакцией. Рекламные
              и партнёрские отношения с биржами, проектами или другими компаниями не влияют на выбор тем
              и не дают права редактировать содержание материалов.
            </p>

            <h2>Маркировка рекламы</h2>
            <p>
              Любой оплаченный или партнёрский материал явно помечается как «Реклама» или «Партнёрский
              материал». Если пометки нет — значит, материал не является рекламным. Подробнее об условиях
              размещения рекламы — на странице <Link href={`/${locale}/advertising`}>«Реклама»</Link>.
            </p>

            <h2>Стандарты точности</h2>
            <p>
              Мы прилагаем разумные усилия, чтобы публиковать точную и актуальную информацию. Ни один
              материал не является инвестиционной рекомендацией. Подробное описание ограничений
              ответственности — в нашем {' '}<Link href={`/${locale}/disclaimer`}>Дисклеймере</Link>.
            </p>

            <h2>Исправления и обновления</h2>
            <p>
              Если вы заметили фактическую ошибку в материале редакции, напишите нам на
              {' '}{CONTACT_EMAIL} — мы оперативно проверим информацию и внесём исправления.
            </p>

            <h2>Не является финансовой рекомендацией</h2>
            <p>
              Весь контент на сайте, включая собственные материалы редакции, носит исключительно
              информационный характер и не является инвестиционной, юридической или налоговой консультацией.
            </p>

            <h2>Контакты</h2>
            <p>По вопросам редакционной политики пишите на {CONTACT_EMAIL}.</p>
          </>
        ) : (
          <>
            <h2>Who We Are</h2>
            <p>
              {SITE_NAME} (cryptopulse.media) is an independent media project covering cryptocurrency and
              blockchain. We publish original content — authored news, articles, and reviews
              — in Russian and English.
            </p>

            <h2>Editorial Independence</h2>
            <p>
              Decisions about which material to publish are made solely by the editorial team. Advertising
              and partnership relationships with exchanges, projects, or other companies do not influence
              topic selection and do not grant any right to edit content.
            </p>

            <h2>Advertising Disclosure</h2>
            <p>
              Any paid or sponsored material is clearly labeled "Advertising" or "Sponsored content." If a
              piece carries no such label, it is not an advertisement. See our{' '}
              <Link href={`/${locale}/advertising`}>Advertising page</Link> for details.
            </p>

            <h2>Accuracy Standards</h2>
            <p>
              We make reasonable efforts to publish accurate and up-to-date information. No content on this
              site constitutes investment advice. See our{' '}
              <Link href={`/${locale}/disclaimer`}>Disclaimer</Link> for the full scope of our liability
              limitations.
            </p>

            <h2>Corrections &amp; Updates</h2>
            <p>
              If you spot a factual error in one of our editorial pieces, email us at {CONTACT_EMAIL} and
              we will review and correct it promptly.
            </p>

            <h2>Not Financial Advice</h2>
            <p>
              All content on this site, including our own editorial material, is provided for informational
              purposes only and does not constitute investment, legal, or tax advice.
            </p>

            <h2>Contact</h2>
            <p>For questions about this editorial policy, email {CONTACT_EMAIL}.</p>
          </>
        )}
      </div>
    </div>
  );
}
