import Link from 'next/link';

/** Shared with the page so the same wording feeds the FAQPage graph. */
export const CONVERTER_FAQ = {
  en: [
    {
      q: 'How often do the rates update?',
      a: "Every minute, from CoinGecko's volume-weighted aggregate across the major exchanges.",
    },
    {
      q: 'Why does my exchange show a different price?',
      a: 'Because this is a market-wide average and an exchange shows its own order book, minus its own fees and spread. A gap under about 1% is normal.',
    },
    {
      q: 'Can I convert one cryptocurrency into another?',
      a: 'Yes — pick a coin on both sides. The rate is derived through the dollar, which is how exchanges price those pairs too.',
    },
    {
      q: 'Does the converter include fees?',
      a: 'No, deliberately. It shows the clean market rate so you can see exactly what fees cost you when you compare it against a real quote.',
    },
    {
      q: 'Which currencies are supported?',
      a: 'Fifteen cryptocurrencies by market cap and twenty fiat currencies, including the hryvnia, zloty, koruna and lira alongside the majors.',
    },
    {
      q: 'Is the rate good enough to trade on?',
      a: 'Use it to check whether an offer is fair, not as the price you will be filled at. For an executable number, look at a specific venue.',
    },
    {
      q: 'Why is a small transfer proportionally so expensive?',
      a: 'Network fees are charged per transaction, not per amount. On small sums they can outweigh every other cost, which is why one batched cash-out is usually cheaper than several small ones.',
    },
    {
      q: 'Do you store what I convert?',
      a: 'No. The calculation runs in your browser; nothing about the amount or the pair is sent to us or saved.',
    },
  ],
  ru: [
    {
      q: 'Как часто обновляются курсы?',
      a: 'Раз в минуту — из агрегата CoinGecko, взвешенного по объёму торгов на крупнейших биржах.',
    },
    {
      q: 'Почему на моей бирже другая цена?',
      a: 'Потому что здесь среднерыночный курс, а биржа показывает свой стакан за вычетом своей комиссии и спреда. Расхождение до процента — норма.',
    },
    {
      q: 'Можно ли перевести одну криптовалюту в другую?',
      a: 'Да — выберите монету с обеих сторон. Курс считается через доллар, так же его считают и биржи.',
    },
    {
      q: 'Учитывает ли конвертер комиссии?',
      a: 'Нет, и это сделано намеренно. Он показывает чистый рыночный курс, чтобы вы видели, во сколько вам обходятся комиссии при сравнении с реальной котировкой.',
    },
    {
      q: 'Какие валюты поддерживаются?',
      a: 'Пятнадцать криптовалют по капитализации и двадцать фиатных валют — вместе с основными есть гривна, злотый, крона и лира.',
    },
    {
      q: 'Можно ли торговать по этому курсу?',
      a: 'Он годится, чтобы проверить, справедливо ли предложение, но это не та цена, по которой исполнится сделка. За исполняемой ценой идите на конкретную площадку.',
    },
    {
      q: 'Почему мелкий перевод обходится так дорого?',
      a: 'Комиссия сети берётся за транзакцию, а не за сумму. На маленьких суммах она перевешивает все остальные издержки — поэтому один крупный вывод обычно дешевле нескольких мелких.',
    },
    {
      q: 'Вы сохраняете, что я конвертирую?',
      a: 'Нет. Расчёт идёт в браузере: ни сумма, ни пара нам не отправляются и нигде не хранятся.',
    },
  ],
} as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9 first:mt-0">
      <h2 className="text-lg sm:text-xl font-extrabold text-foreground -tracking-[0.02em] mb-3">{title}</h2>
      <div className="flex flex-col gap-3 text-sm sm:text-[15px] text-muted leading-[1.75] max-w-[74ch]">{children}</div>
    </section>
  );
}

function CostTable({ isRu }: { isRu: boolean }) {
  const rows = isRu
    ? [
        ['Спред — разрыв между лучшей покупкой и продажей', '0,05–1%', 'Сам рынок'],
        ['Комиссия за сделку', '0–0,5%', 'Биржа'],
        ['Комиссия сети за перевод монет', 'Фиксированная, в монете', 'Блокчейн'],
        ['Вывод на карту или счёт', '0,5–3%', 'Биржа или банк'],
      ]
    : [
        ['Spread — the gap between the best buy and best sell offer', '0.05–1%', 'The market itself'],
        ['Trading fee', '0–0.5%', 'The exchange'],
        ['Network fee for moving coins on-chain', 'Fixed, in coin', 'The blockchain'],
        ['Withdrawal to a card or bank', '0.5–3%', 'Exchange or bank'],
      ];
  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
      <table className="w-full border-collapse text-[13.5px] min-w-[430px]">
        <thead>
          <tr className="text-[10.5px] font-extrabold uppercase tracking-[0.07em] text-muted">
            <th className="text-left py-2.5 pr-3 border-b border-border font-extrabold">{isRu ? 'Что это' : 'What it is'}</th>
            <th className="text-left py-2.5 pr-3 border-b border-border font-extrabold">{isRu ? 'Сколько' : 'Typical size'}</th>
            <th className="text-left py-2.5 border-b border-border font-extrabold">{isRu ? 'Кто берёт' : 'Who charges it'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row[0]}>
              <td className="py-2.5 pr-3 border-b border-border align-top text-foreground font-semibold">{row[0]}</td>
              <td className="py-2.5 pr-3 border-b border-border align-top tabular-nums">{row[1]}</td>
              <td className="py-2.5 border-b border-border align-top">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ConverterSeo({ locale }: { locale: string }) {
  const isRu = locale === 'ru';
  const rates = `/${locale}/rates`;
  const exchanges = `/${locale}/exchanges`;
  const link = 'text-accent hover:underline';

  if (isRu) {
    return (
      <div>
        <Section title="Как перевести криптовалюту в деньги и обратно">
          <p>
            Конвертер отвечает на один вопрос: <b className="text-foreground">сколько это стоит прямо сейчас?</b> Вы вводите
            сумму, выбираете, что у вас на руках и в чём хотите увидеть результат, — и число пересчитывается по живому
            рыночному курсу. Работает в обе стороны: доллары в биткоин, биткоин в евро и любая из пятнадцати монет в
            любую другую.
          </p>
          <p>
            Курс здесь — <b className="text-foreground">среднерыночный</b>: средневзвешенный по объёму торгов на крупных
            биржах, с обновлением раз в минуту. Это то число, по которому стоит оценивать портфель, выставлять счёт или
            проверять, справедливо ли предложение, которое вам сделали. Но это не то число, которое вы получите при
            реальной сделке — об этом ниже.
          </p>
          <h3 className="text-[15px] font-extrabold text-foreground mt-2">Что охватывает конвертер</h3>
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li><b className="text-foreground">15 криптовалют</b> — биткоин, Ethereum, Tether, BNB, Solana, XRP, USD Coin, Cardano, Dogecoin, Toncoin, TRON, Avalanche, Polkadot, Chainlink и Polygon.</li>
            <li><b className="text-foreground">20 фиатных валют</b> — доллар, евро, фунт, иена, юань, франк и валюты тех стран, где живут наши читатели: гривна, злотый, крона, лира, рупия, реал.</li>
            <li><b className="text-foreground">Крипта в крипту</b> — сколько Ethereum стоит один биткоин, сколько USDT в позиции на Solana.</li>
            <li><b className="text-foreground">Готовые суммы</b> — 0,1, 0,5, 1, 5, 10 и 100 единиц уже посчитаны: именно эти суммы люди и ищут.</li>
          </ul>
        </Section>

        <Section title="Почему цена, которую вы получите, никогда не равна той, что видите">
          <p>
            Это главный источник путаницы, поэтому разберём по частям. Между рыночным курсом сверху и деньгами, которые
            дойдут до вашего счёта, стоят четыре разные издержки.
          </p>
          <CostTable isRu />
          <p>
            На маленькой сумме главную роль играет комиссия сети: отправить биткоина на 40 долларов может обойтись
            дороже, чем на 4 000, потому что комиссия берётся за транзакцию, а не за сумму. На крупной сумме главным
            становится спред. Поэтому одна и та же тысяча превращается то в 985, то в 997 — и поэтому реальные
            котировки P2P и бирж мы публикуем <Link href={rates} className={link}>отдельно от конвертера</Link>.
          </p>
        </Section>

        <Section title="Стейблкоины — мост, через который проходит почти каждый обмен">
          <p>
            Мало кто переводит биткоин прямо на банковский счёт. Обычный маршрут состоит из двух шагов: сначала монета
            меняется на <b className="text-foreground">стейблкоин</b> — токен, привязанный к доллару, вроде USDT или
            USDC, — а уже он продаётся за местную валюту через P2P-сделку или биржу с банковским каналом.
          </p>
          <p>
            Для расчётов это важно. Стейблкоин задуман стоять ровно на одном долларе, но цена, по которой его реально
            купят у вас, гуляет вслед за местным спросом: там, где есть валютные ограничения, он торгуется выше
            доллара, на спокойных рынках — чуть ниже. Перевод биткоина в USDT, а затем в евро — это две конвертации,
            и у каждой свой спред. Проверьте вторую до того, как соглашаться на первую.
          </p>
        </Section>

        <Section title="Откуда берутся наши курсы">
          <p>
            Цены приходят от <b className="text-foreground">CoinGecko</b>, который агрегирует данные сотен бирж и
            взвешивает их по объёму торгов; обновление — раз в минуту. Курсы фиатных валют выводятся из того же
            источника, поэтому цифра в гривнах и цифра в долларах для одной монеты всегда взяты из одного среза и
            никогда не расходятся на устаревшую минуту.
          </p>
          <p>Три ограничения, о которых стоит знать:</p>
          <ol className="list-decimal pl-5 flex flex-col gap-1.5">
            <li>Курс — это <b className="text-foreground">среднее</b>. Ни одна биржа не показывает ровно это число ровно в эту секунду.</li>
            <li>Тонкий рынок его сдвигает. У монеты с малым объёмом крупная сделка на одной площадке способна качнуть среднее на несколько минут.</li>
            <li>На выходных фиат отстаёт. Валютные рынки закрываются, крипта — нет. За выходные фиатная часть экзотической пары может устареть на пару дней, хотя крипто-часть свежая.</li>
          </ol>
        </Section>

        <Section title="Как пользоваться конвертером">
          <ul className="list-disc pl-5 flex flex-col gap-1.5">
            <li><b className="text-foreground">Оценить актив:</b> введите количество монет и переключите вывод в свою валюту — это стоимость позиции по рынку.</li>
            <li><b className="text-foreground">Выставить счёт:</b> введите сумму в валюте, посмотрите число в крипте — и добавьте запас. Пока клиент оплатит, курс уйдёт.</li>
            <li><b className="text-foreground">Проверить предложение:</b> если P2P-продавец называет курс, отличающийся от здешнего больше чем на пару процентов, спросите почему, прежде чем соглашаться.</li>
            <li><b className="text-foreground">Спланировать вывод:</b> посчитайте здесь рыночную стоимость, а затем сравните её с живыми котировками на <Link href={rates} className={link}>странице курсов</Link> и в разделе <Link href={exchanges} className={link}>криптобирж</Link> — разница и есть цена спреда.</li>
          </ul>
        </Section>

        <Section title="Про налоги">
          <p>
            В большинстве юрисдикций обмен одной криптовалюты на другую — <b className="text-foreground">налогооблагаемое
            событие</b>, а не нейтральный перевод: меняя биткоин на Ethereum, вы фиксируете прибыль или убыток, даже
            если банк в сделке не участвовал. Обмен крипты на фиат — почти всегда. Конвертер показывает рыночную
            стоимость, он не считает налог, и ничто здесь не является налоговой консультацией. Записывайте курс и время
            каждой конвертации: именно этого потребует налоговая.
          </p>
        </Section>
      </div>
    );
  }

  return (
    <div>
      <Section title="How to convert crypto to fiat — and back">
        <p>
          A converter answers one question: <b className="text-foreground">what is this amount worth right now?</b> Type
          in an amount, pick what you are holding and what you want to see it in, and the number updates against the
          live market price. It works both ways — dollars into Bitcoin, Bitcoin into euros, and any of the fifteen
          coins into each other.
        </p>
        <p>
          The rate here is the <b className="text-foreground">global market rate</b>: a volume-weighted average across
          the major exchanges, refreshed every minute. It is the number to use when valuing a portfolio, pricing an
          invoice, or checking whether an offer you have been given is fair. It is not the number you will get when you
          actually trade — more on that below.
        </p>
        <h3 className="text-[15px] font-extrabold text-foreground mt-2">What the converter covers</h3>
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li><b className="text-foreground">15 cryptocurrencies</b> — Bitcoin, Ethereum, Tether, BNB, Solana, XRP, USD Coin, Cardano, Dogecoin, Toncoin, TRON, Avalanche, Polkadot, Chainlink and Polygon.</li>
          <li><b className="text-foreground">20 fiat currencies</b> — dollar, euro, pound, yen, yuan, franc, and the currencies of the markets our readers actually live in: hryvnia, zloty, koruna, lira, rupee, real.</li>
          <li><b className="text-foreground">Crypto to crypto</b> — how much Ethereum one Bitcoin buys, how much USDT a Solana position is worth.</li>
          <li><b className="text-foreground">Ready-made amounts</b> — 0.1, 0.5, 1, 5, 10 and 100 units, precomputed, because those are the amounts people actually look up.</li>
        </ul>
      </Section>

      <Section title="Why the price you get is never the price you see">
        <p>
          This is the most common source of confusion, so it is worth being precise. Between the market rate above and
          the money that lands in your account sit four separate costs.
        </p>
        <CostTable isRu={false} />
        <p>
          On a small amount the network fee dominates: sending $40 of Bitcoin can cost more in fees than sending
          $4,000, because the fee is charged per transaction, not per dollar. On a large amount the spread dominates.
          That is why the same $1,000 comes out as $985 on one venue and $997 on another — and why we publish live P2P
          and exchange quotes <Link href={rates} className={link}>separately from this converter</Link>.
        </p>
      </Section>

      <Section title="Stablecoins: the bridge most conversions actually cross">
        <p>
          Very few people move Bitcoin straight into a bank account. The usual route takes two steps: sell the coin for
          a <b className="text-foreground">stablecoin</b> — a token pegged to the dollar, such as USDT or USDC — and
          then sell the stablecoin for local currency through a P2P deal or an exchange with a bank connection.
        </p>
        <p>
          That matters for your arithmetic. A stablecoin is designed to sit at $1.00, but the price at which someone
          will actually buy it from you drifts with local demand: where capital controls exist it trades above the
          dollar, in quiet markets slightly below. Converting $1,000 of Bitcoin into USDT and then into euros is two
          conversions, each with its own spread — so check the second one before you commit to the first.
        </p>
      </Section>

      <Section title="How our rates are sourced">
        <p>
          Prices come from <b className="text-foreground">CoinGecko</b>, which aggregates across hundreds of exchanges
          and weights by traded volume, refreshed once a minute. Fiat cross-rates are derived from the same feed, so a
          hryvnia figure and a dollar figure for the same coin always come from one snapshot — they never drift apart
          by a stale minute.
        </p>
        <p>Three limits worth knowing:</p>
        <ol className="list-decimal pl-5 flex flex-col gap-1.5">
          <li>The rate is an <b className="text-foreground">average</b>. No single exchange prints exactly this number at exactly this second.</li>
          <li>Thin markets move it. For a low-volume coin, one large trade on one venue can shift the global average for a few minutes.</li>
          <li>Weekend fiat rates lag. Currency markets close; crypto does not. Over a weekend the fiat leg of an exotic pair can be two days old even though the crypto leg is current.</li>
        </ol>
      </Section>

      <Section title="Using the converter well">
        <ul className="list-disc pl-5 flex flex-col gap-1.5">
          <li><b className="text-foreground">Value a holding:</b> enter the number of coins and switch the output to your own currency. That is your position at market.</li>
          <li><b className="text-foreground">Price an invoice:</b> enter the fiat amount, read the crypto figure, then add a buffer. By the time the client pays, the number will have moved.</li>
          <li><b className="text-foreground">Sanity-check an offer:</b> if a P2P seller quotes a rate more than about 2% off the number here, ask why before accepting.</li>
          <li><b className="text-foreground">Plan a cash-out:</b> convert here for market value, then compare against real quotes on our <Link href={rates} className={link}>rates page</Link> and the venues in our <Link href={exchanges} className={link}>exchange ranking</Link> — the gap is what the spread costs you.</li>
        </ul>
      </Section>

      <Section title="A note on tax">
        <p>
          In most jurisdictions converting one crypto into another is a <b className="text-foreground">taxable event</b>,
          not a neutral transfer — swapping Bitcoin for Ethereum realises a gain or a loss even though no bank was
          involved. Converting crypto into fiat almost always is. This converter shows market value; it does not
          calculate what you owe, and nothing here is tax advice. Record the rate and the timestamp at each conversion —
          that record is what a tax authority will ask for.
        </p>
      </Section>
    </div>
  );
}
