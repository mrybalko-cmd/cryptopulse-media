/**
 * Карточки сервисов каталога.
 *
 * Цены сверены с официальными прайсами вручную. Правило одно и жёсткое:
 * `priceCheckedAt` ставится только там, где тариф прочитан на странице самой
 * компании или в её официальном объявлении. Где прайс закрыт, расходится
 * между регионами или устроен так, что «цены в месяц» просто нет (оплата по
 * объёму), поле остаётся пустым — на карточке это видно подписью
 * «Цена не сверена». Пустое поле честнее выдуманной даты.
 *
 * `facets` содержит только то, что проверяется руками. Ключи free, cheap,
 * mid, pricey, perseat и usage выводятся из тарифов кодом (derivedFacets) и
 * здесь не дублируются — иначе при первой же правке цены они разъедутся.
 */

export interface SeedPlan {
  name: string;
  price: number | null;
  currency?: 'USD' | 'EUR';
  unit?: 'month' | 'seat' | 'usage' | 'once';
  includes?: { ru: string; en: string };
  recommended?: boolean;
}

export interface SeedService {
  slug: string;
  name: string;
  monogram: string;
  brandColor: string;
  job: string;
  rank: number;
  website: string;
  pricingUrl: string;
  foundedYear?: number;
  plans: SeedPlan[];
  facets: string[];
  tagline: { ru: string; en: string };
  highlight: { ru: string; en: string };
  features: { ru: string[]; en: string[] };
  about: { ru: string; en: string };
  priceCheckedAt?: string;
  sources: string[];
}

const D = '2026-10-12';

export const SERVICES: SeedService[] = [
  /* ── Генерация видео ───────────────────────────────────────────── */
  {
    slug: 'runway',
    name: 'Runway',
    monogram: 'RW',
    brandColor: '#000000',
    job: 'video',
    rank: 2,
    website: 'https://runwayml.com',
    pricingUrl: 'https://runwayml.com/pricing',
    foundedYear: 2018,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'разовый запас кредитов, водяной знак', en: 'one-off credit batch, watermark' } },
      { name: 'Standard', price: 15, recommended: true, includes: { ru: '625 кредитов в месяц, 4K, без знака', en: '625 credits a month, 4K, no watermark' } },
      { name: 'Pro', price: 35, includes: { ru: '2250 кредитов, своя озвучка', en: '2,250 credits, custom voices' } },
      { name: 'Unlimited', price: 95, includes: { ru: 'без лимита в медленном режиме', en: 'unlimited in relaxed mode' } },
    ],
    facets: ['v4k', 'v1080', 'vnomark', 'vref', 'vlip', 'api', 'fmark', 'fexpire'],
    tagline: {
      ru: 'Видеомодель с полным монтажным столом вокруг неё',
      en: 'A video model with a full editing suite around it',
    },
    highlight: {
      ru: 'Единственный из генераторов, где рядом с моделью стоит монтаж: кадр можно продлить, перекрасить и переозвучить, не выходя наружу',
      en: 'The only generator with an editor beside the model: you extend, recolour and re-voice a shot without leaving the tab',
    },
    features: {
      ru: ['4K и без водяного знака уже на тарифе за $15', 'Генерация по своей картинке или по видео', 'Инструменты монтажа: удаление объектов, ротоскоп', 'API для встраивания в свой продукт'],
      en: ['4K and watermark-free from the $15 plan', 'Generate from your own frame or an existing clip', 'Editing tools: object removal, rotoscoping', 'API for building it into your own product'],
    },
    about: {
      ru: 'Runway основали в 2018 году Кристобаль Валенсуэла, Анастасис Германидис и Алехандро Матамала — они познакомились в Нью-Йоркском университете и начинали с того, что делали нейросети доступными художникам. Первый коммерческий успех пришёл не от генерации, а от монтажных инструментов: Runway сняли фон без зелёного экрана раньше, чем это стало обычным делом. Модель Gen-3 и следующие за ней вывели компанию в число тех, чьи ролики попадают в кино и рекламу: студия участвовала в постпродакшне «Всё везде и сразу». Сегодня это не только модель, а рабочее место: кадр генерируется и тут же правится, что отличает Runway от конкурентов, где после экспорта начинается вторая программа.',
      en: 'Runway was started in 2018 by Cristóbal Valenzuela, Anastasis Germanidis and Alejandro Matamala, who met at NYU while trying to put neural networks into the hands of artists. Its first commercial win came from editing rather than generation: Runway could pull a background without a green screen before that was ordinary. Gen-3 and the models after it moved the company into film and advertising work, including post-production on Everything Everywhere All at Once. What separates it from the rest is that the shot you generate stays editable in the same place, instead of starting a second piece of software after export.',
    },
    priceCheckedAt: D,
    sources: ['https://runwayml.com/pricing'],
  },
  {
    slug: 'kling-ai',
    name: 'Kling AI',
    monogram: 'KL',
    brandColor: '#1f2937',
    job: 'video',
    rank: 3,
    website: 'https://klingai.com',
    pricingUrl: 'https://klingai.com/membership',
    foundedYear: 2024,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '66 кредитов в день, не переносятся', en: '66 daily credits, no rollover' } },
      { name: 'Standard', price: 10, includes: { ru: '660 кредитов в месяц', en: '660 credits a month' } },
      { name: 'Pro', price: 37, recommended: true, includes: { ru: '3000 кредитов, 4K', en: '3,000 credits, 4K' } },
      { name: 'Premier', price: 92, includes: { ru: '8000 кредитов, приоритет', en: '8,000 credits, priority queue' } },
    ],
    facets: ['v4k', 'v1080', 'vnomark', 'vref', 'vlip', 'vlong', 'api', 'mob', 'fexpire'],
    tagline: {
      ru: 'Движение в кадре, которое выдерживает длинный план',
      en: 'Motion that holds up across a long take',
    },
    highlight: {
      ru: 'Держит физику движения на планах, где другие модели начинают ломать руки и лица, — за счёт этого попал в рейтинг выручки из Китая',
      en: 'Holds physical motion together on takes where rival models start breaking hands and faces, which is how a Chinese app reached the revenue list',
    },
    features: {
      ru: ['Нативный 4K — но только с тарифа $37', 'Расширение ролика до двух-трёх минут', 'Липсинк под загруженную озвучку', 'Бесплатные кредиты сгорают за сутки'],
      en: ['Native 4K, but only from the $37 plan', 'Extend a clip out to two or three minutes', 'Lip-sync to an uploaded voice track', 'Free credits expire within 24 hours'],
    },
    about: {
      ru: 'Kling выпустила Kuaishou — вторая по размеру короткометражная видеоплатформа Китая, которая конкурирует с Douyin и собирала данные о видео задолго до того, как появились генеративные модели. Публичный запуск состоялся в июне 2024 года, и за первый год сервис дошёл до мирового рейтинга выручки, что для китайского приложения вне игровой категории редкость. Сильная сторона у Kling одна и считываемая глазом: связность движения. Там, где другие модели на второй секунде ломают анатомию, Kling чаще доводит план до конца. Обратная сторона — тарифная сетка: 4K открывается только с третьего уровня, а бесплатные кредиты сгорают через сутки и не переносятся.',
      en: 'Kling comes from Kuaishou, China’s second-largest short-video platform and a direct rival to Douyin, which had been accumulating video data long before generative models existed. It launched publicly in June 2024 and reached the global revenue rankings inside a year — unusual for a Chinese app outside gaming. Its one legible strength is motion coherence: where other models break anatomy two seconds in, Kling more often carries a take to the end. The trade-off sits in the pricing table, where 4K unlocks only on the third tier and free credits burn off within a day rather than rolling over.',
    },
    priceCheckedAt: D,
    sources: ['https://klingai.com/membership'],
  },
  {
    slug: 'heygen',
    name: 'HeyGen',
    monogram: 'HG',
    brandColor: '#3b82f6',
    job: 'video',
    rank: 5,
    website: 'https://heygen.com',
    pricingUrl: 'https://heygen.com/pricing',
    foundedYear: 2020,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '3 видео в месяц, водяной знак', en: '3 videos a month, watermark' } },
      { name: 'Creator', price: 29, recommended: true, includes: { ru: 'без знака, 1080p', en: 'no watermark, 1080p' } },
      { name: 'Team', price: 49, unit: 'seat', includes: { ru: 'общая библиотека аватаров', en: 'shared avatar library' } },
      { name: 'Scale', price: 149, includes: { ru: '4K, API, озвучка на 175 языках', en: '4K, API, 175 languages' } },
    ],
    facets: ['vavatar', 'vlip', 'v1080', 'v4k', 'vnomark', 'vlong', 'api', 'fmark'],
    tagline: {
      ru: 'Говорящий аватар вместо съёмочного дня',
      en: 'A talking avatar instead of a shoot day',
    },
    highlight: {
      ru: 'Переозвучивает снятое видео на другой язык и переставляет губы под новую речь — в кадре остаётся тот же человек',
      en: 'Re-voices footage into another language and reshapes the mouth to the new speech, keeping the same person on screen',
    },
    features: {
      ru: ['Свой аватар по одной записи с телефона', 'Перевод видео с перестановкой губ', 'Больше 170 языков озвучки', 'Шаблоны под обучение и продажи'],
      en: ['Your own avatar from one phone recording', 'Video translation with lip reshaping', 'Over 170 voice-over languages', 'Templates for training and sales'],
    },
    about: {
      ru: 'HeyGen основали в 2020 году Джошуа Сюй и Уэйн Лю, работавшие до этого в Snap; компания начиналась под именем Movio и делала видео для отделов продаж. Поворот случился, когда к шаблонным роликам добавили аватар, повторяющий речь: обучающее видео перестало требовать камеры, света и человека в кадре. Сейчас основная ставка — перевод: сервис берёт уже снятое видео, озвучивает его на другом языке и переставляет движение губ под новую дорожку, из-за чего локализация курса перестала быть съёмочным проектом. В январе 2026 года компания закрыла тариф Team для новых подписчиков, и это стоит учитывать, выбирая план под команду.',
      en: 'HeyGen was founded in 2020 by Joshua Xu and Wayne Liang, both previously at Snap, and spent its first years as Movio making videos for sales teams. The turn came when a speaking avatar was added to those templates: a training video no longer needed a camera, lights, or a person on set. Its main bet now is translation — the service takes existing footage, voices it in another language and reshapes the mouth to the new track, which takes localising a course out of the production budget. In January 2026 the company closed the Team plan to new subscribers, which is worth knowing when picking a plan for a group.',
    },
    priceCheckedAt: D,
    sources: ['https://heygen.com/pricing'],
  },
  {
    slug: 'descript',
    name: 'Descript',
    monogram: 'DS',
    brandColor: '#2f3fd0',
    job: 'video',
    rank: 15,
    website: 'https://descript.com',
    pricingUrl: 'https://descript.com/pricing',
    foundedYear: 2017,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '60 минут расшифровки, 720p со знаком', en: '60 transcript minutes, watermarked 720p' } },
      { name: 'Hobbyist', price: 24, includes: { ru: '10 часов расшифровки, 4K', en: '10 transcript hours, 4K' } },
      { name: 'Creator', price: 35, recommended: true, includes: { ru: '30 часов, клон голоса', en: '30 hours, voice clone' } },
      { name: 'Business', price: 65, unit: 'seat', includes: { ru: 'бренд-шаблоны, SSO', en: 'brand templates, SSO' } },
    ],
    facets: ['v4k', 'v1080', 'vnomark', 'vlong', 'sso', 'desktop', 'fmark'],
    tagline: {
      ru: 'Монтаж видео правкой текста расшифровки',
      en: 'Edit video by editing the transcript',
    },
    highlight: {
      ru: 'Удалённое слово в расшифровке вырезается из видео — монтаж подкаста превращается в правку документа',
      en: 'Delete a word in the transcript and it leaves the video: podcast editing becomes document editing',
    },
    features: {
      ru: ['Удаление слов-филлеров одной кнопкой', 'Клон голоса для перезаписи фразы', 'Съёмка экрана и созвонов', 'Бесплатный тариф пишет водяной знак'],
      en: ['Strip filler words in one click', 'Voice clone to re-record a line', 'Screen and call recording', 'Free tier stamps a watermark'],
    },
    about: {
      ru: 'Descript создал в 2017 году Эндрю Мейсон — до этого он основал Groupon и вывел его на биржу, а потом занялся аудиогидами, из которых и выросла идея редактора. Логика сервиса простая и ни у кого больше не доведена до такой степени: запись превращается в текст, а правка текста меняет саму запись. Для подкаста и обучающего видео это снимает главную боль — не нужно искать нужную секунду на таймлайне. Компания последовательно добавляла вокруг этой идеи остальное: запись экрана, клон голоса для досъёмки одной фразы, удаление «эээ» одним нажатием. Бесплатный тариф тут ознакомительный: шестьдесят минут расшифровки и водяной знак на выгрузке.',
      en: 'Descript was built in 2017 by Andrew Mason, who had founded Groupon and taken it public before moving into audio tours — the project the editor grew out of. Its logic is simple and nobody else has pushed it as far: the recording becomes text, and editing the text edits the recording. For podcasts and training video that removes the real pain, which is hunting for the right second on a timeline. Everything since has been built around that one idea: screen capture, a voice clone for re-recording a single line, one-click removal of every "um". The free tier is a demo rather than a plan — sixty transcript minutes and a watermark on export.',
    },
    priceCheckedAt: D,
    sources: ['https://descript.com/pricing'],
  },
  {
    slug: 'invideo',
    name: 'InVideo',
    monogram: 'IV',
    brandColor: '#e11d48',
    job: 'video',
    rank: 22,
    website: 'https://invideo.io',
    pricingUrl: 'https://invideo.io/pricing',
    foundedYear: 2017,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'около 10 минут в неделю, водяной знак', en: 'about 10 minutes a week, watermark' } },
      { name: 'Plus', price: 28, recommended: true, includes: { ru: '50 минут генерации в месяц', en: '50 generated minutes a month' } },
      { name: 'Max', price: 60, includes: { ru: '200 минут, 4K', en: '200 minutes, 4K' } },
      { name: 'Generative', price: 120, includes: { ru: 'доступ к премиальным моделям', en: 'access to premium models' } },
    ],
    facets: ['v1080', 'v4k', 'vnomark', 'vlong', 'vsound', 'fmark'],
    tagline: {
      ru: 'Готовый ролик из одного текстового задания',
      en: 'A finished clip from one written brief',
    },
    highlight: {
      ru: 'Собирает полный ролик с озвучкой, подписями и музыкой из одного абзаца задания, без раскадровки по кускам',
      en: 'Assembles a complete clip with voice-over, captions and music from a single paragraph of brief, with no shot-by-shot work',
    },
    features: {
      ru: ['Сценарий, озвучка и подписи в одном проходе', 'Правки голосовой командой', 'Библиотека стоковых кадров внутри', 'Бесплатный тариф ограничен минутами в неделю'],
      en: ['Script, voice-over and captions in one pass', 'Edits by spoken command', 'Stock footage library built in', 'Free tier capped by minutes per week'],
    },
    about: {
      ru: 'InVideo основали в 2017 году Санкет Шах и Харш Вахария; компания выросла из редактора шаблонов для малого бизнеса и дольше многих жила на рынке, где главным товаром были готовые заготовки. Генеративный разворот дал ей неожиданное преимущество: вокруг модели уже был собран рабочий конвейер со стоком, подписями и озвучкой, поэтому ролик выходит не кадром, а готовым изделием. Сервис ориентируется на тех, кому нужно много однотипного видео: продуктовые карточки, короткие обзоры, объявления. Бесплатный тариф тут самый жёсткий в задаче — около десяти минут в неделю и водяной знак.',
      en: 'InVideo was founded in 2017 by Sanket Shah and Harsh Vakharia, growing out of a template editor for small businesses and surviving longer than most in a market whose product was pre-made assets. The generative turn handed it an advantage: a working pipeline with stock, captions and voice-over already surrounded the model, so what comes out is a finished piece rather than a shot. It aims at people who need a lot of similar video — product cards, short reviews, listings. Its free tier is the tightest in this job: roughly ten minutes a week, watermarked.',
    },
    priceCheckedAt: D,
    sources: ['https://invideo.io/pricing'],
  },
  {
    slug: 'higgsfield',
    name: 'Higgsfield',
    monogram: 'HF',
    brandColor: '#0f172a',
    job: 'video',
    rank: 30,
    website: 'https://higgsfield.ai',
    pricingUrl: 'https://higgsfield.ai/pricing',
    foundedYear: 2023,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'небольшой запас дневных кредитов', en: 'a small daily credit allowance' } },
      { name: 'Basic', price: 9, includes: { ru: '120 кредитов в месяц', en: '120 credits a month' } },
      { name: 'Pro', price: 29, recommended: true, includes: { ru: '600–900 кредитов', en: '600–900 credits' } },
      { name: 'Max', price: 79, includes: { ru: 'до 5400 кредитов', en: 'up to 5,400 credits' } },
    ],
    facets: ['v1080', 'vref', 'vnomark', 'api'],
    tagline: {
      ru: 'Движение камеры задаётся выбором приёма',
      en: 'Camera moves picked from a list of shots',
    },
    highlight: {
      ru: 'Движение камеры выбирается из списка приёмов — проезд, облёт, резкий зум, — а не описывается словами в надежде, что модель поймёт',
      en: 'You pick the camera move from a list of named shots — dolly, orbit, crash zoom — instead of describing it and hoping the model guesses',
    },
    features: {
      ru: ['Каталог операторских приёмов вместо описаний', 'Генерация по своей фотографии', 'Скидка при оплате за год', 'Цена за год и за месяц различается вдвое'],
      en: ['A catalogue of camera moves instead of prose', 'Generate from your own photograph', 'Discount for paying annually', 'Annual and monthly rates differ by half'],
    },
    about: {
      ru: 'Higgsfield основал в 2023 году Алекс Машрабов — до этого он возглавлял направление генеративного AI в Snap и продал туда свою предыдущую компанию. Продукт отвечает на жалобу, знакомую каждому, кто писал задания видеомодели: описать движение камеры словами почти невозможно. Вместо этого Higgsfield предлагает выбрать приём из списка — проезд, облёт, резкий наезд, — и модель отрабатывает именно его. Такая постановка задачи сделала сервис популярным у тех, кто снимает короткие рекламные вставки, где нужен конкретный кадр, а не красивая случайность. Тарифы заметно дешевеют при оплате за год, поэтому месячная и годовая цена здесь различаются почти вдвое.',
      en: 'Higgsfield was founded in 2023 by Alex Mashrabov, who previously ran generative AI at Snap after selling his earlier company into it. The product answers a complaint familiar to anyone who has written prompts for a video model: describing a camera move in words barely works. Higgsfield instead lets you pick the move from a list — dolly, orbit, crash zoom — and the model performs that one. Framing the task that way made it popular with people cutting short ad inserts, where a specific shot matters more than a pretty accident. Paying by the year cuts the rate sharply, so monthly and annual pricing here differ by nearly half.',
    },
    priceCheckedAt: D,
    sources: ['https://higgsfield.ai/pricing'],
  },

  /* ── Генерация изображений ─────────────────────────────────────── */
  {
    slug: 'midjourney',
    name: 'Midjourney',
    monogram: 'MJ',
    brandColor: '#0b0b0f',
    job: 'images',
    rank: 1,
    website: 'https://midjourney.com',
    pricingUrl: 'https://midjourney.com/account',
    foundedYear: 2021,
    plans: [
      { name: 'Basic', price: 10, includes: { ru: '200 генераций в месяц', en: '200 generations a month' } },
      { name: 'Standard', price: 30, recommended: true, includes: { ru: '15 часов быстрого режима, медленный без лимита', en: '15 fast hours, unlimited relaxed' } },
      { name: 'Pro', price: 60, includes: { ru: '30 часов, скрытый режим', en: '30 hours, stealth mode' } },
      { name: 'Mega', price: 120, includes: { ru: '60 часов быстрого режима', en: '60 fast hours' } },
    ],
    facets: ['i4k', 'iportrait'],
    tagline: {
      ru: 'Самая узнаваемая картинка в отрасли и ни одного бесплатного запроса',
      en: 'The most recognisable look in the field, and not one free prompt',
    },
    highlight: {
      ru: 'Единственный сервис первой десятки рейтинга без бесплатного тарифа вообще — и при этом с самой высокой выручкой среди генераторов картинок',
      en: 'The only service in the top ten with no free tier at all, and still the highest-grossing image generator of the lot',
    },
    features: {
      ru: ['Узнаваемый художественный почерк модели', 'Параметры стиля и его переноса между работами', 'Скрытый режим только с тарифа $60', 'Бесплатных пробных генераций нет'],
      en: ['A recognisable house style', 'Style reference and transfer between works', 'Stealth mode only from the $60 plan', 'No free trial generations at all'],
    },
    about: {
      ru: 'Midjourney основал в 2021 году Дэвид Хольц, до этого продавший Leap Motion. Компания устроена не как стартап: внешних раундов она не поднимала, живёт с подписок и годами работала через Discord, а не через сайт. Это дало ей редкую независимость — продукт развивается в ту сторону, которую выбирает небольшая исследовательская группа, а не инвестор. Художественный почерк модели узнаётся без подписи, и именно он держит выручку: Midjourney остаётся самым дорогим способом получить картинку и при этом самым кассовым. Бесплатного тарифа здесь нет совсем, пробных генераций тоже — дешёвый вход закрылся в 2023 году и не возвращался.',
      en: 'Midjourney was founded in 2021 by David Holz, who had previously sold Leap Motion. The company is not shaped like a startup: it raised no outside rounds, runs on subscriptions, and for years worked through Discord rather than a website. That bought it unusual independence, with the product moving where a small research group decides rather than where an investor does. The model’s house style is recognisable without a caption, and that style is what holds the revenue: Midjourney remains the most expensive way to get an image and the highest-grossing one. There is no free tier and no trial generations — the cheap entry closed in 2023 and never came back.',
    },
    priceCheckedAt: D,
    sources: ['https://docs.midjourney.com/hc/en-us/articles/19684414179981-Subscription-Plans'],
  },
  {
    slug: 'ideogram',
    name: 'Ideogram',
    monogram: 'ID',
    brandColor: '#1d4ed8',
    job: 'images',
    rank: 7,
    website: 'https://ideogram.ai',
    pricingUrl: 'https://ideogram.ai/pricing',
    foundedYear: 2022,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '10 медленных генераций в неделю', en: '10 slow generations a week' } },
      { name: 'Plus', price: 20, recommended: true, includes: { ru: '400 быстрых генераций, приватность', en: '400 fast generations, private mode' } },
      { name: 'Pro', price: 60, includes: { ru: '1000 быстрых генераций', en: '1,000 fast generations' } },
    ],
    facets: ['itext', 'i4k', 'ibatch', 'api', 'fexpire'],
    tagline: {
      ru: 'Текст на картинке, который не надо переделывать',
      en: 'Text in the image that you do not have to redo',
    },
    highlight: {
      ru: 'Пишет на картинке читаемые слова и целые вывески — задача, на которой до него спотыкались все генераторы',
      en: 'Renders legible words and whole signs inside an image — the task every generator before it stumbled on',
    },
    features: {
      ru: ['Надписи и вывески без искажений букв', 'Шаблоны под логотипы и обложки', 'Бесплатно — десять медленных генераций в неделю', 'Приватный режим только на платном'],
      en: ['Signage and captions without mangled letters', 'Templates for logos and covers', 'Free tier: ten slow generations a week', 'Private mode on paid plans only'],
    },
    about: {
      ru: 'Ideogram собрали в 2022 году выходцы из Google Brain во главе с Мохаммадом Норузи — одним из авторов работ по генерации изображений в Google. Компания взялась за узкую и обидную проблему: модели рисовали прекрасный плакат, на котором нельзя было прочитать ни слова. Ideogram первым выдал надписи, которые не нужно переклеивать в редакторе, и этим занял свою нишу в маркетинге и дизайне обложек. Бесплатный тариф скромный — десять медленных генераций в неделю, — но он существует, в отличие от Midjourney.',
      en: 'Ideogram was assembled in 2022 by former Google Brain researchers led by Mohammad Norouzi, a co-author of Google’s image-generation work. It went after a narrow and galling problem: models produced beautiful posters on which not a single word was readable. Ideogram was the first to render captions nobody had to paste over in an editor, and that won it a place in marketing and cover design. The free tier is modest — ten slow generations a week — but unlike Midjourney it exists.',
    },
    priceCheckedAt: D,
    sources: ['https://ideogram.ai/pricing'],
  },
  {
    slug: 'recraft',
    name: 'Recraft',
    monogram: 'RC',
    brandColor: '#111827',
    job: 'images',
    rank: 8,
    website: 'https://recraft.ai',
    pricingUrl: 'https://recraft.ai/pricing',
    foundedYear: 2022,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '50 кредитов в день, результат публичный', en: '50 daily credits, output is public' } },
      { name: 'Basic', price: 12, recommended: true, includes: { ru: '1000 кредитов, приватность, лицензия', en: '1,000 credits, private, licensed' } },
      { name: 'Advanced', price: 20, includes: { ru: '2000 кредитов, вектор', en: '2,000 credits, vector output' } },
    ],
    facets: ['ivector', 'itext', 'i4k', 'ibatch', 'api', 'fnocomm'],
    tagline: {
      ru: 'Генератор, который отдаёт SVG, а не картинку',
      en: 'A generator that hands back SVG, not a bitmap',
    },
    highlight: {
      ru: 'Выдаёт настоящий вектор: иконку или логотип можно открыть в редакторе и править по узлам, а не перерисовывать заново',
      en: 'Produces real vectors: an icon or logo opens in an editor and is edited by nodes instead of being redrawn',
    },
    features: {
      ru: ['SVG на выходе, а не растр', 'Свой стиль обучается на своих же работах', 'Бесплатный результат уходит в общую галерею', 'Коммерческая лицензия только с $12'],
      en: ['SVG output rather than raster', 'Train a house style on your own work', 'Free output lands in a public gallery', 'Commercial licence only from $12'],
    },
    about: {
      ru: 'Recraft основала в 2022 году Анна Вероника Дорогуш — до этого она вела разработку CatBoost в Яндексе, одной из самых используемых библиотек градиентного бустинга. Компания зарегистрирована в Лондоне и выбрала направление, которое остальные обошли: вектор. Дизайнеру нужен не красивый PNG, а файл, который открывается в редакторе и правится по узлам, и Recraft единственный из рейтинга отдаёт такой результат напрямую. Бесплатный тариф стоит читать внимательно: пятьдесят кредитов в день есть, но результат публикуется в общую галерею и коммерческой лицензии не имеет.',
      en: 'Recraft was founded in 2022 by Anna Veronika Dorogush, who had led CatBoost at Yandex — one of the most widely used gradient-boosting libraries. The company is registered in London and took the direction everyone else skipped: vectors. A designer needs a file that opens in an editor and is edited by nodes, not a pretty PNG, and Recraft is the only entry on the list that hands that back directly. Read the free tier closely, though: fifty daily credits are real, but the output is published to a shared gallery and carries no commercial licence.',
    },
    priceCheckedAt: D,
    sources: ['https://recraft.ai/pricing'],
  },
  {
    slug: 'photoroom',
    name: 'Photoroom',
    monogram: 'PR',
    brandColor: '#7c3aed',
    job: 'images',
    rank: 20,
    website: 'https://photoroom.com',
    pricingUrl: 'https://photoroom.com/pricing',
    foundedYear: 2019,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '250 выгрузок в месяц со знаком', en: '250 watermarked exports a month' } },
      { name: 'Pro', price: 7.5, recommended: true, includes: { ru: 'без знака, пакетная обработка', en: 'no watermark, batch editing' } },
      { name: 'Pro Plus', price: 20.99, includes: { ru: 'больше генераций и шаблонов', en: 'more generations and templates' } },
      { name: 'Teams', price: 82.5, includes: { ru: 'общие бренд-шаблоны', en: 'shared brand templates' } },
    ],
    facets: ['ibg', 'ibatch', 'iportrait', 'mob', 'api', 'fmark'],
    tagline: {
      ru: 'Фон под товар, снятый на телефон',
      en: 'A backdrop for a product shot on a phone',
    },
    highlight: {
      ru: 'Ставит снятый на телефон товар в сгенерированную сцену и обрабатывает сразу всю выгрузку каталога, а не по одной карточке',
      en: 'Drops a phone-shot product into a generated scene and processes a whole catalogue export at once rather than card by card',
    },
    features: {
      ru: ['Снятие фона и подстановка сцены', 'Пакетная обработка каталога', 'Приложение на телефоне, а не только сайт', 'Бесплатно — 250 выгрузок со знаком'],
      en: ['Background removal and scene replacement', 'Batch processing for a catalogue', 'A phone app, not only a website', 'Free: 250 watermarked exports'],
    },
    about: {
      ru: 'Photoroom основали в 2019 году в Париже Матьё Руиф и Элиот Андрес; Руиф до этого работал в GoPro, и первая версия продукта решала ровно одну задачу — убрать фон с фотографии товара. На этой задаче компания и выросла: продавцам на маркетплейсах нужна не художественная картинка, а пятьсот однотипных карточек на белом. Сегодня сервис умеет не только вырезать фон, но и ставить товар в сгенерированную сцену, причём делает это пачками. Бесплатный тариф щедрее многих — двести пятьдесят выгрузок в месяц, — но с водяным знаком.',
      en: 'Photoroom was founded in 2019 in Paris by Matthieu Rouif and Eliot Andres; Rouif had come from GoPro, and the first version solved exactly one problem — lifting the background off a product photo. That problem is what the company grew on: marketplace sellers do not need art, they need five hundred identical cards on white. The service now also places a product into a generated scene, and does it in batches. Its free tier is more generous than most at 250 exports a month, but every one carries a watermark.',
    },
    priceCheckedAt: D,
    sources: ['https://photoroom.com/pricing'],
  },
  {
    slug: 'topaz-labs',
    name: 'Topaz Labs',
    monogram: 'TZ',
    brandColor: '#0e7490',
    job: 'images',
    rank: 21,
    website: 'https://topazlabs.com',
    pricingUrl: 'https://topazlabs.com/pricing',
    foundedYear: 2006,
    plans: [
      { name: 'Starter', price: 19, recommended: true, includes: { ru: 'подписка на все программы', en: 'subscription to the whole suite' } },
      { name: 'Photo AI (год)', price: 199, unit: 'once', includes: { ru: 'разовая лицензия на год обновлений', en: 'one-off licence with a year of updates' } },
      { name: 'Video AI (год)', price: 299, unit: 'once', includes: { ru: 'разовая лицензия на год обновлений', en: 'one-off licence with a year of updates' } },
      { name: 'Studio (год)', price: 399, unit: 'once', includes: { ru: 'весь набор программ', en: 'the full suite' } },
    ],
    facets: ['iupscale', 'i4k', 'ibatch', 'iportrait', 'desktop'],
    tagline: {
      ru: 'Увеличение и восстановление, работающее на своём компьютере',
      en: 'Upscaling and restoration that runs on your own machine',
    },
    highlight: {
      ru: 'Считает на своём компьютере, а не на чужом сервере — исходники никуда не уходят, и это единственный такой сервис в каталоге',
      en: 'Processes on your own machine rather than someone’s server, so the originals never leave — the only service here that does',
    },
    features: {
      ru: ['Увеличение фото и видео без потери деталей', 'Восстановление старых и шумных снимков', 'Обработка идёт локально, без загрузки', 'Бесплатного тарифа нет'],
      en: ['Upscale photo and video without losing detail', 'Restore old and noisy shots', 'Processing runs locally, nothing uploaded', 'No free tier'],
    },
    about: {
      ru: 'Topaz Labs работает из Далласа с 2006 года и старше всей остальной подборки примерно на пятнадцать лет: компания делала плагины для Photoshop задолго до того, как слово «нейросеть» попало в маркетинг. Её продукты считают на своём компьютере, а не на сервере, и это главное отличие — исходники не уходят наружу, что важно фотографам, работающим по договору. Основное применение осталось прежним: увеличить снимок, вытащить детали из шума, поднять старую съёмку до пригодного разрешения. С сентября 2025 года компания перешла на подписку, разовые лицензии остались только как годовой пакет обновлений, а бесплатного тарифа здесь нет.',
      en: 'Topaz Labs has worked out of Dallas since 2006, making it roughly fifteen years older than the rest of this list; it was shipping Photoshop plugins long before "neural network" reached marketing copy. Its products compute on your own machine rather than a server, which is the real differentiator — originals never leave, and that matters to photographers working under contract. The core use has not changed: enlarge a shot, pull detail out of noise, lift old footage to a usable resolution. Since September 2025 the company has moved to subscriptions, with one-off licences surviving only as a year of updates, and there is no free tier.',
    },
    priceCheckedAt: D,
    sources: ['https://www.topazlabs.com/pricing'],
  },
  {
    slug: 'openart',
    name: 'OpenArt',
    monogram: 'OA',
    brandColor: '#4f46e5',
    job: 'images',
    rank: 31,
    website: 'https://openart.ai',
    pricingUrl: 'https://openart.ai/pricing',
    foundedYear: 2022,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '50 кредитов в день, без водяного знака', en: '50 daily credits, no watermark' } },
      { name: 'Essential', price: 7, includes: { ru: '4000 кредитов в месяц', en: '4,000 credits a month' } },
      { name: 'Advanced', price: 14.5, recommended: true, includes: { ru: '12 000 кредитов', en: '12,000 credits' } },
      { name: 'Infinite', price: 28, includes: { ru: '24 000 кредитов', en: '24,000 credits' } },
    ],
    facets: ['i4k', 'iportrait', 'itext'],
    tagline: {
      ru: 'Много моделей в одном окне и щедрый бесплатный тариф',
      en: 'Many models in one window, with a generous free tier',
    },
    highlight: {
      ru: 'Пятьдесят бесплатных кредитов в день без водяного знака — самый свободный вход в задаче, где остальные либо метят картинку, либо не пускают вовсе',
      en: 'Fifty free credits a day with no watermark — the most open entry in a job where the rest either stamp the image or charge at the door',
    },
    features: {
      ru: ['Несколько моделей в одном интерфейсе', 'Свои персонажи и обучение на них', 'Раскадровки и серии в одном стиле', 'Бесплатно без водяного знака'],
      en: ['Several models in one interface', 'Custom characters you can train', 'Storyboards and consistent series', 'Free tier without a watermark'],
    },
    about: {
      ru: 'OpenArt основали в 2022 году Коко Мао и Яда Гу — обе до этого работали в Google. Сервис выбрал роль витрины: вместо одной собственной модели он собирает в одном окне несколько сторонних, добавляя сверху редактор, обучение персонажей и раскадровки. Для нерегулярного пользователя это удобнее подписки на конкретную модель, потому что не надо заранее угадывать, какая справится с задачей. Бесплатный тариф здесь один из самых свободных в задаче: пятьдесят кредитов в день и без водяного знака.',
      en: 'OpenArt was founded in 2022 by Coco Mao and Yada Gu, both previously at Google. The service chose the role of a shopfront: instead of one in-house model it gathers several third-party ones in a single window, adding an editor, character training and storyboards on top. For an irregular user that beats subscribing to one specific model, because you do not have to guess in advance which will handle the job. Its free tier is among the most open here: fifty credits a day, no watermark.',
    },
    priceCheckedAt: D,
    sources: ['https://openart.ai/pricing'],
  },
  {
    slug: 'evoto',
    name: 'Evoto',
    monogram: 'EV',
    brandColor: '#0891b2',
    job: 'images',
    rank: 43,
    website: 'https://evoto.ai',
    pricingUrl: 'https://www.evoto.ai/payment',
    plans: [
      { name: 'Starter (год)', price: 75, currency: 'EUR', unit: 'once', includes: { ru: 'годовая лицензия, 7 дней пробы', en: 'annual licence, 7-day trial' } },
      { name: 'Basic (год)', price: 125, currency: 'EUR', unit: 'once', recommended: true, includes: { ru: 'годовая лицензия', en: 'annual licence' } },
      { name: 'Basic Plus (год)', price: 224, currency: 'EUR', unit: 'once', includes: { ru: 'годовая лицензия', en: 'annual licence' } },
      { name: 'Standard (год)', price: 485, currency: 'EUR', unit: 'once', includes: { ru: 'годовая лицензия для студии', en: 'annual studio licence' } },
      { name: 'Standard Plus (год)', price: 1106, currency: 'EUR', unit: 'once', includes: { ru: 'максимальный объём', en: 'maximum volume' } },
    ],
    facets: ['iportrait', 'ibatch', 'ibg', 'desktop'],
    tagline: {
      ru: 'Ретушь целой съёмки за один проход',
      en: 'Retouching an entire shoot in one pass',
    },
    highlight: {
      ru: 'Переносит настройки ретуши с одного кадра на всю съёмку — свадьбу на восемьсот снимков обрабатывает пачкой',
      en: 'Copies one frame’s retouching settings across a whole shoot, so an eight-hundred-shot wedding goes through in a batch',
    },
    features: {
      ru: ['Пакетная ретушь портретов', 'Перенос настроек на всю съёмку', 'Замена фона и неба', 'Подписка только годовая, месячной нет'],
      en: ['Batch portrait retouching', 'Copy settings across the whole shoot', 'Background and sky replacement', 'Annual subscription only, no monthly plan'],
    },
    about: {
      ru: 'Evoto работает в узкой нише, где объём важнее эффекта: обработка съёмок на сотни кадров. Свадебному или школьному фотографу нужна не художественная ретушь одного портрета, а одинаковый результат на восьмистах снимках, и сервис строится вокруг этого — настройки с одного кадра переносятся на всю папку. Сюда же входит замена фона и неба, выравнивание кожи и света. Тарифы устроены нестандартно: месячной подписки нет вовсе, всё продаётся на год, и прайс на сайте показан в евро — мы сверяли его из Европы 12 октября 2026 года, в другом регионе цифры могут отличаться.',
      en: 'Evoto works a narrow niche where volume matters more than effect: shoots running to hundreds of frames. A wedding or school photographer does not need artistic retouching of one portrait, they need the same result across eight hundred, and the product is built around that — settings from one frame copy to the whole folder. Background and sky replacement, skin and light levelling come with it. Pricing is unusual: there is no monthly subscription at all, everything sells by the year, and the site quotes euros — we checked it from Europe on 12 October 2026, and another region may see different figures.',
    },
    priceCheckedAt: D,
    sources: ['https://www.evoto.ai/payment'],
  },
  {
    slug: 'reface',
    name: 'Reface',
    monogram: 'RF',
    brandColor: '#db2777',
    job: 'images',
    rank: 34,
    website: 'https://reface.ai',
    pricingUrl: 'https://reface.ai',
    foundedYear: 2020,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'ограниченный набор, водяной знак', en: 'limited set, watermark' } },
      { name: 'Pro', price: null, includes: { ru: 'продаётся только в App Store и Google Play, цена своя в каждой стране', en: 'sold only through the App Store and Google Play, priced per country' } },
    ],
    facets: ['iportrait', 'mob', 'fmark'],
    tagline: {
      ru: 'Подмена лица, выросшая из киевской лаборатории',
      en: 'Face swapping out of a Kyiv lab',
    },
    highlight: {
      ru: 'Выросла из киевской исследовательской команды и первой вывела подмену лица в массовое приложение — задолго до того, как это стало функцией каждого редактора',
      en: 'Grew out of a Kyiv research team and was first to put face swapping into a mass-market app, long before every editor had the feature',
    },
    features: {
      ru: ['Подмена лица в фото и коротком видео', 'Приложение на телефоне', 'Своего прайса у сервиса нет', 'Цену назначает магазин приложений'],
      en: ['Face swap in photos and short video', 'Phone app', 'The service publishes no price list', 'The app store sets the price'],
    },
    about: {
      ru: 'Reface выросла из киевской исследовательской команды и вышла в 2020 году под названием Doublicat; приложение попало в топы магазинов и за несколько месяцев собрало десятки миллионов установок. Технически это та же задача, что у дипфейков, но поставленная развлекательно: подставить своё лицо в кадр из фильма или клипа. Компания одна из немногих украинских в этом рейтинге, и её история — пример того, как исследование превращается в массовый продукт раньше крупных платформ. Цену подписки мы в карточке не указываем, и это не пробел: на собственном сайте компании прайса нет вовсе — мы проверили 12 октября 2026 года. Подписка продаётся только через App Store и Google Play, где цена своя в каждой стране.',
      en: 'Reface grew out of a Kyiv research team and launched in 2020 as Doublicat; the app hit store charts and gathered tens of millions of installs within months. Technically it is the same problem as deepfakes, framed as entertainment: put your face into a film or music-video frame. It is one of the few Ukrainian companies on this list, and its history shows research reaching a mass product ahead of the large platforms. We quote no subscription price on this card, and that is not an omission: the company publishes no price list on its own site — we checked on 12 October 2026. The subscription sells only through the App Store and Google Play, priced separately in every country.',
    },
    priceCheckedAt: D,
    sources: ['https://reface.ai'],
  },
  {
    slug: 'faceapp',
    name: 'FaceApp',
    monogram: 'FA',
    brandColor: '#334155',
    job: 'images',
    rank: 47,
    website: 'https://faceapp.com',
    pricingUrl: 'https://faceapp.com',
    foundedYear: 2017,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'базовые фильтры, водяной знак', en: 'basic filters, watermark' } },
      { name: 'Pro', price: null, includes: { ru: 'продаётся только в App Store и Google Play, цена своя в каждой стране', en: 'sold only through the App Store and Google Play, priced per country' } },
    ],
    facets: ['iportrait', 'mob', 'fmark'],
    tagline: {
      ru: 'Старейшее массовое приложение для правки лица',
      en: 'The oldest mass-market app for editing a face',
    },
    highlight: {
      ru: 'Работает с 2017 года и до сих пор держится в рейтинге выручки — редкий случай, когда мобильное приложение переживает две волны отраслевой моды',
      en: 'Shipping since 2017 and still on the revenue list — a rare case of a mobile app outliving two waves of industry fashion',
    },
    features: {
      ru: ['Возраст, улыбка, причёска на фото', 'Приложение на телефоне', 'Своего прайса у сервиса нет', 'Цену назначает магазин приложений'],
      en: ['Age, smile and hairstyle edits', 'Phone app', 'The service publishes no price list', 'The app store sets the price'],
    },
    about: {
      ru: 'FaceApp выпустил в 2017 году Ярослав Гончаров, и приложение успело стать мемом раньше, чем отрасль научилась слову «генеративный». Фильтры старения и смены пола дважды выводили его в мировые топы загрузок, а в 2019 году вокруг него разошёлся спор о том, куда уходят загруженные фотографии. Приложение остаётся в рейтинге выручки спустя восемь лет — для мобильного продукта это редкость. Цену подписки мы не указываем, и это проверенный факт, а не пропуск: на сайте faceapp.com прайса нет — мы смотрели 12 октября 2026 года. Подписка продаётся только через магазины приложений, где цена своя в каждой стране.',
      en: 'FaceApp was released in 2017 by Yaroslav Goncharov and became a meme before the industry had learned the word "generative". Its ageing and gender-swap filters pushed it into global download charts twice, and in 2019 it drew a public argument about where uploaded photographs went. Eight years on it is still on the revenue list, which is rare for a mobile product. We quote no subscription price, and that is a checked fact rather than an omission: faceapp.com carries no price list — we looked on 12 October 2026. The subscription sells only through app stores, priced separately in every country.',
    },
    priceCheckedAt: D,
    sources: ['https://faceapp.com'],
  },

  /* ── Голос и музыка ────────────────────────────────────────────── */
  {
    slug: 'elevenlabs',
    name: 'ElevenLabs',
    monogram: 'EL',
    brandColor: '#0b0b0f',
    job: 'voice',
    rank: 4,
    website: 'https://elevenlabs.io',
    pricingUrl: 'https://elevenlabs.io/pricing',
    foundedYear: 2022,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '10 тысяч знаков в месяц, нужна атрибуция', en: '10k characters a month, attribution required' } },
      { name: 'Starter', price: 6, includes: { ru: '30 тысяч знаков, клон голоса', en: '30k characters, voice clone' } },
      { name: 'Creator', price: 22, recommended: true, includes: { ru: '100 тысяч знаков, профессиональный клон', en: '100k characters, professional clone' } },
      { name: 'Pro', price: 99, includes: { ru: '500 тысяч знаков, 192 кбит/с', en: '500k characters, 192 kbps' } },
      { name: 'Scale', price: 330, includes: { ru: '2 млн знаков, несколько мест', en: '2M characters, multiple seats' } },
    ],
    facets: ['sclone', 'smulti', 'sread', 'api', 'fnocomm'],
    tagline: {
      ru: 'Озвучка, которую не отличают от записи в студии',
      en: 'Voice-over people do not separate from a studio take',
    },
    highlight: {
      ru: 'Переносит интонацию клонированного голоса на другой язык — тот же тембр читает текст по-русски, по-японски и по-немецки',
      en: 'Carries a cloned voice’s intonation into another language — the same timbre reads Russian, Japanese and German',
    },
    features: {
      ru: ['Клон голоса по короткой записи', 'Больше 30 языков одним голосом', 'Отдельная модель для диалогов', 'Бесплатно требует указания сервиса'],
      en: ['Voice clone from a short sample', 'Over 30 languages in one voice', 'A separate model for dialogue', 'Free tier requires attribution'],
    },
    about: {
      ru: 'ElevenLabs основали в 2022 году Пётр Домбковский и Матти Станишевский — школьные друзья из Польши, один пришёл из Google, другой из Palantir. Повод был личный: оба выросли на фильмах, озвученных одним голосом поверх всех ролей, и хотели, чтобы дубляж перестал звучать так. Компания быстро вышла за пределы озвучки текста: сейчас это и клонирование голоса, и дубляж видео, и отдельная модель для диалогов. Бесплатный тариф рабочий, но требует указывать сервис в описании, а клон голоса начинается с шести долларов.',
      en: 'ElevenLabs was founded in 2022 by Piotr Dąbkowski and Mati Staniszewski, school friends from Poland who came out of Google and Palantir. The motive was personal: both grew up on films dubbed by a single voice reading every part, and wanted dubbing to stop sounding like that. The company moved well past reading text aloud — it now covers voice cloning, video dubbing and a separate dialogue model. The free tier is usable but requires crediting the service, and voice cloning starts at six dollars.',
    },
    priceCheckedAt: D,
    sources: ['https://elevenlabs.io/pricing'],
  },
  {
    slug: 'suno',
    name: 'Suno',
    monogram: 'SU',
    brandColor: '#1f2937',
    job: 'voice',
    rank: 12,
    website: 'https://suno.com',
    pricingUrl: 'https://suno.com/pricing',
    foundedYear: 2023,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '50 кредитов в день, без коммерческого права', en: '50 daily credits, no commercial rights' } },
      { name: 'Pro', price: 10, recommended: true, includes: { ru: '2500 кредитов, коммерческое использование', en: '2,500 credits, commercial use' } },
      { name: 'Premier', price: 30, includes: { ru: '10 000 кредитов в месяц', en: '10,000 credits a month' } },
    ],
    facets: ['smusic', 'smulti', 'mob', 'api', 'fnocomm'],
    tagline: {
      ru: 'Песня с вокалом по одной строке описания',
      en: 'A song with vocals from one line of description',
    },
    highlight: {
      ru: 'Пишет законченную песню с вокалом и текстом, а не минусовку — и на бесплатном тарифе не отдаёт на неё коммерческих прав',
      en: 'Writes a finished song with vocals and lyrics rather than a backing track — and on the free tier grants no commercial rights to it',
    },
    features: {
      ru: ['Вокал и текст, а не только музыка', 'Загрузка своей наброски для продолжения', '50 кредитов в день бесплатно', 'Бесплатно — только личное использование'],
      en: ['Vocals and lyrics, not only music', 'Upload your own sketch to extend', '50 free credits a day', 'Free tier is personal use only'],
    },
    about: {
      ru: 'Suno основали в 2023 году в Кембридже Майки Шульман, Георг Кучко, Мартин Камачо и Кинан Фрайберг — команда пришла из Kensho, где занималась распознаванием речи для финансовых данных. Продукт сразу поставил планку, которую до него не брали: не минусовка и не сэмпл, а законченная песня с вокалом и словами по одной строке описания. Это же поставило компанию в центр судебных споров с музыкальными лейблами, которые идут до сих пор. Бесплатный тариф даёт пятьдесят кредитов в день, но права на коммерческое использование по нему не передаются, и указание сервиса обязательно.',
      en: 'Suno was founded in 2023 in Cambridge by Mikey Shulman, Georg Kucsko, Martin Camacho and Keenan Freyberg, a team that came out of Kensho working on speech recognition for financial data. The product set a bar nobody had cleared: not a backing track or a sample but a finished song with vocals and words from one line of description. That also put the company at the centre of ongoing litigation with music labels. The free tier gives fifty credits a day, but it conveys no commercial rights and attribution is required.',
    },
    priceCheckedAt: D,
    sources: ['https://suno.com/pricing'],
  },
  {
    slug: 'speechify',
    name: 'Speechify',
    monogram: 'SP',
    brandColor: '#2563eb',
    job: 'voice',
    rank: 26,
    website: 'https://speechify.com',
    pricingUrl: 'https://speechify.com/pricing',
    foundedYear: 2017,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'стандартные голоса, базовая скорость', en: 'standard voices, basic speed' } },
      { name: 'Premium (год)', price: 11.58, recommended: true, includes: { ru: 'при оплате за год', en: 'when billed annually' } },
      { name: 'Premium (месяц)', price: 29, includes: { ru: 'премиальные голоса, 30 языков', en: 'premium voices, 30 languages' } },
    ],
    facets: ['sread', 'smulti', 'mob', 'desktop'],
    tagline: {
      ru: 'Читает вслух то, что вы не успеваете прочесть глазами',
      en: 'Reads aloud what you do not have time to read',
    },
    highlight: {
      ru: 'Читает PDF, письма и веб-страницы на скорости до девятикратной — продукт изначально делался под дислексию, а не под подкасты',
      en: 'Reads PDFs, email and web pages at up to nine times speed — the product was built for dyslexia, not for podcasts',
    },
    features: {
      ru: ['Чтение PDF, писем и страниц', 'Скорость до девятикратной', 'Расширение для браузера и приложение', 'Годовая оплата дешевле месячной почти втрое'],
      en: ['Reads PDFs, email and web pages', 'Up to nine times playback speed', 'Browser extension and apps', 'Annual billing is nearly three times cheaper'],
    },
    about: {
      ru: 'Speechify основал Клифф Вайцман — у него дислексия, и первую версию он собрал для себя, ещё учась в Брауновском университете. Это объясняет устройство продукта: он не про красивый дубляж, а про то, чтобы прочесть вслух двести страниц PDF на высокой скорости и не потерять нить. Сервис живёт расширением в браузере и приложением на телефоне, а не отдельной студией. Разрыв между месячной и годовой оплатой здесь один из самых больших в каталоге — почти втрое, — поэтому месячная цена фактически заградительная.',
      en: 'Speechify was founded by Cliff Weitzman, who has dyslexia and built the first version for himself while at Brown. That explains the product: it is not about polished dubbing but about reading two hundred PDF pages aloud at speed without losing the thread. It lives as a browser extension and a phone app rather than a studio. The gap between monthly and annual billing is one of the widest in this catalogue — nearly threefold — which makes the monthly rate effectively a deterrent.',
    },
    priceCheckedAt: D,
    sources: ['https://speechify.com/pricing'],
  },
  {
    slug: 'moises',
    name: 'Moises',
    monogram: 'MO',
    brandColor: '#4338ca',
    job: 'voice',
    rank: 48,
    website: 'https://moises.ai',
    pricingUrl: 'https://moises.ai/pricing',
    foundedYear: 2019,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '5 загрузок в месяц', en: '5 uploads a month' } },
      { name: 'Premium', price: 3.99, recommended: true, includes: { ru: 'без лимита загрузок', en: 'unlimited uploads' } },
      { name: 'Pro', price: 9.99, includes: { ru: 'высшее качество, API', en: 'top quality, API' } },
    ],
    facets: ['sstems', 'mob', 'api'],
    tagline: {
      ru: 'Разбирает готовый трек на отдельные дорожки',
      en: 'Pulls a finished track apart into separate stems',
    },
    highlight: {
      ru: 'Снимает с готовой записи вокал, барабаны и бас по отдельности — самый дешёвый платный тариф во всём каталоге',
      en: 'Separates vocals, drums and bass out of a finished recording — and carries the cheapest paid plan in the whole catalogue',
    },
    features: {
      ru: ['Разбор трека на вокал, бас, барабаны', 'Смена тональности и темпа', 'Приложение для репетиций', 'Платный тариф от $3,99 — дешевле всех'],
      en: ['Split a track into vocals, bass, drums', 'Change key and tempo', 'A practice app for musicians', 'Paid from $3.99 — the cheapest here'],
    },
    about: {
      ru: 'Moises сделала бразильская команда во главе с Жералду Рамусом; сервис вышел в 2020 году и целился не в продюсеров, а в играющих музыкантов. Задача у него музыкальная и очень конкретная: снять с готовой записи вокал, бас и барабаны по отдельности, чтобы можно было репетировать свою партию под остальные. Вокруг этого выросли метроном, смена тональности и темпа, распознавание аккордов. Платный тариф здесь самый дешёвый во всём каталоге — меньше четырёх долларов, — и бесплатный вход не требует карты.',
      en: 'Moises was built by a Brazilian team led by Geraldo Ramos and launched in 2020 aimed at playing musicians rather than producers. Its job is musical and specific: lift vocals, bass and drums out of a finished recording so you can rehearse your own part against the rest. A metronome, key and tempo changes and chord detection grew around that. Its paid plan is the cheapest in the entire catalogue at under four dollars, and the free entry asks for no card.',
    },
    priceCheckedAt: D,
    sources: ['https://moises.ai/pricing'],
  },
  {
    slug: 'jumpspeak',
    name: 'Jumpspeak',
    monogram: 'JS',
    brandColor: '#ea580c',
    job: 'voice',
    rank: 35,
    website: 'https://jumpspeak.com',
    pricingUrl: 'https://jumpspeak.com',
    plans: [
      { name: '3 месяца', price: 69, unit: 'once', includes: { ru: 'разовый платёж за срок', en: 'one payment for the term' } },
      { name: '12 месяцев', price: 79, unit: 'once', recommended: true, includes: { ru: 'цена первого года', en: 'first-year price' } },
      { name: 'Навсегда', price: 59, unit: 'once', includes: { ru: 'разовая покупка, цена по акции', en: 'one-off purchase at a promotional price' } },
    ],
    facets: ['stalk', 'mob'],
    tagline: {
      ru: 'Разговорная практика без живого собеседника',
      en: 'Speaking practice without a human on the other side',
    },
    highlight: {
      ru: 'Учит не словам, а речи: всё занятие построено на том, что вы говорите вслух и вас перебивают, а не на карточках',
      en: 'Teaches speech rather than words: the whole lesson is you talking out loud and being interrupted, not flashcards',
    },
    features: {
      ru: ['Занятие построено на речи вслух', 'Исправление произношения по ходу', 'Платят за срок, а не помесячно', 'Цена первого года ниже цены продления'],
      en: ['Lessons built around speaking aloud', 'Pronunciation corrected as you go', 'Paid by term, not by month', 'The first year costs less than the renewal'],
    },
    about: {
      ru: 'Jumpspeak занимает в этом рейтинге единственное место, связанное с обучением, и попал туда за счёт того, от чего отказались остальные языковые приложения: разговора. Карточки и тесты легко превратить в игру с ежедневной серией, а речь вслух — нет, и большинство сервисов эту часть обходит. Здесь занятие целиком построено на том, что вы говорите, а система перебивает и правит произношение. Цены здесь считаются не помесячно, а за срок: 69 долларов за три месяца и 79 за год — так на официальной странице тарифов 12 октября 2026 года. Цифры стоит перепроверять при оплате: сервис продаёт подписку через акционные страницы, и продление стоит дороже первого года.',
      en: 'Jumpspeak holds the only education slot on this list, and it got there by doing what other language apps avoid: conversation. Flashcards and quizzes turn easily into a game with a daily streak; speaking aloud does not, so most services skip that part. Here the whole lesson is you talking while the system interrupts and corrects pronunciation. Prices here go by term rather than by month: sixty-nine dollars for three months and seventy-nine for a year, as the official pricing page read on 12 October 2026. Check the figure at the till, though — the service sells through promotional pages, and renewal costs more than the first year.',
    },
    priceCheckedAt: D,
    sources: ['https://www.jumpspeak.com/pricing'],
  },

  /* ── Диктовка и расшифровка ────────────────────────────────────── */
  {
    slug: 'wispr-flow',
    name: 'Wispr Flow',
    monogram: 'WF',
    brandColor: '#111827',
    job: 'dictation',
    rank: 9,
    website: 'https://wisprflow.ai',
    pricingUrl: 'https://wisprflow.ai/pricing',
    foundedYear: 2021,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '2000 слов в неделю на компьютере', en: '2,000 words a week on desktop' } },
      { name: 'Pro (год)', price: 12, recommended: true, includes: { ru: 'без лимита, при оплате за год', en: 'unlimited, billed annually' } },
      { name: 'Pro (месяц)', price: 15, includes: { ru: 'без лимита слов', en: 'unlimited words' } },
      { name: 'Team', price: 15, unit: 'seat', includes: { ru: 'общий словарь, управление', en: 'shared dictionary, admin' } },
    ],
    facets: ['dlive', 'danywhere', 'ddict', 'mob', 'desktop'],
    tagline: {
      ru: 'Диктовка в любое поле ввода, а не в своё окно',
      en: 'Dictation into any text field, not into its own window',
    },
    highlight: {
      ru: 'Пишет прямо в то поле, где стоит курсор — в письмо, в чат, в код, — и сам убирает «эээ» и переставляет слова в связную фразу',
      en: 'Types straight into whatever field the cursor is in — an email, a chat, code — and strips the "ums" into a clean sentence on the way',
    },
    features: {
      ru: ['Работает в любом приложении', 'Чистит речь до связного текста', 'Свой словарь имён и терминов', 'Бесплатно — 2000 слов в неделю'],
      en: ['Works inside any application', 'Cleans speech into readable text', 'Custom dictionary of names and terms', 'Free: 2,000 words a week'],
    },
    about: {
      ru: 'Wispr Flow сделала компания Wispr AI, основанная в 2021 году Танаем Котари и Сахаджем Гаргом; начинали они с нейроинтерфейса для беззвучной речи и свернули к задаче проще и нужнее — диктовке. Отличие от встроенного в систему голосового ввода в двух вещах: текст появляется в том поле, где стоит курсор, в любом приложении, и перед вставкой он причёсывается — убираются оговорки, расставляются знаки, фраза собирается в связную. Для переписки и заметок это меняет сам способ работы: быстрее надиктовать, чем набрать. Бесплатный тариф рабочий — две тысячи слов в неделю на компьютере и тысяча на телефоне.',
      en: 'Wispr Flow comes from Wispr AI, founded in 2021 by Tanay Kothari and Sahaj Garg, who started on a neural interface for silent speech and turned to something simpler and more needed: dictation. It differs from built-in voice input in two ways — the text lands in whatever field the cursor is in, in any application, and it is tidied before insertion, with stumbles removed, punctuation added and the sentence pulled straight. For correspondence and notes that changes how you work: dictating beats typing. The free tier is usable at two thousand words a week on desktop and a thousand on the phone.',
    },
    priceCheckedAt: D,
    sources: ['https://wisprflow.ai/pricing'],
  },
  {
    slug: 'otter-ai',
    name: 'Otter.ai',
    monogram: 'OT',
    brandColor: '#1d4ed8',
    job: 'dictation',
    rank: 25,
    website: 'https://otter.ai',
    pricingUrl: 'https://otter.ai/pricing',
    foundedYear: 2016,
    plans: [
      { name: 'Basic', price: 0, includes: { ru: '300 минут в месяц, 30 минут за раз', en: '300 minutes a month, 30 per conversation' } },
      { name: 'Pro (год)', price: 8.33, recommended: true, includes: { ru: '1200 минут, при оплате за год', en: '1,200 minutes, billed annually' } },
      { name: 'Pro (месяц)', price: 16.99, includes: { ru: '1200 минут в месяц', en: '1,200 minutes a month' } },
      { name: 'Business', price: 30, unit: 'seat', includes: { ru: '6000 минут, админ-панель', en: '6,000 minutes, admin console' } },
    ],
    facets: ['dmeet', 'dlive', 'ddict', 'mob', 'sso'],
    tagline: {
      ru: 'Расшифровка созвона с разбивкой по участникам',
      en: 'A meeting transcript split by speaker',
    },
    highlight: {
      ru: 'Заходит в созвон отдельным участником и выдаёт расшифровку с разбивкой по говорящим и списком принятых решений',
      en: 'Joins the call as a participant of its own and returns a transcript split by speaker with the decisions listed out',
    },
    features: {
      ru: ['Подключается к Zoom, Meet и Teams', 'Разбивка реплик по участникам', 'Сводка решений после созвона', 'Бесплатно — 300 минут и 30 за раз'],
      en: ['Joins Zoom, Meet and Teams', 'Speaker-by-speaker transcript', 'A decisions summary after the call', 'Free: 300 minutes, 30 per call'],
    },
    about: {
      ru: 'Otter.ai основали в 2016 году Сэм Лян и Юнь Фу; Лян до этого работал в Google над геолокацией и продал туда свой стартап. Сервис появился задолго до нынешней волны и успел стать для многих компаний стандартом на расшифровку созвонов: бот заходит в Zoom или Meet отдельным участником и выдаёт текст с разбивкой по говорящим. Сильная сторона — не точность сама по себе, а то, что встроено вокруг: поиск по всем прошлым созвонам и автоматическая сводка решений. Бесплатный тариф ограничен и по месяцу, и по длине одного разговора: триста минут и тридцать за раз.',
      en: 'Otter.ai was founded in 2016 by Sam Liang and Yun Fu; Liang had worked on location at Google after selling his startup into it. The service arrived long before the current wave and became many companies’ default for call transcripts: a bot joins Zoom or Meet as its own participant and returns text split by speaker. Its strength is less raw accuracy than what surrounds it — search across every past call and an automatic summary of decisions. The free tier is capped both monthly and per conversation: three hundred minutes, thirty at a time.',
    },
    priceCheckedAt: D,
    sources: ['https://otter.ai/pricing'],
  },
  {
    slug: 'fireflies-ai',
    name: 'Fireflies.ai',
    monogram: 'FF',
    brandColor: '#f59e0b',
    job: 'dictation',
    rank: 11,
    website: 'https://fireflies.ai',
    pricingUrl: 'https://fireflies.ai/pricing',
    foundedYear: 2016,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'расшифровка без лимита, хранение ограничено', en: 'unlimited transcription, limited storage' } },
      { name: 'Pro (год)', price: 10, unit: 'seat', recommended: true, includes: { ru: 'при оплате за год', en: 'billed annually' } },
      { name: 'Pro (месяц)', price: 18, unit: 'seat', includes: { ru: 'сводки, поиск, интеграции', en: 'summaries, search, integrations' } },
      { name: 'Business', price: 29, unit: 'seat', includes: { ru: 'аналитика разговоров, API', en: 'conversation analytics, API' } },
    ],
    facets: ['dmeet', 'dcrm', 'ddict', 'api', 'sso', 'notrain'],
    tagline: {
      ru: 'Созвон уезжает в CRM без ручного переноса',
      en: 'The call lands in your CRM without retyping',
    },
    highlight: {
      ru: 'Складывает расшифровку созвона прямо в карточку сделки в CRM — отдел продаж перестаёт переписывать разговор руками',
      en: 'Files the call transcript straight into the deal record in your CRM, so sales stops retyping conversations by hand',
    },
    features: {
      ru: ['Запись в Salesforce, HubSpot и Pipedrive', 'Поиск по всем прошлым созвонам', 'Аналитика: кто сколько говорил', 'Расшифровка бесплатно, но хранение ограничено'],
      en: ['Writes into Salesforce, HubSpot and Pipedrive', 'Search across every past call', 'Analytics: who spoke how much', 'Free transcription, limited storage'],
    },
    about: {
      ru: 'Fireflies основали в 2016 году Криш Рамини и Сэм Удотонг — компания восемь лет работала без громких раундов и выросла через отделы продаж, а не через потребительский рынок. Отличие от Otter лежит не в расшифровке, а в том, что происходит после: запись уезжает в карточку сделки в Salesforce или HubSpot, и менеджер не переписывает разговор руками. Сюда же добавилась аналитика разговоров — кто сколько говорил, какие возражения прозвучали. Бесплатный тариф даёт расшифровку без лимита по минутам, но ограничивает хранение, а платные считаются за каждого человека.',
      en: 'Fireflies was founded in 2016 by Krish Ramineni and Sam Udotong, and spent eight years without loud funding rounds, growing through sales teams rather than consumers. What separates it from Otter is not the transcript but what happens next: the record lands in the deal in Salesforce or HubSpot, so nobody retypes the conversation. Conversation analytics came later — who talked how long, which objections came up. The free tier transcribes without a minute cap but limits storage, and the paid plans bill per person.',
    },
    priceCheckedAt: D,
    sources: ['https://fireflies.ai/pricing'],
  },
  {
    slug: 'plaud',
    name: 'PLAUD',
    monogram: 'PL',
    brandColor: '#0f172a',
    job: 'dictation',
    rank: 33,
    website: 'https://plaud.ai',
    pricingUrl: 'https://www.plaud.ai/pages/membership',
    plans: [
      { name: 'Starter', price: 0, includes: { ru: '300 минут расшифровки в месяц', en: '300 transcript minutes a month' } },
      { name: 'Pro', price: 17.99, recommended: true, includes: { ru: '$99,99 за год', en: '$99.99 billed annually' } },
      { name: 'Unlimited', price: 29.99, includes: { ru: '$239,99 за год', en: '$239.99 billed annually' } },
      { name: 'Team', price: 25, unit: 'seat', includes: { ru: 'общая база записей', en: 'shared recording library' } },
    ],
    facets: ['dhw', 'dmeet', 'ddict', 'mob'],
    tagline: {
      ru: 'Диктофон размером с карту плюс расшифровка',
      en: 'A card-sized recorder with transcription attached',
    },
    highlight: {
      ru: 'Записывает не через телефон, а на свой диктофон размером с банковскую карту — единственный в каталоге, кто продаёт железо вместе с подпиской',
      en: 'Records on its own card-sized device rather than through a phone — the only entry here that sells hardware alongside the subscription',
    },
    features: {
      ru: ['Своё устройство, а не приложение на телефоне', 'Запись телефонного разговора', '300 минут расшифровки бесплатно', 'Подписка оплачивается отдельно от устройства'],
      en: ['Its own device rather than a phone app', 'Records phone calls', '300 free transcript minutes', 'Subscription is paid separately from the hardware'],
    },
    about: {
      ru: 'PLAUD продаёт то, чего нет больше ни у кого в этом рейтинге: физическое устройство. Диктофон размером с банковскую карту крепится к телефону магнитом, пишет и разговор в комнате, и телефонный звонок, а расшифровку и сводку выдаёт уже подписка. Такая связка решает проблему, которую приложение решить не может: телефон в кармане пишет плохо, а достать его на встрече — значит сменить характер разговора. Считать расходы здесь надо в два приёма: устройство покупается отдельно, подписка идёт сверху, и бесплатный тариф в триста минут к устройству тоже прилагается.',
      en: 'PLAUD sells something nobody else on this list does: a physical device. A card-sized recorder clips magnetically to a phone, captures both a room conversation and a phone call, and the subscription supplies the transcript and summary. That pairing solves what an app cannot: a phone in a pocket records badly, and taking it out at a meeting changes the meeting. Budget in two parts here — the device is bought separately, the subscription sits on top, and the free three-hundred-minute tier comes with the hardware.',
    },
    priceCheckedAt: D,
    sources: ['https://www.plaud.ai/pages/membership'],
  },

  /* ── Рекламные креативы ────────────────────────────────────────── */
  {
    slug: 'zeely',
    name: 'Zeely',
    monogram: 'ZE',
    brandColor: '#7c3aed',
    job: 'video',
    rank: 50,
    website: 'https://zeely.app',
    pricingUrl: 'https://zeely.app/pricing',
    plans: [
      { name: 'Starter', price: 29.95, recommended: true, includes: { ru: '2500 кредитов, плюс 12% с рекламного бюджета', en: '2,500 credits, plus 12% of ad spend' } },
      { name: 'Plus', price: 49.95, includes: { ru: '5000 кредитов', en: '5,000 credits' } },
      { name: 'Growth', price: 79.95, includes: { ru: '10 000 кредитов', en: '10,000 credits' } },
    ],
    facets: ['aacc', 'aab', 'augc', 'aproduct', 'afee', 'mob'],
    tagline: {
      ru: 'Креатив, кампания и бюджет в одном приложении',
      en: 'Creative, campaign and budget in one app',
    },
    highlight: {
      ru: 'Не отдаёт файл, а сам запускает кампанию в рекламном кабинете — и берёт за это процент с рекламного бюджета, а не только подписку',
      en: 'Does not hand over a file: it launches the campaign in the ad account itself, and takes a share of ad spend on top of the subscription',
    },
    features: {
      ru: ['Ролики в формате UGC по ссылке на товар', 'Запуск кампании из того же приложения', 'Тест вариантов креатива', 'Комиссия 12% с рекламного бюджета сверху подписки'],
      en: ['UGC-style clips from a product link', 'Launches the campaign from the same app', 'Variant testing', '12% of ad spend on top of the subscription'],
    },
    about: {
      ru: 'Zeely работает с малым бизнесом, у которого нет ни агентства, ни дизайнера: приложение берёт ссылку на товар, собирает из неё ролик в формате UGC и запускает кампанию в рекламном кабинете, не выходя наружу. Это принципиально иная модель, чем у видеогенераторов: там на выходе файл, здесь — открученная реклама с метриками. Из той же модели вытекает главная особенность сметы: сверх подписки сервис берёт 12% с рекламного бюджета, и доплата за ускоритель снижает её до шести. Поэтому реальная стоимость считается не по тарифу, а по тому, сколько вы крутите.',
      en: 'Zeely works with small businesses that have neither an agency nor a designer: the app takes a product link, builds a UGC-style clip out of it and launches the campaign in the ad account without leaving. That is a different model from a video generator, where the output is a file; here the output is a running ad with metrics. The same model drives the key budget quirk: on top of the subscription it takes 12% of ad spend, which a paid booster brings down to six. Real cost is therefore set by how much you spend, not by the plan.',
    },
    priceCheckedAt: D,
    sources: ['https://zeely.app/pricing'],
  },
  {
    slug: 'topview',
    name: 'TopView',
    monogram: 'TV',
    brandColor: '#0891b2',
    job: 'video',
    rank: 36,
    website: 'https://topview.ai',
    pricingUrl: 'https://www.topview.ai/pricing',
    plans: [
      { name: 'Pro', price: 29, recommended: true, includes: { ru: 'базовый пакет генераций', en: 'base generation allowance' } },
      { name: 'Business', price: 75, includes: { ru: 'больше роликов и аватаров', en: 'more clips and avatars' } },
      { name: 'Ultra', price: 150, includes: { ru: 'максимальный объём', en: 'maximum volume' } },
      { name: 'Team', price: 180, unit: 'seat', includes: { ru: 'общая библиотека', en: 'shared library' } },
    ],
    facets: ['augc', 'aproduct', 'aab'],
    tagline: {
      ru: 'Рекламный ролик из карточки товара',
      en: 'An ad clip built from a product listing',
    },
    highlight: {
      ru: 'Разбирает ссылку на товар и подставляет его в готовую рекламную раскадровку с аватаром-ведущим — работа начинается с URL, а не с задания',
      en: 'Parses a product URL and drops the item into a ready ad storyboard with a presenting avatar — the job starts from a link, not a brief',
    },
    features: {
      ru: ['Ролик по ссылке на товар', 'Аватар-ведущий в кадре', 'Варианты под разные площадки', 'Бесплатного тарифа нет'],
      en: ['Clip from a product URL', 'A presenting avatar on camera', 'Variants per platform', 'No free tier'],
    },
    about: {
      ru: 'TopView занимает тот же участок, что и Zeely, но с другого конца: он не трогает рекламный кабинет, зато лучше разбирает исходный товар. Сервис читает ссылку на карточку, вытаскивает фотографии и описание и подставляет их в готовую рекламную раскадровку, где текст читает аватар. Это решает задачу продавца на маркетплейсе, которому нужно двадцать однотипных роликов, а не один выразительный. Бесплатного тарифа здесь нет, вход начинается с двадцати девяти долларов, а тариф для команды считается за каждого человека.',
      en: 'TopView covers the same ground as Zeely from the other end: it never touches the ad account, but it reads the source product better. The service parses a listing URL, pulls the photographs and description out of it and drops them into a ready ad storyboard narrated by an avatar. That answers the marketplace seller who needs twenty near-identical clips rather than one expressive film. There is no free tier, entry starts at twenty-nine dollars, and the team plan bills per person.',
    },
    priceCheckedAt: D,
    sources: ['https://www.topview.ai/pricing'],
  },

  /* ── Презентации ───────────────────────────────────────────────── */
  {
    slug: 'gamma',
    name: 'Gamma',
    monogram: 'GM',
    brandColor: '#7c3aed',
    job: 'design',
    rank: 6,
    website: 'https://gamma.app',
    pricingUrl: 'https://gamma.app/pricing',
    foundedYear: 2020,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '400 кредитов разово, знак Gamma', en: '400 one-off credits, Gamma badge' } },
      { name: 'Plus', price: 12, recommended: true, includes: { ru: 'без знака, 400 кредитов в месяц', en: 'no badge, 400 credits a month' } },
      { name: 'Pro', price: 25, includes: { ru: 'без лимита, свой домен', en: 'unlimited, custom domain' } },
      { name: 'Business', price: 100, includes: { ru: 'бренд-кит и права доступа', en: 'brand kit and permissions' } },
    ],
    facets: ['kbrand', 'kpptx', 'kweb', 'kanalytics', 'api', 'fmark', 'fexpire'],
    tagline: {
      ru: 'Презентация, которая живёт ссылкой, а не файлом',
      en: 'A deck that lives as a link, not a file',
    },
    highlight: {
      ru: 'Отдаёт презентацию ссылкой с аналитикой просмотров, а не файлом — видно, кто дошёл до какого слайда',
      en: 'Hands over the deck as a link with view analytics rather than a file, so you see who reached which slide',
    },
    features: {
      ru: ['Слайды собираются из одного абзаца задания', 'Презентация как страница со статистикой просмотров', 'Выгрузка в PowerPoint и PDF', 'Бесплатно — разовые 400 кредитов и знак Gamma'],
      en: ['Slides built from one paragraph of brief', 'Deck as a page with view stats', 'Export to PowerPoint and PDF', 'Free: a one-off 400 credits and a Gamma badge'],
    },
    about: {
      ru: 'Gamma основали в 2020 году Грант Ли, Джон Норонья и Джеймс Фокс — команда пришла из Optimizely и Figma. Идея у них была не про генерацию, а про формат: презентация перестаёт быть файлом и становится страницей, которую открывают по ссылке и прокручивают. Отсюда то, чего нет у PowerPoint: автор видит, кто дошёл до какого слайда. Генерация добавилась сверху и сделала вход простым — абзац задания превращается в двадцать слайдов. Бесплатный тариф даёт четыреста кредитов разово, не ежемесячно, и оставляет на презентации знак Gamma.',
      en: 'Gamma was founded in 2020 by Grant Lee, Jon Noronha and James Fox, a team out of Optimizely and Figma. Their idea was about format rather than generation: a deck stops being a file and becomes a page you open by link and scroll. That brings something PowerPoint cannot — the author sees who reached which slide. Generation arrived on top and made entry trivial, turning a paragraph of brief into twenty slides. The free tier grants four hundred credits once rather than monthly, and leaves a Gamma badge on the deck.',
    },
    priceCheckedAt: D,
    sources: ['https://gamma.app/pricing'],
  },
  {
    slug: 'beautiful-ai',
    name: 'Beautiful.ai',
    monogram: 'BA',
    brandColor: '#1d4ed8',
    job: 'design',
    rank: 44,
    website: 'https://beautiful.ai',
    pricingUrl: 'https://www.beautiful.ai/pricing',
    foundedYear: 2017,
    plans: [
      { name: 'Pro (год)', price: 12, recommended: true, includes: { ru: 'при оплате за год', en: 'billed annually' } },
      { name: 'Pro (месяц)', price: 45, includes: { ru: 'один человек', en: 'single user' } },
      { name: 'Team (год)', price: 40, unit: 'seat', includes: { ru: 'бренд-кит, совместная работа', en: 'brand kit, collaboration' } },
    ],
    facets: ['kbrand', 'kpptx'],
    tagline: {
      ru: 'Слайд сам перестраивается, когда добавляешь пункт',
      en: 'The slide relays itself when you add a point',
    },
    highlight: {
      ru: 'Слайд перестраивает раскладку сам, как только добавляешь пункт, — вместо того чтобы дать вам таскать блоки руками',
      en: 'The slide rebuilds its own layout the moment you add a point, instead of leaving you to drag boxes',
    },
    features: {
      ru: ['Раскладка слайда перестраивается автоматически', 'Единый фирменный стиль на всю команду', 'Выгрузка в PowerPoint', 'Бесплатного тарифа нет, только пробный период'],
      en: ['Slide layout rebuilds automatically', 'One brand style across the team', 'PowerPoint export', 'No free tier, trial only'],
    },
    about: {
      ru: 'Beautiful.ai основал в 2017 году Митч Грассо — до этого он сделал SlideRocket и продал его, так что презентациями он занимается третий десяток лет. Ставка у продукта не на генерацию текста, а на вёрстку: слайд сам перестраивает раскладку, когда вы добавляете пункт, и испортить композицию руками сложнее, чем в PowerPoint. Для компаний, где презентации делают не дизайнеры, это даёт ровный результат без правки каждого слайда. Разрыв между месячной и годовой оплатой здесь почти четырёхкратный, а бесплатного тарифа нет — только пробный период.',
      en: 'Beautiful.ai was founded in 2017 by Mitch Grasso, who had built and sold SlideRocket, putting him into a third decade of working on decks. Its bet is on layout rather than text generation: the slide re-composes itself when you add a point, and wrecking the composition by hand is harder than in PowerPoint. For companies where decks are made by people who are not designers, that yields an even result without fixing every slide. The gap between monthly and annual billing here is nearly fourfold, and there is no free tier — only a trial.',
    },
    priceCheckedAt: D,
    sources: ['https://www.beautiful.ai/pricing'],
  },

  /* ── Код и разработка ──────────────────────────────────────────── */
  {
    slug: 'cursor',
    name: 'Cursor',
    monogram: 'CU',
    brandColor: '#0b0b0f',
    job: 'code',
    // Не из рейтинга a16z: добавлен отдельно, поэтому номер за пределами списка.
    rank: 51,
    website: 'https://cursor.com',
    pricingUrl: 'https://cursor.com/pricing',
    foundedYear: 2022,
    plans: [
      { name: 'Hobby', price: 0, includes: { ru: 'ограниченный запас запросов', en: 'a limited request allowance' } },
      { name: 'Pro', price: 20, recommended: true, includes: { ru: 'основной тариф разработчика', en: 'the standard developer plan' } },
      { name: 'Pro+', price: 60, includes: { ru: 'больше запросов к сильным моделям', en: 'more requests to frontier models' } },
      { name: 'Ultra', price: 200, includes: { ru: 'максимальный запас', en: 'maximum allowance' } },
      { name: 'Teams', price: 40, unit: 'seat', includes: { ru: 'общий биллинг и права', en: 'shared billing and permissions' } },
    ],
    facets: ['cide', 'cagent', 'crepo', 'sso', 'notrain', 'desktop'],
    tagline: {
      ru: 'Редактор, который видит проект целиком',
      en: 'An editor that sees the whole project',
    },
    highlight: {
      ru: 'Строит индекс всего репозитория, поэтому правка одной функции учитывает места, где её вызывают, а не только открытый файл',
      en: 'Indexes the entire repository, so changing one function accounts for where it is called rather than only the open file',
    },
    features: {
      ru: ['Индекс всего репозитория, а не открытого файла', 'Агент правит несколько файлов за проход', 'Выбор модели под задачу', 'Годовая оплата дешевле примерно на 20%'],
      en: ['Indexes the whole repository, not the open file', 'Agent edits several files in one pass', 'Model choice per task', 'Annual billing is about 20% cheaper'],
    },
    about: {
      ru: 'Cursor делает компания Anysphere, основанная в 2022 году четырьмя выпускниками MIT — Майклом Труэллом, Суалехом Асифом, Арвидом Луннемарком и Аманом Санджером. Продукт устроен как форк Visual Studio Code, и это оказалось решающим: разработчик переносит настройки и расширения и не меняет привычек. Главное отличие от дополнений к редактору — индекс всего репозитория: модель видит, где функция вызывается, а не только открытый файл. Тарифная сетка за три года менялась несколько раз и сейчас устроена по запасу запросов, поэтому дешёвый тариф на тяжёлом проекте заканчивается быстрее, чем ожидаешь.',
      en: 'Cursor is made by Anysphere, founded in 2022 by four MIT graduates — Michael Truell, Sualeh Asif, Arvid Lunnemark and Aman Sanger. It is built as a fork of Visual Studio Code, and that proved decisive: a developer brings over settings and extensions and changes no habits. What separates it from editor add-ons is the repository index — the model sees where a function is called, not only the open file. The pricing table has changed several times in three years and now runs on request allowances, so a cheap plan on a heavy project runs out sooner than you expect.',
    },
    priceCheckedAt: D,
    sources: ['https://cursor.com/pricing'],
  },
  {
    slug: 'replit',
    name: 'Replit',
    monogram: 'RP',
    brandColor: '#ea580c',
    job: 'code',
    rank: 13,
    website: 'https://replit.com',
    pricingUrl: 'https://replit.com/pricing',
    foundedYear: 2016,
    plans: [
      { name: 'Starter', price: 0, includes: { ru: 'знак «Made with Replit», приложения спят через 30 дней', en: '"Made with Replit" badge, apps sleep after 30 days' } },
      { name: 'Core', price: 20, recommended: true, includes: { ru: '$25 в кредитах на агента', en: '$25 of agent credits' } },
      { name: 'Teams', price: 40, unit: 'seat', includes: { ru: 'общий проект и права', en: 'shared project and permissions' } },
    ],
    facets: ['cagent', 'cdeploy', 'cnocode', 'crepo', 'mob', 'sso', 'fmark'],
    tagline: {
      ru: 'Среда и хостинг в браузере, без установки',
      en: 'Environment and hosting in the browser, nothing installed',
    },
    highlight: {
      ru: 'Собирает приложение и сразу публикует его на живом адресе — ни среды, ни сервера настраивать не надо',
      en: 'Builds the app and publishes it to a live address straight away, with no environment or server to set up',
    },
    features: {
      ru: ['Агент собирает приложение с нуля', 'Публикация на живой адрес из того же окна', 'Работает в браузере, ставить ничего не надо', 'Бесплатно — приложения засыпают через 30 дней'],
      en: ['Agent builds an app from scratch', 'Publishes to a live address from the same window', 'Runs in the browser, nothing to install', 'Free: apps sleep after 30 days'],
    },
    about: {
      ru: 'Replit основали в 2016 году Амджад Масад, Фарис Масад и Хайя Одех; первые годы компания была средой разработки в браузере и держалась на школьниках и студентах, которым негде было поставить компилятор. Агент перевернул аудиторию: теперь сюда приходят люди, которые не пишут код вообще, и получают работающее приложение на живом адресе. В этом и преимущество — среда, база и хостинг уже на месте, настраивать нечего. Бесплатный тариф надо читать внимательно: приложение получает знак «Made with Replit», а через тридцать дней без обращений засыпает.',
      en: 'Replit was founded in 2016 by Amjad Masad, Faris Masad and Haya Odeh, and spent its first years as a browser IDE living off school and university students with nowhere to install a compiler. The agent flipped the audience: people who write no code at all now arrive and leave with a working app on a live address. That is the advantage — environment, database and hosting are already there, with nothing to configure. Read the free tier closely: the app carries a "Made with Replit" badge and goes to sleep after thirty days without traffic.',
    },
    priceCheckedAt: D,
    sources: ['https://replit.com/pricing'],
  },
  {
    slug: 'lovable',
    name: 'Lovable',
    monogram: 'LV',
    brandColor: '#db2777',
    job: 'code',
    rank: 14,
    website: 'https://lovable.dev',
    pricingUrl: 'https://lovable.dev/pricing',
    foundedYear: 2023,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '5 правок в день, не больше 30 в месяц', en: '5 edits a day, capped at 30 a month' } },
      { name: 'Pro', price: 25, recommended: true, includes: { ru: '100 кредитов в месяц, свой домен', en: '100 credits a month, custom domain' } },
      { name: 'Business', price: 50, unit: 'seat', includes: { ru: 'приватные проекты, SSO', en: 'private projects, SSO' } },
    ],
    facets: ['cagent', 'cnocode', 'cdeploy', 'sso', 'fexpire'],
    tagline: {
      ru: 'Приложение описанием, с настоящим кодом на выходе',
      en: 'An app from a description, with real code at the end',
    },
    highlight: {
      ru: 'Отдаёт результат обычным репозиторием на GitHub — проект можно унести к разработчику, а не остаться запертым в платформе',
      en: 'Hands the result over as an ordinary GitHub repository, so the project can leave for a developer instead of being locked into the platform',
    },
    features: {
      ru: ['Приложение собирается из описания на словах', 'Код уезжает в свой GitHub', 'База и авторизация подключаются сразу', 'Бесплатно — 5 правок в день, максимум 30 в месяц'],
      en: ['App assembled from a plain description', 'Code pushes to your own GitHub', 'Database and auth wired in from the start', 'Free: 5 edits a day, 30 a month at most'],
    },
    about: {
      ru: 'Lovable основали в 2023 году в Стокгольме Антон Осика и Фабиан Хедин; проект вырос из открытого инструмента GPT Engineer и за полтора года стал одним из самых быстрорастущих европейских стартапов. Отличие от конструкторов без кода принципиальное: на выходе получается обычный репозиторий на GitHub, который можно унести разработчику, а не остаться внутри платформы. База, авторизация и публикация подключены заранее. Бесплатный тариф тут самый жёсткий в задаче: пять правок в день и не больше тридцати в месяц, то есть на один вечер работы.',
      en: 'Lovable was founded in 2023 in Stockholm by Anton Osika and Fabian Hedin, grew out of the open-source GPT Engineer, and became one of Europe’s fastest-growing startups within eighteen months. It differs from no-code builders in a way that matters: the output is an ordinary GitHub repository you can hand to a developer instead of staying inside the platform. Database, auth and deployment are wired in up front. Its free tier is the tightest in this job: five edits a day and no more than thirty a month, which is one evening of work.',
    },
    priceCheckedAt: D,
    sources: ['https://lovable.dev/pricing'],
  },
  {
    slug: 'cognition-devin',
    name: 'Cognition (Devin)',
    monogram: 'DV',
    brandColor: '#111827',
    job: 'code',
    rank: 46,
    website: 'https://cognition.ai',
    pricingUrl: 'https://devin.ai/pricing',
    foundedYear: 2023,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'небольшой пробный запас', en: 'a small trial allowance' } },
      { name: 'Pro', price: 20, unit: 'seat', recommended: true, includes: { ru: 'основной тариф', en: 'the standard plan' } },
      { name: 'Max', price: 200, unit: 'seat', includes: { ru: 'большой запас ACU', en: 'a large ACU allowance' } },
      { name: 'Доплата за объём', price: 2.25, unit: 'usage', includes: { ru: '$2,25 за ACU сверх запаса', en: '$2.25 per ACU beyond the allowance' } },
    ],
    facets: ['cagent', 'crepo', 'cdeploy', 'api', 'sso'],
    tagline: {
      ru: 'Агент берёт задачу из трекера и приносит пулреквест',
      en: 'An agent takes a ticket and brings back a pull request',
    },
    highlight: {
      ru: 'Работает не подсказкой в редакторе, а исполнителем: берёт задачу, сам прогоняет тесты и возвращается с пулреквестом',
      en: 'Works as a performer rather than a prompt: it takes the ticket, runs the tests itself and comes back with a pull request',
    },
    features: {
      ru: ['Задача ставится как человеку, не как редактору', 'Сам прогоняет тесты и правит падения', 'Расход считается в ACU, не в запросах', 'Сверх запаса — $2,25 за ACU'],
      en: ['Briefed like a person, not like an editor', 'Runs tests and fixes failures itself', 'Usage counted in ACU, not requests', 'Beyond the allowance: $2.25 per ACU'],
    },
    about: {
      ru: 'Cognition основали в 2023 году Скотт Ву, Стивен Хао и Уолден Ян; команда известна по олимпиадному программированию, и первая демонстрация Devin в марте 2024 года была самым громким обещанием года — агент, который работает как инженер, а не как подсказка. Начиналось это с пятисот долларов в месяц; в апреле 2025 года цена упала до двадцати, и это один из самых резких пересмотров прайса в отрасли. В 2025 году компания купила Windsurf и получила вместе с ним редактор. Считать расходы здесь надо не по тарифу, а по ACU — единицам работы агента: запас быстро заканчивается, а сверх него идёт $2,25 за единицу.',
      en: 'Cognition was founded in 2023 by Scott Wu, Steven Hao and Walden Yan, a team known from competitive programming, and its March 2024 demo of Devin was the loudest promise of the year: an agent that works like an engineer rather than a prompt. It started at five hundred dollars a month; in April 2025 the price fell to twenty, one of the sharpest repricings in the industry. In 2025 the company bought Windsurf and acquired an editor with it. Budget here by ACU — units of agent work — rather than by plan: the allowance runs down quickly and beyond it each unit costs $2.25.',
    },
    priceCheckedAt: D,
    sources: ['https://devin.ai/pricing', 'https://venturebeat.com/technology/devin-2-0-is-here-cognition-slashes-price-of-ai-software-engineer-to-20-per-month-from-500'],
  },

  /* ── Текст и редактура ─────────────────────────────────────────── */
  {
    slug: 'notion',
    name: 'Notion',
    monogram: 'NO',
    brandColor: '#0b0b0f',
    job: 'writing',
    rank: 17,
    website: 'https://notion.com',
    pricingUrl: 'https://www.notion.com/pricing',
    foundedYear: 2013,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'личное использование, AI ограничен', en: 'personal use, limited AI' } },
      { name: 'Plus', price: 10, unit: 'seat', recommended: true, includes: { ru: 'команда, базовый AI', en: 'team workspace, basic AI' } },
      { name: 'Business', price: 20, unit: 'seat', includes: { ru: 'полный AI и поиск по базе', en: 'full AI and workspace search' } },
    ],
    facets: ['wnote', 'wedit', 'mob', 'api', 'sso', 'desktop'],
    tagline: {
      ru: 'Текст рядом с базой, где лежат все рабочие документы',
      en: 'Writing next to the database where the work already lives',
    },
    highlight: {
      ru: 'Отвечает по вашей собственной базе документов, а не по интернету — спросить можно про свой прошлогодний бриф',
      en: 'Answers from your own document base rather than the web, so you can ask about your own brief from last year',
    },
    features: {
      ru: ['Поиск и ответы по своим документам', 'Текст пишется там, где лежит проект', 'Подключение к Slack, Jira и почте', 'Полный AI открывается только с тарифа $20'],
      en: ['Search and answers across your own docs', 'Writing happens where the project lives', 'Connects to Slack, Jira and email', 'Full AI only from the $20 plan'],
    },
    about: {
      ru: 'Notion основали в 2013 году Иван Чжао и Саймон Ласт, и компания почти десять лет строила одно — рабочее пространство, где документы, задачи и базы лежат вместе. Когда появились языковые модели, это оказалось сильной позицией: отвечать можно не по интернету, а по собственным документам компании. Поэтому сравнивать Notion с генераторами текста не вполне корректно — он выигрывает не качеством абзаца, а тем, что знает контекст проекта. Тарифы считаются за каждого человека, и полный доступ к AI начинается только с уровня Business, то есть с двадцати долларов за участника.',
      en: 'Notion was founded in 2013 by Ivan Zhao and Simon Last and spent nearly a decade building one thing: a workspace where documents, tasks and databases sit together. When language models arrived that turned out to be a strong position, because answers can come from the company’s own documents rather than the web. Comparing Notion to a text generator is therefore slightly off — it wins on knowing the project’s context, not on the quality of a paragraph. Plans bill per person, and full AI access begins only at the Business tier, at twenty dollars a head.',
    },
    priceCheckedAt: D,
    sources: ['https://www.notion.com/pricing'],
  },
  {
    slug: 'jasper',
    name: 'Jasper',
    monogram: 'JA',
    brandColor: '#7c3aed',
    job: 'writing',
    rank: 23,
    website: 'https://jasper.ai',
    pricingUrl: 'https://www.jasper.ai/pricing',
    foundedYear: 2021,
    plans: [
      { name: 'Pro (год)', price: 59, recommended: true, includes: { ru: 'при оплате за год', en: 'billed annually' } },
      { name: 'Pro (месяц)', price: 69, includes: { ru: 'голос бренда, кампании', en: 'brand voice, campaigns' } },
    ],
    facets: ['wbrand', 'wseo', 'api', 'sso', 'notrain'],
    tagline: {
      ru: 'Маркетинговый текст, который держит голос бренда',
      en: 'Marketing copy that holds a brand voice',
    },
    highlight: {
      ru: 'Обучается на вашем архиве текстов и держит голос бренда на всей кампании — не один удачный абзац, а двести однотипных',
      en: 'Trains on your own text archive and holds the brand voice across a whole campaign — not one good paragraph but two hundred consistent ones',
    },
    features: {
      ru: ['Голос бренда обучается на своих текстах', 'Кампания целиком, а не отдельный текст', 'Данные не идут в обучение моделей', 'Бесплатного тарифа нет, только 7 дней пробы'],
      en: ['Brand voice trained on your own writing', 'Whole campaigns rather than single pieces', 'Your data stays out of model training', 'No free tier, only a 7-day trial'],
    },
    about: {
      ru: 'Jasper основали в 2021 году Дэйв Рогенмозер, Джон Филип Морган и Крис Халл — сначала под именем Jarvis, которое пришлось сменить после претензий Marvel. Компания одна из первых построила бизнес на генерации текста и прошла через падение: когда ChatGPT стал бесплатным, ценность простой обёртки вокруг модели обнулилась. Выжила она разворотом в корпоративный маркетинг: голос бренда, обученный на архиве компании, кампании целиком, обещание не отдавать данные в обучение. Бесплатного тарифа здесь нет — только семидневная проба, а вход начинается с пятидесяти девяти долларов при оплате за год.',
      en: 'Jasper was founded in 2021 by Dave Rogenmoser, John Philip Morgan and Chris Hull, first as Jarvis — a name dropped after Marvel objected. It was among the first to build a business on text generation and lived through a collapse: once ChatGPT was free, a thin wrapper around a model was worth nothing. It survived by turning into enterprise marketing — a brand voice trained on the company’s archive, whole campaigns, a promise to keep data out of training. There is no free tier, only a seven-day trial, and entry starts at fifty-nine dollars on annual billing.',
    },
    priceCheckedAt: D,
    sources: ['https://www.jasper.ai/pricing'],
  },
  {
    slug: 'quillbot',
    name: 'QuillBot',
    monogram: 'QB',
    brandColor: '#0e7490',
    job: 'writing',
    rank: 24,
    website: 'https://quillbot.com',
    pricingUrl: 'https://quillbot.com/premium',
    foundedYear: 2017,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'перефраз до 125 слов, без знака', en: 'paraphrase up to 125 words, no watermark' } },
      { name: 'Premium (год)', price: 4.17, recommended: true, includes: { ru: 'при оплате за год', en: 'billed annually' } },
      { name: 'Premium (месяц)', price: 9.95, includes: { ru: 'без лимита слов', en: 'no word cap' } },
      { name: 'Teams', price: 8.33, unit: 'seat', includes: { ru: 'общий аккаунт', en: 'shared workspace' } },
    ],
    facets: ['wedit', 'wdetect', 'mob'],
    tagline: {
      ru: 'Перефраз и вычитка чужого абзаца',
      en: 'Paraphrasing and proofing someone else’s paragraph',
    },
    highlight: {
      ru: 'Самый дешёвый платный доступ среди текстовых сервисов — четыре доллара в месяц при оплате за год, и бесплатный тариф без водяного знака',
      en: 'The cheapest paid access among the writing tools — four dollars a month billed annually, with a free tier that adds no watermark',
    },
    features: {
      ru: ['Перефраз в нескольких режимах', 'Проверка на AI-текст и плагиат', 'Бесплатно — до 125 слов за раз', 'Годовая цена вдвое ниже месячной'],
      en: ['Paraphrasing in several modes', 'AI-text and plagiarism checks', 'Free: up to 125 words at a time', 'Annual rate is half the monthly one'],
    },
    about: {
      ru: 'QuillBot основали в 2017 году Рохан Гупта, Анил Джейсон и Дэвид Силин — трое студентов, собравших перефразировщик для своих курсовых; в 2021 году компанию купил Course Hero. Задача у сервиса узкая и честная: не написать текст с нуля, а переписать чужой абзац и вычитать свой. Вокруг этого выросли проверка на плагиат, детектор AI-текста и грамматика. Это самый дешёвый платный доступ среди текстовых сервисов каталога — четыре доллара в месяц при оплате за год, — а бесплатный тариф ограничен ста двадцатью пятью словами за раз, зато без водяного знака.',
      en: 'QuillBot was founded in 2017 by Rohan Gupta, Anil Jason and David Silin — three students who built a paraphraser for their own coursework — and was bought by Course Hero in 2021. Its job is narrow and honest: not writing from scratch but rewriting somebody else’s paragraph and proofing your own. Plagiarism checking, an AI-text detector and grammar grew around that. It is the cheapest paid access among the writing tools here at four dollars a month on annual billing, and its free tier is capped at a hundred and twenty-five words at a time but adds no watermark.',
    },
    priceCheckedAt: D,
    sources: ['https://quillbot.com/premium'],
  },
  {
    slug: 'sudowrite',
    name: 'Sudowrite',
    monogram: 'SW',
    brandColor: '#be185d',
    job: 'writing',
    rank: 40,
    website: 'https://sudowrite.com',
    pricingUrl: 'https://www.sudowrite.com/pricing',
    foundedYear: 2020,
    plans: [
      { name: 'Hobby (год)', price: 10, includes: { ru: '225 тысяч кредитов, при оплате за год', en: '225k credits, billed annually' } },
      { name: 'Hobby (месяц)', price: 19, includes: { ru: '225 тысяч кредитов', en: '225k credits' } },
      { name: 'Professional', price: 29, recommended: true, includes: { ru: '1 млн кредитов', en: '1M credits' } },
      { name: 'Max', price: 59, includes: { ru: '2 млн кредитов, перенос остатка', en: '2M credits, rollover' } },
    ],
    facets: ['wlong', 'wedit'],
    tagline: {
      ru: 'Инструмент для романа, а не для поста',
      en: 'A tool for a novel, not for a post',
    },
    highlight: {
      ru: 'Держит сюжет и персонажей на всю книгу: помнит, кто кому кем является, на сотом тысячном слове',
      en: 'Holds plot and characters across a whole book, remembering who is who at the hundred-thousandth word',
    },
    features: {
      ru: ['Карта персонажей и сюжетных линий', 'Работа с текстом в сто тысяч слов', 'Перенос неизрасходованного на тарифе Max', 'Постоянного бесплатного тарифа нет'],
      en: ['A map of characters and plot lines', 'Works across a hundred thousand words', 'Credit rollover on the Max plan', 'No permanent free tier'],
    },
    about: {
      ru: 'Sudowrite основали в 2020 году Амит Гупта и Джеймс Ю — оба пишут прозу сами, и продукт собран под чужую задачу, а не под корпоративный маркетинг. Отличие от универсальных помощников в масштабе: сервис держит карту персонажей и сюжетных линий, поэтому на сотом тысячном слове помнит, кто кому кем является. Для романа это принципиально, а для поста в блоге бессмысленно, и сервис честно выбирает первое. Постоянного бесплатного тарифа здесь нет, но пробные десять тысяч кредитов не сгорают по сроку, а на старшем тарифе неизрасходованное переносится на следующий месяц.',
      en: 'Sudowrite was founded in 2020 by Amit Gupta and James Yu, both fiction writers themselves, and the product is built for that job rather than for enterprise marketing. What separates it from general assistants is scale: it keeps a map of characters and plot lines, so at the hundred-thousandth word it still knows who is who. That matters for a novel and is pointless for a blog post, and the product honestly picks the former. There is no permanent free tier, but the ten thousand trial credits do not expire by date, and on the top plan unused credits roll into the next month.',
    },
    priceCheckedAt: D,
    sources: ['https://www.sudowrite.com/pricing'],
  },
  {
    slug: 'novelai',
    name: 'NovelAI',
    monogram: 'NA',
    brandColor: '#1f2937',
    job: 'writing',
    rank: 38,
    website: 'https://novelai.net',
    pricingUrl: 'https://novelai.net/#pricing',
    foundedYear: 2021,
    plans: [
      { name: 'Tablet', price: 10, includes: { ru: 'базовая память контекста', en: 'base context memory' } },
      { name: 'Scroll', price: 15, recommended: true, includes: { ru: 'больше памяти и генераций', en: 'more memory and generations' } },
      { name: 'Opus', price: 25, includes: { ru: 'максимум памяти, картинки без лимита', en: 'maximum memory, unlimited images' } },
    ],
    facets: ['wlong'],
    tagline: {
      ru: 'Проза и аниме-картинка в одной подписке',
      en: 'Prose and anime imagery in one subscription',
    },
    highlight: {
      ru: 'Единственный в каталоге, кто держит текст и генерацию картинок в одной подписке, не вводя внешней модерации на сюжет',
      en: 'The only entry here that keeps text and image generation in one subscription without imposing outside moderation on the story',
    },
    features: {
      ru: ['Проза без внешней модерации сюжета', 'Генерация картинок в аниме-стилистике', 'Своя модель, а не чужой API', 'Бесплатного тарифа нет, только короткая проба'],
      en: ['Prose without outside story moderation', 'Anime-style image generation', 'Its own model rather than someone’s API', 'No free tier, only a short trial'],
    },
    about: {
      ru: 'NovelAI запустила в 2021 году команда Anlatan, и сервис с самого начала строился на принципе, от которого остальные отказались: своя модель и отсутствие внешней модерации сюжета. Аудитория у него соответствующая — авторы интерактивной прозы и фанфикшена, которым важно, чтобы текст не правил редактор чужой платформы. К прозе добавилась генерация картинок в аниме-стилистике, что для подписки за десять-двадцать пять долларов необычно много. Бесплатного тарифа нет, есть только короткая проба: тридцать картинок и пятьдесят текстовых генераций.',
      en: 'NovelAI was launched in 2021 by the Anlatan team and was built from the start on a principle the rest abandoned: its own model and no outside moderation of the story. Its audience follows from that — writers of interactive fiction and fan work who need the text not edited by somebody else’s platform. Anime-style image generation was added to the prose, which is unusually broad for a ten-to-twenty-five-dollar subscription. There is no free tier, only a short trial of thirty images and fifty text generations.',
    },
    priceCheckedAt: D,
    sources: ['https://novelai.net/#pricing'],
  },
  {
    slug: 'justdone',
    name: 'JustDone',
    monogram: 'JD',
    brandColor: '#2563eb',
    job: 'writing',
    rank: 39,
    website: 'https://justdone.ai',
    pricingUrl: 'https://justdone.ai',
    plans: [
      { name: 'Подписка', price: null, includes: { ru: 'на сайте цена не опубликована, появляется при оформлении', en: 'no price published on the site, it appears at checkout' } },
    ],
    facets: ['wdetect', 'wedit'],
    tagline: {
      ru: 'Проверка текста на AI и переписывание под неё',
      en: 'AI detection, and rewriting to get past it',
    },
    highlight: {
      ru: 'Держит обе стороны одной задачи: проверяет текст на машинное происхождение и тут же переписывает его под эту проверку',
      en: 'Works both sides of the same job: it checks text for machine origin and rewrites it against that check',
    },
    features: {
      ru: ['Детектор AI-текста и перефраз под него', 'Вычитка и проверка на плагиат', 'Работает в браузере', 'Прайса на сайте нет'],
      en: ['AI-text detector plus rewriting against it', 'Proofing and plagiarism checks', 'Browser-based', 'No price list on the site'],
    },
    about: {
      ru: 'JustDone работает на стыке двух задач, которые обычно продают отдельно: проверить текст на машинное происхождение и переписать его так, чтобы проверку он прошёл. Основная аудитория — студенты и копирайтеры, сдающие работу туда, где стоит детектор. Содержательно сервис близок к QuillBot, но собран вокруг детектора, а не вокруг перефраза. Цену в карточке мы не указываем по проверенной причине: на странице тарифов justdone.com цифр нет вовсе — там перечислены возможности, а сумма появляется только в оформлении заказа. Мы смотрели 12 октября 2026 года.',
      en: 'JustDone sits where two usually separate products meet: checking text for machine origin and rewriting it to pass that check. Its audience is students and copywriters submitting work where a detector is waiting. In substance it is close to QuillBot, but built around the detector rather than the paraphraser. We quote no price for a checked reason: the justdone.com pricing page carries no figures at all — it lists what is included, and the sum appears only at checkout. We looked on 12 October 2026.',
    },
    priceCheckedAt: D,
    sources: ['https://justdone.com/pricing'],
  },

  /* ── Поиск и разбор ────────────────────────────────────────────── */
  {
    slug: 'perplexity',
    name: 'Perplexity',
    monogram: 'PX',
    brandColor: '#0e7490',
    job: 'automation',
    rank: 10,
    website: 'https://perplexity.ai',
    pricingUrl: 'https://www.perplexity.ai/settings/account',
    foundedYear: 2022,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'поиск со ссылками, ограниченный глубокий разбор', en: 'sourced search, limited deep research' } },
      { name: 'Pro', price: 20, recommended: true, includes: { ru: 'выбор моделей, глубокий разбор', en: 'model choice, deep research' } },
      { name: 'Max', price: 200, includes: { ru: 'максимальный доступ к моделям', en: 'maximum model access' } },
    ],
    facets: ['rsource', 'rdeep', 'rfile', 'mob', 'api'],
    tagline: {
      ru: 'Поиск, который показывает, откуда взял ответ',
      en: 'Search that shows where the answer came from',
    },
    highlight: {
      ru: 'Ставит ссылку к каждому утверждению в ответе, поэтому проверить его можно построчно, а не поверить на слово',
      en: 'Puts a link against every claim in the answer, so it can be checked line by line instead of taken on trust',
    },
    features: {
      ru: ['Ссылка к каждому утверждению', 'Глубокий разбор на много шагов', 'Чтение присланных файлов', 'Бесплатный тариф рабочий, но глубокий разбор ограничен'],
      en: ['A link against every claim', 'Multi-step deep research', 'Reads files you upload', 'Free tier is usable, deep research capped'],
    },
    about: {
      ru: 'Perplexity основали в 2022 году Аравинд Сринивас, Денис Яратс, Джонни Хо и Энди Конвински — команда пришла из OpenAI, Meta и Databricks. Решение, которое отличило сервис от чата, было редакторским, а не техническим: к каждому утверждению ставится ссылка, и ответ можно проверить построчно. Это сделало Perplexity рабочим инструментом там, где за неточность отвечают деньгами или репутацией. Бесплатный тариф полноценный и для большинства запросов достаточный; двадцать долларов открывают выбор моделей и долгий разбор на много шагов.',
      en: 'Perplexity was founded in 2022 by Aravind Srinivas, Denis Yarats, Johnny Ho and Andy Konwinski, a team out of OpenAI, Meta and Databricks. The decision that separated it from a chatbot was editorial rather than technical: every claim carries a link, so the answer can be checked line by line. That made Perplexity a working tool in places where being wrong costs money or reputation. The free tier is real and enough for most queries; twenty dollars opens model choice and long multi-step research.',
    },
    priceCheckedAt: D,
    sources: ['https://www.perplexity.ai/hub/faq/pplx-pro'],
  },
  {
    slug: 'genspark',
    name: 'Genspark',
    monogram: 'GS',
    brandColor: '#4338ca',
    job: 'automation',
    rank: 42,
    website: 'https://genspark.ai',
    pricingUrl: 'https://www.genspark.ai/pricing',
    foundedYear: 2023,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '100 кредитов в день, без карты', en: '100 credits a day, no card' } },
      { name: 'Plus', price: 24.99, recommended: true, includes: { ru: 'большой запас кредитов', en: 'a large credit allowance' } },
      { name: 'Pro', price: 249.99, includes: { ru: 'максимальный запас и приоритет', en: 'maximum allowance and priority' } },
    ],
    facets: ['rsource', 'rdeep', 'rsheet', 'rfile', 'mob'],
    tagline: {
      ru: 'Разбор, который собирается в страницу, а не в ответ',
      en: 'Research that assembles into a page, not a reply',
    },
    highlight: {
      ru: 'Сто бесплатных кредитов в день без карты — самый свободный вход в задаче, где остальные ограничивают глубокий разбор платным тарифом',
      en: 'A hundred free credits a day with no card — the most open entry in a job where the rest put deep research behind a paywall',
    },
    features: {
      ru: ['Результат собирается в страницу со таблицами', 'Агент выполняет задачу по шагам', '100 кредитов в день бесплатно', 'Разрыв между тарифами десятикратный'],
      en: ['Results assembled into a page with tables', 'An agent works the task step by step', '100 free credits a day', 'A tenfold gap between plans'],
    },
    about: {
      ru: 'Genspark основали в 2023 году выходцы из Baidu, включая Эрика Цзина, который руководил там поисковыми продуктами. Отличие от Perplexity в формате выдачи: не ответ со ссылками, а собранная страница с таблицами и разделами, которую можно отдать дальше как готовый материал. Сюда же добавлен агент, выполняющий задачу по шагам — позвонить, заполнить, собрать. Бесплатный тариф здесь один из самых свободных: сто кредитов в день и без привязки карты. Разрыв между тарифами огромный — от двадцати пяти до двухсот пятидесяти долларов.',
      en: 'Genspark was founded in 2023 by alumni of Baidu, including Eric Jing, who had run search products there. It differs from Perplexity in what it hands back: not an answer with links but an assembled page with tables and sections you can pass on as finished material. An agent that works a task in steps — calling, filling in, collecting — sits alongside it. The free tier is among the most open here: a hundred credits a day with no card. The gap between plans is enormous, running from twenty-five to two hundred and fifty dollars.',
    },
    priceCheckedAt: D,
    sources: ['https://www.genspark.ai/pricing'],
  },

  /* ── Автоматизация и агенты ────────────────────────────────────── */
  {
    slug: 'n8n',
    name: 'n8n',
    monogram: 'N8',
    brandColor: '#db2777',
    job: 'automation',
    rank: 29,
    website: 'https://n8n.io',
    pricingUrl: 'https://n8n.io/pricing',
    foundedYear: 2019,
    plans: [
      { name: 'Community (свой сервер)', price: 0, includes: { ru: 'без лимита срабатываний, ставится самостоятельно', en: 'unlimited executions, you host it' } },
      { name: 'Starter', price: 24, currency: 'EUR', recommended: true, includes: { ru: '2500 срабатываний в месяц', en: '2,500 executions a month' } },
      { name: 'Pro', price: 60, currency: 'EUR', includes: { ru: '10 000 срабатываний', en: '10,000 executions' } },
      { name: 'Enterprise', price: 800, currency: 'EUR', includes: { ru: '40 000 срабатываний, SSO', en: '40,000 executions, SSO' } },
    ],
    facets: ['zflow', 'znodes', 'zagent', 'selfhost', 'api', 'sso'],
    tagline: {
      ru: 'Сценарии из блоков, которые можно унести на свой сервер',
      en: 'Block-built flows you can move onto your own server',
    },
    highlight: {
      ru: 'Открытая версия ставится на свой сервер и работает без лимита срабатываний и без оплаты вообще — единственный такой случай в каталоге',
      en: 'The open edition installs on your own server and runs with no execution cap and no payment at all — the only case of its kind here',
    },
    features: {
      ru: ['Сценарии собираются из блоков', 'Больше 400 готовых интеграций', 'Бесплатно без лимита на своём сервере', 'Облачный тариф считается в срабатываниях, не в людях'],
      en: ['Flows assembled from blocks', 'Over 400 ready integrations', 'Free and uncapped on your own server', 'Cloud plans count executions, not people'],
    },
    about: {
      ru: 'n8n основал в 2019 году в Берлине Ян Оберхаузер, и компания с самого начала держалась модели, редкой для автоматизации: исходники открыты, а версию Community можно поставить на свой сервер и работать без лимита срабатываний и без оплаты. Это и сделало её выбором тех, кому важно, чтобы данные не уходили в чужое облако. Облачные тарифы считаются не по людям, а по срабатываниям, поэтому цена зависит от нагрузки: команда из двадцати человек с десятком сценариев может платить меньше, чем один человек с тяжёлым потоком. Годовая оплата дешевле примерно на семнадцать процентов.',
      en: 'n8n was founded in 2019 in Berlin by Jan Oberhauser, and from the start the company held to a model unusual in automation: the source is open, and the Community edition installs on your own server with no execution cap and no payment. That made it the pick for anyone who needs data to stay out of somebody else’s cloud. Cloud plans count executions rather than people, so the bill follows load: a team of twenty with a dozen flows can pay less than one person with a heavy pipeline. Annual billing saves roughly seventeen per cent.',
    },
    priceCheckedAt: D,
    sources: ['https://n8n.io/pricing'],
  },
  {
    slug: 'manus',
    name: 'Manus',
    monogram: 'MN',
    brandColor: '#1f2937',
    job: 'automation',
    rank: 27,
    website: 'https://manus.im',
    pricingUrl: 'https://manus.im/pricing',
    foundedYear: 2025,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'дневной запас кредитов', en: 'a daily credit allowance' } },
      { name: 'Starter', price: 20, recommended: true, includes: { ru: '4000 кредитов в месяц', en: '4,000 credits a month' } },
      { name: 'Pro', price: 40, includes: { ru: 'больше кредитов и параллельных задач', en: 'more credits and parallel tasks' } },
      { name: 'Max', price: 200, includes: { ru: 'максимальный запас', en: 'maximum allowance' } },
    ],
    facets: ['zagent', 'mob'],
    tagline: {
      ru: 'Агент, который доводит задачу до результата сам',
      en: 'An agent that carries a task through to a result',
    },
    highlight: {
      ru: 'Работает в своём браузере и своей файловой системе: открывает сайты, заполняет формы и возвращается с готовым файлом, а не с инструкцией',
      en: 'Runs its own browser and file system: it opens sites, fills forms and comes back with a finished file rather than instructions',
    },
    features: {
      ru: ['Задача выполняется, а не описывается', 'Свой браузер и файлы у агента', 'Отчёт собирается в таблицу или страницу', 'Расход считается в кредитах за задачу'],
      en: ['The task is done, not described', 'The agent has its own browser and files', 'Reports assemble into a sheet or a page', 'Usage counted as credits per task'],
    },
    about: {
      ru: 'Manus выпустила в 2025 году китайская компания Butterfly Effect, известная до этого расширением Monica; запуск по приглашениям стал одним из самых обсуждаемых в том году. Отличие от чата в том, что агент получает своё окружение: браузер, файловую систему, возможность запускать код, — и возвращается не с инструкцией, а с результатом, будь то таблица или собранная страница. Расход считается в кредитах за задачу, поэтому цена зависит от сложности, а не от числа запросов. Бесплатный тариф даёт дневной запас, которого хватает попробовать одну-две задачи.',
      en: 'Manus was released in 2025 by the Chinese company Butterfly Effect, previously known for the Monica extension, and its invite-only launch was among the most discussed of the year. It differs from a chatbot in giving the agent an environment of its own — a browser, a file system, the ability to run code — so it comes back with a result rather than instructions, be that a spreadsheet or an assembled page. Usage is counted as credits per task, so the bill follows complexity rather than request count. The free tier gives a daily allowance, enough for one or two tasks.',
    },
    priceCheckedAt: D,
    sources: ['https://manus.im/pricing'],
  },
  {
    slug: 'superhuman',
    name: 'Superhuman',
    monogram: 'SH',
    brandColor: '#4338ca',
    job: 'automation',
    rank: 19,
    website: 'https://superhuman.com',
    pricingUrl: 'https://superhuman.com/pricing',
    foundedYear: 2014,
    plans: [
      { name: 'Starter (год)', price: 25, unit: 'seat', recommended: true, includes: { ru: 'при оплате за год', en: 'billed annually' } },
      { name: 'Starter (месяц)', price: 30, unit: 'seat', includes: { ru: 'один человек', en: 'single user' } },
      { name: 'Business', price: 40, unit: 'seat', includes: { ru: 'командные функции и управление', en: 'team features and admin' } },
    ],
    facets: ['zmail', 'mob', 'sso', 'desktop'],
    tagline: {
      ru: 'Почта, разобранная к тому моменту, как вы её открыли',
      en: 'An inbox already triaged by the time you open it',
    },
    highlight: {
      ru: 'Разбирает входящие до того, как вы их открыли: письма отсортированы, неважное убрано, ответы предложены — и бесплатного тарифа нет совсем',
      en: 'Triages the inbox before you open it — sorted, noise set aside, replies drafted — and has no free tier at all',
    },
    features: {
      ru: ['Входящие сортируются автоматически', 'Черновики ответов в вашем стиле', 'Управление с клавиатуры без мыши', 'Бесплатного тарифа нет'],
      en: ['Inbox sorted automatically', 'Reply drafts in your own voice', 'Keyboard-only control', 'No free tier'],
    },
    about: {
      ru: 'Superhuman основал в 2014 году Рахул Вохра, до этого продавший Rapportive в LinkedIn; продукт десять лет продавался как самый быстрый почтовый клиент и стоил тридцать долларов в месяц задолго до того, как добавил AI. Логика осталась прежней — почта должна разбираться быстрее, чем вы успеваете её читать, — но теперь к скорости добавились автоматическая сортировка и черновики ответов в вашей манере. В 2025 году компанию купила Grammarly. Бесплатного тарифа здесь никогда не было, и оплата идёт за каждого человека.',
      en: 'Superhuman was founded in 2014 by Rahul Vohra, who had sold Rapportive to LinkedIn, and for a decade sold itself as the fastest email client at thirty dollars a month long before it added AI. The logic has not changed — mail should be cleared faster than you can read it — but automatic triage and reply drafts in your own manner now sit on top of the speed. Grammarly acquired the company in 2025. There has never been a free tier, and billing is per person.',
    },
    priceCheckedAt: D,
    sources: ['https://superhuman.com/pricing'],
  },

  /* ── Дизайн и макеты ───────────────────────────────────────────── */
  {
    slug: 'canva',
    name: 'Canva',
    monogram: 'CV',
    brandColor: '#0891b2',
    job: 'design',
    rank: 16,
    website: 'https://canva.com',
    pricingUrl: 'https://www.canva.com/pricing',
    foundedYear: 2013,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'шаблоны и базовые инструменты', en: 'templates and basic tools' } },
      { name: 'Pro', price: 18, recommended: true, includes: { ru: 'бренд-кит, снятие фона', en: 'brand kit, background removal' } },
      { name: 'Teams', price: 25, unit: 'seat', includes: { ru: 'общие шаблоны и согласование', en: 'shared templates and approvals' } },
    ],
    facets: ['gtemplate', 'gcollab', 'mob', 'api', 'sso', 'desktop'],
    tagline: {
      ru: 'Дизайн для тех, кто не дизайнер',
      en: 'Design for people who are not designers',
    },
    highlight: {
      ru: 'Генерация встроена в редактор, которым уже умеют пользоваться — учиться новому инструменту не нужно, и это объясняет масштаб',
      en: 'Generation is built into an editor people already know how to use, so nothing new has to be learned — which explains the scale',
    },
    features: {
      ru: ['Огромная библиотека шаблонов', 'Снятие фона и правка картинок', 'Фирменный стиль на всю команду', 'Бесплатный тариф без водяного знака'],
      en: ['An enormous template library', 'Background removal and image editing', 'A brand kit across the team', 'Free tier without a watermark'],
    },
    about: {
      ru: 'Canva основали в 2013 году в Сиднее Мелани Перкинс, Клифф Обрехт и Кэмерон Адамс, и компания выросла на одной мысли: большинству людей нужен не Photoshop, а шаблон. Генеративные инструменты здесь встроены в редактор, которым уже умеют пользоваться десятки миллионов — учиться заново не надо, и это объясняет её место в рейтинге выручки. Для команд ценность не в генерации, а в фирменном стиле: шрифты и цвета один раз заводятся в бренд-кит и дальше не разъезжаются. Бесплатный тариф настоящий, без водяного знака; платный открывает снятие фона и бренд-кит.',
      en: 'Canva was founded in 2013 in Sydney by Melanie Perkins, Cliff Obrecht and Cameron Adams, and grew on one observation: most people do not need Photoshop, they need a template. Its generative tools are built into an editor tens of millions already know, so nothing has to be relearned — which explains its place on the revenue list. For teams the value is not generation but the brand kit: fonts and colours are set once and stop drifting. The free tier is real and watermark-free; paying adds background removal and the brand kit.',
    },
    priceCheckedAt: D,
    sources: ['https://www.canva.com/pricing'],
  },
  {
    slug: 'figma',
    name: 'Figma',
    monogram: 'FG',
    brandColor: '#0b0b0f',
    job: 'design',
    rank: 18,
    website: 'https://figma.com',
    pricingUrl: 'https://www.figma.com/pricing',
    foundedYear: 2012,
    plans: [
      { name: 'Starter', price: 0, includes: { ru: '3 файла, совместная работа', en: '3 files, collaboration' } },
      { name: 'Dev', price: 12, unit: 'seat', includes: { ru: 'доступ к коду и замерам', en: 'code and measurement access' } },
      { name: 'Full', price: 16, unit: 'seat', recommended: true, includes: { ru: 'полная работа с макетами', en: 'full design editing' } },
    ],
    facets: ['gcollab', 'gdev', 'gtemplate', 'api', 'sso', 'desktop'],
    tagline: {
      ru: 'Макет, в котором работают все сразу',
      en: 'A file everyone works in at once',
    },
    highlight: {
      ru: 'Платит за роль, а не за человека: смотрящий, разработчик и дизайнер стоят по-разному, и команда не переплачивает за зрителей',
      en: 'Charges by role rather than by head: a viewer, a developer and a designer each cost differently, so teams stop overpaying for spectators',
    },
    features: {
      ru: ['Несколько человек в одном файле', 'Отдельная дешёвая роль для разработчика', 'Место для комментариев стоит $3', 'Бесплатно — три файла'],
      en: ['Several people in one file', 'A separate cheaper developer seat', 'A commenting seat costs $3', 'Free: three files'],
    },
    about: {
      ru: 'Figma основали в 2012 году Дилан Филд и Эван Уоллес и восемь лет строили то, что казалось невозможным: полноценный редактор интерфейсов в браузере. Выигрыш оказался не в скорости, а в совместной работе — в одном файле сидят дизайнер, разработчик и заказчик. Покупка за двадцать миллиардов не состоялась после возражений регуляторов, и в 2025 году компания вышла на биржу самостоятельно. Тарифы здесь устроены по ролям, а не по людям: зритель, разработчик и дизайнер стоят по-разному, и на команде это существенная разница в смете.',
      en: 'Figma was founded in 2012 by Dylan Field and Evan Wallace and spent eight years building what looked impossible: a full interface editor in a browser. The win turned out to be collaboration rather than speed — designer, developer and client sit in one file. A twenty-billion-dollar acquisition collapsed under regulatory objection, and in 2025 the company went public on its own. Pricing here is structured by role rather than by head: viewer, developer and designer cost differently, which makes a real difference to a team’s budget.',
    },
    priceCheckedAt: D,
    sources: ['https://www.figma.com/pricing'],
  },
  {
    slug: 'meshy',
    name: 'Meshy',
    monogram: 'MS',
    brandColor: '#4f46e5',
    job: 'design',
    rank: 37,
    website: 'https://meshy.ai',
    pricingUrl: 'https://www.meshy.ai/pricing',
    foundedYear: 2021,
    plans: [
      { name: 'Free', price: 0, includes: { ru: '100 кредитов в месяц, лицензия CC BY 4.0', en: '100 credits a month, CC BY 4.0 licence' } },
      { name: 'Pro', price: 20, recommended: true, includes: { ru: '1000 кредитов, приватность, API', en: '1,000 credits, private assets, API' } },
      { name: 'Studio', price: 60, includes: { ru: '4000 кредитов, команда', en: '4,000 credits, team features' } },
      { name: 'Max', price: 100, includes: { ru: 'максимальный запас', en: 'maximum allowance' } },
    ],
    facets: ['g3d', 'gtemplate', 'api', 'fnocomm'],
    tagline: {
      ru: '3D-модель по картинке или описанию',
      en: 'A 3D model from an image or a description',
    },
    highlight: {
      ru: 'Единственный в каталоге, кто отдаёт готовую 3D-модель с текстурами — результат идёт прямо в игровой движок, а не в рендер',
      en: 'The only entry here that hands back a textured 3D model — the output goes straight into a game engine rather than a render',
    },
    features: {
      ru: ['Модель с текстурами, готовая к движку', 'Генерация по фотографии предмета', 'Бесплатно 100 кредитов, но лицензия с указанием автора', 'API для встраивания в конвейер'],
      en: ['A textured model ready for an engine', 'Generate from a photograph of an object', 'Free 100 credits, but licensed with attribution', 'API for your own pipeline'],
    },
    about: {
      ru: 'Meshy основал в 2021 году Итан Ху, работавший до этого в NVIDIA над графикой; компания заняла участок, которого в рейтинге больше никто не закрывает — трёхмерные модели. Задача здесь тяжелее картинки: нужна не проекция, а геометрия с текстурами, которую можно открыть в движке и поставить в сцену. Основная аудитория — разработчики игр и те, кто делает предметы для AR. Бесплатный тариф даёт сто кредитов в месяц, но результат выходит под лицензией с обязательным указанием авторства, и для коммерческого проекта это стоит проверить до начала работы.',
      en: 'Meshy was founded in 2021 by Ethan Hu, previously working on graphics at NVIDIA, and covers ground nobody else on this list does: three-dimensional models. The problem is harder than an image — you need geometry with textures that opens in an engine and drops into a scene, not a projection. Its audience is game developers and people building objects for AR. The free tier gives a hundred credits a month, but the output carries an attribution licence, which is worth checking before a commercial project starts.',
    },
    priceCheckedAt: D,
    sources: ['https://www.meshy.ai/pricing'],
  },

  /* ── Платформы и API ───────────────────────────────────────────── */
  {
    slug: 'openrouter',
    name: 'OpenRouter',
    monogram: 'OR',
    brandColor: '#1f2937',
    job: 'platform',
    rank: 32,
    website: 'https://openrouter.ai',
    pricingUrl: 'https://openrouter.ai/pricing',
    foundedYear: 2023,
    plans: [
      { name: 'Standard', price: null, unit: 'usage', recommended: true, includes: { ru: 'цена модели плюс 5,5% при покупке кредитов', en: 'model list price plus 5.5% on credit top-ups' } },
      { name: 'Business', price: null, unit: 'usage', includes: { ru: 'цена модели плюс 8%', en: 'model list price plus 8%' } },
    ],
    facets: ['pmodels', 'popen', 'api'],
    tagline: {
      ru: 'Одна точка доступа к моделям всех поставщиков',
      en: 'One access point to every provider’s models',
    },
    highlight: {
      ru: 'Отдаёт модели всех поставщиков по одному ключу и без наценки на токены — платите прайс поставщика плюс процент при пополнении счёта',
      en: 'Serves every provider’s models through one key with no token markup — you pay the provider’s list price plus a percentage on top-up',
    },
    features: {
      ru: ['Больше 300 моделей одним ключом', 'Наценки на токены нет, только процент за пополнение', 'Автоматический переход на резервного поставщика', 'Месячной подписки нет вообще'],
      en: ['Over 300 models through one key', 'No token markup, only a top-up fee', 'Automatic failover to a backup provider', 'No monthly subscription at all'],
    },
    about: {
      ru: 'OpenRouter основал в 2023 году Алекс Аталла — соучредитель OpenSea; задача у сервиса инфраструктурная и скучная ровно настолько, насколько полезная. Вместо того чтобы держать по ключу на каждого поставщика, разработчик подключается к одной точке и получает три сотни моделей, причём при недоступности одной запрос уходит к резервной. Наценки на токены здесь нет: вы платите прайс поставщика, а сервис берёт процент при пополнении счёта — 5,5% на обычном тарифе. Месячной подписки не существует вообще, поэтому «цена в месяц» для этой карточки неприменима.',
      en: 'OpenRouter was founded in 2023 by Alex Atallah, a co-founder of OpenSea, and its job is infrastructural and exactly as dull as it is useful. Instead of holding a key per provider, a developer connects to one endpoint and gets three hundred models, with requests failing over to a backup when one goes down. There is no token markup: you pay the provider’s list price and the service takes a cut on credit top-ups — 5.5% on the standard tier. No monthly subscription exists, so a monthly price does not apply to this card.',
    },
    priceCheckedAt: D,
    sources: ['https://openrouter.ai/docs/faq'],
  },
  {
    slug: 'hugging-face',
    name: 'Hugging Face',
    monogram: 'HF',
    brandColor: '#f59e0b',
    job: 'platform',
    rank: 41,
    website: 'https://huggingface.co',
    pricingUrl: 'https://huggingface.co/pricing',
    foundedYear: 2016,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'публичные модели и наборы данных', en: 'public models and datasets' } },
      { name: 'PRO', price: 9, recommended: true, includes: { ru: '$2 кредитов на вычисления', en: '$2 of inference credits' } },
      { name: 'Team', price: 20, unit: 'seat', includes: { ru: 'приватные репозитории', en: 'private repositories' } },
      { name: 'Enterprise', price: 50, unit: 'seat', includes: { ru: 'управление доступом, аудит', en: 'access control and audit' } },
    ],
    facets: ['popen', 'phost', 'pgpu', 'api', 'sso'],
    tagline: {
      ru: 'Склад открытых моделей, на который ссылается вся отрасль',
      en: 'The open-model repository the whole field links to',
    },
    highlight: {
      ru: 'Открытая модель, о которой пишут в новостях, почти всегда лежит здесь — это общий склад отрасли, а не чей-то продукт',
      en: 'The open model in the news is almost always hosted here: this is the field’s shared warehouse, not somebody’s product',
    },
    features: {
      ru: ['Открытые модели и наборы данных', 'Размещение своей модели и демо', 'Аренда GPU под обучение', 'Бесплатный доступ к публичным репозиториям'],
      en: ['Open models and datasets', 'Host your own model and demo', 'GPU rental for training', 'Free access to public repositories'],
    },
    about: {
      ru: 'Hugging Face основали в 2016 году Клеман Делянг, Жюльен Шомон и Тома Вольф, и начинали они с чат-бота для подростков — направление, от которого ничего не осталось. Компания превратилась в общую инфраструктуру отрасли: открытая модель, о которой пишут в новостях, почти наверняка лежит здесь, вместе с наборами данных и демонстрациями. Платные тарифы нужны тем, кто держит приватные репозитории или арендует GPU под обучение, а публичный доступ остаётся бесплатным. Расходы здесь считаются не подпиской, а объёмом вычислений, и тариф PRO включает лишь два доллара кредитов.',
      en: 'Hugging Face was founded in 2016 by Clément Delangue, Julien Chaumond and Thomas Wolf, starting from a chatbot for teenagers — a direction nothing survives from. The company became the field’s shared infrastructure: the open model in the news is almost certainly hosted here, along with the datasets and demos. Paid plans serve people keeping private repositories or renting GPUs for training, while public access stays free. Spending here is measured in compute rather than subscription, and the PRO tier includes only two dollars of credits.',
    },
    priceCheckedAt: D,
    sources: ['https://huggingface.co/pricing'],
  },
  {
    slug: 'fal',
    name: 'fal',
    monogram: 'FL',
    brandColor: '#db2777',
    job: 'platform',
    rank: 45,
    website: 'https://fal.ai',
    pricingUrl: 'https://fal.ai/pricing',
    foundedYear: 2021,
    plans: [
      { name: 'Модели по объёму', price: null, unit: 'usage', recommended: true, includes: { ru: 'видео $0,025–0,14 за секунду, картинки от $0,005', en: 'video $0.025–0.14 a second, images from $0.005' } },
      { name: 'Аренда GPU', price: null, unit: 'usage', includes: { ru: '$1,99–12,99 за час работы карты', en: '$1.99–12.99 per GPU hour' } },
    ],
    facets: ['pgpu', 'pmodels', 'phost', 'api'],
    tagline: {
      ru: 'Генеративные модели как быстрый API',
      en: 'Generative models as a fast API',
    },
    highlight: {
      ru: 'Специализируется на скорости генерации картинок и видео — продаёт не модель, а задержку, которой хватает для работы в реальном времени',
      en: 'Specialises in image and video latency — it sells the response time rather than the model, fast enough to work in real time',
    },
    features: {
      ru: ['Модели картинок и видео через API', 'Аренда GPU по часам', 'Размещение своей модели', 'Подписки нет вовсе: только за объём и за часы GPU'],
      en: ['Image and video models over an API', 'GPU rental by the hour', 'Host your own model', 'No subscription at all: usage and GPU hours only'],
    },
    about: {
      ru: 'fal основали в 2021 году Буркай Гюр и Гёркем Юртсевен — выходцы из Amazon и Coinbase; компания выбрала узкую инфраструктурную нишу: быстрый запуск генеративных моделей картинок и видео. Продаётся здесь не модель, а задержка — на fal работают продукты, которым нужно отдавать результат за секунды, и под это построена вся платформа. Рядом есть аренда GPU по часам и размещение своей модели. Подписки нет: платят за вызов модели или за секунду видео, поэтому «цена в месяц» для карточки неприменима, а счёт считается по нагрузке.',
      en: 'fal was founded in 2021 by Burkay Gur and Gorkem Yurtseven, who came out of Amazon and Coinbase, and picked a narrow infrastructural niche: running generative image and video models fast. What it sells is latency rather than a model — products that must return a result in seconds run on fal, and the whole platform is built for that. GPU rental by the hour and hosting your own model sit alongside. There is no subscription: you pay per model call or per second of video, so a monthly price does not apply and the bill follows load.',
    },
    priceCheckedAt: D,
    sources: ['https://fal.ai/pricing'],
  },
  {
    slug: 'minimax',
    name: 'MiniMax',
    monogram: 'MM',
    brandColor: '#0e7490',
    job: 'platform',
    rank: 28,
    website: 'https://minimax.io',
    pricingUrl: 'https://www.minimax.io/price',
    foundedYear: 2021,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'ограниченный дневной запас', en: 'a limited daily allowance' } },
      { name: 'Go', price: 22, recommended: true, includes: { ru: 'базовый запас генераций', en: 'base generation allowance' } },
      { name: 'Explore', price: 55, includes: { ru: 'больше видео и аудио', en: 'more video and audio' } },
      { name: 'Build', price: 132, includes: { ru: 'максимальный запас', en: 'maximum allowance' } },
    ],
    facets: ['pmodels', 'popen', 'api', 'mob'],
    tagline: {
      ru: 'Свои модели для видео, аудио и текста в одном месте',
      en: 'In-house video, audio and text models in one place',
    },
    highlight: {
      ru: 'Держит собственные модели для видео, речи и текста сразу — редкий случай, когда весь набор у одной команды, а часть весов выложена открыто',
      en: 'Runs its own video, speech and text models at once — a rare case of one team holding the full set, with some weights released openly',
    },
    features: {
      ru: ['Видео, речь и текст на своих моделях', 'Часть весов выложена открыто', 'API и приложение одновременно', 'Тарифы переименованы 30 сентября 2026 года'],
      en: ['Video, speech and text on in-house models', 'Some weights released openly', 'An API and an app at once', 'Plans renamed on 30 September 2026'],
    },
    about: {
      ru: 'MiniMax основал в 2021 году в Шанхае Янь Цзюньцзе, ушедший из SenseTime; компания одна из немногих, кто держит собственные модели сразу для видео, речи и текста, а не берёт чужие по API. Часть весов она выкладывает открыто, что для китайской лаборатории такого размера нечастый выбор и делает её заметной за пределами внутреннего рынка. Продукт существует и как приложение, и как платформа для разработчиков. Тарифы здесь переименовали 30 сентября 2026 года: прежние Plus, Max и Ultra стали Go, Explore и Build, и сравнения из статей годичной давности уже не совпадают с прайсом.',
      en: 'MiniMax was founded in 2021 in Shanghai by Yan Junjie after leaving SenseTime, and is one of the few companies holding its own models for video, speech and text rather than renting others over an API. It releases some weights openly, an uncommon choice for a Chinese lab of that size and one that makes it visible beyond its home market. The product exists both as an app and as a developer platform. Its plans were renamed on 30 September 2026 — the former Plus, Max and Ultra became Go, Explore and Build — so year-old comparisons no longer match the price list.',
    },
    priceCheckedAt: D,
    sources: ['https://www.minimax.io/price'],
  },
  {
    slug: 'nous-research',
    name: 'Nous Research',
    monogram: 'NR',
    brandColor: '#111827',
    job: 'platform',
    rank: 49,
    website: 'https://nousresearch.com',
    pricingUrl: 'https://nousresearch.com',
    foundedYear: 2023,
    plans: [
      { name: 'Открытые веса', price: 0, includes: { ru: 'модели выложены свободно', en: 'models released freely' } },
      { name: 'Доступ к API', price: null, unit: 'usage', includes: { ru: 'цена зависит от модели и объёма', en: 'price depends on model and volume' } },
    ],
    facets: ['popen', 'phost', 'selfhost', 'api'],
    tagline: {
      ru: 'Открытые модели, которые дорабатывает сообщество',
      en: 'Open models the community keeps refining',
    },
    highlight: {
      ru: 'Выкладывает веса свободно и обучает модели распределённо, на чужих машинах, — противоположность закрытым лабораториям рейтинга',
      en: 'Releases weights freely and trains distributed across other people’s machines — the opposite of the closed labs on this list',
    },
    features: {
      ru: ['Веса выложены свободно', 'Распределённое обучение на машинах участников', 'Модель можно поставить на свой сервер', 'Подписки нет: часть моделей открыта бесплатно'],
      en: ['Weights released freely', 'Distributed training across participants’ machines', 'Models run on your own server', 'No subscription: some models are open and free'],
    },
    about: {
      ru: 'Nous Research собралась в 2023 году вокруг сообщества, дорабатывавшего открытые модели, и выросла в исследовательскую лабораторию, которая публикует веса свободно. Её особенность — распределённое обучение: модель учится не в одном дата-центре, а на машинах участников, и это прямая противоположность закрытым лабораториям из этого же рейтинга. Попадание в список выручки здесь объясняется не подпиской, а доступом к вычислениям и API. Цену в карточке мы не указываем: единого тарифа «в месяц» не существует, расход считается по модели и объёму, а модель можно поставить и на свой сервер бесплатно.',
      en: 'Nous Research formed in 2023 around a community refining open models and grew into a research lab that publishes weights freely. Its distinguishing practice is distributed training: a model learns across participants’ machines rather than in one data centre, which is the direct opposite of the closed labs on the same list. Its place on the revenue list comes from compute and API access rather than subscriptions. We quote no price on this card: there is no single monthly plan, spending follows model and volume, and the models also run on your own server for nothing.',
    },
    priceCheckedAt: D,
    sources: ['https://nousresearch.com'],
  },

  /* ── Универсальные ассистенты ──────────────────────────────────── */
  {
    slug: 'chatgpt',
    name: 'ChatGPT',
    monogram: 'GP',
    brandColor: '#0f766e',
    job: 'assistants',
    // Вне рейтинга a16z: тот считает потребительские приложения по выручке с
    // подписок, а у лабораторий деньги идут из подписок и API вперемешку.
    rank: 52,
    website: 'https://chatgpt.com',
    pricingUrl: 'https://openai.com/chatgpt/pricing/',
    foundedYear: 2015,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'переписка без лимита, остальное с ограничениями', en: 'unlimited text chats, everything else capped' } },
      { name: 'Go', price: null, includes: { ru: 'цена по стране; в Чехии 200 Kč в месяц, тариф может показывать рекламу', en: 'priced per country; 200 CZK a month in Czechia, this plan may show ads' } },
      { name: 'Plus', price: null, recommended: true, includes: { ru: 'цена по стране; в Чехии 499 Kč в месяц', en: 'priced per country; 499 CZK a month in Czechia' } },
      { name: 'Pro', price: null, includes: { ru: 'цена по стране; в Чехии от 2 490 Kč в месяц', en: 'priced per country; from 2,490 CZK a month in Czechia' } },
    ],
    facets: ['xvoice', 'xfiles', 'xcode', 'xmem', 'ximg', 'mob', 'api', 'sso', 'notrain', 'desktop'],
    tagline: {
      ru: 'Тот самый чат, с которого для большинства начался AI',
      en: 'The chat that started it for most people',
    },
    highlight: {
      ru: 'Единственный, кого ставят рядом с водой и электричеством: им пользуются люди, которые не смогут назвать ни одной другой нейросети',
      en: 'The only one people reach for without knowing any other model exists — the default, not a choice',
    },
    features: {
      ru: ['Голосовой режим и разговор вслух', 'Читает файлы, таблицы и картинки', 'Генерирует изображения в том же окне', 'Цену назначает страна, единой нет'],
      en: ['Voice mode and spoken conversation', 'Reads files, spreadsheets and images', 'Generates images in the same window', 'Price is set per country, there is no single one'],
    },
    about: {
      ru: 'OpenAI основали в 2015 году как некоммерческую лабораторию; среди учредителей были Сэм Альтман и Илон Маск, последний вышел из совета в 2018-м. ChatGPT запустили в ноябре 2022 года как демонстрацию, и он за два месяца собрал сто миллионов пользователей — быстрее любого потребительского продукта до него. Сегодня это не чат, а оболочка над несколькими моделями: голос, файлы, картинки, запуск кода и агент, выполняющий задачу по шагам. Цена зависит от страны: 12 октября 2026 года официальная страница из Чехии показывала 200, 499 и от 2 490 крон за три платных уровня, и единой мировой цифры у сервиса нет.',
      en: 'OpenAI was founded in 2015 as a non-profit lab, with Sam Altman and Elon Musk among its backers; Musk left the board in 2018. ChatGPT launched in November 2022 as a demo and reached a hundred million users in two months, faster than any consumer product before it. It is no longer a chat but a shell over several models: voice, files, images, code execution and an agent that works a task in steps. Pricing follows the country: on 12 October 2026 the official page served from Czechia showed 200, 499 and from 2,490 CZK for the three paid tiers, and no single global figure exists.',
    },
    priceCheckedAt: D,
    sources: ['https://openai.com/chatgpt/pricing/'],
  },
  {
    slug: 'claude',
    name: 'Claude',
    monogram: 'CL',
    brandColor: '#c96442',
    job: 'assistants',
    rank: 53,
    website: 'https://claude.com',
    pricingUrl: 'https://claude.com/pricing',
    foundedYear: 2021,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'ограниченный объём, Claude Code не входит', en: 'limited usage, Claude Code not included' } },
      { name: 'Pro', price: 20, recommended: true, includes: { ru: '$17 при оплате за год, Claude Code входит', en: '$17 billed annually, Claude Code included' } },
      { name: 'Max', price: 100, includes: { ru: 'от $100, выбор объёма 5× или 20×', en: 'from $100, pick a 5× or 20× tier' } },
      { name: 'Team', price: 25, unit: 'seat', includes: { ru: '$20 за место при оплате за год', en: '$20 a seat billed annually' } },
    ],
    facets: ['xfiles', 'xcode', 'xmem', 'mob', 'api', 'sso', 'notrain', 'desktop'],
    tagline: {
      ru: 'Ассистент, которого выбирают за длинный разбор, а не за скорость',
      en: 'The assistant picked for long reasoning rather than speed',
    },
    highlight: {
      ru: 'Единственный из тройки, кто кладёт инструмент для кода в ту же подписку: Claude Code входит в любой платный тариф и отдельных денег не стоит',
      en: 'The only one of the three that puts its coding tool in the same subscription: Claude Code is included in every paid plan at no extra cost',
    },
    features: {
      ru: ['Claude Code входит в любой платный тариф', 'Работа с длинными документами целиком', 'Приложение для компьютера и телефона', 'Данные не идут в обучение моделей'],
      en: ['Claude Code included in every paid plan', 'Works through long documents whole', 'Desktop and phone apps', 'Your data stays out of model training'],
    },
    about: {
      ru: 'Anthropic основали в 2021 году Дарио и Даниэла Амодеи вместе с группой исследователей, ушедших из OpenAI; компания с самого начала заявила безопасность моделей своей основной задачей и выстроила вокруг неё подход, который называет конституционным обучением. Claude вышел в 2023 году и занял место там, где важнее не скорость ответа, а умение держать длинный документ и не терять нить. Отдельная ставка — разработка: инструмент Claude Code входит в любой платный тариф, тогда как конкуренты продают такие вещи сверху. Цены компания публикует в долларах одинаково для всех стран: на 12 октября 2026 года это 20 долларов за Pro, от 100 за Max и 25 за место в команде.',
      en: 'Anthropic was founded in 2021 by Dario and Daniela Amodei with a group of researchers who had left OpenAI, and declared model safety its central problem from the start, building an approach it calls constitutional training. Claude arrived in 2023 and found its place where holding a long document without losing the thread matters more than answering fast. Its separate bet is development: Claude Code comes with every paid plan, while rivals sell that kind of thing on top. The company publishes dollar prices identically for every country — on 12 October 2026 that is twenty dollars for Pro, from a hundred for Max and twenty-five a seat for Team.',
    },
    priceCheckedAt: D,
    sources: ['https://claude.com/pricing'],
  },
  {
    slug: 'gemini',
    name: 'Gemini',
    monogram: 'GM',
    brandColor: '#1a73e8',
    job: 'assistants',
    rank: 54,
    website: 'https://gemini.google.com',
    pricingUrl: 'https://one.google.com/about/google-ai-plans/',
    foundedYear: 2023,
    plans: [
      { name: 'Free', price: 0, includes: { ru: 'приложение Gemini и 15 ГБ в Google One', en: 'the Gemini app and 15 GB of Google One storage' } },
      { name: 'Google AI Plus', price: null, includes: { ru: 'цена по стране; в Чехии 149,99 Kč в месяц, 400 ГБ', en: 'priced per country; 149.99 CZK a month in Czechia, 400 GB' } },
      { name: 'Google AI Pro', price: null, recommended: true, includes: { ru: 'цена по стране; в Чехии 549,99 Kč в месяц, 5 ТБ', en: 'priced per country; 549.99 CZK a month in Czechia, 5 TB' } },
      { name: 'Google AI Ultra', price: null, includes: { ru: 'цена по стране; в Чехии от 2 999,99 Kč в месяц', en: 'priced per country; from 2,999.99 CZK a month in Czechia' } },
    ],
    facets: ['xvoice', 'xfiles', 'xcode', 'xmem', 'ximg', 'mob', 'api', 'sso'],
    tagline: {
      ru: 'Ассистент, который уже стоит там, где вы работаете',
      en: 'The assistant already sitting where you work',
    },
    highlight: {
      ru: 'Приходит не отдельным сайтом, а внутрь почты, документов и таблиц, которыми вы и так пользуетесь, — и продаётся в одной подписке с местом в облаке',
      en: 'Arrives inside the mail, documents and spreadsheets you already use rather than as another website — and ships in one subscription with cloud storage',
    },
    features: {
      ru: ['Встроен в Gmail, Документы и Таблицы', 'Подписка идёт вместе с местом в Google One', 'Голосовой режим и работа с картинками', 'Цену назначает страна, единой нет'],
      en: ['Built into Gmail, Docs and Sheets', 'The subscription bundles Google One storage', 'Voice mode and image work', 'Price is set per country, there is no single one'],
    },
    about: {
      ru: 'Gemini выпустила Google DeepMind в декабре 2023 года, заменив им прежнего ассистента Bard; за моделью стоит подразделение, собранное из DeepMind и Google Brain после их слияния в 2023-м. Преимущество у сервиса не в самой модели, а в том, где он находится: Gemini встроен в Gmail, Документы и Таблицы, то есть оказывается рядом с работой, а не ждёт, пока к нему придут. Подписка продаётся вместе с местом в облаке Google One, из-за чего сравнивать её цену с чистым ассистентом не вполне корректно. Цифры зависят от страны: 12 октября 2026 года официальная страница из Чехии показывала 149,99, 549,99 и от 2 999,99 крон за три уровня.',
      en: 'Gemini was released by Google DeepMind in December 2023, replacing the earlier Bard assistant; behind it sits the division formed when DeepMind and Google Brain merged in 2023. Its advantage is not the model but its location: Gemini is built into Gmail, Docs and Sheets, which puts it beside the work instead of waiting to be visited. The subscription is sold together with Google One storage, which makes a straight price comparison with a bare assistant slightly unfair. The figures follow the country — on 12 October 2026 the official page served from Czechia showed 149.99, 549.99 and from 2,999.99 CZK for the three tiers.',
    },
    priceCheckedAt: D,
    sources: ['https://one.google.com/about/google-ai-plans/'],
  },
];
