import { getTranslations, setRequestLocale} from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import { CONTACT_EMAIL, SITE_NAME } from '@/lib/constants';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });
  return {
    title: t('disclaimerTitle'),
    openGraph: buildOg({ url: `${BASE}/${locale}/disclaimer`, title: t('disclaimerTitle'), description: '', locale }),
    alternates: {
      canonical: `https://cryptopulse.media/${locale}/disclaimer`,
      languages: { ru: 'https://cryptopulse.media/ru/disclaimer', en: 'https://cryptopulse.media/en/disclaimer' },
    },
  };
}

export default async function DisclaimerPage({ params }: Props) {
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
      { '@type': 'ListItem', position: 2, name: isRu ? 'Дисклеймер' : 'Disclaimer', item: `${BASE}/${locale}/disclaimer` },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t('disclaimerTitle')}</h1>
      <p className="text-muted text-xs mb-8">{t('lastUpdated')}: {lastUpdated}</p>

      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:text-foreground prose-headings:font-semibold
        prose-p:text-muted prose-p:leading-relaxed
        prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
        prose-li:text-muted prose-strong:text-foreground
      ">
        {isRu ? (
          <>
            <h2>Только информационный характер</h2>
            <p>
              Весь контент на {SITE_NAME} (cryptopulse.media) — новости, статьи, интервью и другие
              материалы — предоставляется исключительно в информационных и образовательных целях.
            </p>

            <h2>Не является финансовой рекомендацией</h2>
            <p>
              Ничто на этом сайте не является инвестиционной, юридической или финансовой консультацией.
              Перед принятием любых финансовых решений рекомендуем обратиться к квалифицированному специалисту.
            </p>

            <h2>Риски криптовалютных активов</h2>
            <p>
              Криптовалюты — высоковолатильный и спекулятивный класс активов. Стоимость криптовалют может
              значительно колебаться, и вы можете потерять часть или всю инвестированную сумму. Инвестируйте
              только те средства, потерю которых вы готовы принять.
            </p>

            <h2>Точность информации</h2>
            <p>
              Мы прилагаем разумные усилия для публикации точной и актуальной информации, однако не
              гарантируем полноту или своевременность всех материалов. Крипторынок меняется быстро —
              всегда проверяйте информацию из нескольких источников перед принятием решений.
            </p>

            <h2>Внешние ссылки и контент</h2>
            <p>
              Сайт может содержать ссылки на внешние ресурсы (новостные источники и т.д.),
              которые находятся вне нашего контроля. Мы не отвечаем за содержание, точность или политику
              конфиденциальности таких сторонних ресурсов.
            </p>

            <h2>Редакционные материалы</h2>
            <p>
              Авторские статьи и комментарии отражают личное мнение автора(ов) и не являются профессиональной
              финансовой рекомендацией.
            </p>

            <h2>Ограничение ответственности</h2>
            <p>
              Мы не несём ответственности за любые убытки или ущерб, возникшие в результате использования
              материалов этого сайта или принятия решений на их основе.
            </p>

            <h2>Изменения дисклеймера</h2>
            <p>Этот дисклеймер может периодически обновляться. Дата последнего обновления указана выше.</p>

            <h2>Контакты</h2>
            <p>Вопросы можно направлять на {CONTACT_EMAIL}.</p>
          </>
        ) : (
          <>
            <h2>General Information Only</h2>
            <p>
              All content on {SITE_NAME} (cryptopulse.media) — news, articles, and other
              materials — is provided strictly for informational and educational purposes.
            </p>

            <h2>Not Financial Advice</h2>
            <p>
              Nothing on this site constitutes investment, legal, or financial advice. Please consult a
              qualified professional before making any financial decisions.
            </p>

            <h2>Cryptocurrency Risk Warning</h2>
            <p>
              Cryptocurrencies are a highly volatile and speculative asset class. Their value can fluctuate
              significantly, and you may lose some or all of your invested capital. Only invest funds you are
              prepared to lose.
            </p>

            <h2>Accuracy of Information</h2>
            <p>
              We make reasonable efforts to publish accurate and up-to-date information, but we do not
              guarantee the completeness or timeliness of all content. The crypto market moves fast —
              always verify information from multiple sources before making any decisions.
            </p>

            <h2>Third-Party Links &amp; Content</h2>
            <p>
              The site may contain links to external resources (news sources, etc.) that are
              outside our control. We are not responsible for the content, accuracy, or privacy practices of
              such third-party resources.
            </p>

            <h2>Editorial Content</h2>
            <p>
              Authored articles and commentary reflect the personal views of the author(s) and do not
              constitute professional financial recommendations.
            </p>

            <h2>No Liability</h2>
            <p>
              We accept no liability for any loss or damage arising from the use of this site&apos;s content or
              decisions made based on it.
            </p>

            <h2>Changes to This Disclaimer</h2>
            <p>This disclaimer may be updated periodically. The last-updated date is shown above.</p>

            <h2>Contact</h2>
            <p>Questions can be directed to {CONTACT_EMAIL}.</p>
          </>
        )}
      </div>
    </div>
  );
}
