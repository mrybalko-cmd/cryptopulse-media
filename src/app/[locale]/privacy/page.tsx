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
    title: t('privacyTitle'),
    openGraph: buildOg({ url: `${BASE}/${locale}/privacy`, title: t('privacyTitle'), description: '', locale }),
    alternates: {
      canonical: `https://cryptopulse.media/${locale}/privacy`,
      languages: { ru: 'https://cryptopulse.media/ru/privacy', en: 'https://cryptopulse.media/en/privacy' },
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
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
      { '@type': 'ListItem', position: 2, name: isRu ? 'Политика конфиденциальности' : 'Privacy Policy', item: `${BASE}/${locale}/privacy` },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t('privacyTitle')}</h1>
      <p className="text-muted text-xs mb-8">{t('lastUpdated')}: {lastUpdated}</p>

      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:text-foreground prose-headings:font-semibold
        prose-p:text-muted prose-p:leading-relaxed
        prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
        prose-li:text-muted prose-strong:text-foreground
      ">
        {isRu ? (
          <>
            <p>
              {SITE_NAME} (далее «мы») — независимый проект, посвящённый новостям и аналитике криптовалютного
              рынка. Эта политика объясняет, какие данные мы собираем при использовании сайта cryptopulse.media
              и как мы с ними поступаем.
            </p>

            <h2>Какие данные мы собираем</h2>
            <p>
              Сайт не требует регистрации и не имеет системы учётных записей. Мы можем собирать базовую
              техническую информацию о посещениях: страницы, которые вы просматриваете, тип устройства и
              браузера, приблизительную геолокацию по IP-адресу, а также данные через cookie-файлы аналитики
              (например, Google Analytics или аналогичные сервисы).
            </p>

            <h2>Как мы используем данные</h2>
            <p>
              Собранная информация используется исключительно для понимания посещаемости сайта, улучшения
              контента и работы сайта. Мы не продаём и не передаём личные данные третьим лицам в коммерческих
              целях.
            </p>

            <h2>Сторонние сервисы</h2>
            <p>
              Сайт использует следующие сторонние сервисы, у каждого из которых есть собственная политика
              конфиденциальности: Sanity (управление контентом), а также Vercel (хостинг и базовая серверная аналитика).
            </p>

            <h2>Файлы cookie</h2>
            <p>
              Мы можем использовать функциональные и аналитические cookie-файлы. Вы можете отключить cookie
              в настройках своего браузера — это может ограничить часть функциональности сайта.
            </p>

            <h2>Ваши права</h2>
            <p>
              Поскольку сайт не хранит учётные записи пользователей, объём персональных данных, которые мы
              храним, минимален. Если у вас есть вопросы о том, какие данные о вас могут быть собраны, или
              запрос на их удаление, напишите нам по адресу {CONTACT_EMAIL}.
            </p>

            <h2>Дети</h2>
            <p>Сайт не предназначен для детей младше 16 лет, и мы сознательно не собираем их данные.</p>

            <h2>Изменения в политике</h2>
            <p>
              Мы можем периодически обновлять эту политику. Дата последнего обновления указана в начале
              страницы.
            </p>

            <h2>Контакты</h2>
            <p>
              По любым вопросам, связанным с конфиденциальностью, пишите на {CONTACT_EMAIL}.
            </p>
          </>
        ) : (
          <>
            <p>
              {SITE_NAME} (&quot;we&quot;) is an independent project covering crypto market news and analysis.
              This policy explains what data we collect when you use cryptopulse.media and how we handle it.
            </p>

            <h2>Information We Collect</h2>
            <p>
              The site does not require registration and has no account system. We may collect basic technical
              information about visits: the pages you view, device and browser type, an approximate location
              based on IP address, and data through analytics cookies (e.g. Google Analytics or similar
              services).
            </p>

            <h2>How We Use This Information</h2>
            <p>
              Collected information is used solely to understand site traffic, improve content, and improve
              site performance. We do not sell or share personal data with third parties for commercial
              purposes.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              The site relies on the following third-party services, each with its own privacy policy: Sanity
              (content management), and Vercel (hosting and standard server analytics).
            </p>

            <h2>Cookies</h2>
            <p>
              We may use functional and analytics cookies. You can disable cookies in your browser settings —
              this may limit some site functionality.
            </p>

            <h2>Your Rights</h2>
            <p>
              Since the site does not store user accounts, the amount of personal data we hold is minimal. If
              you have questions about what data may have been collected about you, or wish to request its
              deletion, please contact us at {CONTACT_EMAIL}.
            </p>

            <h2>Children&apos;s Privacy</h2>
            <p>The site is not directed at children under 16, and we do not knowingly collect their data.</p>

            <h2>Changes to This Policy</h2>
            <p>We may update this policy from time to time. The last-updated date is shown at the top of this page.</p>

            <h2>Contact</h2>
            <p>For any privacy-related questions, reach us at {CONTACT_EMAIL}.</p>
          </>
        )}
      </div>
    </div>
  );
}
