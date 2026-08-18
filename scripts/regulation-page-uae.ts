/**
 * The United Arab Emirates country page — the first of the five.
 *
 * Written, not translated: the Russian and English sides make the same points
 * from their own sentences, because a page that reads as machine output is
 * exactly what the site's own brief rules out.
 *
 * Every figure here was checked against a regulator or a primary announcement
 * on 18 August 2026. Where sources disagreed the claim was dropped rather than
 * averaged — this page is the sort a reader arrives at to settle a question.
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

const ru = {
  intro:
    'Криптовалюта в ОАЭ полностью легальна. Физическое лицо не платит ни налога на доход, ни налога на прирост капитала — ставка ноль, декларацию подавать некуда. ' +
    'Компании нужна лицензия, и выдаёт её один из нескольких регуляторов: в Дубае это VARA, в финансовом центре Абу-Даби — FSRA, а федеральный надзор с 1 января 2026 года ведёт Управление рынка капитала.',

  figures: [
    'НАЛОГ ФИЗЛИЦ | 0% | на доход и на прирост капитала | ok',
    'НАЛОГ КОМПАНИЙ | 9% | с прибыли свыше 375 000 AED',
    'НДС НА ОБМЕН | 0% | освобождение задним числом с 2018 года | ok',
    'ЛИЦЕНЗИЯ БИРЖ | Обязательна | VARA, FSRA, DFSA или CMA | warn',
    'ОПЛАТА В РОЗНИЦЕ | Ограничена | только токены, одобренные ЦБ | warn',
    'ЛИЦЕНЗИРУЮЩИХ ОРГАНОВ | 5 | федеральный, ЦБ и три свободные зоны',
  ].join('\n'),

  body: `## Кто и как регулирует крипту в ОАЭ

Регулирование здесь устроено не как единый закон, а как несколько параллельных контуров — и это конструкция, а не недосмотр. Федеральный уровень с 1 января 2026 года ведёт Управление рынка капитала, заменившее прежнюю Комиссию по ценным бумагам и товарам. В феврале того же года заработала новая федеральная рамка лицензирования поставщиков услуг с виртуальными активами, собранная из трёх модулей.

Параллельно живут свободные зоны со своим правом. В эмирате Дубай работает [VARA](https://www.vara.ae/) — созданный в марте 2022 года первый в мире регулятор, учреждённый специально под виртуальные активы. В финансовом центре Абу-Даби действует режим FSRA, построенный на английском общем праве. В дубайском DIFC — режим DFSA.

Отдельно стоит центральный банк: ему подчиняются не площадки, а расчёты. Регламент о платёжных токенах вступил в силу в июле 2024 года, а переходный период по нему закончился 16 июня 2026-го. С этого дня на материковой части страны расплачиваться в рознице можно только теми платёжными токенами, которые банк одобрил.

Такая конструкция и объясняет, почему компании выбирают ОАЭ: контур подбирают под задачу. Бирже с розничными клиентами нужна лицензия VARA, управляющей компании удобнее Абу-Даби с привычным английским правом, эмитенту стейблкоина — разрешение центрального банка. Оборотная сторона: надзор здесь не декоративный, и VARA штрафует в том числе площадки, которые обслуживают местных клиентов из-за рубежа без лицензии.

## Налоги: что платит человек и что платит компания

Для физических лиц ставка ноль, и это самое короткое, что можно сказать о налогах в ОАЭ. Подоходного налога в стране нет как явления, а криптовалюта не выделена в отдельную категорию: прибыль от продажи, доход от стейкинга и вознаграждение майнера у частного лица не облагаются ничем. Отчитываться не нужно — отчитываться просто некуда.

С компаниями иначе. Корпоративный налог введён в 2023 году: 9% с прибыли свыше 375 000 дирхамов, это около 102 тысяч долларов. Ниже порога ставка нулевая. Криптобизнес тут не исключение — биржа, майнинговая ферма и кастодиан считают прибыль по общим правилам, а не по особым.

Отдельная история — НДС. Решением кабинета министров № 100 от 2024 года передача права собственности на виртуальные активы и их обмен освобождены от налога. Освобождение вступило в силу 15 ноября 2024 года, но действует задним числом — с 1 января 2018-го, из-за чего компаниям пришлось пересчитывать давно закрытые периоды.

Есть и деталь, которую обычно упускают. В феврале 2026 года министерство финансов назначило VARA компетентным органом для целей корпоративного налога. Дубайский регулятор теперь участвует не только в лицензионном контуре, но и в налоговом — и для компании, зарегистрированной в Дубае, это значит, что оба разговора она ведёт с одним и тем же учреждением.`,

  allowed: [
    'Покупать, хранить, продавать и переводить любые криптоактивы',
    'Держать счёт на зарубежной бирже и торговать на ней',
    'Майнить — по лицензии свободной зоны',
    'Открыть биржу, брокера или кастодиана, получив лицензию',
    'Принимать оплату криптой, если вы лицензированный мерчант',
  ].join('\n'),

  restricted: [
    'Услуги без лицензии — VARA наказывает и офшорные площадки',
    'Розничные расчёты — только одобренными ЦБ платёжными токенами',
    'Выпуск дирхамового стейблкоина — по правилам центрального банка',
    'Реклама без предупреждения о риске',
  ].join('\n'),

  timeline: [
    'Март 2022 | Дубай принимает закон о виртуальных активах и создаёт VARA — первый в мире регулятор, учреждённый специально под эту отрасль.',
    '* Май 2022 | Биржа Bybit переносит в Дубай штаб-квартиру. За ней тянутся остальные, и город получает репутацию, которую до сих пор эксплуатирует.',
    'Июль 2024 | Вступает в силу регламент центрального банка о платёжных токенах — расчёты отделены от торговли и уходят под отдельный надзор.',
    'Ноябрь 2024 | Обмен и передача криптоактивов освобождены от НДС, причём задним числом с 2018 года.',
    'Январь 2026 | Федеральный надзор переходит к новому Управлению рынка капитала.',
    'Июнь 2026 | Заканчивается переходный период по платёжным токенам: в рознице остаются только одобренные банком.',
  ].join('\n'),

  faq: [
    'Нужно ли платить налог с прибыли от криптовалюты в ОАЭ? | Нет. Для физических лиц ставка ноль: ни налога на доход, ни налога на прирост капитала в стране не существует, поэтому и декларировать прибыль некуда.',
    'Можно ли жить в ОАЭ и торговать на зарубежной бирже? | Да. Ограничений на личные сделки через иностранные площадки нет. Лицензия нужна тому, кто обслуживает клиентов, а не тому, кто торгует своими деньгами.',
    'Что даёт лицензия VARA? | Право законно обслуживать клиентов из Дубая — вести биржу, хранить активы, быть брокером. Работа без неё наказуема, причём и для компаний, зарегистрированных за пределами страны.',
    'Можно ли расплатиться криптовалютой в магазине? | С июня 2026 года на материковой части — только платёжными токенами, одобренными центральным банком. Заплатить биткоином на кассе нельзя.',
    'Платит ли компания НДС при обмене криптовалюты? | Нет. Передача и обмен виртуальных активов освобождены от НДС с ноября 2024 года, а само освобождение распространили назад до 1 января 2018-го.',
  ].join('\n'),

  sources: [
    'VARA — регулятор виртуальных активов Дубая | https://www.vara.ae/',
    'ADGM — финансовый центр Абу-Даби и режим FSRA | https://www.adgm.com/',
    'Центральный банк ОАЭ — регламент о платёжных токенах | https://rulebook.centralbank.ae/en/rulebook/payment-token-services-regulation',
    'Федеральная налоговая служба ОАЭ | https://tax.gov.ae/',
    'DFSA — регулятор финансового центра Дубая | https://www.dfsa.ae/',
  ].join('\n'),

  related: [
    'deribit-spot-ordera-coinbase-dubai-litsenziya',
    'mubadala-kaio-fond-tokenizatsiya-solana-coinbase',
    'tether-gold-status-tovara-abu-dabi-adgm',
  ].join('\n'),

  seoTitle: 'Криптовалюта в ОАЭ: регулирование, налоги и лицензии',
  seoDescription:
    'Легальна ли криптовалюта в ОАЭ, какие налоги платят физлица и компании, кто выдаёт лицензии — VARA, FSRA, DFSA и центральный банк. Данные проверены по сайтам регуляторов.',
};

const en = {
  intro:
    'Cryptocurrency is fully legal in the United Arab Emirates. Individuals pay nothing — there is no income tax and no capital gains tax, so there is no return to file. ' +
    'Businesses need a licence, and which regulator issues it depends on where they set up: VARA in Dubai, FSRA in the Abu Dhabi Global Market, and, at federal level since 1 January 2026, the Capital Market Authority.',

  figures: [
    'INDIVIDUALS | 0% | on income and on capital gains | ok',
    'COMPANIES | 9% | on profit above AED 375,000',
    'VAT ON EXCHANGE | 0% | exempt, backdated to 2018 | ok',
    'EXCHANGE LICENCE | Required | VARA, FSRA, DFSA or CMA | warn',
    'RETAIL PAYMENTS | Restricted | only central-bank approved tokens | warn',
    'LICENSING BODIES | 5 | federal, central bank and three free zones',
  ].join('\n'),

  body: `## Who regulates crypto in the UAE

The country does not govern crypto through one law. It runs several regimes side by side, and that is the design rather than an accident of drafting. At federal level the Capital Market Authority took over on 1 January 2026, replacing the former Securities and Commodities Authority, and a new three-module federal framework for licensing virtual asset service providers followed in February.

Alongside it sit free zones with their own law. Dubai has [VARA](https://www.vara.ae/), stood up in March 2022 as the world's first regulator created specifically for virtual assets. The Abu Dhabi Global Market runs the FSRA regime on English common law. The Dubai International Financial Centre has the DFSA.

The central bank occupies its own lane. It does not license trading venues; it governs payment. Its payment token regulation took effect in July 2024 and its transition period closed on 16 June 2026. Since then, retail payments on the mainland may only be made in payment tokens the bank has approved.

That structure is the reason companies come here: you pick the regime that fits the business. A retail exchange wants a VARA licence, an asset manager usually prefers Abu Dhabi and its familiar common law, a stablecoin issuer needs the central bank. The other side of the bargain is that supervision is real — VARA has penalised offshore venues serving UAE customers without a licence, not only local ones.

## Tax: what a person pays and what a company pays

For an individual the answer is short: nothing. The UAE has no personal income tax at all, and crypto is not carved out as a special category, so a trading profit, staking income and mining rewards are all untaxed in private hands. There is no filing obligation because there is nothing to file to.

Companies are a different matter. Corporate tax arrived in 2023 at 9% on profit above AED 375,000 — roughly $102,000. Below that threshold the rate is zero. Crypto businesses get no special treatment in either direction: an exchange, a mining operation and a custodian all compute profit under the ordinary rules.

VAT is its own story. Cabinet Decision No. 100 of 2024 exempted both the transfer of ownership of virtual assets and their conversion. The exemption took force on 15 November 2024 but applies retroactively from 1 January 2018, which sent finance teams back through years of closed filings.

One detail tends to get missed. In February 2026 the Ministry of Finance designated VARA a competent authority for corporate tax purposes. Dubai's regulator now sits in the tax loop as well as the licensing one — meaning a Dubai-registered company increasingly has both conversations with the same institution.`,

  allowed: [
    'Buy, hold, sell and transfer any crypto asset',
    'Keep an account on a foreign exchange and trade there',
    'Mine, under a free-zone licence',
    'Run an exchange, brokerage or custody business once licensed',
    'Accept crypto as a licensed merchant',
  ].join('\n'),

  restricted: [
    'Serving clients unlicensed — offshore venues are penalised too',
    'Retail settlement in anything but central-bank approved tokens',
    'Issuing a dirham-pegged stablecoin outside the bank’s rules',
    'Advertising without a risk warning',
  ].join('\n'),

  timeline: [
    'March 2022 | Dubai passes its virtual assets law and creates VARA, the first regulator anywhere built specifically for this industry.',
    '* May 2022 | Bybit moves its headquarters to Dubai. Others follow, and the city acquires the reputation it still trades on.',
    'July 2024 | The central bank’s payment token regulation takes effect, splitting settlement away from trading and putting it under separate supervision.',
    'November 2024 | Transferring and converting crypto assets is exempted from VAT — backdated to 2018.',
    'January 2026 | Federal oversight passes to the newly created Capital Market Authority.',
    'June 2026 | The payment token transition period closes; only approved tokens remain usable at retail.',
  ].join('\n'),

  faq: [
    'Do I pay tax on crypto profits in the UAE? | No. Individuals face a zero rate — the country has neither income tax nor capital gains tax, so there is nothing to declare.',
    'Can I live in the UAE and trade on a foreign exchange? | Yes. Personal trading through overseas venues is unrestricted. Licensing applies to firms serving clients, not to someone trading their own money.',
    'What does a VARA licence allow? | Serving Dubai customers lawfully — running an exchange, holding client assets, brokering. Operating without one is penalised, including for companies based outside the country.',
    'Can I pay for things in crypto? | Since June 2026, on the mainland only with payment tokens the central bank has approved. Paying a shop in bitcoin is not permitted.',
    'Does a company pay VAT when converting crypto? | No. Transfers and conversions of virtual assets have been VAT-exempt since November 2024, with the exemption reaching back to 1 January 2018.',
  ].join('\n'),

  sources: [
    'VARA — Dubai’s Virtual Assets Regulatory Authority | https://www.vara.ae/',
    'ADGM — Abu Dhabi Global Market and the FSRA regime | https://www.adgm.com/',
    'Central Bank of the UAE — Payment Token Services Regulation | https://rulebook.centralbank.ae/en/rulebook/payment-token-services-regulation',
    'UAE Federal Tax Authority | https://tax.gov.ae/',
    'DFSA — Dubai International Financial Centre regulator | https://www.dfsa.ae/',
  ].join('\n'),

  related: [
    'deribit-route-spot-orders-coinbase-dubai-licence',
    'mubadala-kaio-fund-tokenization-solana-coinbase',
    'tether-gold-accepted-spot-commodity-abu-dhabi-adgm',
  ].join('\n'),

  seoTitle: 'Cryptocurrency in the UAE: regulation, taxes and licensing',
  seoDescription:
    'Is crypto legal in the UAE, what individuals and companies pay, and who issues licences — VARA, FSRA, DFSA and the central bank. Checked against regulator sources.',
};

const FIELDS = [
  'intro', 'figures', 'body', 'allowed', 'restricted',
  'timeline', 'faq', 'sources', 'related', 'seoTitle', 'seoDescription',
] as const;

async function main() {
  const doc = await client.fetch<{ _id: string; nameRu: string } | null>(
    `*[_type == "regulationCountry" && iso2 == "AE"][0]{_id, "nameRu": name.ru}`
  );
  if (!doc) throw new Error('ОАЭ не найдены — сначала должна пройти миграция карты.');

  const page = Object.fromEntries(
    FIELDS.map(f => [f, { _type: 'object', ru: (ru as Record<string, string>)[f], en: (en as Record<string, string>)[f] }])
  );

  await client
    .patch(doc._id)
    .set({ hasPage: true, page: { _type: 'object', ...page }, checkedAt: '2026-08-18' })
    .commit({ autoGenerateArrayKeys: false });

  const words = (s: string) => s.split(/\s+/).filter(Boolean).length;
  const total = (o: typeof ru) =>
    words(o.intro) + words(o.body) + words(o.allowed) + words(o.restricted) +
    words(o.timeline) + words(o.faq) + words(o.figures);

  console.log(`${doc.nameRu}: страница включена`);
  console.log(`  слов RU ${total(ru)} · EN ${total(en)}`);
  console.log(`  источников ${ru.sources.split('\n').length} · вопросов ${ru.faq.split('\n').length} · вех ${ru.timeline.split('\n').length}`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
