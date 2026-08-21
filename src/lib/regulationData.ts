export type RegStatus = 'legal' | 'restricted' | 'banned' | 'unclear';

export interface CountryReg {
  iso2: string;       // ISO 3166-1 alpha-2 (for display)
  isoNum: string;     // ISO 3166-1 numeric (for react-simple-maps TopoJSON matching)
  slug: string;
  name: { ru: string; en: string };
  status: RegStatus;
  summary: { ru: string; en: string };
  details: { ru: string; en: string };
  taxNote?: { ru: string; en: string };
  updatedYear: string;
}

export const REGULATION_DATA: CountryReg[] = [
  // ─── LEGAL ──────────────────────────────────────────────────────────────────
  {
    iso2: 'CZ', isoNum: '203', slug: 'czech-republic',
    name: { ru: 'Чехия', en: 'Czech Republic' },
    status: 'legal',
    summary: {
      ru: 'Криптовалюты полностью легальны. С 2024 года действует европейский регламент MiCA, устанавливающий единые правила для всего ЕС.',
      en: 'Crypto is fully legal. Since 2024 the EU MiCA regulation applies, setting unified rules across the EU.',
    },
    details: {
      ru: 'Биржи и кастодиальные кошельки должны получить лицензию согласно MiCA. Физические лица могут свободно покупать, продавать и хранить крипту. Платежи в крипте разрешены по соглашению сторон. По состоянию на август 2026 переходный период MiCA завершён: с 1 июля обслуживать клиентов ЕС без лицензии поставщика услуг нельзя, а сама лицензия действует во всех 27 странах союза.',
      en: 'Exchanges and custodial wallets require a MiCA licence. Individuals may freely buy, sell, and hold crypto. Crypto payments are permitted by mutual agreement. As of August 2026 the MiCA transition is over: since 1 July serving EU clients without a service-provider licence is prohibited, and the licence itself passports across all 27 member states.',
    },
    taxNote: {
      ru: 'С 15 февраля 2025 года прибыль освобождена от налога, если монеты держали дольше трёх лет, — в пределах 40 млн крон в год. Освобождается и годовая выручка до 100 000 крон. В остальных случаях — 15% или 23% подоходного налога.',
      en: 'Since 15 February 2025 gains are exempt if the coins were held over three years, capped at CZK 40m a year. Annual gross proceeds up to CZK 100,000 are exempt too. Otherwise 15% or 23% income tax applies.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'DE', isoNum: '276', slug: 'germany',
    name: { ru: 'Германия', en: 'Germany' },
    status: 'legal',
    summary: {
      ru: 'Одна из самых криптодружественных стран ЕС. Биткоин признан «частными деньгами». MiCA применяется с 2024 года.',
      en: 'One of the most crypto-friendly EU countries. Bitcoin is recognised as "private money". MiCA applies since 2024.',
    },
    details: {
      ru: 'Банки имеют право хранить криптоактивы клиентов. Крипта не является законным платёжным средством, но её использование разрешено. BaFin регулирует биржи.',
      en: 'Banks may custody crypto assets for clients. Crypto is not legal tender but use is permitted. BaFin regulates exchanges.',
    },
    taxNote: {
      ru: 'Если держать Bitcoin более 1 года — продажа не облагается налогом для физлиц.',
      en: 'Holding Bitcoin for over 1 year means tax-free sale for individuals.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'FR', isoNum: '250', slug: 'france',
    name: { ru: 'Франция', en: 'France' },
    status: 'legal',
    summary: {
      ru: 'Криптовалюты легальны, регулируются AMF (регулятор финрынков). Первой из стран ЕС выдаёт лицензии крипто-провайдерам по MiCA.',
      en: 'Crypto is legal, regulated by AMF. France was among the first EU countries to issue MiCA licences to crypto providers.',
    },
    details: {
      ru: 'PSAN-реестр (провайдеры крипто-услуг) действует с 2020 года. Стейблкоины и DeFi дополнительно регулируются с 2024 года.',
      en: 'PSAN registry (crypto asset service providers) active since 2020. Stablecoins and DeFi further regulated from 2024.',
    },
    taxNote: {
      ru: 'Прибыль от крипто облагается фиксированной ставкой 30% (flat tax).',
      en: 'Crypto gains are taxed at a flat rate of 30%.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'CH', isoNum: '756', slug: 'switzerland',
    name: { ru: 'Швейцария', en: 'Switzerland' },
    status: 'legal',
    summary: {
      ru: '"Крипто-долина" Цуга — мировой хаб блокчейн-компаний. Одно из самых прогрессивных регулирований в мире. DLT-закон действует с 2021 года.',
      en: '"Crypto Valley" Zug is a global blockchain hub. One of the most progressive regulatory frameworks worldwide. DLT Act in force since 2021.',
    },
    details: {
      ru: 'FINMA (финансовый регулятор) делит крипту на платёжные токены, утилитарные и ценные бумаги. Крупные компании (Ethereum Foundation, Cardano) зарегистрированы здесь.',
      en: 'FINMA classifies crypto into payment, utility, and asset tokens. Major firms (Ethereum Foundation, Cardano) are incorporated here.',
    },
    taxNote: {
      ru: 'Для частных лиц прибыль от торговли обычно не облагается налогом (если не профессиональный трейдер).',
      en: 'For private individuals, trading gains are typically tax-free (unless classified as professional trader).',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'US', isoNum: '840', slug: 'usa',
    name: { ru: 'США', en: 'United States' },
    status: 'legal',
    summary: {
      ru: 'Крупнейший крипторынок мира. Регулирование идёт на федеральном уровне (SEC, CFTC, FinCEN) и уровне штатов. С 2024 одобрены Bitcoin ETF.',
      en: 'The world\'s largest crypto market. Regulated at federal (SEC, CFTC, FinCEN) and state level. Bitcoin ETFs approved in 2024.',
    },
    details: {
      ru: 'SEC рассматривает большинство токенов как ценные бумаги. Биржи (Coinbase, Kraken) работают с лицензиями FinCEN. Крипта признана собственностью.',
      en: 'SEC treats most tokens as securities. Exchanges (Coinbase, Kraken) operate with FinCEN licences. Crypto is treated as property.',
    },
    taxNote: {
      ru: 'Прибыль от продажи — налог на прирост капитала (0–37% в зависимости от срока и дохода).',
      en: 'Gains are subject to capital gains tax (0–37% depending on holding period and income).',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'GB', isoNum: '826', slug: 'uk',
    name: { ru: 'Великобритания', en: 'United Kingdom' },
    status: 'legal',
    summary: {
      ru: 'Крипто легально. FCA (Управление по финансовому регулированию) лицензирует биржи и провайдеров. После Brexit — своё независимое регулирование.',
      en: 'Crypto is legal. FCA licenses exchanges and providers. Post-Brexit UK has its own independent framework.',
    },
    details: {
      ru: 'С 2024 стейблкоины регулируются как электронные деньги. Криптоплатформы обязаны регистрироваться в FCA против отмывания денег.',
      en: 'Stablecoins regulated as e-money from 2024. Crypto platforms must register with FCA for AML compliance.',
    },
    taxNote: {
      ru: 'HMRC считает крипту собственностью. Прибыль облагается CGT (налог на прирост капитала).',
      en: 'HMRC treats crypto as property. Gains are subject to CGT (capital gains tax).',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'SG', isoNum: '702', slug: 'singapore',
    name: { ru: 'Сингапур', en: 'Singapore' },
    status: 'legal',
    summary: {
      ru: 'Один из главных азиатских крипто-хабов. MAS (центральный банк) выдаёт лицензии провайдерам цифровых платёжных токенов.',
      en: 'One of Asia\'s top crypto hubs. MAS (central bank) licenses digital payment token service providers.',
    },
    details: {
      ru: 'Payment Services Act 2019 регулирует крипто-биржи. Реклама крипты широкой публике ограничена с 2022 года.',
      en: 'Payment Services Act 2019 regulates crypto exchanges. Advertising crypto to the general public restricted since 2022.',
    },
    taxNote: {
      ru: 'Нет налога на прирост капитала. Бизнес-доход от крипты облагается корпоративным налогом.',
      en: 'No capital gains tax. Business income from crypto subject to corporate tax.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'JP', isoNum: '392', slug: 'japan',
    name: { ru: 'Япония', en: 'Japan' },
    status: 'legal',
    summary: {
      ru: 'Первая страна, признавшая Bitcoin законным платёжным средством (2017). Биржи лицензируются FSA.',
      en: 'First country to recognise Bitcoin as legal payment (2017). Exchanges licensed by FSA.',
    },
    details: {
      ru: 'Все крипто-биржи обязаны регистрироваться в FSA. Есть требования к холодному хранению и резервам. ICO регулируются как ценные бумаги.',
      en: 'All crypto exchanges must register with FSA. Requirements for cold storage and reserves apply. ICOs regulated as securities.',
    },
    taxNote: {
      ru: 'Прибыль от крипты — категория "прочие доходы", ставка до 55%. Один из самых высоких налогов.',
      en: 'Crypto gains classified as "miscellaneous income", rate up to 55%. One of the highest tax rates.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'AU', isoNum: '036', slug: 'australia',
    name: { ru: 'Австралия', en: 'Australia' },
    status: 'legal',
    summary: {
      ru: 'Криптовалюты легальны и рассматриваются как собственность. AUSTRAC лицензирует биржи. Разрабатывается новый лицензионный режим (2024–2025).',
      en: 'Crypto is legal and treated as property. AUSTRAC licenses exchanges. A new licensing regime is being developed (2024–2025).',
    },
    details: {
      ru: 'Биржи должны регистрироваться в AUSTRAC (AML/CTF). Новый закон о рынках финансовых активов включит крипто под режим AFSL.',
      en: 'Exchanges must register with AUSTRAC (AML/CTF). New financial asset markets law will bring crypto under the AFSL regime.',
    },
    taxNote: {
      ru: 'ATO считает крипту активом. Прибыль облагается CGT. Скидка 50% на CGT при удержании более 12 месяцев.',
      en: 'ATO treats crypto as an asset. Gains subject to CGT. 50% CGT discount for holdings over 12 months.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'AE', isoNum: '784', slug: 'uae',
    name: { ru: 'ОАЭ', en: 'United Arab Emirates' },
    status: 'legal',
    summary: {
      ru: 'Один из самых криптодружественных режимов в мире. VARA (в Дубае) и FSRA (в ADGM) создали детальную регуляторную базу.',
      en: 'One of the most crypto-friendly regimes globally. VARA (Dubai) and FSRA (ADGM) have built a detailed regulatory framework.',
    },
    details: {
      ru: 'Дубай — мировой центр крипто-компаний, мигрирующих из других юрисдикций. Нет налога на доход физлиц.',
      en: 'Dubai is a global hub for crypto companies relocating from stricter jurisdictions. No personal income tax.',
    },
    taxNote: {
      ru: 'Нет налога на прибыль и прирост капитала для физических лиц.',
      en: 'No income or capital gains tax for individuals.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'CA', isoNum: '124', slug: 'canada',
    name: { ru: 'Канада', en: 'Canada' },
    status: 'legal',
    summary: {
      ru: 'Крипто легально. Первая в мире страна, одобрившая Bitcoin ETF (2021). Биржи регулируются провинциальными комиссиями.',
      en: 'Crypto is legal. First country to approve a Bitcoin ETF (2021). Exchanges regulated by provincial commissions.',
    },
    details: {
      ru: 'CSA (канадские регуляторы ценных бумаг) требует регистрации крипто-платформ. Крупные международные биржи должны соответствовать требованиям.',
      en: 'CSA (Canadian Securities Administrators) requires crypto platform registration. Major international exchanges must comply.',
    },
    taxNote: {
      ru: '50% прибыли от крипты включается в налогооблагаемый доход. Считается как собственность.',
      en: '50% of crypto gains are included in taxable income. Treated as property.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'SV', isoNum: '222', slug: 'el-salvador',
    name: { ru: 'Сальвадор', en: 'El Salvador' },
    status: 'legal',
    summary: {
      ru: 'Первая страна в мире, принявшая Bitcoin как законное платёжное средство (2021). С 29 января 2025 года приём добровольный: обязанность бизнеса принимать Bitcoin отменена по условию сделки с МВФ.',
      en: 'First country to adopt Bitcoin as legal tender (2021). Since 29 January 2025 acceptance is voluntary: the duty for businesses to accept Bitcoin was repealed under the terms of an IMF deal.',
    },
    details: {
      ru: 'Поправки 2025 года сняли обязанность принимать Bitcoin, отменили уплату налогов в нём и свернули государственный кошелёк Chivo. Расплатиться Bitcoin по-прежнему можно — по согласию сторон, — а государство продолжает держать его в резервах.',
      en: 'The 2025 amendments repealed the duty to accept Bitcoin, ended tax payments in it, and wound down the state-run Chivo wallet. Paying in Bitcoin is still possible by mutual agreement, and the state continues to hold it in reserves.',
    },
    taxNote: {
      ru: 'Прирост стоимости Bitcoin налогом не облагается — эта льгота сохранена и после поправок.',
      en: 'Bitcoin capital gains remain untaxed — the exemption survived the amendments.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'PT', isoNum: '620', slug: 'portugal',
    name: { ru: 'Португалия', en: 'Portugal' },
    status: 'legal',
    summary: {
      ru: 'Популярный крипто-хаб с 2021 года. С 2023 введён налог на краткосрочные сделки, но долгосрочные (более года) — по-прежнему без налога.',
      en: 'Popular crypto hub since 2021. Since 2023 a tax applies to short-term trades, but long-term gains (over 1 year) remain tax-free.',
    },
    details: {
      ru: 'Банк Португалии регистрирует провайдеров крипто-услуг. Страна привлекает крипто-номадов визой Digital Nomad.',
      en: 'Bank of Portugal registers crypto service providers. Country attracts crypto nomads with the Digital Nomad visa.',
    },
    taxNote: {
      ru: 'Прибыль от крипты менее 12 месяцев — 28%. Более 12 месяцев — налога нет.',
      en: 'Gains held under 12 months taxed at 28%. Over 12 months — no tax.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'ES', isoNum: '724', slug: 'spain',
    name: { ru: 'Испания', en: 'Spain' },
    status: 'legal',
    summary: {
      ru: 'Крипто легально в рамках MiCA. CNMV и Банк Испании совместно регулируют рынок. Обязательное уведомление о владении крипто за рубежом.',
      en: 'Crypto is legal under MiCA. CNMV and Bank of Spain jointly regulate the market. Mandatory disclosure of foreign crypto holdings.',
    },
    details: {
      ru: 'Обмен крипты на евро и наоборот рассматривается как налогооблагаемое событие.',
      en: 'Converting crypto to euro and vice versa is treated as a taxable event.',
    },
    taxNote: {
      ru: 'Ставка налога на прирост капитала 19–28% в зависимости от суммы.',
      en: 'Capital gains tax rate of 19–28% depending on amount.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'NL', isoNum: '528', slug: 'netherlands',
    name: { ru: 'Нидерланды', en: 'Netherlands' },
    status: 'legal',
    summary: {
      ru: 'Криптовалюта легальна в рамках MiCA. Лицензии поставщикам выдаёт AFM: прежняя регистрация в DNB закончилась вместе с переходным периодом 30 июня 2025 года. Строгий AML-надзор.',
      en: 'Crypto is legal under MiCA. The AFM licenses service providers, and the old DNB registration ended with the transition on 30 June 2025. Strong AML enforcement.',
    },
    details: {
      ru: 'Нидерланды — один из первых регуляторов в ЕС, начавших применять AMLD5 к крипте. Binance получила здесь первую регистрацию в ЕС. По состоянию на август 2026 переходный период MiCA завершён: с 1 июля обслуживать клиентов ЕС без лицензии поставщика услуг нельзя, а сама лицензия действует во всех 27 странах союза.',
      en: 'Netherlands was among the first EU regulators to apply AMLD5 to crypto. Binance obtained its first EU registration here. As of August 2026 the MiCA transition is over: since 1 July serving EU clients without a service-provider licence is prohibited, and the licence itself passports across all 27 member states.',
    },
    taxNote: {
      ru: 'Налога на прирост капитала нет. Криптовалюта попадает в «ящик 3»: государство предполагает доходность 6,00% за 2026 год и облагает её по ставке 36%. Первые 59 357 € чистого состояния не облагаются.',
      en: 'No capital gains tax. Crypto falls in box 3, where the state assumes a 6.00% return for 2026 and taxes that at 36%. The first EUR 59,357 of net wealth is exempt.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'NO', isoNum: '578', slug: 'norway',
    name: { ru: 'Норвегия', en: 'Norway' },
    status: 'legal',
    summary: {
      ru: 'Криптовалюта легальна и облагается как имущество. MiCA действует через Европейское экономическое пространство, надзор ведёт Finanstilsynet, срок лицензирования продлён до 30 июня 2026 года.',
      en: 'Crypto is legal and taxed as property. MiCA applies through the European Economic Area, Finanstilsynet supervises, and the licensing deadline ran to 30 June 2026.',
    },
    details: {
      ru: 'Норвегия применяет MiCA как страна Европейского экономического пространства, переходный период продлевали до 30 июня 2026 года. С 1 января 2025 года операторы дата-центров обязаны регистрироваться в управлении связи, а в июне 2025 года правительство объявило о временном запрете новых дата-центров под proof-of-work. Физлица до 5 кВт под регистрацию не подпадают.',
      en: 'Norway applies MiCA as a European Economic Area state, with the transition extended to 30 June 2026. Data centre operators have had to register with the communications authority since 1 January 2025, and in June 2025 the government announced a temporary bar on new data centres for proof-of-work mining. Individuals under 5 kW fall outside the registration duty.',
    },
    taxNote: {
      ru: 'Прибыль облагается по 22% как обычный доход — коэффициент 1,72, поднимающий акции до 37,84%, к криптовалюте не применяется. Остаток на рубеж года входит в налог на состояние.',
      en: 'Gains meet 22% as ordinary income: the 1.72 uplift that takes shares to 37.84% does not apply to crypto. Your year-end holding counts toward the wealth tax.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'SE', isoNum: '752', slug: 'sweden',
    name: { ru: 'Швеция', en: 'Sweden' },
    status: 'legal',
    summary: {
      ru: 'Один из ведущих крипторынков Скандинавии. Надзор ведёт Finansinspektionen как уполномоченный орган по MiCA, правила ЕС применяются с 30 декабря 2024 года.',
      en: 'One of the leading crypto markets in Scandinavia. Finansinspektionen supervises as the competent authority under MiCA, with the EU rules applying since 30 December 2024.',
    },
    details: {
      ru: 'Ранее Швеция выдавала отдельные лицензии крипто-провайдерам. Теперь заменяется лицензиями MiCA CASP. По состоянию на август 2026 переходный период MiCA завершён: с 1 июля обслуживать клиентов ЕС без лицензии поставщика услуг нельзя, а сама лицензия действует во всех 27 странах союза.',
      en: 'Sweden previously granted individual licences to crypto providers. Now replaced by MiCA CASP licences. As of August 2026 the MiCA transition is over: since 1 July serving EU clients without a service-provider licence is prohibited, and the licence itself passports across all 27 member states.',
    },
    taxNote: {
      ru: 'Плоские 30% с чистого прироста капитала, но из убытка засчитывают только 70%. Выбытием считается и обмен монеты на монету, декларация — по форме K4.',
      en: 'A flat 30% on the net capital gain, with only 70% of a loss deductible. A coin-for-coin swap counts as a disposal, declared on form K4.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'EE', isoNum: '233', slug: 'estonia',
    name: { ru: 'Эстония', en: 'Estonia' },
    status: 'legal',
    summary: {
      ru: 'Одна из первых стран ЕС, начавших выдавать криптолицензии, и одна из первых, кто их массово отозвал. С 1 июля 2026 года переходный период MiCA закрыт: рынок ведёт Финансовая инспекция.',
      en: 'One of the first EU states to issue crypto licences, and one of the first to revoke them in bulk. The MiCA transition closed on 1 July 2026, and Finantsinspektsioon now runs the market.',
    },
    details: {
      ru: 'В 2022 году требования ужесточили, и подавляющее большинство провайдеров лицензий лишились. Надзор перешёл от Бюро данных по отмыванию денег к Финансовой инспекции: старые лицензии VASP истекли 1 июля 2026 года без автоматического перевода, и в марте 2026 года у регулятора было всего десять заявок. Обслуживать эстонских клиентов вправе компании с разрешением по MiCA из любой страны союза.',
      en: 'Estonia tightened its requirements in 2022 and the great majority of providers lost their licences. Supervision passed from the Financial Intelligence Unit to Finantsinspektsioon: legacy VASP licences expired on 1 July 2026 with no automatic conversion, and in March 2026 the regulator held just ten applications. Firms authorised under MiCA anywhere in the union may serve Estonian clients.',
    },
    taxNote: {
      ru: 'Прибыль облагается подоходным налогом по ставке 22%: повышение до 24% парламент отменил в декабре 2025 года. Обмен монеты на монету считается выбытием, а убытки зачесть против прибыли нельзя.',
      en: 'Gains meet income tax at 22%, after parliament repealed the planned rise to 24% in December 2025. A coin-for-coin swap counts as a disposal, and you cannot offset losses against gains.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'PL', isoNum: '616', slug: 'poland',
    name: { ru: 'Польша', en: 'Poland' },
    status: 'legal',
    summary: {
      ru: 'Крипто легально в рамках MiCA. Один из крупнейших крипторынков ЦВЕ по числу пользователей.',
      en: 'Crypto is legal under MiCA. One of the largest crypto markets in CEE by user count.',
    },
    details: {
      ru: 'AML-законодательство применяется к криптообменникам. Закон о внедрении MiCA, назначавший надзорным органом KNF, президент ветировал трижды, поэтому заявки на лицензию KNF принимать не может. С 1 июля 2026 года оказывать услуги с криптоактивами из Польши без разрешения незаконно, при этом иностранные площадки заходят по паспорту ЕС свободно.',
      en: 'AML legislation applies to crypto exchanges. The president vetoed the MiCA implementing law naming the KNF as supervisor three times, so the KNF cannot accept licence applications. Since 1 July 2026 providing crypto services from Poland without authorisation has been unlawful, while foreign providers passport in freely.',
    },
    taxNote: {
      ru: 'Плоские 19% при возмездном выбытии в фиат, декларация PIT-38 до 30 апреля. Обмен одной монеты на другую налогом не облагается, но и расходы на такие обмены в вычет не идут.',
      en: 'A flat 19% on paid disposal into fiat, declared on PIT-38 by 30 April. Crypto-to-crypto swaps are not taxed, and their costs are not deductible either.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'IT', isoNum: '380', slug: 'italy',
    name: { ru: 'Италия', en: 'Italy' },
    status: 'legal',
    summary: {
      ru: 'Крипто легально в рамках MiCA. С 2023 введён специальный налоговый режим на крипто-доходы.',
      en: 'Crypto is legal under MiCA. A special crypto tax regime was introduced in 2023.',
    },
    details: {
      ru: 'Провайдеры регистрируются в OAM (реестр). Планируется полный переход на лицензии MiCA CASP.',
      en: 'Providers register with OAM (registry). Full transition to MiCA CASP licences is planned.',
    },
    taxNote: {
      ru: 'Прибыль от крипты свыше €2000 облагается 26% налогом.',
      en: 'Crypto gains above €2,000 taxed at 26%.',
    },
    updatedYear: '2025',
  },

  // ─── RESTRICTED ─────────────────────────────────────────────────────────────
  {
    iso2: 'RU', isoNum: '643', slug: 'russia',
    name: { ru: 'Россия', en: 'Russia' },
    status: 'restricted',
    summary: {
      ru: 'Хранение и майнинг разрешены, но использование крипты как средства оплаты — запрещено. Рубль остаётся единственным законным платёжным средством.',
      en: 'Holding and mining are permitted, but using crypto as payment is banned. The ruble remains the sole legal tender.',
    },
    details: {
      ru: 'Закон о ЦФА (цифровых финансовых активах) регулирует выпуск токенов. ЦБ РФ против крипты, Минфин — за ограниченное использование. Экспорт с расчётами в крипте разрешён с 2024. Принят закон о цифровых валютах и цифровых правах: криптовалюта получает статус имущества, операции переводятся в лицензированную инфраструктуру бирж и брокеров. Ключевые нормы вступают в силу с 1 сентября 2026 года.',
      en: 'The DFA law (Digital Financial Assets) regulates token issuance. CBR opposes crypto; MinFin supports limited use. Crypto in export settlements permitted since 2024. A law on digital currencies and digital rights grants crypto the status of property and moves transactions into licensed exchange and broker infrastructure. Its core provisions take effect on 1 September 2026.',
    },
    taxNote: {
      ru: 'Продажа и обмен идут в отдельную налоговую базу: 13% до 2,4 млн рублей и 15% сверх этой суммы. Доход от майнинга облагается по общей прогрессивной шкале от 13% до 22%. НДС не возникает ни там, ни там.',
      en: 'Selling and exchanging go into a separate tax base: 13% up to ₽2.4 million and 15% above it. Mining income meets the general progressive scale of 13% to 22%. Neither carries VAT.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'UA', isoNum: '804', slug: 'ukraine',
    name: { ru: 'Украина', en: 'Ukraine' },
    status: 'restricted',
    summary: {
      ru: 'Закон о виртуальных активах принят в 2022, но полный регуляторный режим ещё не запущен. Крипта фактически используется широко.',
      en: 'The Virtual Assets law was adopted in 2022, but the full regulatory regime is not yet operational. Crypto is widely used in practice.',
    },
    details: {
      ru: 'НКЦПФР готовит текст ко второму чтению, вопрос о надзорном органе между ней и Национальным банком не решён. Законопроект 10225-д принят за основу 3 сентября 2025 года: 18% НДФЛ плюс военный сбор 5%, льготные 5% плюс 5% для активов, купленных до вступления закона в силу. Обмен между виртуальными активами законопроект налогом не облагает. Собственные сроки документа (старт с 1 января 2026 года, регистрация поставщиков до 1 июля 2026 года) задержка уже перекрыла.',
      en: 'The securities commission is preparing the text for a second reading, and the choice of supervisor between it and the National Bank remains open. Parliament adopted bill 10225-d as a basis on 3 September 2025: 18% income tax plus a 5% military levy, with a transitional 5% plus 5% for assets bought before the law takes effect. The bill leaves exchanges between virtual assets untaxed. Its own deadlines, a 1 January 2026 start and provider registration by 1 July 2026, have been overtaken by the delay.',
    },
    taxNote: {
      ru: 'Криптовалютного режима в силе пока нет: закон 2022 года не заработал, а законопроект ждёт второго чтения. По законопроекту — 18% НДФЛ плюс военный сбор 5%, то есть 23% с прибыли, и обмены между активами вне налога.',
      en: 'No crypto regime is in force yet: the 2022 law never started and the bill awaits its second reading. The bill proposes 18% income tax plus a 5% military levy, so 23% of the gain, with swaps between assets left outside the tax.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'IN', isoNum: '356', slug: 'india',
    name: { ru: 'Индия', en: 'India' },
    status: 'restricted',
    summary: {
      ru: 'Крипто легально, но с жёсткими ограничениями: 30% налог на доходы, 1% TDS с каждой сделки. Многие пользователи переходят на иностранные биржи.',
      en: 'Crypto is legal but with harsh restrictions: 30% tax on income, 1% TDS on each transaction. Many users move to foreign exchanges.',
    },
    details: {
      ru: 'RBI (центральный банк) против крипты, но суд запретил ему блокировать транзакции. Убытки от одной монеты нельзя зачесть в счёт дохода от другой.',
      en: 'RBI (central bank) opposes crypto but the court prevented it from blocking transactions. Losses from one coin cannot offset gains from another.',
    },
    taxNote: {
      ru: 'Фиксированный налог 30% на всю прибыль + 1% TDS. Один из самых жёстких налоговых режимов в мире.',
      en: 'Fixed 30% tax on all gains + 1% TDS. One of the harshest tax regimes globally.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'TR', isoNum: '792', slug: 'turkey',
    name: { ru: 'Турция', en: 'Turkey' },
    status: 'restricted',
    summary: {
      ru: 'Крипту можно хранить и торговать, но использовать в качестве оплаты за товары и услуги — запрещено с 2021 года. Биржи регулируются SPK.',
      en: 'Crypto can be held and traded, but using it as payment for goods and services is banned since 2021. Exchanges are regulated by CMB.',
    },
    details: {
      ru: 'Турки активно используют крипту для защиты от инфляции лиры. SPK (регулятор) требует лицензирования бирж с 2024. Binance работает с турецкой лицензией.',
      en: 'Turks actively use crypto to hedge against lira inflation. CMB (regulator) requires exchange licensing from 2024. Binance operates with a Turkish licence.',
    },
    taxNote: {
      ru: 'С 2023 Турция ввела налог на крипто-транзакции. Ставка обсуждается.',
      en: 'Turkey introduced a crypto transaction tax in 2023. The rate is still under debate.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'KR', isoNum: '410', slug: 'south-korea',
    name: { ru: 'Южная Корея', en: 'South Korea' },
    status: 'restricted',
    summary: {
      ru: 'Один из самых активных крипторынков в мире. Крипту можно хранить и торговать, но только через лицензированные корейские биржи с подтверждённой личностью.',
      en: 'One of the most active crypto markets globally. Crypto may be held and traded, but only on licensed Korean exchanges with verified identity.',
    },
    details: {
      ru: 'Иностранные граждане фактически не имеют доступа к биржам. ICO запрещены. Жёсткий KYC: реальное имя обязательно для вывода в won.',
      en: 'Foreign nationals effectively cannot access the exchanges. ICOs are banned. Strict KYC: real name required for KRW withdrawals.',
    },
    taxNote: {
      ru: 'Налог на крипто-доходы (20%) введён с 2025 года после многолетних откладываний.',
      en: 'Crypto income tax (20%) was introduced in 2025 after years of delays.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'BR', isoNum: '076', slug: 'brazil',
    name: { ru: 'Бразилия', en: 'Brazil' },
    status: 'restricted',
    summary: {
      ru: 'Крипто легально с 2023 года. Закон о виртуальных активах создал регуляторную базу. Но реклама крипты строго ограничена.',
      en: 'Crypto is legal since 2023. The Virtual Assets law established a regulatory framework. However, crypto advertising is strictly limited.',
    },
    details: {
      ru: 'Banco Central do Brasil лицензирует криптоплатформы. Nubank и другие банки предлагают крипто-продукты. Реальный использует крипту для трансграничных расчётов.',
      en: 'Banco Central do Brasil licenses crypto platforms. Nubank and other banks offer crypto products. Brazil uses crypto for cross-border settlements.',
    },
    taxNote: {
      ru: 'Прибыль от крипты свыше 35,000 BRL в год облагается налогом от 15% до 22.5%.',
      en: 'Gains above BRL 35,000/year taxed at 15% to 22.5%.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'KZ', isoNum: '398', slug: 'kazakhstan',
    name: { ru: 'Казахстан', en: 'Kazakhstan' },
    status: 'restricted',
    summary: {
      ru: 'Майнинг легален и привлёк много компаний после запрета в Китае. Но крипта не является законным платёжным средством, торговля ограничена зоной МФЦА.',
      en: 'Mining is legal and attracted many firms after China\'s ban. But crypto is not legal tender and trading is limited to the AIFC zone.',
    },
    details: {
      ru: 'МФЦА (Международный финансовый центр «Астана») создал отдельный регуляторный режим для крипты. Вне МФЦА операции с криптой в серой зоне.',
      en: 'AIFC (Astana International Financial Centre) created a separate crypto regulatory regime. Outside AIFC, crypto operations are in a grey zone.',
    },
    taxNote: {
      ru: 'Майнеры платят налог на доход. Индивидуальные инвесторы — в серой зоне.',
      en: 'Miners pay income tax. Individual investors are in a grey zone.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'GE', isoNum: '268', slug: 'georgia',
    name: { ru: 'Грузия', en: 'Georgia' },
    status: 'restricted',
    summary: {
      ru: 'Майнинг легален и активно развит. Продажа крипты в Грузии освобождена от НДС. Но криптоплатежи не признаны законными.',
      en: 'Mining is legal and actively developed. Crypto sales in Georgia are VAT-exempt. But crypto payments are not legally recognised.',
    },
    details: {
      ru: 'Грузия — один из мировых лидеров по майнингу на душу населения. Нацбанк изучает возможность регулирования крипто-обменников.',
      en: 'Georgia is among the world\'s leaders in mining per capita. The National Bank is exploring crypto exchange regulation.',
    },
    taxNote: {
      ru: 'Физлица освобождены от налога на прибыль при продаже крипты нерезидентам.',
      en: 'Individuals are exempt from capital gains tax when selling crypto to non-residents.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'AR', isoNum: '032', slug: 'argentina',
    name: { ru: 'Аргентина', en: 'Argentina' },
    status: 'legal',
    summary: {
      ru: 'Криптовалюта легальна и широко используется на фоне инфляции песо. Поставщики услуг обязаны регистрироваться в Комиссии по ценным бумагам — в реестре 82 компании. Валютные ограничения для физлиц ослаблены с апреля 2025 года.',
      en: 'Crypto is legal and widely used against peso inflation. Service providers must register with the securities commission, and 82 hold registration. Currency controls on individuals eased in April 2025.',
    },
    details: {
      ru: 'ARCA (налоговый орган) требует декларирования крипто-активов. Правительство Милея дружественно к крипте. Программа легализации активов принята в 2024. С 31 декабря 2025 года регистрация в реестре Комиссии по ценным бумагам обязательна для всех поставщиков услуг, включая иностранные площадки, работающие с аргентинским рынком. Минимальный капитал — от 35 до 150 тысяч долларов в зависимости от вида деятельности.',
      en: 'ARCA (tax authority) requires crypto asset declaration. Milei government is crypto-friendly. Asset legalisation programme adopted in 2024. Since 31 December 2025 registration with the securities commission is mandatory for every service provider, foreign platforms serving the Argentine market included. Minimum capital ranges from USD 35,000 to 150,000 by activity.',
    },
    taxNote: {
      ru: 'За само владение налога нет, но остаток на конец года входит в налог на личное имущество. Прибыль: 5% при аргентинском источнике дохода, 15% при зарубежном. С мая 2026 года биржи ежемесячно отчитываются перед ARCA.',
      en: 'Holding alone is not taxed, but the year-end balance counts for personal property tax. Gains: 5% on Argentine-source income, 15% on foreign-source. Exchanges have reported to ARCA monthly since May 2026.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'ZA', isoNum: '710', slug: 'south-africa',
    name: { ru: 'ЮАР', en: 'South Africa' },
    status: 'legal',
    summary: {
      ru: 'С 2023 крипто-провайдеры должны получать лицензию FSCA. Один из самых активных рынков Африки. Крипта рассматривается как финансовый продукт.',
      en: 'Since 2023 crypto providers must hold an FSCA licence. One of Africa\'s most active markets. Crypto is treated as a financial product.',
    },
    details: {
      ru: 'FSCA — первый в Африке регулятор, создавший обязательный лицензионный режим для крипты. SARB (центробанк) тестирует CBDC. К 2026 году регулятор рассмотрел 512 заявок и выдал 300 лицензий. Совместное заявление Резервного банка и FSCA от 28 мая 2026 года подтвердило: криптоактивы не являются законным платёжным средством и остаются вне национальной платёжной системы.',
      en: 'FSCA is Africa\'s first regulator to create mandatory licensing for crypto. SARB (central bank) is testing a CBDC. By 2026 the regulator had processed 512 applications and granted 300 licences. A joint statement by the Reserve Bank and the FSCA on 28 May 2026 confirmed that crypto is not legal tender and stays outside the national payment system.',
    },
    taxNote: {
      ru: 'Отдельного налога на криптовалюту нет. Прибыль от торговли идёт по предельной ставке, до 45%; долгосрочная прибыль считается капитальной — включение 40% и потолок 18% эффективных. Первые 50 000 рандов прибыли за год не облагаются.',
      en: 'No separate crypto tax. Trading profit meets your marginal rate, up to 45%, while a long-term gain is capital: a 40% inclusion gives an effective ceiling of 18%. The first R50,000 of gain a year is exempt.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'MX', isoNum: '484', slug: 'mexico',
    name: { ru: 'Мексика', en: 'Mexico' },
    status: 'restricted',
    summary: {
      ru: 'Закон о финтехе 2018 года признаёт криптовалюту «виртуальным активом», но циркуляр центрального банка 2019 года запрещает банкам и финтех-институтам предлагать её клиентам. Владеть и торговать физлицам можно.',
      en: 'The 2018 fintech law recognises crypto as a "virtual asset", while a 2019 central bank circular bars banks and fintech institutions from offering it to clients. Individuals may own and trade freely.',
    },
    details: {
      ru: 'Отдельного режима лицензирования бирж по-прежнему нет: площадки регистрируются как финтех-структуры, а банкам предлагать криптоуслуги запрещено. С апреля 2026 года биржи передают налоговой службе данные об операциях по международному стандарту обмена. Отрасль с июня 2026 года добивается реформы закона о финтехе.',
      en: 'Mexico still has no dedicated exchange-licensing regime: platforms register as fintech entities while banks stay barred from offering crypto services. Since April 2026 exchanges pass transaction data to the tax administration under the international exchange framework. The industry has been pressing for a reform of the fintech law since June 2026.',
    },
    taxNote: {
      ru: 'Прибыль складывается с прочими доходами и облагается по прогрессивной шкале до 35%, но цену приобретения перед расчётом индексируют на инфляцию. Годовой вычет — три расчётные величины UMA, около 128 000 песо на 2026 год.',
      en: 'Gains accumulate to your other income on the progressive scale up to 35%, though you index the purchase price for inflation first. The annual exemption is three times the annual UMA, around 128,000 pesos for 2026.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'TH', isoNum: '764', slug: 'thailand',
    name: { ru: 'Таиланд', en: 'Thailand' },
    status: 'restricted',
    summary: {
      ru: 'Крипто разрешено как цифровой актив. SEC лицензирует биржи. Использование крипты для платежей запрещено с 2022 года.',
      en: 'Crypto is permitted as a digital asset. SEC licenses exchanges. Using crypto for payments is banned since 2022.',
    },
    details: {
      ru: 'Биржи должны иметь лицензию SEC Thailand. Иностранные биржи заблокированы. Правительство создаёт крипто-хаб в Phuket. Работает песочница TouristDigiPay: иностранные туристы конвертируют криптоактивы в баты и платят через национальную систему QR-платежей, продавцы получают уже местную валюту. С 16 августа 2026 года действуют усиленные требования к проверке клиентов.',
      en: 'Exchanges must hold a Thai SEC licence. Foreign exchanges are blocked. The government is creating a crypto hub in Phuket. The TouristDigiPay sandbox lets foreign visitors convert crypto into baht and pay through the national QR system, with merchants receiving local currency. Tighter customer-verification rules apply from 16 August 2026.',
    },
    taxNote: {
      ru: 'Прибыль от продажи через площадку с лицензией тайской комиссии по ценным бумагам не облагается с 1 января 2025 года по 31 декабря 2029 года. Продажа в обход лицензированных площадок идёт по обычной шкале НДФЛ до 35%.',
      en: 'Gains on sales through a platform licensed by the Thai securities regulator are exempt from 1 January 2025 to 31 December 2029. Selling outside licensed venues meets ordinary income tax rates of up to 35%.',
    },
    updatedYear: '2026',
  },

  // ─── BANNED ──────────────────────────────────────────────────────────────────
  {
    iso2: 'CN', isoNum: '156', slug: 'china',
    name: { ru: 'Китай', en: 'China' },
    status: 'banned',
    summary: {
      ru: 'Полный запрет с сентября 2021. Все крипто-транзакции, биржи и майнинг объявлены незаконными. PBOC запустил цифровой юань (e-CNY) как альтернативу.',
      en: 'Complete ban since September 2021. All crypto transactions, exchanges, and mining declared illegal. PBOC launched the digital yuan (e-CNY) as an alternative.',
    },
    details: {
      ru: 'До запрета на Китай приходилось до 70% мирового хешрейта Bitcoin; после него майнеры перебрались в США, Казахстан и Россию. Полностью майнинг из страны не ушёл: по независимым оценкам часть мощностей продолжает работать вопреки запрету. Гражданам запрещено пользоваться иностранными биржами, в том числе через VPN. Гонконг живёт по собственным правилам и лицензирует крипто-площадки.',
      en: 'Before the ban China accounted for up to 70% of Bitcoin\'s global hashrate; afterwards miners moved to the US, Kazakhstan, and Russia. Mining never left entirely — independent estimates put a meaningful share of hashrate still inside the country. Citizens are barred from foreign exchanges, VPN included. Hong Kong operates under its own rules and licenses crypto platforms.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'DZ', isoNum: '012', slug: 'algeria',
    name: { ru: 'Алжир', en: 'Algeria' },
    status: 'banned',
    summary: {
      ru: 'Криптовалюта запрещена с закона о финансах 2018 года, а с закона 25-10 от 24 июля 2025 года стала уголовно наказуемой: под статью попали покупка, продажа, использование, владение, майнинг, хранение и продвижение.',
      en: 'Crypto has been prohibited since the 2018 finance law, and Law 25-10 of 24 July 2025 made it criminal: buying, selling, using, holding, mining, storing and promoting all fall inside the offence.',
    },
    details: {
      ru: 'Закон о финансах 2018 прямо запрещает любое использование виртуальных валют. Центральный банк не признаёт крипту ни в какой форме. Закон 25-10 от 24 июля 2025 года ужесточил запрет: под уголовную статью попали выпуск, покупка, продажа, хранение и майнинг, наказание — от двух до двенадцати месяцев лишения свободы и штраф до миллиона динаров.',
      en: 'Finance Law 2018 explicitly bans any use of virtual currencies. The central bank does not recognise crypto in any form. Law 25-10 of 24 July 2025 hardened the ban: issuing, buying, selling, holding and mining are all criminal offences, punishable by two to twelve months\' imprisonment and fines up to one million dinars.',
    },
    taxNote: {
      ru: 'Налогового режима нет: вся деятельность запрещена. Наказание — от двух месяцев до года лишения свободы и штраф, при повторе удваиваемый.',
      en: 'No tax regime exists, since every activity is prohibited. Penalties run from two months to one year in prison plus a fine, doubled for a repeat offence.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'EG', isoNum: '818', slug: 'egypt',
    name: { ru: 'Египет', en: 'Egypt' },
    status: 'banned',
    summary: {
      ru: 'Торговля и использование криптовалют запрещены. Центральный банк Египта прямо запретил крипту. Исламские фетвы также относят крипту к "харам".',
      en: 'Trading and using cryptocurrencies are banned. Egypt\'s central bank explicitly prohibited crypto. Islamic fatwas also classify crypto as haram.',
    },
    details: {
      ru: 'Египет разрабатывает собственный цифровой фунт (CBDC) через центральный банк как альтернативу криптовалютам. Запрет опирается на статью 206 закона о центробанке 194/2020: операции возможны только с лицензией, но её не получил никто. Штрафы доходят до 10 млн фунтов.',
      en: 'Egypt is developing its own digital pound (CBDC) through the central bank as an alternative to cryptocurrencies. The ban rests on article 206 of central-bank law 194/2020: activity requires a licence that has never been granted. Fines reach EGP 10 million.',
    },
    taxNote: {
      ru: 'Налогового режима нет: по статье 206 закона 194/2020 операции требуют разрешения центробанка, которого не получил никто. Штрафы от 1 до 10 млн фунтов вместе с лишением свободы.',
      en: 'No tax regime exists: under Article 206 of Law 194 of 2020 the activity requires central bank approval that no entity has received. Fines run from 1m to 10m pounds alongside imprisonment.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'MA', isoNum: '504', slug: 'morocco',
    name: { ru: 'Марокко', en: 'Morocco' },
    status: 'banned',
    summary: {
      ru: 'Все транзакции с криптовалютами запрещены с 2017 года. Office des Changes ввёл штрафы за нарушение.',
      en: 'All cryptocurrency transactions have been banned since 2017. Office des Changes imposed fines for violations.',
    },
    details: {
      ru: 'Несмотря на запрет, Марокко входит в топ-30 мировых рейтингов по крипто-адопции — население использует P2P-биржи. В ноябре 2025 года опубликован законопроект 42.25, написанный по образцу европейского MiCA: он определяет цифровые активы, вводит лицензирование и требует полного обеспечения стейблкоинов. Первые лицензии ожидаются не раньше конца 2026 года.',
      en: 'Despite the ban, Morocco ranks in the global top 30 for crypto adoption — the population uses P2P exchanges. Draft bill 42.25, modelled on the EU\'s MiCA, was published in November 2025: it defines digital assets, introduces licensing and requires stablecoins to be fully backed. First licences are expected no earlier than late 2026.',
    },
    taxNote: {
      ru: 'Налогового режима нет: операции с криптовалютой запрещены как нарушение валютного регулирования. Законопроект 42.25, опубликованный в ноябре 2025 года, ещё не принят.',
      en: 'No tax regime exists: crypto transactions are prohibited as a breach of the exchange regulations. Bill 42.25, published in November 2025, has not been adopted.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'NP', isoNum: '524', slug: 'nepal',
    name: { ru: 'Непал', en: 'Nepal' },
    status: 'banned',
    summary: {
      ru: 'Центральный банк Непала (NRB) запретил все операции с криптовалютами. Полиция проводила аресты за крипто-деятельность.',
      en: 'Nepal Rastra Bank (NRB) banned all cryptocurrency operations. Police have made arrests for crypto activity.',
    },
    details: {
      ru: 'В 2021 несколько человек были арестованы за майнинг и торговлю криптой. Доступ к крипто-сайтам заблокирован. Запрет опирается на валютный закон 1962 года и закон о центробанке 2002 года. Наказание — штраф от одной до трёх сумм сделки и лишение свободы до трёх лет, а по отдельным статьям до семи.',
      en: 'In 2021 several people were arrested for mining and trading crypto. Access to crypto sites is blocked. The ban rests on the 1962 foreign-exchange act and the 2002 central-bank act. Penalties run from one to three times the transaction value plus up to three years\' imprisonment, and up to seven under certain provisions.',
    },
    taxNote: {
      ru: 'Налогового режима нет: запрет охватывает использование, торговлю, вложения и майнинг. Наказание по валютному закону — лишение свободы, штраф, считаемый от суммы сделки, и конфискация активов.',
      en: 'No tax regime exists: the prohibition covers use, trade, investment and mining. Penalties under the foreign exchange act include imprisonment, fines calculated against the transaction amount, and confiscation of the assets.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'TN', isoNum: '788', slug: 'tunisia',
    name: { ru: 'Тунис', en: 'Tunisia' },
    status: 'banned',
    summary: {
      ru: 'Операции с криптовалютой запрещены: валютный кодекс 1976 года считает их несанкционированными валютными операциями. В парламенте с октября 2025 года лежит новый валютный кодекс, который разрешил бы декларировать и держать цифровые активы.',
      en: 'Crypto transactions are prohibited: the 1976 foreign exchange code treats them as unauthorised operations. A new exchange code has been before parliament since October 2025 and would let residents declare and hold digital assets.',
    },
    details: {
      ru: 'Центральный банк Туниса прямо запретил операции с криптовалютами: запрет держится на директиве 2018 года и валютном кодексе 1976 года, нарушение грозит сроком до пяти лет и штрафами. Новый валютный кодекс лежит в парламенте под номером 115/2025 с октября 2025 года: он разрешил бы резиденту декларировать и держать цифровые активы в рамках, заданных центральным банком. Отдельный законопроект в комитете декриминализовал бы владение и ввёл лицензирование поставщиков услуг. Ни один пока не принят.',
      en: 'The Central Bank of Tunisia has expressly prohibited crypto operations: the ban rests on a 2018 directive and the 1976 foreign exchange code, with violations carrying up to five years in prison alongside fines. A new exchange code has sat in parliament as bill 115/2025 since October 2025 and would let a resident declare and hold digital assets inside a framework the central bank defines. A separate bill in committee would decriminalise possession and license service providers. Parliament has adopted neither.',
    },
    taxNote: {
      ru: 'Налогового режима нет, поскольку операции запрещены. Наказание по валютному кодексу доходит до пяти лет лишения свободы и штрафов.',
      en: 'No tax regime exists, since the operations are prohibited. Penalties under the exchange code reach five years in prison alongside fines.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'BD', isoNum: '050', slug: 'bangladesh',
    name: { ru: 'Бангладеш', en: 'Bangladesh' },
    status: 'banned',
    summary: {
      ru: 'Bangladesh Bank запретил все транзакции с криптовалютами. Использование может привести к тюремному сроку по закону об иностранной валюте.',
      en: 'Bangladesh Bank banned all cryptocurrency transactions. Use can lead to imprisonment under foreign exchange law.',
    },
    details: {
      ru: 'Первое предупреждение центрального банка вышло в 2014 году, циркуляр № 17 от 2017 года запретил банкам и финансовым организациям обслуживать криптовалютные операции. Отдельного закона о криптовалюте нет: запрет держится на этом циркуляре, валютном законе 1947 года и законе о противодействии отмыванию денег. Организации, содействующей криптопереводам, грозят отзыв лицензии и уголовное преследование.',
      en: 'The central bank issued its first warning in 2014, and Circular No. 17 of 2017 barred banks and financial institutions from facilitating crypto transactions. Bangladesh has no dedicated crypto law: the prohibition rests on that circular, the foreign exchange act of 1947 and the money laundering prevention act. An entity facilitating crypto remittances risks licence revocation and prosecution.',
    },
    taxNote: {
      ru: 'Налогового режима для цифровых активов Бангладеш не вводил — облагать законным порядком нечего. Любая встреченная ставка описывает несуществующие нормы.',
      en: 'Bangladesh has introduced no tax framework for digital assets, since there is nothing lawful to tax. Any rate you find quoted describes rules nobody wrote.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'BO', isoNum: '068', slug: 'bolivia',
    name: { ru: 'Боливия', en: 'Bolivia' },
    status: 'restricted',
    summary: {
      ru: 'Запрет 2014 года отменён 26 июня 2024 года постановлением Центрального банка 082/2024. Операции с криптоактивами разрешены через авторизованные каналы.',
      en: 'The 2014 ban was lifted on 26 June 2024 by central bank resolution 082/2024. Crypto transactions are permitted through authorised channels.',
    },
    details: {
      ru: 'Владеть, покупать и продавать цифровые активы законно. Регуляторная рамка ещё достраивается: постановлением ASFI 1203/2025 приём заявок от финтех-компаний и бирж продлён до 30 апреля 2026 года. К 2026 году часть банков начала обслуживать операции с USDT.',
      en: 'Owning, buying, and selling digital assets is lawful. The framework is still being built: ASFI resolution 1203/2025 extended the application window for fintech firms and exchanges to 30 April 2026. By 2026 several banks had begun servicing USDT transactions.',
    },
    taxNote: {
      ru: 'Отдельного налогового режима для криптовалюты Боливия не вводила: прибыль подпадает под общие правила. При крупной позиции стоит взять местную консультацию.',
      en: 'Bolivia has introduced no crypto-specific tax regime, so gains fall under the ordinary rules. Take local advice on a substantial position.',
    },
    updatedYear: '2026',
  },

  // ─── UNCLEAR ────────────────────────────────────────────────────────────────
  {
    iso2: 'BY', isoNum: '112', slug: 'belarus',
    name: { ru: 'Беларусь', en: 'Belarus' },
    status: 'legal',
    summary: {
      ru: 'Декрет № 8 от 21 декабря 2017 года легализовал операции с токенами через Парк высоких технологий. С 2025 года операции вне ПВТ облагаются налогом, а пользоваться иностранными биржами с территории страны нельзя.',
      en: 'Decree No. 8 of 21 December 2017 legalised token operations through the Hi-Tech Park. Since 2025 operations outside the park are taxable, and using foreign exchanges from Belarusian territory is barred.',
    },
    details: {
      ru: 'Физлица могут хранить и майнить крипту. Торговля разрешена через резидентов ПВТ. Международные санкции ограничивают доступ к крупным биржам. Декретом №19 от 16 января 2026 года введён статус криптобанка: такие организации попадают в реестр Национального банка, работают с 26 криптовалютами и могут выдавать кредиты под залог криптоактивов. Обязательное условие — резидентство Парка высоких технологий.',
      en: 'Individuals may hold and mine crypto. Trading is permitted through HTP residents. International sanctions limit access to major exchanges. Decree No. 19 of 16 January 2026 created the status of a crypto bank: such firms enter a National Bank register, work with 26 cryptocurrencies and may lend against crypto collateral. Residency in the High-Tech Park is mandatory.',
    },
    taxNote: {
      ru: 'Через резидентов ПВТ — 0%. Вне этого маршрута с 1 января 2025 года действует статья 202¹ Налогового кодекса: 13% с задекларированного дохода и 26% с незадекларированного либо полученного незаконно. Майнинг у физлиц не облагается.',
      en: 'Through Hi-Tech Park residents the rate is zero. Outside that route, Article 202¹ of the Tax Code has applied since 1 January 2025: 13% on declared income and 26% on income that is undeclared or unlawfully obtained. Mining by individuals stays untaxed.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'SA', isoNum: '682', slug: 'saudi-arabia',
    name: { ru: 'Саудовская Аравия', en: 'Saudi Arabia' },
    status: 'unclear',
    summary: {
      ru: 'Официального разрешения или запрета нет. Центральный банк SAMA предупреждает о рисках. Де-факто торговля не запрещена.',
      en: 'No official permit or ban. Central bank SAMA warns of risks. De facto trading is not prohibited.',
    },
    details: {
      ru: 'Саудовская Аравия участвует в крипто-экспериментах в рамках Vision 2030. В 2023 SAMA присоединилась к исследованию международного CBDC (mBridge). Владение криптовалютой законом не запрещено, но с 2018 года банкам нельзя обслуживать операции с ней, а лицензий биржам не выдавалось. Комплексного закона в ближайшие годы не ожидается.',
      en: 'Saudi Arabia participates in crypto experiments under Vision 2030. In 2023 SAMA joined the international CBDC research project (mBridge). Owning crypto is not prohibited by law, but since 2018 banks may not service crypto transactions and no exchange licences have been issued. A comprehensive law is not expected in the near term.',
    },
    taxNote: {
      ru: 'Налоговых правил для криптовалюты Королевство не писало — это следует из отсутствия регуляторной рамки как таковой.',
      en: 'The Kingdom has written no crypto tax rules, which follows from having no regulatory framework at all.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'PK', isoNum: '586', slug: 'pakistan',
    name: { ru: 'Пакистан', en: 'Pakistan' },
    status: 'restricted',
    summary: {
      ru: 'Позиция менялась не раз: с 2018 года центральный банк держал банки в стороне от криптовалюты, а в 2025 году правительство создало криптосовет и учредило регулятора PVARA.',
      en: 'The position has shifted more than once: the central bank kept banks away from crypto from 2018, and in 2025 the government formed a crypto council and created the regulator PVARA.',
    },
    details: {
      ru: 'Закон о виртуальных активах, подписанный 7 марта 2026 года, сделал PVARA постоянным федеральным регулятором вместо указа июля 2025 года: лицензия обязательна для бирж, кошельков, кастодианов и эмитентов токенов, работа без неё грозит штрафом до 50 млн рупий и сроком до пяти лет. Циркуляр Государственного банка от 14 апреля 2026 года вернул лицензированным площадкам доступ к банковским счетам, отменив запрет 2018 года.',
      en: 'The Virtual Assets Act signed on 7 March 2026 made PVARA a permanent federal regulator in place of the July 2025 ordinance: exchanges, wallets, custodians and token issuers must hold a licence, and operating without one carries fines up to PKR 50 million and up to five years in prison. A State Bank circular of 14 April 2026 restored banking access for licensed providers, ending the 2018 ban.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'UZ', isoNum: '860', slug: 'uzbekistan',
    name: { ru: 'Узбекистан', en: 'Uzbekistan' },
    status: 'restricted',
    summary: {
      ru: 'Криптобиржи, криптомагазины, криптодепозитарии и майнинг-пулы лицензирует НАПП. Расчёты криптовалютой внутри страны не допускаются, кроме случаев, установленных законодательством. Майнинг разрешён только по лицензии и по отдельному тарифу.',
      en: 'Crypto exchanges, shops, depositories and mining pools are licensed by the national agency NAPP. Crypto is not a means of domestic payment except where legislation provides. Mining requires a licence and carries its own electricity tariff.',
    },
    details: {
      ru: 'Иностранным гражданам разрешено торговать на лицензированных биржах, а с 1 января 2026 года их зарубежные доходы освобождены от НДФЛ — обслуживать таких клиентов аккредитованы три биржи. Отдельный режим для расчётов стейблкоинами государство готовит, но средством платежа криптоактивы пока не являются. Доступ к крупным иностранным площадкам закрыт, а с 2026 года НАПП вправе отказать в лицензии по мотивированному суждению.',
      en: 'Foreign citizens may trade on licensed exchanges, and since 1 January 2026 their foreign-source income is exempt from personal income tax, with three exchanges accredited to serve them. The state is preparing a separate regime for stablecoin payments, though crypto-assets remain outside the definition of a means of payment. Access to the large foreign platforms is blocked, and since 2026 the agency may refuse a licence on a reasoned judgement.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'ID', isoNum: '360', slug: 'indonesia',
    name: { ru: 'Индонезия', en: 'Indonesia' },
    status: 'restricted',
    summary: {
      ru: 'Криптовалюта разрешена как инвестиционный актив, но не как средство платежа. Надзор за биржами перешёл к финансовому регулятору OJK 10 января 2025 года — до этого рынком занималось товарно-фьючерсное ведомство Bappebti.',
      en: 'Crypto is permitted as an investment asset, though not as a means of payment. Supervision of exchanges passed to the financial regulator OJK on 10 January 2025, having sat with the commodity futures agency Bappebti before that.',
    },
    details: {
      ru: 'Индонезия — один из крупнейших крипторынков ЮВА. Реклама криптовалюты разрешена только лицензированным субъектам. С 10 января 2025 года надзор перешёл от товарного регулятора Bappebti к финансовому OJK, а поправки к закону о финансовом секторе действуют с 17 июня 2026 года: криптоактивы окончательно переведены в разряд цифровых финансовых активов.',
      en: 'Indonesia is one of the largest crypto markets in South-East Asia. Only licensed entities may advertise crypto. Oversight moved from the commodity regulator Bappebti to the financial authority OJK on 10 January 2025, and amendments to the financial-sector law took effect on 17 June 2026, reclassifying crypto as digital financial assets.',
    },
    taxNote: {
      ru: 'Налог берут с суммы сделки, а не с прибыли: окончательные 0,21% при продаже через регулируемую местную площадку и 1% через иностранную, с 1 августа 2025 года. НДС при передаче криптоактивов не возникает.',
      en: 'The tax follows the transaction value and not the gain: a final 0.21% selling through a regulated local platform and 1% through a foreign one, since 1 August 2025. Transfers of crypto assets carry no VAT.',
    },
    updatedYear: '2026',
  },
  {
    iso2: 'PH', isoNum: '608', slug: 'philippines',
    name: { ru: 'Филиппины', en: 'Philippines' },
    status: 'restricted',
    summary: {
      ru: 'Центральный банк лицензирует поставщиков услуг с виртуальными активами с 2017 года, но новые заявки не принимает с сентября 2022 года. Правила комиссии по ценным бумагам для поставщиков услуг с криптоактивами действуют с 5 июля 2025 года.',
      en: 'The central bank has licensed virtual asset service providers since 2017, though it has taken no new applications since September 2022. The securities commission\'s rules for crypto-asset service providers took effect on 5 July 2025.',
    },
    details: {
      ru: 'Филиппины — один из мировых лидеров по P2P-торговле и крипто-гейммингу (Axie Infinity родом отсюда). SEZ Cagayan Zone создала отдельный крипто-хаб. Правила для поставщиков услуг вступили в силу 5 июля 2025 года: требуется регистрация филиппинской компании и оплаченный капитал от 100 млн песо. Новые заявки на лицензию центробанка в 2026 году не принимаются.',
      en: 'Philippines is a global leader in P2P trading and crypto gaming (Axie Infinity originated here). Cagayan SEZ created a separate crypto hub. Rules for crypto-asset service providers took effect on 5 July 2025: a Philippine company and paid-up capital of at least ₱100 million are required. The central bank is not accepting new licence applications in 2026.',
    },
    taxNote: {
      ru: 'Отдельной ставки на прирост капитала для криптовалюты нет: прибыль идёт как обычный доход по прогрессивной шкале от 0% до 35%. Обмен одной монеты на другую налоговая считает выбытием.',
      en: 'No separate capital gains rate applies to crypto: profit counts as ordinary income on the graduated scale running from 0% to 35%. The revenue bureau treats a coin-for-coin swap as a disposal.',
    },
    updatedYear: '2026',
  },
];

export const STATUS_META: Record<RegStatus, { labelRu: string; labelEn: string; color: string; bg: string; border: string }> = {
  legal:      { labelRu: 'Разрешено',         labelEn: 'Legal',       color: '#22c55e', bg: 'bg-green-500/10',  border: 'border-green-500/30' },
  restricted: { labelRu: 'С ограничениями',   labelEn: 'Restricted',  color: '#f59e0b', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  banned:     { labelRu: 'Запрещено',         labelEn: 'Banned',      color: '#ef4444', bg: 'bg-red-500/10',    border: 'border-red-500/30' },
  unclear:    { labelRu: 'Нет данных / серая зона', labelEn: 'Unclear / Grey zone', color: '#6b7280', bg: 'bg-gray-500/10', border: 'border-gray-500/30' },
};

export function getCountryByIsoNum(isoNum: string): CountryReg | undefined {
  return REGULATION_DATA.find(c => c.isoNum === isoNum);
}
