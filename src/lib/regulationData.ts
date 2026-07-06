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
      ru: 'Биржи и кастодиальные кошельки должны получить лицензию согласно MiCA. Физические лица могут свободно покупать, продавать и хранить крипту. Платежи в крипте разрешены по соглашению сторон.',
      en: 'Exchanges and custodial wallets require a MiCA licence. Individuals may freely buy, sell, and hold crypto. Crypto payments are permitted by mutual agreement.',
    },
    taxNote: {
      ru: 'Прибыль от продажи облагается налогом как доход от капитала.',
      en: 'Profits from sale are taxed as capital gains.',
    },
    updatedYear: '2025',
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
      ru: 'Первая страна в мире, принявшая Bitcoin в качестве законного платёжного средства (2021). Bitcoin принимают все магазины.',
      en: 'First country to adopt Bitcoin as legal tender (2021). All businesses are required to accept Bitcoin.',
    },
    details: {
      ru: 'Правительство создало криптокошелёк Chivo. Накапливает Bitcoin в государственных резервах. Привлекает крипто-туристов и компании нулевым налогом на крипто.',
      en: 'Government created the Chivo crypto wallet. Accumulates Bitcoin in national reserves. Attracts crypto tourists and companies with zero tax on crypto.',
    },
    taxNote: {
      ru: 'Нет налога на прибыль от Bitcoin для иностранных инвесторов.',
      en: 'No tax on Bitcoin gains for foreign investors.',
    },
    updatedYear: '2025',
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
      ru: 'Криптовалюты легальны в рамках MiCA. DNB (центральный банк) требует регистрации провайдеров. Строгое исполнение AML.',
      en: 'Crypto is legal under MiCA. DNB (central bank) requires provider registration. Strong AML enforcement.',
    },
    details: {
      ru: 'Нидерланды — один из первых регуляторов в ЕС, начавших применять AMLD5 к крипте. Binance получила здесь первую регистрацию в ЕС.',
      en: 'Netherlands was among the first EU regulators to apply AMLD5 to crypto. Binance obtained its first EU registration here.',
    },
    taxNote: {
      ru: 'Крипто включается в "box 3" (сбережения и инвестиции), облагается 36% от предполагаемого дохода.',
      en: 'Crypto included in "box 3" (savings and investments), taxed at 36% of presumed return.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'NO', isoNum: '578', slug: 'norway',
    name: { ru: 'Норвегия', en: 'Norway' },
    status: 'legal',
    summary: {
      ru: 'Крипто легально и облагается налогом как имущество. Finanstilsynet (регулятор) зарегистрировал несколько провайдеров.',
      en: 'Crypto is legal and taxed as wealth/property. Finanstilsynet (regulator) has registered several providers.',
    },
    details: {
      ru: 'Майнинг Bitcoin разрешён, но электричество дорогое и нет ценовых субсидий. Страна активно внедряет CBDC.',
      en: 'Bitcoin mining is permitted but electricity is costly with no price subsidies. Country is actively piloting CBDC.',
    },
    taxNote: {
      ru: 'Прирост от крипты облагается налогом 22%. Убытки могут быть вычтены.',
      en: 'Crypto gains taxed at 22%. Losses are deductible.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'SE', isoNum: '752', slug: 'sweden',
    name: { ru: 'Швеция', en: 'Sweden' },
    status: 'legal',
    summary: {
      ru: 'Один из ведущих крипто-рынков Скандинавии. Регулирование в рамках MiCA с 2024 года. Swedbank и Nordea предлагают крипто-продукты.',
      en: 'A leading crypto market in Scandinavia. MiCA framework applies since 2024. Swedbank and Nordea offer crypto products.',
    },
    details: {
      ru: 'Ранее Швеция выдавала отдельные лицензии крипто-провайдерам. Теперь заменяется лицензиями MiCA CASP.',
      en: 'Sweden previously granted individual licences to crypto providers. Now replaced by MiCA CASP licences.',
    },
    taxNote: {
      ru: 'Прибыль облагается 30% налогом на прирост капитала. Шведские биржи автоматически сообщают в Skatteverket (налоговую).',
      en: 'Gains taxed at 30% capital gains tax. Swedish exchanges automatically report to Skatteverket (tax authority).',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'EE', isoNum: '233', slug: 'estonia',
    name: { ru: 'Эстония', en: 'Estonia' },
    status: 'legal',
    summary: {
      ru: 'Пионер крипто-регулирования в ЕС. Первой выдавала лицензии крипто-компаниям. С 2024 перешла на режим MiCA.',
      en: 'A pioneer of crypto regulation in the EU. First to issue crypto licences. Transitioned to MiCA regime in 2024.',
    },
    details: {
      ru: 'В 2022 ужесточила выдачу лицензий — 99% провайдеров потеряли лицензии из-за несоответствия. Финансовая разведка FIU надзирает за рынком.',
      en: 'Tightened licensing in 2022 — 99% of providers lost licences for non-compliance. Financial Intelligence Unit FIU supervises the market.',
    },
    taxNote: {
      ru: 'Прибыль от крипты — налог на доход 20%.',
      en: 'Crypto gains taxed as income at 20%.',
    },
    updatedYear: '2025',
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
      ru: 'KNF (надзорный орган) требует регистрации провайдеров. AML-законодательство применяется к криптообменникам.',
      en: 'KNF (supervisory authority) requires provider registration. AML legislation applies to crypto exchanges.',
    },
    taxNote: {
      ru: 'Прибыль от продажи крипты — 19% налог на прирост капитала.',
      en: 'Crypto gains taxed at 19% capital gains tax.',
    },
    updatedYear: '2025',
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
      ru: 'Закон о ЦФА (цифровых финансовых активах) регулирует выпуск токенов. ЦБ РФ против крипты, Минфин — за ограниченное использование. Экспорт с расчётами в крипте разрешён с 2024.',
      en: 'The DFA law (Digital Financial Assets) regulates token issuance. CBR opposes crypto; MinFin supports limited use. Crypto in export settlements permitted since 2024.',
    },
    taxNote: {
      ru: 'Доход от крипты декларируется как доход физлица (НДФЛ 13–15%).',
      en: 'Crypto income declared as personal income (PIT 13–15%).',
    },
    updatedYear: '2025',
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
      ru: 'НКЦПФР (регулятор) должен выдавать лицензии. Сроки запуска сдвигались из-за войны. Украина — один из мировых лидеров по крипто-принятию среди населения.',
      en: 'NSSMC (regulator) to issue licences. Launch was delayed due to the war. Ukraine is a global leader in crypto adoption per capita.',
    },
    taxNote: {
      ru: 'Формально доход от крипты облагается НДФЛ 18% + военный сбор 1.5%. Исполнение слабое.',
      en: 'Formally crypto income is taxed at PIT 18% + military levy 1.5%. Enforcement is weak.',
    },
    updatedYear: '2025',
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
    status: 'restricted',
    summary: {
      ru: 'Крипту можно хранить и торговать. Высокая инфляция песо делает крипту очень популярной. Но крипто-доллары заморожены на биржах особым регулированием.',
      en: 'Crypto may be held and traded. High peso inflation makes crypto very popular. But crypto-dollars are frozen on exchanges by special regulation.',
    },
    details: {
      ru: 'ARCA (налоговый орган) требует декларирования крипто-активов. Правительство Милея дружественно к крипте. Программа легализации активов принята в 2024.',
      en: 'ARCA (tax authority) requires crypto asset declaration. Milei government is crypto-friendly. Asset legalisation programme adopted in 2024.',
    },
    taxNote: {
      ru: 'Налог на доход 15% для резидентов. Валютные ограничения затрудняют ввод/вывод фиата.',
      en: '15% income tax for residents. Currency controls complicate fiat on/off-ramps.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'ZA', isoNum: '710', slug: 'south-africa',
    name: { ru: 'ЮАР', en: 'South Africa' },
    status: 'restricted',
    summary: {
      ru: 'С 2023 крипто-провайдеры должны получать лицензию FSCA. Один из самых активных рынков Африки. Крипта рассматривается как финансовый продукт.',
      en: 'Since 2023 crypto providers must hold an FSCA licence. One of Africa\'s most active markets. Crypto is treated as a financial product.',
    },
    details: {
      ru: 'FSCA — первый в Африке регулятор, создавший обязательный лицензионный режим для крипты. SARB (центробанк) тестирует CBDC.',
      en: 'FSCA is Africa\'s first regulator to create mandatory licensing for crypto. SARB (central bank) is testing a CBDC.',
    },
    taxNote: {
      ru: 'Прибыль от крипты облагается налогом на прирост капитала (включение 40% для физлиц).',
      en: 'Crypto gains subject to CGT (40% inclusion rate for individuals).',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'MX', isoNum: '484', slug: 'mexico',
    name: { ru: 'Мексика', en: 'Mexico' },
    status: 'restricted',
    summary: {
      ru: 'Закон Fintech 2018 разрешает крипту как "виртуальный актив", но банки не обязаны работать с крипто-компаниями. CNBV жёстко ограничивает рекламу.',
      en: 'Fintech Law 2018 permits crypto as a "virtual asset", but banks are not required to serve crypto firms. CNBV strictly restricts advertising.',
    },
    details: {
      ru: 'Только Bitso получила разрешение на работу от CNBV. Иностранные биржи работают в серой зоне. El Peso Digital (CBDC) тестируется.',
      en: 'Only Bitso received CNBV operating permission. Foreign exchanges operate in a grey zone. El Peso Digital (CBDC) is being tested.',
    },
    taxNote: {
      ru: 'SAT (налоговая) требует декларации крипто-доходов. Ставка налога на доход 1.4–35%.',
      en: 'SAT (tax authority) requires crypto income declaration. Income tax rate 1.4–35%.',
    },
    updatedYear: '2025',
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
      ru: 'Биржи должны иметь лицензию SEC Thailand. Иностранные биржи заблокированы. Правительство создаёт крипто-хаб в Phuket.',
      en: 'Exchanges must hold a Thai SEC licence. Foreign exchanges are blocked. The government is creating a crypto hub in Phuket.',
    },
    taxNote: {
      ru: 'Прибыль от крипты — налог на доход 15%. Убытки не компенсируются другими доходами.',
      en: 'Crypto gains taxed at 15% income tax. Losses cannot offset other income.',
    },
    updatedYear: '2025',
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
      ru: 'Ранее Китай занимал до 70% мирового хешрейта Bitcoin. После запрета майнеры переехали в Казахстан, США, Россию. Гражданам запрещено пользоваться иностранными биржами через VPN.',
      en: 'China previously accounted for up to 70% of Bitcoin\'s global hashrate. After the ban, miners relocated to Kazakhstan, the US, and Russia. Citizens are barred from using foreign exchanges via VPN.',
    },
    updatedYear: '2021',
  },
  {
    iso2: 'DZ', isoNum: '012', slug: 'algeria',
    name: { ru: 'Алжир', en: 'Algeria' },
    status: 'banned',
    summary: {
      ru: 'Криптовалюты полностью запрещены с 2018 года. Покупка, продажа, использование и хранение криптовалют — уголовно наказуемые действия.',
      en: 'Cryptocurrencies are fully banned since 2018. Buying, selling, using, and holding crypto are criminal offences.',
    },
    details: {
      ru: 'Закон о финансах 2018 прямо запрещает любое использование виртуальных валют. Центральный банк не признаёт крипту ни в какой форме.',
      en: 'Finance Law 2018 explicitly bans any use of virtual currencies. The central bank does not recognise crypto in any form.',
    },
    updatedYear: '2024',
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
      ru: 'Египет разрабатывает собственный цифровой фунт (CBDC) через центральный банк как альтернативу криптовалютам.',
      en: 'Egypt is developing its own digital pound (CBDC) through the central bank as an alternative to cryptocurrencies.',
    },
    updatedYear: '2024',
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
      ru: 'Несмотря на запрет, Марокко входит в топ-30 мировых рейтингов по крипто-адопции — население использует P2P-биржи.',
      en: 'Despite the ban, Morocco ranks in the global top 30 for crypto adoption — the population uses P2P exchanges.',
    },
    updatedYear: '2024',
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
      ru: 'В 2021 несколько человек были арестованы за майнинг и торговлю криптой. Доступ к крипто-сайтам заблокирован.',
      en: 'In 2021 several people were arrested for mining and trading crypto. Access to crypto sites is blocked.',
    },
    updatedYear: '2024',
  },
  {
    iso2: 'TN', isoNum: '788', slug: 'tunisia',
    name: { ru: 'Тунис', en: 'Tunisia' },
    status: 'banned',
    summary: {
      ru: 'Использование криптовалют физическими лицами запрещено. Одновременно Тунис первым в мире выпустил государственную CBDC — e-Dinar.',
      en: 'Cryptocurrency use by individuals is banned. At the same time, Tunisia was the first country to issue a state CBDC — e-Dinar.',
    },
    details: {
      ru: 'Центральный банк Туниса (BCT) прямо запретил операции с криптовалютами, несмотря на инновации с e-Dinar.',
      en: 'Central Bank of Tunisia (BCT) explicitly banned crypto operations, despite innovations with e-Dinar.',
    },
    updatedYear: '2024',
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
      ru: 'Запрет действует с 2014 года. Последующие предупреждения ужесточили наказание. VPN-использование для доступа к биржам также незаконно.',
      en: 'The ban has been in force since 2014. Subsequent warnings tightened punishments. Using a VPN to access exchanges is also illegal.',
    },
    updatedYear: '2024',
  },
  {
    iso2: 'BO', isoNum: '068', slug: 'bolivia',
    name: { ru: 'Боливия', en: 'Bolivia' },
    status: 'banned',
    summary: {
      ru: 'Центральный банк Боливии запретил Bitcoin и все криптовалюты. Запрет действовал с 2014 по 2024 год, после чего был частично пересмотрен.',
      en: 'Bolivia\'s central bank banned Bitcoin and all cryptocurrencies. The ban was in effect from 2014 to 2024, after which it was partially revised.',
    },
    details: {
      ru: 'В 2024 году Боливия отменила запрет и разрешила использование криптовалют для международных расчётов, стремясь привлечь валютные резервы.',
      en: 'In 2024 Bolivia lifted the ban and permitted crypto for international settlements, seeking to attract foreign currency reserves.',
    },
    updatedYear: '2024',
  },

  // ─── UNCLEAR ────────────────────────────────────────────────────────────────
  {
    iso2: 'BY', isoNum: '112', slug: 'belarus',
    name: { ru: 'Беларусь', en: 'Belarus' },
    status: 'unclear',
    summary: {
      ru: 'Декрет №8 (2018) легализовал крипту в рамках ПВТ (Парк высоких технологий). Вне ПВТ статус крипты неясен.',
      en: 'Decree No. 8 (2018) legalised crypto within the HTP (High Technology Park). Outside HTP, the status is unclear.',
    },
    details: {
      ru: 'Физлица могут хранить и майнить крипту. Торговля разрешена через резидентов ПВТ. Международные санкции ограничивают доступ к крупным биржам.',
      en: 'Individuals may hold and mine crypto. Trading is permitted through HTP residents. International sanctions limit access to major exchanges.',
    },
    updatedYear: '2024',
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
      ru: 'Саудовская Аравия участвует в крипто-экспериментах в рамках Vision 2030. В 2023 SAMA присоединилась к исследованию международного CBDC (mBridge).',
      en: 'Saudi Arabia participates in crypto experiments under Vision 2030. In 2023 SAMA joined the international CBDC research project (mBridge).',
    },
    updatedYear: '2024',
  },
  {
    iso2: 'PK', isoNum: '586', slug: 'pakistan',
    name: { ru: 'Пакистан', en: 'Pakistan' },
    status: 'unclear',
    summary: {
      ru: 'Позиция менялась несколько раз. SBP (центробанк) запрещал крипту, затем рассматривал легализацию. В 2024 создан Совет по крипторегулированию.',
      en: 'The position has changed several times. SBP (central bank) banned crypto, then considered legalisation. A Crypto Regulation Council was established in 2024.',
    },
    details: {
      ru: 'Правительство 2024 года объявило о планах легализовать и обложить налогом крипту для пополнения бюджета. Финальных законов ещё нет.',
      en: 'The 2024 government announced plans to legalise and tax crypto to boost revenues. No final laws yet.',
    },
    updatedYear: '2025',
  },
  {
    iso2: 'UZ', isoNum: '860', slug: 'uzbekistan',
    name: { ru: 'Узбекистан', en: 'Uzbekistan' },
    status: 'unclear',
    summary: {
      ru: 'Крипто-биржи лицензируются MIFT. Но использование крипты для внутренних расчётов запрещено. Майнинг разрешён только с лицензией.',
      en: 'Crypto exchanges are licensed by MIFT. But using crypto for domestic settlements is banned. Mining is allowed only with a licence.',
    },
    details: {
      ru: 'Узбекистан создал регуляторную «песочницу» для крипто-компаний. Иностранным гражданам разрешено торговать на лицензированных биржах.',
      en: 'Uzbekistan created a regulatory sandbox for crypto firms. Foreign citizens are permitted to trade on licensed exchanges.',
    },
    updatedYear: '2024',
  },
  {
    iso2: 'ID', isoNum: '360', slug: 'indonesia',
    name: { ru: 'Индонезия', en: 'Indonesia' },
    status: 'restricted',
    summary: {
      ru: 'Крипта разрешена как инвестиционный актив (не средство платежа). Биржи регулируются OJK с 2023 года.',
      en: 'Crypto is permitted as an investment asset (not a means of payment). Exchanges regulated by OJK since 2023.',
    },
    details: {
      ru: 'Индонезия — один из крупнейших крипторынков ЮВА. OJK сменила Bappebti как регулятор в 2023. Реклама крипты разрешена только лицензированным субъектам.',
      en: 'Indonesia is one of the largest crypto markets in SEA. OJK replaced Bappebti as regulator in 2023. Crypto advertising is only permitted for licensed entities.',
    },
    taxNote: {
      ru: 'Налог на крипто-сделки: 0.1% на каждую транзакцию через лицензированные биржи.',
      en: 'Crypto transaction tax: 0.1% on each transaction through licensed exchanges.',
    },
    updatedYear: '2024',
  },
  {
    iso2: 'PH', isoNum: '608', slug: 'philippines',
    name: { ru: 'Филиппины', en: 'Philippines' },
    status: 'restricted',
    summary: {
      ru: 'BSP (центробанк) лицензирует VASP (провайдеров виртуальных активов) с 2017 года. Крипта как средство платежа разрешена на платформах с лицензией.',
      en: 'BSP (central bank) has licensed VASPs (virtual asset service providers) since 2017. Crypto as payment is allowed on licensed platforms.',
    },
    details: {
      ru: 'Филиппины — один из мировых лидеров по P2P-торговле и крипто-гейммингу (Axie Infinity родом отсюда). SEZ Cagayan Zone создала отдельный крипто-хаб.',
      en: 'Philippines is a global leader in P2P trading and crypto gaming (Axie Infinity originated here). Cagayan SEZ created a separate crypto hub.',
    },
    taxNote: {
      ru: 'Доход от крипты облагается налогом как обычный доход (ставка до 35%).',
      en: 'Crypto income taxed as ordinary income (rate up to 35%).',
    },
    updatedYear: '2024',
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
