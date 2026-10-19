import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { CONTACT_EMAIL } from '@/lib/constants';
import { SITE_BRAND, SITE_NAME, SITE_URL } from '@/lib/site';
import { PAGE_REVISIONS } from '@/lib/pageRevisions';
import { getRegulationCountries } from '@/lib/regulation';

/**
 * Откуда взяты данные справочников и что с ними можно делать.
 *
 * Страница появилась из поля `license` в разметке Dataset на карте
 * регулирования: Search Console просила его заполнить, а лицензия Creative
 * Commons не подошла. Открытая лицензия безотзывна, и под неё попал бы не
 * только фактический слой, но и восемь тысяч слов описаний стран — отдать их
 * навсегда владелец не собирался. Google при этом требует присутствия поля, а
 * не открытости: `license` описан как «URL или CreativeWork», то есть годится
 * адрес собственного документа с условиями. Им и стала эта страница.
 *
 * Прав она никому не передаёт и ничего не обещает: называет происхождение
 * данных, просит ссылку при перепечатке и снимает ответственность за решения,
 * принятые по материалу. Поэтому её можно изменить или снять в любой день —
 * у лицензии такой возможности не было бы.
 *
 * Дата «обновлено» берётся из PAGE_REVISIONS, то есть из коммита, которым
 * страницу правили в последний раз. На соседних правовых страницах там стоит
 * `new Date()`, и документ каждый день сообщает, что он изменился.
 */

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });
  const isRu = locale === 'ru';
  const description = isRu
    ? `Откуда ${SITE_NAME} берёт данные справочников, как их цитировать и за что издание не отвечает.`
    : `Where ${SITE_NAME} gets its reference data, how to cite it, and what the publication does not answer for.`;

  return {
    title: t('termsTitle'),
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/terms`, title: t('termsTitle'), description, locale }),
    twitter: buildTwitter({ url: `${BASE}/${locale}/terms`, title: t('termsTitle'), description, locale }),
    alternates: {
      canonical: `${SITE_URL}/${locale}/terms`,
      languages: {
        ru: `${SITE_URL}/ru/terms`,
        en: `${SITE_URL}/en/terms`,
        'x-default': `${SITE_URL}/en/terms`,
      },
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('legal');
  const isRu = locale === 'ru';

  // Число стран считается по живым данным. Вписанное руками «38» пережило на
  // карте восемь добавлений и врало на странице, где стран было 46.
  const countries = (await getRegulationCountries()).length;

  const revised = PAGE_REVISIONS['/terms'];
  const lastUpdated = revised
    ? new Date(revised).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: isRu ? 'Главная' : 'Home', item: `${BASE}/${locale}` },
      { '@type': 'ListItem', position: 2, name: t('termsTitle'), item: `${BASE}/${locale}/terms` },
    ],
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t('termsTitle')}</h1>
      {lastUpdated && <p className="text-muted text-xs mb-8">{t('lastUpdated')}: {lastUpdated}</p>}

      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:text-foreground prose-headings:font-semibold
        prose-p:text-muted prose-p:leading-relaxed
        prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
        prose-li:text-muted prose-strong:text-foreground
      ">
        {isRu ? (
          <>
            <p>
              Данные в наших справочниках собраны из открытых источников: публикаций самих
              регуляторов и официальных сайтов компаний и бирж. Ссылку на первоисточник мы ставим
              у каждой записи. На <Link href={`/${locale}/regulation`}>карте регулирования</Link> она
              стоит рядом с датой сверки у всех {countries} стран.
            </p>

            <h2>Использование материалов</h2>
            <p>
              Факт никому не принадлежит, и разрешения у нас на него не нужно. Ставка налога в
              Португалии остаётся ставкой налога в Португалии, кто бы её ни напечатал.
            </p>
            <p>
              Просим вас при использовании наших формулировок или нашего текста ставить ссылку на
              наш сайт. Ссылайтесь на ту страницу, откуда взяли. В ней стоит дата нашей сверки, а
              законы меняются: цифра без даты устаревает незаметно для читателя.
            </p>

            <h2>Ответственность</h2>
            <p>
              Справочные страницы пишет редакция {SITE_NAME}. Мы не несём ответственности за
              изложенную информацию, и она не является рекомендацией к какому-либо виду
              деятельности или принятию решения. Авторитет — публикация самого регулятора. Ссылка
              на неё стоит у каждой страны на карте, и перед решением смотрите туда. Полная
              формулировка — в <Link href={`/${locale}/disclaimer`}>дисклеймере</Link>.
            </p>

            <h2>Логотипы и знаки</h2>
            <p>
              Логотипы компаний и сервисов принадлежат своим владельцам. Мы показываем их как
              иллюстрацию к материалу и передать дальше не можем. Название {SITE_BRAND} и знак
              издания остаются за нами.
            </p>

            <h2>Нашли ошибку</h2>
            <p>
              Напишите на <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Мы читаем такие
              письма и исправляем то, что неверно; порядок описан в{' '}
              <Link href={`/${locale}/editorial-policy#corrections`}>редакционной политике</Link>.
            </p>
          </>
        ) : (
          <>
            <p>
              The figures in our reference sections come from open sources: the regulators&rsquo; own
              publications, and the official sites of the companies and exchanges. We link each entry
              to the source it came from. On the{' '}
              <Link href={`/${locale}/regulation`}>regulation map</Link> that link sits beside the
              check date on all {countries} countries.
            </p>

            <h2>Using our material</h2>
            <p>
              Nobody owns a fact, so you need no permission from us. Portugal&rsquo;s tax rate stays
              Portugal&rsquo;s tax rate whoever prints it.
            </p>
            <p>
              When you use our wording or our text, we ask you to link to our site. Link to the page
              you took it from. That page carries the date we checked, and law moves: a figure copied
              without its date goes stale where the reader cannot see it.
            </p>

            <h2>Responsibility</h2>
            <p>
              The {SITE_NAME} newsroom writes these reference pages. We take no responsibility for
              the information set out here, and none of it is a recommendation to act or to decide
              anything. The authority is the regulator&rsquo;s own publication. Every country on the
              map links to it, so look there before you act. The{' '}
              <Link href={`/${locale}/disclaimer`}>disclaimer</Link> carries the full wording.
            </p>

            <h2>Logos and marks</h2>
            <p>
              Company and product logos belong to their owners. We show them to illustrate a story
              and cannot pass them on. The name {SITE_BRAND} and the publication&rsquo;s mark stay
              with us.
            </p>

            <h2>Found a mistake</h2>
            <p>
              Write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We read those letters
              and correct what is wrong; the{' '}
              <Link href={`/${locale}/editorial-policy#corrections`}>editorial policy</Link> describes
              how we handle it.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
