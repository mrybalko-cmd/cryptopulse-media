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
      languages: { ru: `${BASE}/ru/editorial-policy`, en: `${BASE}/en/editorial-policy`, 'x-default': `${BASE}/en/editorial-policy` },
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
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
              Мы собираем рыночные новости из открытых источников и публикуем собственные материалы:
              авторские статьи, обзоры и интервью с участниками индустрии — на русском и английском языках.
            </p>

            <h2>Два типа контента на сайте</h2>
            <p>
              Важно понимать разницу между двумя типами публикаций:
            </p>
            <ul>
              <li>
                <strong>Собственные материалы редакции</strong> — статьи, аналитика и интервью, которые мы
                пишем сами и помечаем значком «Наш материал».
              </li>
              <li>
                <strong>Агрегированные новости</strong> — заголовки и ссылки на публикации сторонних
                источников (Decrypt, The Block, CoinTelegraph, CoinDesk и другие), которые мы собираем
                автоматически через открытые RSS-ленты. Мы не редактируем и не переписываем эти материалы —
                переход по ссылке ведёт на сайт оригинального издания, которое несёт полную ответственность
                за содержание своей публикации.
              </li>
            </ul>

            <h2>Редакционная независимость</h2>
            <p>
              Решения о том, какие собственные материалы публиковать и какие внешние новости агрегировать,
              принимаются исключительно редакцией. Рекламные и партнёрские отношения с биржами, проектами или
              другими компаниями не влияют на выбор тем и не дают права редактировать содержание материалов.
            </p>

            <h2>Маркировка рекламы</h2>
            <p>
              Любой оплаченный или партнёрский материал явно помечается как «Реклама» или «Партнёрский
              материал». Если пометки нет — значит, материал не является рекламным. Подробнее об условиях
              размещения рекламы — на странице <Link href={`/${locale}/advertising`}>«Реклама»</Link>.
            </p>

            <h2>Стандарты точности и ответственность за источники</h2>
            <p>
              Мы прилагаем разумные усилия, чтобы агрегировать новости из надёжных и известных отраслевых
              изданий. Однако мы не являемся автором стороннего контента, не можем проверить каждый факт в
              чужой публикации и не несём ответственности за точность, полноту или достоверность информации
              из внешних источников. Подробное описание ограничений ответственности — в нашем
              {' '}<Link href={`/${locale}/disclaimer`}>Дисклеймере</Link>.
            </p>

            <h2>Исправления и обновления</h2>
            <p>
              Если вы заметили фактическую ошибку в собственном материале редакции, напишите нам на
              {' '}{CONTACT_EMAIL} — мы оперативно проверим информацию и внесём исправления. По ошибкам в
              сторонних новостях, пожалуйста, обращайтесь напрямую к изданию-первоисточнику, указанному в
              публикации.
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
              blockchain. We gather market news from public sources and publish our own original
              content — authored articles, reviews, and interviews with industry participants — in Russian
              and English.
            </p>

            <h2>Two Types of Content on This Site</h2>
            <p>It is important to understand the difference between two types of publications here:</p>
            <ul>
              <li>
                <strong>Original editorial content</strong> — articles, analysis, and interviews that we write
                ourselves and label with an "Our story" badge.
              </li>
              <li>
                <strong>Aggregated news</strong> — headlines and links to publications from third-party sources
                (Decrypt, The Block, CoinTelegraph, CoinDesk, and others) that we collect automatically via
                public RSS feeds. We do not edit or rewrite this material — clicking through takes you to the
                original publisher's site, which holds full responsibility for the content of its publication.
              </li>
            </ul>

            <h2>Editorial Independence</h2>
            <p>
              Decisions about which original material to publish and which external news to aggregate are made
              solely by the editorial team. Advertising and partnership relationships with exchanges, projects,
              or other companies do not influence topic selection and do not grant any right to edit content.
            </p>

            <h2>Advertising Disclosure</h2>
            <p>
              Any paid or sponsored material is clearly labeled "Advertising" or "Sponsored content." If a
              piece carries no such label, it is not an advertisement. See our{' '}
              <Link href={`/${locale}/advertising`}>Advertising page</Link> for details.
            </p>

            <h2>Accuracy Standards &amp; Source Responsibility</h2>
            <p>
              We make reasonable efforts to aggregate news from reputable, well-known industry publications.
              However, we are not the author of third-party content, cannot verify every fact in someone else's
              publication, and accept no responsibility for the accuracy, completeness, or reliability of
              information from external sources. See our{' '}
              <Link href={`/${locale}/disclaimer`}>Disclaimer</Link> for the full scope of our liability
              limitations.
            </p>

            <h2>Corrections &amp; Updates</h2>
            <p>
              If you spot a factual error in one of our own editorial pieces, email us at {CONTACT_EMAIL} and
              we will review and correct it promptly. For errors in aggregated news, please contact the
              original publisher named in the article directly.
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
