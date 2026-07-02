import type { Metadata } from 'next';
import Link from 'next/link';
import { buildOg, BASE } from '@/lib/metadata';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isRu = locale === 'ru';
  const title = isRu ? 'О нас — CryptoPulse.media' : 'About Us — CryptoPulse.media';
  const description = isRu
    ? 'CryptoPulse.media — независимое крипто-медиа для русскоязычной и европейской аудитории. Новости, аналитика и образовательные материалы без лишнего шума.'
    : 'CryptoPulse.media is an independent crypto media outlet for Russian-speaking and European audiences. News, analysis and educational content without the noise.';
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/about`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/about`,
      languages: { ru: `${BASE}/ru/about`, en: `${BASE}/en/about`, 'x-default': `${BASE}/en/about` },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const isRu = locale === 'ru';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
        <Link href={`/${locale}`} className="hover:text-accent transition-colors">
          {isRu ? 'Главная' : 'Home'}
        </Link>
        <span>›</span>
        <span className="text-foreground">{isRu ? 'О нас' : 'About'}</span>
      </nav>

      {isRu ? (
        <article className="prose prose-invert prose-sm max-w-none">
          <h1>О нас</h1>

          <h2>Кто мы</h2>
          <p>
            CryptoPulse.media — независимое крипто-медиа, созданное для тех, кто хочет разобраться
            в цифровых активах без академического занудства и без хайпа. Мы пишем о Bitcoin, Ethereum,
            DeFi, регуляции и крипторынке в целом — на русском и английском языках.
          </p>
          <p>
            Сайт запущен в 2024 году и работает для аудитории из Восточной Европы, СНГ и русскоязычных
            диаспор по всему миру. Наша миссия — делать крипту понятной: объяснять сложное простыми
            словами, не приукрашивая риски и не продавая мечты.
          </p>

          <h2>Что мы делаем</h2>
          <ul>
            <li>
              <strong>Собственные новости и статьи</strong> — редакционный контент, написанный
              специально для нашей аудитории, с акцентом на события, важные для европейских инвесторов.
            </li>
            <li>
              <strong>Агрегация лучших источников</strong> — мы отслеживаем ведущие крипто-издания
              (Decrypt, CoinTelegraph, The Block, CoinDesk, ForkLog, BeInCrypto) и собираем актуальный
              поток новостей в одном месте.
            </li>
            <li>
              <strong>Обучение</strong> — глоссарий из 65+ терминов, раздел FAQ, гиды по 14 ведущим
              криптовалютам с историей и калькуляторами инвестиций.
            </li>
            <li>
              <strong>Инструменты</strong> — конвертер валют, крипто-календарь событий, индекс страха
              и жадности, тикер цен в реальном времени.
            </li>
          </ul>

          <h2>Редакционные принципы</h2>
          <p>
            Мы разграничиваем собственные материалы и агрегированный контент: каждая внешняя новость
            атрибутируется источнику и содержит ссылку на оригинал. Рекламные и партнёрские материалы
            чётко маркируются. Редакционная повестка не зависит от рекламодателей.
          </p>
          <p>
            CryptoPulse.media не является инвестиционным советником. Весь контент носит
            исключительно информационный характер. Перед принятием финансовых решений проконсультируйтесь
            с квалифицированным специалистом.
          </p>

          <h2>Связь</h2>
          <p>
            По вопросам сотрудничества, рекламы и пресс-запросам пишите на{' '}
            <a href="mailto:info@cryptopulse.media">info@cryptopulse.media</a>.
          </p>
          <p>
            Подробнее о наших стандартах работы — в{' '}
            <Link href={`/${locale}/editorial-policy`}>редакционной политике</Link>.
          </p>
        </article>
      ) : (
        <article className="prose prose-invert prose-sm max-w-none">
          <h1>About Us</h1>

          <h2>Who We Are</h2>
          <p>
            CryptoPulse.media is an independent crypto media outlet for those who want to understand
            digital assets without academic jargon or hype. We cover Bitcoin, Ethereum, DeFi, regulation,
            and the broader crypto market — in Russian and English.
          </p>
          <p>
            Launched in 2024, we serve audiences across Eastern Europe, the CIS, and Russian-speaking
            diaspora communities worldwide. Our mission is to make crypto understandable: explaining
            complex topics in plain language, without sugarcoating risks or selling dreams.
          </p>

          <h2>What We Do</h2>
          <ul>
            <li>
              <strong>Original news and articles</strong> — editorial content written for our audience,
              with a focus on events that matter for European investors.
            </li>
            <li>
              <strong>News aggregation</strong> — we monitor leading crypto publications (Decrypt,
              CoinTelegraph, The Block, CoinDesk, ForkLog, BeInCrypto) and bring the best content
              together in one place.
            </li>
            <li>
              <strong>Education</strong> — a glossary of 65+ terms, a FAQ section, and detailed guides
              for 14 major cryptocurrencies with histories and investment calculators.
            </li>
            <li>
              <strong>Tools</strong> — currency converter, crypto events calendar, Fear &amp; Greed
              index, and real-time price ticker.
            </li>
          </ul>

          <h2>Editorial Principles</h2>
          <p>
            We clearly separate original content from aggregated news: every external article is attributed
            to its source with a link to the original. Sponsored and partner content is clearly labeled.
            Our editorial agenda is independent of advertisers.
          </p>
          <p>
            CryptoPulse.media is not an investment advisor. All content is for informational purposes only.
            Please consult a qualified professional before making any financial decisions.
          </p>

          <h2>Contact</h2>
          <p>
            For partnership, advertising, and press inquiries, email us at{' '}
            <a href="mailto:info@cryptopulse.media">info@cryptopulse.media</a>.
          </p>
          <p>
            Learn more about our standards in our{' '}
            <Link href={`/${locale}/editorial-policy`}>editorial policy</Link>.
          </p>
        </article>
      )}
    </div>
  );
}
