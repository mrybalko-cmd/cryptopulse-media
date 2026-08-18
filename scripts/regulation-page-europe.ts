/**
 * Germany, Portugal and Switzerland — the remaining three of the first five.
 *
 * Grouped in one script because they answer the same question in three ways:
 * Germany forgives you after a year, Portugal after 365 days, Switzerland never
 * taxes the gain at all but taxes the holding every year. Written separately in
 * each language; checked on 18 August 2026.
 *
 * Where a rule is about to change it is stated as pending rather than folded
 * into the present tense — Germany's one-year exemption is the live example.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split('\n')
    .filter(l => l.includes('=') && !l.trim().startsWith('#'))
    .map(l => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
    })
);

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

interface Side {
  intro: string; figures: string; body: string; allowed: string; restricted: string;
  timeline: string; faq: string; sources: string; related: string;
  seoTitle: string; seoDescription: string;
}

const COUNTRIES: { iso2: string; ru: Side; en: Side }[] = [
  /* ═══════════════════════ Germany ═══════════════════════ */
  {
    iso2: 'DE',
    ru: {
      intro:
        'Криптовалюта в Германии легальна, а правило, ради которого сюда смотрят, простое: продержали актив больше года — продажа не облагается вовсе, независимо от прибыли. ' +
        'Продали раньше — платите подоходный налог по своей ставке, вплоть до 45%. Надзор ведёт BaFin, а с 2026 года над ним стоит единый европейский режим MiCA.',
      figures: [
        'ДЕРЖАТЬ ОТ ГОДА | 0% | продажа не облагается вовсе | ok',
        'ПРОДАТЬ РАНЬШЕ | до 45% | по вашей ставке подоходного | warn',
        'ПОРОГ ЧАСТНЫХ СДЕЛОК | 1000 € | в год, с 2024 года | ok',
        'СТЕЙКИНГ И МАЙНИНГ | Облагается | как доход в момент получения | warn',
        'ЛИЦЕНЗИЯ | CASP по MiCA | выдаёт BaFin, действует по всему ЕС',
        'ЛЬГОТА ПОД УГРОЗОЙ | с 2027 | правительство готовит отмену | warn',
      ].join('\n'),
      body: `## Кто и как регулирует крипту в Германии

Надзор ведёт BaFin — федеральное управление финансового надзора. Германия оказалась среди первых стран, которые дали криптовалюте внятный правовой статус: ещё в 2013 году министерство финансов признало биткоин расчётной единицей, «частными деньгами». Тогда это выглядело академическим уточнением, а на деле избавило рынок от многолетнего спора о том, чем он вообще торгует.

С 2026 года поверх национальных правил работает MiCA — единый режим Евросоюза. Он изменил не столько содержание требований, сколько географию: лицензия поставщика услуг с криптоактивами, выданная в одной стране союза, действует во всех остальных. Немецкая площадка получает лицензию у BaFin и может обслуживать клиентов от Португалии до Эстонии, не собирая разрешения по отдельности.

Оборотная сторона паспортизации в том, что и требования стали общими. Часть площадок, которые прежде работали в Европе без местной лицензии, из региона ушла — проще уйти, чем соответствовать.

## Налоги: год владения решает всё

Криптовалюта в Германии считается «прочим экономическим благом», а сделки с ней — частными сделками отчуждения по §23 закона о подоходном налоге. Из этой квалификации следует главное правило: если между покупкой и продажей прошло больше года, прибыль не облагается ничем. Не пониженной ставкой, а нулём, и без верхнего предела суммы.

Если продали раньше — прибыль попадает в общий доход и облагается по вашей личной прогрессивной ставке, доходящей до 45%, плюс солидарный сбор и, если вы его платите, церковный налог.

Есть необлагаемый порог: 1000 евро в год на все частные сделки отчуждения, поднятый с прежних 600 в 2024 году. Важная деталь, на которой люди попадаются: это не вычет, а именно порог. Уложились в 1000 — не платите ничего. Превысили хотя бы на евро — облагается вся прибыль целиком, а не разница.

Стейкинг, майнинг и доход от кредитования устроены иначе: полученные монеты считаются доходом в момент получения и оцениваются по рыночному курсу того дня. Годовое правило к ним применяется потом, уже к приросту стоимости этих монет.

### Что может измениться

Правило года — не закон природы, и правительство обсуждает его отмену. В апреле министр финансов Ларс Клингбайль заявил, что криптовалюту предполагается облагать иначе, а бюджет рассчитывает получить от этого около двух миллиардов евро дополнительных доходов. Наиболее вероятная мишень — как раз годовая льгота, наиболее вероятный срок — 2027 год.

На сегодняшний день льгота действует в полном объёме. Но человеку, который выбирает Германию именно из-за неё, стоит держать в голове, что она обсуждается.`,
      allowed: [
        'Продать после года владения без налога и без лимита суммы',
        'Покупать и хранить криптоактивы, в том числе через немецкие банки',
        'Пользоваться любой площадкой с лицензией MiCA из любой страны ЕС',
        'Майнить и получать стейкинг-вознаграждения, задекларировав их',
      ].join('\n'),
      restricted: [
        'Услуги без лицензии CASP — с 2026 года по всему ЕС',
        'Порог 1000 € — превысили, облагается вся прибыль, а не разница',
        'Стейкинг и майнинг не подпадают под годовую льготу в момент получения',
        'Льгота года обсуждается к отмене с 2027 года',
      ].join('\n'),
      timeline: [
        '2013 | Министерство финансов признаёт биткоин расчётной единицей — «частными деньгами». Германия одной из первых даёт крипте правовой статус.',
        '2020 | Банкам разрешают хранить криптоактивы клиентов по отдельной лицензии BaFin.',
        '2021 | Спецфондам разрешают держать в криптоактивах до 20% портфеля — институциональные деньги получают легальную дверь.',
        '* 2022 | Письмо министерства финансов закрепляет: год владения работает и для монет, которые были в стейкинге. Прежняя идея о десятилетнем сроке снята.',
        '2024 | Необлагаемый порог частных сделок поднят с 600 до 1000 евро.',
        '2026 | MiCA действует в полном объёме: лицензия одной страны ЕС годится во всех.',
      ].join('\n'),
      faq: [
        'Сколько нужно держать криптовалюту, чтобы не платить налог? | Больше года. После этого прибыль от продажи не облагается вовсе, независимо от суммы.',
        'Что будет, если прибыль составила 1001 евро? | Облагается вся тысяча с лишним, а не один евро сверх порога. Это порог, а не вычет — на этом чаще всего и попадаются.',
        'Облагается ли стейкинг? | Да. Полученные монеты считаются доходом в день получения по рыночному курсу. Годовое правило начинает отсчитываться с этого момента и применяется уже к их дальнейшему подорожанию.',
        'Правда ли, что льготу отменят? | Она обсуждается. В апреле министр финансов заявил о намерении облагать криптовалюту иначе, вероятный срок — 2027 год. Сейчас льгота действует.',
        'Нужна ли немецкой бирже отдельная лицензия для клиентов из других стран ЕС? | Нет. С 2026 года лицензия CASP, выданная BaFin, действует во всём союзе.',
      ].join('\n'),
      sources: [
        'BaFin — федеральное управление финансового надзора | https://www.bafin.de/',
        'Министерство финансов Германии | https://www.bundesfinanzministerium.de/',
        'ESMA — европейский регулятор рынков и MiCA | https://www.esma.europa.eu/',
      ].join('\n'),
      related: [
        'avstriya-oshtrafovala-bitpanda-pervoe-nakazanie-mica',
        'kraken-mexc-niderlandy-klienty-mica',
        'mica-genius-act-transgranichnaya-koordinaciya',
      ].join('\n'),
      seoTitle: 'Криптовалюта в Германии: регулирование, налоги и лицензии',
      seoDescription:
        'Год владения — и продажа не облагается. Как считаются налоги на крипту в Германии, что даёт порог 1000 евро, кто выдаёт лицензии и почему льготу могут отменить.',
    },
    en: {
      intro:
        'Crypto is legal in Germany, and the rule people come here for is simple: hold an asset for more than a year and the sale is not taxed at all, whatever the gain. ' +
        'Sell sooner and it is income, taxed at your personal rate of up to 45%. BaFin supervises, and since 2026 the EU-wide MiCA regime sits above it.',
      figures: [
        'HELD OVER A YEAR | 0% | the sale is not taxed at all | ok',
        'SOLD SOONER | up to 45% | at your personal income rate | warn',
        'PRIVATE SALES THRESHOLD | €1,000 | per year, since 2024 | ok',
        'STAKING AND MINING | Taxable | as income when received | warn',
        'LICENCE | MiCA CASP | issued by BaFin, valid EU-wide',
        'EXEMPTION AT RISK | from 2027 | the government plans to end it | warn',
      ].join('\n'),
      body: `## Who regulates crypto in Germany

Supervision sits with BaFin, the federal financial supervisory authority. Germany was among the first countries to give crypto a workable legal status: back in 2013 the finance ministry classified bitcoin as a unit of account — private money. It looked like an academic footnote at the time; in practice it spared the market years of argument about what was even being traded.

Since 2026 the EU's MiCA regime has applied on top of national rules. It changed the geography more than the substance: a crypto-asset service provider licence granted in one member state is valid in all of them. A German venue licensed by BaFin can serve customers from Portugal to Estonia without collecting permissions one by one.

The flip side of passporting is that the requirements became common too. Several venues that had been operating in Europe without local authorisation left the region rather than comply.

## Tax: the holding year decides everything

German law treats crypto as "other economic goods", and disposals as private sale transactions under §23 of the income tax act. The headline consequence follows from that classification: if more than a year passed between purchase and sale, the gain is not taxed. Not at a reduced rate — at zero, with no ceiling on the amount.

Sell sooner and the profit joins your ordinary income, taxed at your personal progressive rate up to 45%, plus the solidarity surcharge and, if it applies to you, church tax.

There is an exempt threshold: €1,000 a year across all private disposals, raised from €600 in 2024. One detail catches people out. It is a threshold, not an allowance. Stay under €1,000 and you pay nothing; go a single euro over and the entire gain becomes taxable, not just the excess.

Staking, mining and lending work differently. Coins received count as income on the day they arrive, valued at that day's market price. The one-year rule then starts running for those coins and applies to any subsequent appreciation.

### What may change

The one-year rule is not a law of nature, and the government is discussing its removal. In April the finance minister, Lars Klingbeil, said crypto should be taxed differently, with the budget counting on roughly €2 billion in additional revenue. The likeliest target is the holding-period exemption itself and the likeliest date is 2027.

For now the exemption stands in full. But anyone choosing Germany specifically for it should know it is under discussion.`,
      allowed: [
        'Sell tax-free after a year, with no cap on the amount',
        'Buy and hold crypto, including through German banks',
        'Use any MiCA-licensed venue from any EU country',
        'Mine and earn staking rewards, declaring them as income',
      ].join('\n'),
      restricted: [
        'Operating without a CASP licence — EU-wide since 2026',
        'The €1,000 threshold: exceed it and the whole gain is taxed',
        'Staking and mining rewards do not get the holding exemption on receipt',
        'The one-year exemption is under review for removal from 2027',
      ].join('\n'),
      timeline: [
        '2013 | The finance ministry classifies bitcoin as a unit of account — private money. Germany becomes one of the first countries to give crypto a legal status.',
        '2020 | Banks are permitted to hold client crypto assets under a dedicated BaFin licence.',
        '2021 | Special funds may allocate up to 20% of a portfolio to crypto, opening a legal door for institutional money.',
        '* 2022 | A finance ministry letter confirms the one-year rule applies to staked coins too, dropping an earlier proposal for a ten-year period.',
        '2024 | The private-disposal threshold rises from €600 to €1,000.',
        '2026 | MiCA applies in full: a licence from one member state works across the union.',
      ].join('\n'),
      faq: [
        'How long must I hold crypto to pay no tax? | More than a year. After that the gain on sale is untaxed regardless of size.',
        'What happens if my gain is €1,001? | The whole amount is taxable, not the single euro above the line. It is a threshold, not an allowance — this is the most common mistake.',
        'Is staking taxed? | Yes. Coins received are income on the day they arrive, at that day\'s market price. The one-year clock then starts for those coins and covers their later appreciation.',
        'Will the exemption really be abolished? | It is under discussion. In April the finance minister said crypto should be taxed differently, with 2027 the likely date. For now the exemption applies.',
        'Does a German exchange need extra licences for clients elsewhere in the EU? | No. Since 2026 a CASP licence from BaFin is valid across the union.',
      ].join('\n'),
      sources: [
        'BaFin — Federal Financial Supervisory Authority | https://www.bafin.de/',
        'German Federal Ministry of Finance | https://www.bundesfinanzministerium.de/',
        'ESMA — the EU markets regulator and MiCA | https://www.esma.europa.eu/',
      ].join('\n'),
      related: [
        'austria-fines-bitpanda-first-mica-penalty',
        'kraken-mexc-netherlands-clients-mica',
        'mica-genius-act-crypto-cross-border-coordination',
      ].join('\n'),
      seoTitle: 'Cryptocurrency in Germany: regulation, taxes and licensing',
      seoDescription:
        'Hold for a year and the sale is untaxed. How German crypto tax works, what the €1,000 threshold really means, who issues licences, and why the exemption may end.',
    },
  },

  /* ═══════════════════════ Portugal ═══════════════════════ */
  {
    iso2: 'PT',
    ru: {
      intro:
        'Криптовалюта в Португалии легальна, но репутация страны отстала от реальности. Нулевого налога, которым она славилась до 2023 года, больше нет: продажа раньше 365 дней облагается по фиксированной ставке 28%. ' +
        'Держали дольше — освобождение сохраняется. Рынок регулирует CMVM вместе с Банком Португалии, лицензии выдаются по единому европейскому режиму MiCA.',
      figures: [
        'ДЕРЖАТЬ ОТ 365 ДНЕЙ | 0% | продажа не облагается | ok',
        'ПРОДАТЬ РАНЬШЕ | 28% | фиксированная ставка | warn',
        'СТЕЙКИНГ И ЛЕНДИНГ | 28% | пассивный доход, категория E',
        'ПРОФЕССИОНАЛЬНАЯ ТОРГОВЛЯ | 14,5–53% | прогрессивная шкала | warn',
        'РЕГУЛЯТОР | CMVM | и Банк Португалии по отмыванию',
        'ЛИЦЕНЗИЯ | CASP по MiCA | действует по всему ЕС',
      ].join('\n'),
      body: `## Кто и как регулирует крипту в Португалии

Регуляторов два, и они делят задачи. Комиссия по рынку ценных бумаг CMVM отвечает за сами рынки и за токены, похожие на финансовые инструменты. Банк Португалии ведёт надзор в части противодействия отмыванию — до появления общеевропейских правил именно он вёл реестр местных криптокомпаний.

С 2026 года над обоими работает MiCA. Лицензия поставщика услуг с криптоактивами, выданная в Португалии, действует во всём Евросоюзе, и наоборот: португальский пользователь может законно обслуживаться у площадки, лицензированной в Ирландии или Германии.

Отдельного «криптозакона» в стране нет, и это стоит понимать правильно. Отсутствие специального регулирования долго читали как отсутствие правил — на деле оно означало лишь то, что действуют общие.

## Налоги: почему Португалия перестала быть налоговым раем

До 2023 года налоговая служба исходила из того, что доход от криптовалюты не подпадает ни под одну из существующих категорий, а значит не облагается. Это и создало репутацию, за которой сюда ехали.

Бюджет на 2023 год закрыл вопрос, введя полноценный режим. Теперь всё зависит от срока владения и от характера деятельности.

Если вы частный инвестор и продали актив, которым владели **меньше 365 дней**, прибыль облагается по фиксированной ставке 28%. Продали позже — освобождение, налога нет.

У освобождения есть исключения, о которых редко пишут. Оно не распространяется на токены, которые по своим признакам являются финансовыми инструментами: такие бумаги облагаются как ценные бумаги независимо от срока. Не действует оно и тогда, когда контрагент или поставщик кошелька находится в юрисдикции из португальского «чёрного списка».

Пассивный доход — стейкинг, кредитование, вознаграждения за предоставление ликвидности — попадает в категорию E и облагается по той же ставке 28%, но уже без всякой связи со сроком владения.

Отдельная история — профессиональная деятельность. Если торговля ведётся регулярно и организованно, если у вас майнинговая ферма или вы занимаетесь маркет-мейкингом, доход считается предпринимательским и попадает в категорию B с прогрессивной шкалой от 14,5% до 53%. Границу между инвестором и профессионалом определяет не число сделок, а характер и организованность деятельности.`,
      allowed: [
        'Продать после 365 дней владения без налога',
        'Держать и переводить криптоактивы без ограничений',
        'Пользоваться любой площадкой с лицензией MiCA в ЕС',
        'Принимать оплату криптой, отразив её в доходе',
      ].join('\n'),
      restricted: [
        'Продажа раньше 365 дней — фиксированные 28%',
        'Освобождение не действует для токенов с признаками ценных бумаг',
        'Освобождение не действует при контрагенте из «чёрного списка»',
        'Регулярная торговля переводит доход в категорию B со ставкой до 53%',
      ].join('\n'),
      timeline: [
        'до 2023 | Налоговая исходит из того, что доход от крипты не подпадает ни под одну категорию. Страна получает репутацию налогового рая.',
        '* Январь 2023 | Бюджет вводит режим: 28% при владении меньше 365 дней, освобождение после. Репутация перестаёт соответствовать реальности.',
        '2023 | Пассивный доход выделен в категорию E, профессиональная деятельность — в категорию B.',
        '2024 | Банк Португалии продолжает вести надзор по отмыванию до перехода на общеевропейские правила.',
        '2026 | MiCA действует в полном объёме, лицензия становится единой для всего союза.',
      ].join('\n'),
      faq: [
        'Правда ли, что в Португалии нет налога на криптовалюту? | Уже нет. До 2023 года дохода действительно не касались, но бюджет на 2023-й ввёл режим: 28% при владении меньше 365 дней и освобождение после.',
        'Как считается срок владения? | От даты приобретения до даты продажи. Ровно 365 дней — граница: раньше облагается, позже нет.',
        'Облагается ли стейкинг? | Да, по ставке 28% как пассивный доход категории E. Срок владения на него не влияет.',
        'Когда инвестор становится предпринимателем? | Когда деятельность ведётся регулярно и организованно — постоянная дневная торговля, майнинговая ферма, маркет-мейкинг. Тогда доход попадает в категорию B со ставкой от 14,5% до 53%.',
        'На какие токены освобождение не распространяется? | На те, что по признакам являются финансовыми инструментами, и на сделки, где контрагент или кошельковый сервис находится в юрисдикции из «чёрного списка».',
      ].join('\n'),
      sources: [
        'CMVM — комиссия по рынку ценных бумаг Португалии | https://www.cmvm.pt/',
        'Банк Португалии | https://www.bportugal.pt/',
        'Налоговая служба Португалии | https://info.portaldasfinancas.gov.pt/',
      ].join('\n'),
      related: [
        'kraken-mexc-niderlandy-klienty-mica',
        'mica-genius-act-transgranichnaya-koordinaciya',
      ].join('\n'),
      seoTitle: 'Криптовалюта в Португалии: регулирование, налоги и лицензии',
      seoDescription:
        'Нулевого налога больше нет: 28% при продаже раньше 365 дней и освобождение после. Как Португалия облагает криптовалюту, что попадает в категории E и B, кто регулирует рынок.',
    },
    en: {
      intro:
        'Crypto is legal in Portugal, but the country\'s reputation has outlived the facts. The zero-tax regime it was famous for ended in 2023: selling within 365 days now attracts a flat 28%. ' +
        'Hold longer and the gain is exempt. The market is supervised by the CMVM alongside the Bank of Portugal, with licensing under the EU-wide MiCA regime.',
      figures: [
        'HELD 365 DAYS OR MORE | 0% | the sale is exempt | ok',
        'SOLD SOONER | 28% | flat rate | warn',
        'STAKING AND LENDING | 28% | passive income, category E',
        'PROFESSIONAL TRADING | 14.5–53% | progressive scale | warn',
        'REGULATOR | CMVM | with the Bank of Portugal on AML',
        'LICENCE | MiCA CASP | valid across the EU',
      ].join('\n'),
      body: `## Who regulates crypto in Portugal

There are two regulators and they split the work. The securities commission, CMVM, handles markets and tokens that behave like financial instruments. The Bank of Portugal supervises anti-money-laundering — before the EU-wide rules arrived it was the body that kept the register of local crypto firms.

Since 2026 MiCA sits above both. A crypto-asset service provider licensed in Portugal may operate anywhere in the union, and the reverse holds: a Portuguese user can lawfully be served by a venue licensed in Ireland or Germany.

Portugal has no dedicated "crypto law", and that is worth reading correctly. The absence of special regulation was long taken to mean an absence of rules; what it actually meant was that the general ones applied.

## Tax: why Portugal stopped being a haven

Until 2023 the tax authority took the view that crypto income fell into none of the existing categories, and therefore was not taxed. That is the reputation people moved here for.

The 2023 budget settled the question by introducing a proper regime. Everything now turns on how long you held and how you were operating.

A private investor who sells an asset held for **less than 365 days** pays a flat 28% on the gain. Sell after that and it is exempt.

The exemption has exceptions that get little coverage. It does not reach tokens that qualify as financial instruments — those are taxed as securities regardless of holding period. Nor does it apply where the counterparty or wallet provider sits in a jurisdiction on Portugal's blacklist.

Passive income — staking, lending, liquidity rewards — falls into category E and is taxed at the same 28%, but with no holding-period relief at all.

Professional activity is its own case. Where trading is regular and organised, or where you run a mining operation or make markets, the profit is business income in category B on a progressive scale from 14.5% to 53%. The line between investor and professional is drawn by the character and organisation of the activity, not by a transaction count.`,
      allowed: [
        'Sell tax-free after 365 days of holding',
        'Hold and transfer crypto without restriction',
        'Use any MiCA-licensed venue in the EU',
        'Accept crypto in payment, declaring it as income',
      ].join('\n'),
      restricted: [
        'Selling within 365 days — a flat 28%',
        'The exemption misses tokens that qualify as financial instruments',
        'The exemption misses trades with blacklisted-jurisdiction counterparties',
        'Regular trading moves income to category B at up to 53%',
      ].join('\n'),
      timeline: [
        'before 2023 | The tax authority holds that crypto income fits none of the existing categories. The country acquires its tax-haven reputation.',
        '* January 2023 | The budget introduces a regime: 28% under 365 days, exempt after. The reputation stops matching reality.',
        '2023 | Passive income is placed in category E and professional activity in category B.',
        '2024 | The Bank of Portugal continues AML supervision ahead of the switch to EU-wide rules.',
        '2026 | MiCA applies in full and licensing becomes union-wide.',
      ].join('\n'),
      faq: [
        'Is crypto really untaxed in Portugal? | Not any more. Until 2023 gains were genuinely untouched, but the 2023 budget introduced 28% for holdings under 365 days, with an exemption after that.',
        'How is the holding period counted? | From acquisition to disposal. 365 days is the line: sell before and it is taxed, sell after and it is not.',
        'Is staking taxed? | Yes, at 28% as passive income in category E. Holding period makes no difference to it.',
        'When does an investor become a business? | When the activity is regular and organised — constant day trading, a mining operation, market making. The income then falls into category B at 14.5% to 53%.',
        'Which tokens miss the exemption? | Those that qualify as financial instruments, and trades where the counterparty or wallet service sits in a blacklisted jurisdiction.',
      ].join('\n'),
      sources: [
        'CMVM — Portuguese Securities Market Commission | https://www.cmvm.pt/',
        'Banco de Portugal | https://www.bportugal.pt/',
        'Portuguese Tax and Customs Authority | https://info.portaldasfinancas.gov.pt/',
      ].join('\n'),
      related: [
        'kraken-mexc-netherlands-clients-mica',
        'mica-genius-act-crypto-cross-border-coordination',
      ].join('\n'),
      seoTitle: 'Cryptocurrency in Portugal: regulation, taxes and licensing',
      seoDescription:
        'The zero-tax era is over: 28% under 365 days, exempt after. How Portugal taxes crypto, what falls into categories E and B, and who supervises the market.',
    },
  },

  /* ═══════════════════════ Switzerland ═══════════════════════ */
  {
    iso2: 'CH',
    ru: {
      intro:
        'Криптовалюта в Швейцарии легальна и встроена в финансовое право глубже, чем почти где-либо: с 2021 года действует закон о технологиях распределённого реестра, надзор ведёт FINMA. ' +
        'Частный инвестор не платит налога на прирост капитала — но платит ежегодный налог на имущество со всего, что держит, и ставку определяет его кантон.',
      figures: [
        'ПРИРОСТ У ЧАСТНОГО ЛИЦА | 0% | продажа не облагается | ok',
        'НАЛОГ НА ИМУЩЕСТВО | 0,3–1% | ежегодно, ставка кантональная | warn',
        'СТЕЙКИНГ И МАЙНИНГ | Облагается | как доход в момент получения | warn',
        'ПРОФЕССИОНАЛЬНЫЙ ТРЕЙДЕР | Подоходный | критерии в Циркуляре 36 | warn',
        'КАНТОНОВ СО СВОЕЙ СТАВКОЙ | 26 | налог считают на месте',
        'РЕГУЛЯТОР | FINMA | закон о DLT действует с 2021 года',
      ].join('\n'),
      body: `## Кто и как регулирует крипту в Швейцарии

Швейцария не входит в Евросоюз, поэтому MiCA на неё не распространяется — у страны свой режим, и он старше европейского. Надзор ведёт FINMA, а с 2018 года действует её классификация токенов: платёжные, служебные и токены активов. Разделение оказалось удачным настолько, что его повторяли другие юрисдикции.

В 2021 году вступил в силу закон об адаптации федерального права к технологиям распределённого реестра. Он ввёл в гражданское право регистровые ценные бумаги — то есть права, которые существуют в блокчейне и передаются вместе с записью, а не бумагой, — и создал отдельный вид лицензии для торговых площадок на DLT.

Цена самостоятельности в том, что швейцарская лицензия не даёт доступа к европейскому рынку. Площадка, желающая обслуживать клиентов из ЕС, получает лицензию по MiCA отдельно.

Криптодолина в кантоне Цуг выросла не из закона, а из практики: местные власти начали принимать биткоин за государственные услуги ещё в 2016 году, а позже разрешили платить в биткоине и эфире налоги на сумму до ста тысяч франков.

## Налоги: прирост не облагается, а владение — да

Швейцарская логика непривычна для тех, кто приезжает из стран с налогом на прирост капитала. Здесь его для частных лиц просто нет: продали дороже, чем купили, — прибыль ваша целиком.

Но есть налог, которого нет в большинстве стран: ежегодный налог на имущество. Криптоактивы декларируются по курсу на 31 декабря и складываются со всем остальным — недвижимостью, счетами, ценными бумагами. Ставка кантональная и обычно укладывается в диапазон от 0,3% до 1% совокупного имущества.

Кантонов 26, и разница между ними существенная — именно поэтому в Швейцарии выбирают не страну, а кантон.

### Где заканчивается частный инвестор

Освобождение прироста от налога действует, пока вы остаётесь частным инвестором. Как только налоговая сочтёт вашу деятельность профессиональной, прибыль превращается в доход и облагается подоходным налогом, а сверху добавляются социальные взносы.

Границу описывает Циркуляр 36 федеральной налоговой администрации: пять критериев «безопасной гавани», выполнив которые вы точно остаётесь частным лицом. Среди них — владение активом не меньше полугода, отсутствие заёмного финансирования сделок и доля прибыли от торговли меньше половины чистого дохода. Не уложились в критерии — вопрос решается по совокупности обстоятельств, а не автоматически против вас.

Стейкинг, майнинг и вознаграждение, полученное криптовалютой за работу, к приросту капитала отношения не имеют: это доход в момент получения, по рыночному курсу того дня.`,
      allowed: [
        'Продать дороже, чем купили, — прирост у частного лица не облагается',
        'Держать криптоактивы, задекларировав их по курсу на 31 декабря',
        'Платить в Цуге налоги в биткоине и эфире на сумму до 100 000 франков',
        'Вести криптобизнес по лицензии FINMA, включая площадку на DLT',
      ].join('\n'),
      restricted: [
        'Ежегодный налог на имущество — платится, даже если вы ничего не продавали',
        'Профессиональная торговля: прибыль облагается подоходным налогом и взносами',
        'Швейцарская лицензия не даёт доступа к рынку ЕС — MiCA получают отдельно',
        'Стейкинг и майнинг облагаются как доход в момент получения',
      ].join('\n'),
      timeline: [
        '* 2016 | Цуг первым в мире начинает принимать биткоин в оплату государственных услуг. С этого вырастает Криптодолина.',
        '2018 | FINMA публикует классификацию токенов на платёжные, служебные и токены активов — её потом повторяют другие страны.',
        '2021 | Вступает в силу закон о технологиях распределённого реестра: появляются регистровые ценные бумаги и лицензия для торговых площадок на DLT.',
        '2021 | Цуг разрешает платить налоги в биткоине и эфире на сумму до 100 000 франков.',
        '2026 | MiCA работает в ЕС, но не в Швейцарии: страна сохраняет свой режим, а доступ на европейский рынок получают отдельной лицензией.',
      ].join('\n'),
      faq: [
        'Платит ли частное лицо налог с прибыли от криптовалюты? | Нет, налога на прирост капитала для частных лиц в Швейцарии не существует. Но ежегодно платится налог на имущество со всего портфеля.',
        'Как считается налог на имущество? | Криптоактивы декларируются по курсу на 31 декабря и складываются с остальным имуществом. Ставку устанавливает кантон, обычно от 0,3% до 1%.',
        'Когда инвестор становится профессиональным трейдером? | Когда деятельность выходит за рамки Циркуляра 36 — например, при коротких сроках владения, торговле на заёмные средства или когда прибыль от торговли превышает половину чистого дохода.',
        'Действует ли в Швейцарии MiCA? | Нет. Страна не входит в ЕС и сохраняет собственный режим. Для обслуживания клиентов из союза нужна отдельная европейская лицензия.',
        'Правда ли, что в Цуге можно платить налоги биткоином? | Да, кантон принимает биткоин и эфир в оплату налогов на сумму до 100 000 франков.',
      ].join('\n'),
      sources: [
        'FINMA — служба надзора за финансовым рынком Швейцарии | https://www.finma.ch/',
        'Федеральная налоговая администрация Швейцарии | https://www.estv.admin.ch/',
        'Кантон Цуг | https://www.zg.ch/',
      ].join('\n'),
      related: [
        'mica-god-spustya-kto-vyzhil-v-evrope',
        'mica-genius-act-transgranichnaya-koordinaciya',
      ].join('\n'),
      seoTitle: 'Криптовалюта в Швейцарии: регулирование, налоги и лицензии',
      seoDescription:
        'Прирост капитала у частного лица не облагается, но есть ежегодный налог на имущество. Как Швейцария регулирует крипту, что такое Циркуляр 36 и почему MiCA здесь не действует.',
    },
    en: {
      intro:
        'Crypto is legal in Switzerland and woven into financial law more deeply than almost anywhere: a distributed ledger act has been in force since 2021, with FINMA supervising. ' +
        'A private investor pays no capital gains tax — but does pay an annual wealth tax on everything held, at a rate their canton sets.',
      figures: [
        'PRIVATE CAPITAL GAINS | 0% | the sale is not taxed | ok',
        'WEALTH TAX | 0.3–1% | annually, set by canton | warn',
        'STAKING AND MINING | Taxable | as income when received | warn',
        'PROFESSIONAL TRADER | Income tax | criteria in Circular 36 | warn',
        'CANTONS SETTING RATES | 26 | tax is decided locally',
        'REGULATOR | FINMA | the DLT act has applied since 2021',
      ].join('\n'),
      body: `## Who regulates crypto in Switzerland

Switzerland is outside the EU, so MiCA does not reach it. The country has its own regime, and it is older than the European one. FINMA supervises, and its 2018 token taxonomy — payment, utility and asset tokens — proved durable enough that other jurisdictions copied it.

In 2021 the act adapting federal law to distributed ledger technology came into force. It introduced register-based securities into civil law — rights that live on a blockchain and move with the entry rather than with a certificate — and created a distinct licence category for DLT trading facilities.

The price of independence is that a Swiss licence buys no access to the European market. A venue wanting EU customers applies for a MiCA licence separately.

Crypto Valley in the canton of Zug grew out of practice rather than legislation: the local authorities began accepting bitcoin for public services back in 2016, and later allowed tax bills of up to CHF 100,000 to be paid in bitcoin or ether.

## Tax: gains are free, holding is not

The Swiss arrangement surprises people arriving from capital-gains-tax countries. For private individuals there is no such tax: sell higher than you bought and the profit is entirely yours.

There is, however, a tax most countries do not levy: an annual wealth tax. Crypto is declared at its 31 December valuation and added to everything else you own — property, accounts, securities. The rate is cantonal and typically falls between 0.3% and 1% of total wealth.

There are 26 cantons and the spread between them is material, which is why in Switzerland people choose a canton rather than a country.

### Where the private investor ends

The exemption holds only while you remain a private investor. Once the tax authority considers the activity professional, profits become income, taxed at income rates with social contributions on top.

The boundary is described in Circular 36 from the federal tax administration: five safe-harbour criteria which, if all met, keep you firmly private. They include holding assets for at least six months, not financing trades with debt, and keeping trading profit below half of net income. Falling outside them does not decide the matter automatically — the assessment then looks at the circumstances as a whole.

Staking, mining and being paid in crypto for work are not capital gains at all. They are income at the moment of receipt, valued at that day's market price.`,
      allowed: [
        'Sell higher than you bought — private capital gains are untaxed',
        'Hold crypto, declaring it at the 31 December valuation',
        'Pay Zug tax bills up to CHF 100,000 in bitcoin or ether',
        'Run a crypto business under a FINMA licence, including a DLT venue',
      ].join('\n'),
      restricted: [
        'Annual wealth tax applies whether or not you sold anything',
        'Professional trading: profits are income, plus social contributions',
        'A Swiss licence grants no EU access — MiCA is applied for separately',
        'Staking and mining are taxed as income on receipt',
      ].join('\n'),
      timeline: [
        '* 2016 | Zug becomes the first place anywhere to accept bitcoin for public services. Crypto Valley grows from it.',
        '2018 | FINMA publishes its token taxonomy — payment, utility, asset — which other jurisdictions go on to copy.',
        '2021 | The distributed ledger act takes effect, creating register-based securities and a licence for DLT trading facilities.',
        '2021 | Zug allows tax bills of up to CHF 100,000 to be settled in bitcoin or ether.',
        '2026 | MiCA governs the EU but not Switzerland: the country keeps its own regime and EU access requires a separate licence.',
      ].join('\n'),
      faq: [
        'Does a private individual pay tax on crypto gains? | No — Switzerland levies no capital gains tax on private individuals. An annual wealth tax on the whole portfolio applies instead.',
        'How is the wealth tax calculated? | Crypto is declared at its 31 December valuation and added to your other assets. The canton sets the rate, usually between 0.3% and 1%.',
        'When does an investor become a professional trader? | When the activity falls outside Circular 36 — short holding periods, debt-financed trading, or trading profit exceeding half of net income.',
        'Does MiCA apply in Switzerland? | No. The country is outside the EU and keeps its own regime. Serving EU customers requires a separate European licence.',
        'Can you really pay taxes in bitcoin in Zug? | Yes, the canton accepts bitcoin and ether for tax bills up to CHF 100,000.',
      ].join('\n'),
      sources: [
        'FINMA — Swiss Financial Market Supervisory Authority | https://www.finma.ch/',
        'Swiss Federal Tax Administration | https://www.estv.admin.ch/',
        'Canton of Zug | https://www.zg.ch/',
      ].join('\n'),
      related: [
        'mica-full-force-europe-crypto-winners-losers',
        'mica-genius-act-crypto-cross-border-coordination',
      ].join('\n'),
      seoTitle: 'Cryptocurrency in Switzerland: regulation, taxes and licensing',
      seoDescription:
        'Private capital gains are untaxed, but an annual wealth tax applies. How Switzerland regulates crypto, what Circular 36 decides, and why MiCA does not reach it.',
    },
  },
];

const FIELDS = [
  'intro', 'figures', 'body', 'allowed', 'restricted',
  'timeline', 'faq', 'sources', 'related', 'seoTitle', 'seoDescription',
] as const;

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
const total = (o: Side) =>
  words(o.intro) + words(o.body) + words(o.allowed) + words(o.restricted) +
  words(o.timeline) + words(o.faq) + words(o.figures);

async function main() {
  for (const c of COUNTRIES) {
    const doc = await client.fetch<{ _id: string; nameRu: string } | null>(
      `*[_type == "regulationCountry" && iso2 == $iso][0]{_id, "nameRu": name.ru}`,
      { iso: c.iso2 }
    );
    if (!doc) {
      console.error(`${c.iso2}: страна не найдена на карте — пропускаю`);
      continue;
    }
    const page = Object.fromEntries(
      FIELDS.map(f => [f, { _type: 'object', ru: c.ru[f], en: c.en[f] }])
    );
    await client
      .patch(doc._id)
      .set({ hasPage: true, page: { _type: 'object', ...page }, checkedAt: '2026-08-18' })
      .commit({ autoGenerateArrayKeys: false });
    console.log(`${doc.nameRu.padEnd(12)} включена · слов RU ${total(c.ru)} · EN ${total(c.en)}`);
  }
}

main().catch(e => { console.error(e.message); process.exit(1); });
