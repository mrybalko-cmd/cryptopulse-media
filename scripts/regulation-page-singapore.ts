/**
 * Singapore — the second country page, and the one that proves the map
 * fallback: Singapore has no outline in the 110m dataset, so its header draws
 * a marker rather than a shape.
 *
 * Checked on 18 August 2026 against MAS releases and IRAS guidance. The
 * licence-approval figures come from the country record already on the map,
 * which was verified in the same pass as the other 45.
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
    'Криптовалюта в Сингапуре разрешена, но это не мягкая юрисдикция, а строгая. Частный инвестор не платит налога на прирост капитала — его в стране нет вовсе. ' +
    'Зато компании проходят через самое узкое горлышко в Азии: лицензию выдаёт центральный банк MAS, и с 30 июня 2025 года она нужна даже тем, кто обслуживает исключительно зарубежных клиентов.',

  figures: [
    'НАЛОГ НА ПРИРОСТ | 0% | у частного инвестора | ok',
    'НАЛОГ КОМПАНИЙ | 17% | обычная ставка, крипта не выделена',
    'GST НА ТОКЕНЫ | 0% | освобождение с 2020 года | ok',
    'ЛИЦЕНЗИЯ | Обязательна | даже при работе только на зарубеж | warn',
    'ПРОДВИЖЕНИЕ В РОЗНИЦЕ | Запрещено | ни рекламы, ни бонусов | warn',
    'КАПИТАЛ ДЛЯ ЛИЦЕНЗИИ | 250 000 S$ | плюс 10 000 S$ пошлины в год',
  ].join('\n'),

  body: `## Кто и как регулирует крипту в Сингапуре

Здесь всё проще, чем в ОАЭ: регулятор один. Денежно-кредитное управление Сингапура (MAS) — одновременно центральный банк и надзорный орган, и вопросы криптоиндустрии решаются в одном кабинете, а не в трёх.

Основа — Payment Services Act 2019: он завёл понятие услуг с цифровыми платёжными токенами и требование лицензии для бирж, обменников и кастодианов. С 30 июня 2025 года к нему добавился режим для поставщиков услуг с цифровыми токенами по Financial Services and Markets Act 2022, и вот он изменил многое. Под лицензирование попали компании, которые зарегистрированы в Сингапуре, но обслуживают только клиентов за его пределами.

MAS сразу предупредил, что такие лицензии в общем случае выдавать не намерен: если вся деятельность происходит за границей, надзирать за ней невозможно, а риск отмывания при этом остаётся сингапурским. Формулировка звучала мягко, последствия оказались резкими — часть компаний просто ушла.

Требования к тем, кто лицензию получает, тоже не символические: капитал от 250 тысяч сингапурских долларов, комплаенс-офицер, физически находящийся в стране, ежегодный аудит, отчёт о сбое ИТ-систем в течение часа. Годовая пошлина — 10 тысяч долларов, одинаковая и для крупной биржи, и для маленького обменника.

Планка видна по цифрам: из более чем 380 поданных заявок одобрено около 90, свыше 200 отклонены или отозваны.

Отдельно с августа 2023 года действует рамка для стейблкоинов. Она касается односоставных стейблкоинов, привязанных к сингапурскому доллару или валютам G10: эмитент должен быть зарегистрирован в Сингапуре, держать резервы по установленному стандарту и погашать монету по номиналу.

### Что изменилось для розницы

Ограничения начались в январе 2022 года: поставщику услуг запретили продвигать их широкой публике — ни рекламы в транспорте, ни баннеров на сайтах, ни продвижения в социальных сетях, ни криптоматов в общественных местах.

Дальше — больше. К 2024 году добавились меры доступа: перед открытием счёта клиента проверяют на понимание риска, площадкам запрещено предлагать бонусы за регистрацию, за приглашение друга и за сделки, включая программы «учись и зарабатывай». Кредитное плечо и финансирование сделок для розницы закрыты, оплата местной кредитной картой не принимается — иностранной можно. Криптовалюта не учитывается при расчёте чистого капитала клиента.

## Налоги: что платит человек и что платит компания

Налога на прирост капитала в Сингапуре нет как класса, и криптовалюта тут не исключение: купили, подержали, продали дороже — государству вы ничего не должны.

Ловушка в слове «подержали». Если торговля частая и по сути является вашим промыслом, доход перестаёт быть приростом капитала и становится предпринимательским — а он облагается подоходным налогом по обычной прогрессивной шкале. Чёткого числа сделок в законе нет, налоговая смотрит на характер деятельности: регулярность, объём, источник средств, намерение при покупке. Проверок за последние годы стало заметно больше.

Компании платят корпоративный налог по обычной ставке 17%. Особого режима для криптобизнеса нет ни в лучшую, ни в худшую сторону.

Отдельная хорошая новость — налог на товары и услуги. Ставка GST в стране 9%, но цифровые платёжные токены освобождены от него с 1 января 2020 года. Освобождение не автоматическое: токен должен быть взаимозаменяемым, не привязанным к фиатной валюте, передаваемым электронно и приниматься публикой как средство обмена. NFT и часть служебных токенов под эти признаки не подпадают, и GST на них начисляется.`,

  allowed: [
    'Покупать, хранить и продавать криптоактивы без налога на прирост',
    'Пользоваться лицензированными сингапурскими площадками',
    'Платить иностранной кредитной картой при пополнении счёта',
    'Вести криптобизнес, получив лицензию MAS',
  ].join('\n'),

  restricted: [
    'Продвижение услуг широкой публике — запрещено с 2022 года',
    'Бонусы за регистрацию, приглашение и сделки',
    'Кредитное плечо и финансирование сделок для розницы',
    'Оплата пополнения местной кредитной картой',
    'Работа на зарубежных клиентов без лицензии — с июня 2025 года',
  ].join('\n'),

  timeline: [
    'Январь 2020 | Цифровые платёжные токены освобождены от GST — обмен перестаёт быть облагаемой операцией.',
    'Январь 2022 | MAS запрещает поставщикам услуг продвигать их широкой публике: ни рекламы, ни криптоматов на улице.',
    '* Лето 2022 | Крах местного фонда Three Arrows Capital: 10 млрд долларов под управлением превращаются в 3,3 млрд долга и тянут за собой половину отрасли.',
    'Август 2023 | Появляется отдельная рамка для стейблкоинов, привязанных к сингапурскому доллару и валютам G10.',
    '2024 | Вводятся меры доступа розницы: проверка понимания риска, запрет бонусов, плеча и местных кредитных карт.',
    'Июнь 2025 | Режим DTSP: лицензия нужна и тем, кто из Сингапура обслуживает только зарубежных клиентов.',
  ].join('\n'),

  faq: [
    'Нужно ли платить налог с прибыли от криптовалюты в Сингапуре? | Если вы держали актив как инвестицию — нет, налога на прирост капитала в стране не существует. Если торгуете часто и это фактически ваш промысел, доход считается предпринимательским и облагается подоходным налогом.',
    'Сколько сделок превращает инвестора в трейдера? | Точного числа в законе нет. Налоговая смотрит на совокупность: регулярность операций, объём, источник средств и намерение при покупке.',
    'Почему сингапурская биржа не берёт мою кредитную карту? | Площадкам запрещено принимать оплату картами, выпущенными в Сингапуре. Иностранная карта ограничением не затронута.',
    'Можно ли открыть криптокомпанию в Сингапуре для клиентов из других стран? | Формально да, но с июня 2025 года на это нужна лицензия, а MAS заявил, что в общем случае выдавать её не будет: надзирать за деятельностью целиком за рубежом он не может.',
    'Платится ли GST при обмене криптовалюты? | Нет. Цифровые платёжные токены освобождены от GST с 2020 года. Но освобождение не распространяется на NFT и часть служебных токенов.',
  ].join('\n'),

  sources: [
    'MAS — Денежно-кредитное управление Сингапура | https://www.mas.gov.sg/',
    'MAS — разъяснение режима для поставщиков услуг с цифровыми токенами | https://www.mas.gov.sg/news/media-releases/2025/mas-clarifies-regulatory-regime-for-digital-token-service-providers',
    'MAS — меры защиты розничных инвесторов | https://www.mas.gov.sg/news/media-releases/2023/mas-strengthens-regulatory-measures-for-digital-payment-token-services',
    'IRAS — налоговая служба Сингапура | https://www.iras.gov.sg/',
  ].join('\n'),

  related: [
    'three-arrows-capital-kak-fond-na-10-mlrd-rukhnul-za-neskolko-nedel',
    'triple-a-vzlom-kaznacheistva-11-8-mln',
  ].join('\n'),

  seoTitle: 'Криптовалюта в Сингапуре: регулирование, налоги и лицензии',
  seoDescription:
    'Легальна ли криптовалюта в Сингапуре, когда прибыль облагается налогом, что запрещено рознице и как MAS выдаёт лицензии. Данные проверены по релизам регулятора.',
};

const en = {
  intro:
    'Crypto is legal in Singapore, but this is a strict jurisdiction rather than a soft one. A private investor pays no capital gains tax, because the country has none. ' +
    'Companies, meanwhile, face the narrowest gate in Asia: the central bank, MAS, issues the licences, and since 30 June 2025 one is required even to serve customers exclusively outside Singapore.',

  figures: [
    'CAPITAL GAINS | 0% | for private investors | ok',
    'CORPORATE TAX | 17% | standard rate, no crypto carve-out',
    'GST ON TOKENS | 0% | exempt since 2020 | ok',
    'LICENCE | Required | even for offshore-only clients | warn',
    'RETAIL PROMOTION | Banned | no advertising, no incentives | warn',
    'CAPITAL TO LICENCE | S$250,000 | plus an S$10,000 annual fee',
  ].join('\n'),

  body: `## Who regulates crypto in Singapore

This is simpler than the UAE in one respect: there is a single regulator. The Monetary Authority of Singapore is both the central bank and the supervisor, so the industry's questions are settled in one building rather than three.

The foundation is the Payment Services Act 2019, which defined digital payment token services and required exchanges, dealers and custodians to be licensed. On 30 June 2025 a further regime arrived for digital token service providers under the Financial Services and Markets Act 2022 — and that one changed the picture. It pulled in companies incorporated in Singapore that serve only customers abroad.

MAS said plainly that it does not intend to grant such licences as a rule: if the activity happens entirely overseas it cannot be supervised effectively, while the money-laundering exposure stays Singaporean. The wording was measured; the effect was not, and a number of firms simply left.

Nor are the obligations for those who do qualify nominal. Base capital starts at S$250,000. A compliance officer must be physically resident in the country. Accounts are audited annually, and an IT incident has to be reported within one hour. The annual licence fee is S$10,000 — the same for a large exchange and a small dealer.

The bar shows in the numbers: of more than 380 applications, roughly 90 were approved and over 200 were rejected or withdrawn.

A separate stablecoin framework has applied since August 2023. It covers single-currency stablecoins pegged to the Singapore dollar or a G10 currency: the issuer must be incorporated locally, hold reserves to a defined standard, and redeem at par.

### What changed for retail

The tightening started in January 2022, when providers were barred from promoting their services to the general public — no advertising on public transport, no banners on websites, no social media pushes, no crypto ATMs in public places.

More followed. By 2024 consumer access measures were in force: a risk-awareness assessment before an account is opened, and a ban on incentives — sign-up bonuses, referral rewards, trading rebates, and "learn and earn" schemes alike. Leverage and trade financing are closed to retail. Locally issued credit cards cannot be used to fund an account, though foreign-issued ones can. Crypto holdings do not count towards a customer's net worth.

## Tax: what a person pays and what a company pays

Singapore has no capital gains tax at all, and crypto is no exception. Buy, hold, sell higher, and you owe nothing.

The trap is the word "hold". Where trading is frequent enough to constitute a trade in substance, the profit stops being a capital gain and becomes business income, taxable at ordinary progressive income tax rates. No transaction count appears in the law; the tax authority weighs the character of the activity — regularity, volume, source of funds, and intention at purchase. Audits in this area have visibly increased.

Companies pay corporate tax at the standard 17%. There is no special crypto regime in either direction.

Goods and services tax is the pleasant surprise. The headline GST rate is 9%, but digital payment tokens have been exempt since 1 January 2020. The exemption is conditional rather than automatic: the token must be fungible, not pegged to a fiat currency, transferable electronically, and accepted by the public as a medium of exchange. NFTs and some utility tokens fail those tests, and GST applies to them.`,

  allowed: [
    'Buy, hold and sell crypto with no tax on the gain',
    'Use licensed Singapore venues',
    'Fund an account with a foreign-issued credit card',
    'Run a crypto business once MAS has licensed it',
  ].join('\n'),

  restricted: [
    'Promoting services to the general public — banned since 2022',
    'Sign-up, referral and trading incentives',
    'Leverage and trade financing for retail customers',
    'Funding an account with a locally issued credit card',
    'Serving offshore clients unlicensed — closed since June 2025',
  ].join('\n'),

  timeline: [
    'January 2020 | Digital payment tokens are exempted from GST, so exchanging them stops being a taxable supply.',
    'January 2022 | MAS bars providers from promoting their services to the general public — no ads, no crypto ATMs on the street.',
    '* Summer 2022 | Local fund Three Arrows Capital collapses: $10 billion under management becomes $3.3 billion of debt and takes half the industry with it.',
    'August 2023 | A dedicated framework arrives for stablecoins pegged to the Singapore dollar and G10 currencies.',
    '2024 | Consumer access measures land: risk assessments, no incentives, no leverage, no local credit cards.',
    'June 2025 | The DTSP regime extends licensing to firms serving only overseas customers from Singapore.',
  ].join('\n'),

  faq: [
    'Do I pay tax on crypto profits in Singapore? | If you held the asset as an investment, no — the country has no capital gains tax. If you trade frequently enough that it amounts to a trade, the profit is business income and is taxed at ordinary income rates.',
    'How many trades make me a trader rather than an investor? | The law names no number. The tax authority weighs regularity, volume, where the money came from, and what you intended when you bought.',
    'Why won’t a Singapore exchange take my credit card? | Providers may not accept cards issued in Singapore. A foreign-issued card is unaffected.',
    'Can I set up a Singapore crypto company for clients abroad? | Formally yes, but since June 2025 it requires a licence, and MAS has said it will generally not grant one — it cannot supervise activity that happens entirely overseas.',
    'Is GST charged when I exchange crypto? | No. Digital payment tokens have been GST-exempt since 2020, though the exemption does not reach NFTs or some utility tokens.',
  ].join('\n'),

  sources: [
    'MAS — Monetary Authority of Singapore | https://www.mas.gov.sg/',
    'MAS — clarification of the digital token service provider regime | https://www.mas.gov.sg/news/media-releases/2025/mas-clarifies-regulatory-regime-for-digital-token-service-providers',
    'MAS — investor protection measures for DPT services | https://www.mas.gov.sg/news/media-releases/2023/mas-strengthens-regulatory-measures-for-digital-payment-token-services',
    'IRAS — Inland Revenue Authority of Singapore | https://www.iras.gov.sg/',
  ].join('\n'),

  related: [
    'three-arrows-capital-how-a-10-billion-fund-collapsed-in-a-few-weeks',
    'triple-a-hack-11-8-million-treasury-breach',
  ].join('\n'),

  seoTitle: 'Cryptocurrency in Singapore: regulation, taxes and licensing',
  seoDescription:
    'Is crypto legal in Singapore, when profit becomes taxable, what retail investors may not do, and how MAS grants licences. Checked against regulator releases.',
};

const FIELDS = [
  'intro', 'figures', 'body', 'allowed', 'restricted',
  'timeline', 'faq', 'sources', 'related', 'seoTitle', 'seoDescription',
] as const;

async function main() {
  const doc = await client.fetch<{ _id: string; nameRu: string } | null>(
    `*[_type == "regulationCountry" && iso2 == "SG"][0]{_id, "nameRu": name.ru}`
  );
  if (!doc) throw new Error('Сингапур не найден на карте.');

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
}

main().catch(e => { console.error(e.message); process.exit(1); });
