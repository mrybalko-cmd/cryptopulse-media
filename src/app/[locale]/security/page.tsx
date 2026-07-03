import { getTranslations, setRequestLocale} from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import type { Metadata } from 'next';
import { CONTACT_EMAIL } from '@/lib/constants';


type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'legal' });
  return {
    title: t('securityTitle'),
    openGraph: buildOg({ url: `${BASE}/${locale}/security`, title: t('securityTitle'), description: '', locale }),
    alternates: {
      canonical: `${BASE}/${locale}/security`,
      languages: { ru: `${BASE}/ru/security`, en: `${BASE}/en/security`, 'x-default': `${BASE}/en/security` },
    },
  };
}

export default async function SecurityPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations('legal');
  const isRu = locale === 'ru';

  const lastUpdated = new Date().toLocaleDateString(isRu ? 'ru-RU' : 'en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{t('securityTitle')}</h1>
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
              Криптовалюты привлекательны для мошенников по нескольким причинам: транзакции необратимы,
              многие пользователи только начинают разбираться в теме, а индустрия пока слабо регулируется.
              Ниже — разбор самых распространённых схем обмана и того, как их распознать.
            </p>

            <h2>Фишинг</h2>
            <p>
              Мошенники создают поддельные сайты, письма или сообщения в мессенджерах, которые имитируют
              биржи, кошельки или известные проекты, чтобы выманить у вас пароль, код двухфакторной
              аутентификации или сид-фразу. Признаки фишинга:
            </p>
            <ul>
              <li>Адрес сайта отличается от настоящего на одну букву или символ (например, «binnance.com»).</li>
              <li>Сообщение создаёт ощущение срочности: «аккаунт будет заблокирован через час».</li>
              <li>В письме или чате просят ввести seed-фразу или приватный ключ — ни одна легитимная служба
                поддержки никогда этого не делает.</li>
              <li>Орфографические ошибки, странное оформление, незнакомый отправитель.</li>
            </ul>
            <p>
              Всегда проверяйте адрес сайта вручную и используйте закладки для часто посещаемых бирж и
              кошельков, а не ссылки из писем и соцсетей.
            </p>

            <h2>Лже-дропы (фейковые airdrop)</h2>
            <p>
              Под видом бесплатной раздачи токенов мошенники просят подключить кошелёк к подозрительному
              сайту и подписать транзакцию, которая на деле даёт доступ к вашим средствам, либо требуют
              заранее заплатить «комиссию за вывод» несуществующих токенов. Настоящие проекты никогда не
              просят оплату за получение airdrop и не требуют разрешения на безлимитный доступ к кошельку.
            </p>

            <h2>P2P-разводы</h2>
            <p>
              На P2P-площадках (прямой обмен криптовалюты на фиат между пользователями) распространены такие
              схемы:
            </p>
            <ul>
              <li><strong>Поддельный платёж</strong> — покупатель присылает фейковый скриншот или PDF
                банковского перевода и просит отправить криптовалюту до зачисления денег.</li>
              <li><strong>Чарджбэк</strong> — после получения криптовалюты покупатель отменяет банковский
                платёж через свой банк, оставляя продавца без денег и без монет.</li>
              <li><strong>Фейковый эскроу</strong> — мошенник предлагает «независимого» посредника-гаранта
                сделки, который на самом деле работает заодно с ним.</li>
            </ul>
            <p>
              Совершайте P2P-сделки только через встроенный эскроу-сервис проверенной платформы и дожидайтесь
              фактического зачисления денег на счёт, а не скриншота об оплате.
            </p>

            <h2>Другие распространённые схемы</h2>
            <ul>
              <li><strong>Фейковая техподдержка</strong> — аккаунты в соцсетях и мессенджерах, выдающие себя
                за поддержку биржи или кошелька, первыми пишут пользователям в комментариях под их же
                жалобами.</li>
              <li><strong>Клонированные приложения</strong> — поддельные версии популярных кошельков в
                магазинах приложений или на сторонних сайтах, которые крадут средства при первом же вводе
                сид-фразы.</li>
              <li><strong>«Гарантированная доходность»</strong> — проекты, обещающие фиксированный высокий
                процент от стейкинга или трейдинга «без рисков», чаще всего оказываются финансовыми
                пирамидами.</li>
              <li><strong>Романтические/инвестиционные разводы (pig butchering)</strong> — долгое
                выстраивание доверительных отношений онлайн с последующим убеждением «инвестировать» на
                поддельной торговой платформе.</li>
            </ul>

            <h2>Чек-лист безопасности</h2>
            <ul>
              <li>Никогда и никому не сообщайте seed-фразу или приватный ключ — ни «поддержке», ни друзьям.</li>
              <li>Всегда проверяйте URL сайта вручную, прежде чем вводить данные.</li>
              <li>Включите двухфакторную аутентификацию (2FA) на всех биржах и кошельках.</li>
              <li>Храните крупные суммы в холодном кошельке, а не на бирже.</li>
              <li>Относитесь с подозрением к «гарантированной» или «безрисковой» доходности.</li>
              <li>Перед инвестицией самостоятельно проверяйте смарт-контракт и адрес проекта в блокчейн-эксплорере.</li>
              <li>Не торопитесь — мошенники почти всегда давят на срочность решения.</li>
            </ul>

            <h2>Куда сообщить о мошенничестве</h2>
            <p>
              Если вы стали жертвой мошенничества, обратитесь в полицию своей страны и в службу поддержки
              биржи или кошелька, через который проходила операция. Если вы хотите предупредить других
              читателей о новой схеме обмана, напишите нам на {CONTACT_EMAIL}.
            </p>
          </>
        ) : (
          <>
            <p>
              Cryptocurrency attracts scammers for a few reasons: transactions are irreversible, many users
              are still new to the space, and the industry remains lightly regulated. Below is a breakdown of
              the most common scams and how to spot them.
            </p>

            <h2>Phishing</h2>
            <p>
              Scammers build fake websites, emails, or messaging-app messages that mimic exchanges, wallets,
              or well-known projects to trick you into revealing a password, a two-factor code, or your seed
              phrase. Warning signs include:
            </p>
            <ul>
              <li>A site URL that differs from the real one by a single letter or character (e.g., "binnance.com").</li>
              <li>Messages that create false urgency: "your account will be locked in one hour."</li>
              <li>Anyone asking you to type in your seed phrase or private key — no legitimate support team
                ever asks for this.</li>
              <li>Spelling mistakes, odd formatting, or an unfamiliar sender.</li>
            </ul>
            <p>
              Always type exchange and wallet URLs manually, or use saved bookmarks — never links from emails
              or social media.
            </p>

            <h2>Fake Airdrops</h2>
            <p>
              Posing as a free token giveaway, scammers ask you to connect your wallet to a malicious site and
              sign a transaction that actually grants access to your funds, or they demand an upfront
              "withdrawal fee" for tokens that don't exist. Legitimate projects never charge a fee to claim an
              airdrop and never need unlimited access to your wallet.
            </p>

            <h2>P2P Scams</h2>
            <p>
              On P2P platforms (direct crypto-for-fiat trades between users), common scams include:
            </p>
            <ul>
              <li><strong>Fake payment proof</strong> — the buyer sends a forged screenshot or PDF of a bank
                transfer and pressures the seller to release crypto before the money actually arrives.</li>
              <li><strong>Chargebacks</strong> — after receiving the crypto, the buyer reverses the bank
                payment through their bank, leaving the seller with neither money nor coins.</li>
              <li><strong>Fake escrow</strong> — a scammer offers an "independent" deal guarantor who is
                actually working with them.</li>
            </ul>
            <p>
              Only trade P2P through a verified platform's built-in escrow, and confirm funds have actually
              landed in your account — not just a screenshot claiming payment was sent.
            </p>

            <h2>Other Common Scams</h2>
            <ul>
              <li><strong>Fake support accounts</strong> — social-media or messaging accounts impersonating an
                exchange's or wallet's support team that reply first to users' public complaints.</li>
              <li><strong>Cloned apps</strong> — fake versions of popular wallets in app stores or on
                third-party sites that steal funds the moment you enter your seed phrase.</li>
              <li><strong>"Guaranteed returns"</strong> — projects promising a fixed, high, "risk-free" yield
                from staking or trading usually turn out to be Ponzi schemes.</li>
              <li><strong>Romance/investment scams (pig butchering)</strong> — a scammer builds a trusting
                online relationship over weeks or months, then convinces the victim to "invest" on a fake
                trading platform.</li>
            </ul>

            <h2>Security Checklist</h2>
            <ul>
              <li>Never share your seed phrase or private key with anyone — not "support," not friends.</li>
              <li>Always type the website URL manually before entering any credentials.</li>
              <li>Enable two-factor authentication (2FA) on every exchange and wallet.</li>
              <li>Keep large amounts in a cold wallet rather than on an exchange.</li>
              <li>Be suspicious of any "guaranteed" or "risk-free" returns.</li>
              <li>Independently verify a project's smart contract and address on a block explorer before investing.</li>
              <li>Slow down — scammers almost always push for urgent decisions.</li>
            </ul>

            <h2>Where to Report a Scam</h2>
            <p>
              If you've been scammed, report it to your local police and to the support team of the exchange
              or wallet involved in the transaction. If you'd like to warn other readers about a new scam,
              email us at {CONTACT_EMAIL}.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
