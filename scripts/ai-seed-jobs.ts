/**
 * Задачи каталога и признаки фильтра.
 *
 * Признаки живут здесь, а не у сервисов, по той же причине, что и в схеме:
 * один ключ — одна формулировка. Группы со scope 'global' заведены один раз,
 * в первой задаче, и подхватываются везде (см. facetGroupsFor в src/lib/ai.ts).
 *
 * Ключи, которые система выводит сама из тарифов и руками не ставятся:
 * free, cheap, mid, pricey, perseat, usage. Они перечислены в фильтре, но у
 * сервисов в `facets` их нет.
 */

export interface SeedFacet { key: string; label: { ru: string; en: string } }
export interface SeedGroup {
  title: { ru: string; en: string };
  scope: 'task' | 'global';
  openByDefault?: boolean;
  items: SeedFacet[];
}
export interface SeedJob {
  slug: string;
  name: { ru: string; en: string };
  icon: string;
  order: number;
  intro: { ru: string; en: string };
  sortedBy: { ru: string; en: string };
  facetGroups: SeedGroup[];
}

/* ── Общие группы: заводятся один раз, работают во всех задачах ──── */

/**
 * Общие группы — тот самый общий знаменатель. Правило при их наборе было одно:
 * пункт остаётся, только если он действительно делит каталог. Признак, который
 * есть почти у всех, фильтром не работает — «в браузере» стояло у 45 карточек
 * из 51, «скидка за год» у 42, «общий аккаунт» у 29. Они убраны, а не
 * переписаны: галочка, после которой список почти не меняется, обманывает.
 *
 * То же с обратной стороны: «коммерческое использование разрешено» и «без
 * очереди» не стояли вообще ни у кого, потому что проверить их по всем
 * компаниям мы не смогли. Пустой пункт в фильтре — обещание, которое продукт
 * не выполняет, и его тоже нет.
 */

const MONEY: SeedGroup = {
  title: { ru: 'Цена и оплата', en: 'Price and billing' },
  scope: 'global',
  openByDefault: true,
  items: [
    { key: 'free', label: { ru: 'Есть бесплатный тариф', en: 'Has a free tier' } },
    { key: 'nofree', label: { ru: 'Бесплатного тарифа нет', en: 'No free tier' } },
    { key: 'cheap', label: { ru: 'Платный до $12 в месяц', en: 'Paid under $12/mo' } },
    { key: 'mid', label: { ru: 'Платный $12–25 в месяц', en: 'Paid $12–25/mo' } },
    { key: 'pricey', label: { ru: 'Платный от $25 в месяц', en: 'Paid from $25/mo' } },
    { key: 'perseat', label: { ru: 'Платят за каждого человека', en: 'Billed per seat' } },
    { key: 'usage', label: { ru: 'Платят за объём, а не подпиской', en: 'Billed by usage, not subscription' } },
  ],
};

const FREE_LIMITS: SeedGroup = {
  title: { ru: 'Что мешает на бесплатном', en: 'What the free tier costs you' },
  scope: 'global',
  items: [
    { key: 'fmark', label: { ru: 'Водяной знак на результате', en: 'Watermark on the output' } },
    { key: 'fnocomm', label: { ru: 'Коммерческое использование закрыто или нужна ссылка', en: 'Commercial use blocked or attribution required' } },
    { key: 'fexpire', label: { ru: 'Запас сгорает и не возобновляется', en: 'Allowance expires and does not renew' } },
  ],
};

const PLATFORM: SeedGroup = {
  title: { ru: 'Где работает', en: 'Where it runs' },
  scope: 'global',
  items: [
    { key: 'desktop', label: { ru: 'Приложение для компьютера', en: 'Desktop app' } },
    { key: 'mob', label: { ru: 'Приложение для телефона', en: 'Phone app' } },
    { key: 'api', label: { ru: 'Есть API', en: 'Has an API' } },
    { key: 'selfhost', label: { ru: 'Ставится на свой сервер', en: 'Runs on your own server' } },
  ],
};

const TEAM: SeedGroup = {
  title: { ru: 'Команда и данные', en: 'Teams and data' },
  scope: 'global',
  items: [
    { key: 'sso', label: { ru: 'Единый вход (SSO)', en: 'Single sign-on' } },
    { key: 'notrain', label: { ru: 'Данные не идут в обучение', en: 'Data excluded from training' } },
  ],
};

const GLOBALS = [MONEY, FREE_LIMITS, PLATFORM, TEAM];

/* ── Задачи ──────────────────────────────────────────────────────── */

export const JOBS: SeedJob[] = [
  {
    slug: 'assistants',
    name: { ru: 'Универсальные ассистенты', en: 'General assistants' },
    icon: 'grid',
    order: 5,
    intro: {
      ru: 'Четыре компании, которые делают сами модели, а не продукт поверх чужой. Сравнивать их по цене бессмысленно: тарифы почти совпали, а различаются они тем, что умеют делать с вашими файлами, кодом и голосом. Цены здесь назначаются по стране, поэтому в карточке стоит оговорка, а не одна цифра на весь мир.',
      en: 'The four companies that build the models themselves rather than a product on top of someone else’s. Comparing them on price is pointless — the plans have converged. They differ in what they will do with your files, your code and your voice. Prices here are set per country, so the cards carry a note instead of one worldwide figure.',
    },
    sortedBy: { ru: 'По минимальному платному тарифу, где он назван одной цифрой', en: 'By cheapest paid plan where one figure is published' },
    facetGroups: [
      {
        title: { ru: 'Ассистент', en: 'Assistant' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'xvoice', label: { ru: 'Голосовой режим', en: 'Voice mode' } },
          { key: 'xfiles', label: { ru: 'Читает присланные файлы', en: 'Reads files you upload' } },
          { key: 'xcode', label: { ru: 'Пишет и запускает код', en: 'Writes and runs code' } },
          { key: 'xmem', label: { ru: 'Помнит прошлые разговоры', en: 'Remembers past conversations' } },
          { key: 'ximg', label: { ru: 'Генерирует изображения', en: 'Generates images' } },
        ],
      },
    ],
  },
  {
    slug: 'video',
    name: { ru: 'Генерация видео', en: 'Video generation' },
    icon: 'film',
    order: 10,
    intro: {
      ru: 'Генераторы видео упираются не в красоту кадра, а в три скучные вещи: сколько секунд даёт один запрос, выходит ли 4K без доплаты и остаётся ли водяной знак. Поэтому фильтр спрашивает про них первым делом.',
      en: 'Video models rarely fail on looks. They fail on the dull part: how many seconds one prompt buys, whether 4K costs extra, and whether a watermark survives the export. The filter asks about those first.',
    },
    sortedBy: { ru: 'По минимальному платному тарифу, от дешёвых к дорогим', en: 'By cheapest paid plan, low to high' },
    facetGroups: [
      ...GLOBALS,
      {
        title: { ru: 'Видео', en: 'Video' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'v4k', label: { ru: 'Выгрузка в 4K', en: '4K export' } },
          { key: 'v1080', label: { ru: 'Выгрузка в 1080p', en: '1080p export' } },
          { key: 'vnomark', label: { ru: 'Без водяного знака на платном', en: 'No watermark on paid plans' } },
          { key: 'vlip', label: { ru: 'Липсинк под озвучку', en: 'Lip-sync to a voice track' } },
          { key: 'vavatar', label: { ru: 'Говорящий аватар', en: 'Talking avatar' } },
          { key: 'vlong', label: { ru: 'Ролик длиннее минуты', en: 'Clips over a minute' } },
          { key: 'vsound', label: { ru: 'Звук генерируется вместе с кадром', en: 'Sound generated with the frame' } },
          { key: 'vref', label: { ru: 'Кадр по своей картинке', en: 'Image-to-video from your own frame' } },
        ],
      },
      {
        title: { ru: 'Реклама', en: 'Advertising' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'aacc', label: { ru: 'Выгрузка в рекламный кабинет', en: 'Pushes into an ad account' } },
          { key: 'aab', label: { ru: 'Тест вариантов', en: 'Variant testing' } },
          { key: 'augc', label: { ru: 'Ролики в формате UGC', en: 'UGC-style clips' } },
          { key: 'aproduct', label: { ru: 'Креатив по ссылке на товар', en: 'Creative from a product link' } },
          { key: 'afee', label: { ru: 'Комиссия с рекламного бюджета', en: 'Takes a cut of ad spend' } },
        ],
      },
    ],
  },
  {
    slug: 'images',
    name: { ru: 'Генерация изображений', en: 'Image generation' },
    icon: 'image',
    order: 20,
    intro: {
      ru: 'Картинку легко получить и трудно использовать: часть сервисов отдаёт бесплатный результат в общую галерею, часть не разрешает коммерческое применение, часть не умеет писать текст на обложке. Фильтр разделяет их по этим признакам, а не по стилю.',
      en: 'Getting an image is easy; being allowed to use it is the hard part. Some tools publish your free output to a public gallery, some withhold a commercial licence, and some still cannot spell a word on a poster. The filter sorts on that, not on style.',
    },
    sortedBy: { ru: 'По минимальному платному тарифу, от дешёвых к дорогим', en: 'By cheapest paid plan, low to high' },
    facetGroups: [
      {
        title: { ru: 'Изображения', en: 'Images' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'i4k', label: { ru: 'Разрешение от 4K', en: '4K and above' } },
          { key: 'ivector', label: { ru: 'Вектор: SVG на выходе', en: 'Vector SVG output' } },
          { key: 'itext', label: { ru: 'Текст на картинке читается', en: 'Legible text in the image' } },
          { key: 'iupscale', label: { ru: 'Увеличение и восстановление', en: 'Upscale and restore' } },
          { key: 'ibatch', label: { ru: 'Пакетная обработка', en: 'Batch processing' } },
          { key: 'iportrait', label: { ru: 'Работа с лицами', en: 'Face and portrait work' } },
          { key: 'ibg', label: { ru: 'Снятие и замена фона', en: 'Background removal and replace' } },
        ],
      },
    ],
  },
  {
    slug: 'voice',
    name: { ru: 'Голос и музыка', en: 'Voice and music' },
    icon: 'volume',
    order: 30,
    intro: {
      ru: 'Синтез голоса разошёлся на две ветки: озвучка текста и музыка. Общее у них одно — лицензия. На бесплатном тарифе коммерческое использование разрешают далеко не все, и это важнее тембра.',
      en: 'Voice work has split in two: reading text aloud and writing music. The one thing both turn on is the licence. Plenty of free tiers withhold commercial use, and that matters more than timbre.',
    },
    sortedBy: { ru: 'По минимальному платному тарифу, от дешёвых к дорогим', en: 'By cheapest paid plan, low to high' },
    facetGroups: [
      {
        title: { ru: 'Голос и звук', en: 'Voice and audio' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'sclone', label: { ru: 'Клон своего голоса', en: 'Clone your own voice' } },
          { key: 'smulti', label: { ru: 'Больше 20 языков', en: 'Over 20 languages' } },
          { key: 'smusic', label: { ru: 'Музыка с вокалом', en: 'Music with vocals' } },
          { key: 'sstems', label: { ru: 'Разбор трека на дорожки', en: 'Split a track into stems' } },
          { key: 'sread', label: { ru: 'Читает документы и книги', en: 'Reads documents and books' } },
          { key: 'stalk', label: { ru: 'Разговорная практика', en: 'Spoken practice' } },
        ],
      },
    ],
  },
  {
    slug: 'dictation',
    name: { ru: 'Диктовка и расшифровка', en: 'Dictation and transcripts' },
    icon: 'mic',
    order: 40,
    intro: {
      ru: 'Здесь два разных дела под одной вывеской. Диктовка превращает речь в текст прямо в поле ввода, расшифровка разбирает уже записанный созвон на реплики и решения. Выбирать нужно по тому, что вам надо, иначе инструмент окажется не тем.',
      en: 'Two different jobs share one label. Dictation turns speech into text in the field you are typing into; transcription takes a call that already happened and breaks it into who said what and what was decided. Pick by which one you need.',
    },
    sortedBy: { ru: 'По минимальному платному тарифу, от дешёвых к дорогим', en: 'By cheapest paid plan, low to high' },
    facetGroups: [
      {
        title: { ru: 'Речь в текст', en: 'Speech to text' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'dlive', label: { ru: 'Пишет по ходу речи', en: 'Transcribes as you speak' } },
          { key: 'danywhere', label: { ru: 'Работает в любом приложении', en: 'Works in any app' } },
          { key: 'ddict', label: { ru: 'Свой словарь терминов', en: 'Custom vocabulary' } },
          { key: 'dmeet', label: { ru: 'Подключается к созвонам', en: 'Joins meetings' } },
          { key: 'dcrm', label: { ru: 'Отдаёт запись в CRM', en: 'Pushes notes to a CRM' } },
          { key: 'dhw', label: { ru: 'Своё устройство для записи', en: 'Its own recording device' } },
        ],
      },
    ],
  },
  {
    slug: 'code',
    name: { ru: 'Код и разработка', en: 'Code and building' },
    icon: 'code',
    order: 50,
    intro: {
      ru: 'Разница между помощником в редакторе и агентом, который сам правит репозиторий, стоит денег и объясняет разброс цен от двадцати долларов до двухсот. Фильтр разделяет их напрямую.',
      en: 'The gap between an assistant inside your editor and an agent that edits the repository on its own is what explains the spread from twenty dollars to two hundred. The filter splits them outright.',
    },
    sortedBy: { ru: 'По минимальному платному тарифу, от дешёвых к дорогим', en: 'By cheapest paid plan, low to high' },
    facetGroups: [
      {
        title: { ru: 'Разработка', en: 'Development' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'cide', label: { ru: 'Работает внутри редактора', en: 'Lives inside the editor' } },
          { key: 'cagent', label: { ru: 'Агент доводит задачу сам', en: 'Agent finishes the task itself' } },
          { key: 'crepo', label: { ru: 'Видит весь репозиторий', en: 'Reads the whole repository' } },
          { key: 'cdeploy', label: { ru: 'Сам публикует результат', en: 'Deploys the result itself' } },
          { key: 'cnocode', label: { ru: 'Без навыков программирования', en: 'No coding required' } },
        ],
      },
    ],
  },
  {
    slug: 'writing',
    name: { ru: 'Текст и редактура', en: 'Writing and editing' },
    icon: 'pen',
    order: 60,
    intro: {
      ru: 'Текстовые сервисы делятся по длине работы: короткие рекламные тексты, редактура чужого абзаца и роман на сто тысяч слов — три разные задачи и три разных инструмента. Цена при этом почти не связана с длиной.',
      en: 'Writing tools split by the length of the job: ad copy, rewriting somebody else’s paragraph, and a hundred-thousand-word novel are three different tasks on three different tools. Price has almost nothing to do with length.',
    },
    sortedBy: { ru: 'По минимальному платному тарифу, от дешёвых к дорогим', en: 'By cheapest paid plan, low to high' },
    facetGroups: [
      {
        title: { ru: 'Текст', en: 'Text' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'wbrand', label: { ru: 'Держит голос бренда', en: 'Keeps a brand voice' } },
          { key: 'wseo', label: { ru: 'Работа под поисковые запросы', en: 'Writes against search queries' } },
          { key: 'wlong', label: { ru: 'Длинные тексты и книги', en: 'Long-form and books' } },
          { key: 'wedit', label: { ru: 'Редактура и перефраз', en: 'Editing and paraphrasing' } },
          { key: 'wdetect', label: { ru: 'Проверка на AI-текст', en: 'AI-text detection' } },
          { key: 'wnote', label: { ru: 'Живёт рядом с заметками и базой', en: 'Sits next to your notes and docs' } },
        ],
      },
    ],
  },
  {
    slug: 'automation',
    name: { ru: 'Поиск и агенты', en: 'Search and agents' },
    icon: 'search',
    order: 70,
    intro: {
      ru: 'Автоматизация оплачивается не временем, а срабатываниями, поэтому счёт растёт от нагрузки, а не от числа людей в команде. Один из сервисов здесь можно поставить на свой сервер и не платить вовсе.',
      en: 'Automation is billed by executions, not by time, so the invoice follows load rather than headcount. One of the tools here runs on your own server for nothing at all.',
    },
    sortedBy: { ru: 'По минимальному платному тарифу, от дешёвых к дорогим', en: 'By cheapest paid plan, low to high' },
    facetGroups: [
      {
        title: { ru: 'Автоматизация', en: 'Automation' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'zflow', label: { ru: 'Сценарии из блоков', en: 'Visual flow builder' } },
          { key: 'zagent', label: { ru: 'Агент работает без присмотра', en: 'Agent runs unattended' } },
          { key: 'znodes', label: { ru: 'Готовые интеграции с сервисами', en: 'Ready-made integrations' } },
          { key: 'zmail', label: { ru: 'Разбирает входящую почту', en: 'Works through your inbox' } },
        ],
      },
      {
        title: { ru: 'Поиск', en: 'Search' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'rsource', label: { ru: 'Ссылки на источники в ответе', en: 'Links to sources in the answer' } },
          { key: 'rdeep', label: { ru: 'Долгий разбор на много шагов', en: 'Multi-step deep research' } },
          { key: 'rfile', label: { ru: 'Читает присланные файлы', en: 'Reads files you upload' } },
          { key: 'rsheet', label: { ru: 'Собирает результат в таблицу', en: 'Builds the result into a sheet' } },
        ],
      },
    ],
  },
  {
    slug: 'design',
    name: { ru: 'Дизайн и макеты', en: 'Design and layout' },
    icon: 'grid',
    order: 80,
    intro: {
      ru: 'Дизайн-инструменты оплачиваются за человека, а не за аккаунт, и это главное, что меняет смету: команда из пяти человек платит в пять раз больше. Фильтр отмечает такие тарифы отдельно.',
      en: 'Design tools bill per person, not per account, and that is what changes the budget: a team of five pays five times over. The filter flags those plans separately.',
    },
    sortedBy: { ru: 'По минимальному платному тарифу, от дешёвых к дорогим', en: 'By cheapest paid plan, low to high' },
    facetGroups: [
      {
        title: { ru: 'Дизайн', en: 'Design' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'gcollab', label: { ru: 'Несколько человек в одном файле', en: 'Several people in one file' } },
          { key: 'g3d', label: { ru: '3D-модели', en: '3D models' } },
          { key: 'gtemplate', label: { ru: 'Библиотека шаблонов', en: 'Template library' } },
          { key: 'gdev', label: { ru: 'Отдаёт код разработчику', en: 'Hands code to the developer' } },
        ],
      },
      {
        title: { ru: 'Презентации', en: 'Decks' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'kbrand', label: { ru: 'Свой фирменный стиль', en: 'Your own brand kit' } },
          { key: 'kpptx', label: { ru: 'Выгрузка в PowerPoint', en: 'PowerPoint export' } },
          { key: 'kweb', label: { ru: 'Презентация как страница', en: 'Deck as a web page' } },
          { key: 'kanalytics', label: { ru: 'Видно, кто и сколько смотрел', en: 'Viewer analytics' } },
        ],
      },
    ],
  },
  {
    slug: 'platform',
    name: { ru: 'Платформы и API', en: 'Platforms and APIs' },
    icon: 'zap',
    order: 90,
    intro: {
      ru: 'Это слой под всем остальным: модели, на которых работают сервисы из других задач. Здесь платят за объём, поэтому «цена в месяц» ничего не говорит, и фильтр спрашивает про открытые веса и про собственные GPU.',
      en: 'This is the layer under everything else: the models the tools in other jobs run on. Billing is by usage, so a monthly figure says nothing, and the filter asks about open weights and about renting GPUs instead.',
    },
    sortedBy: { ru: 'По минимальному платному тарифу, от дешёвых к дорогим', en: 'By cheapest paid plan, low to high' },
    facetGroups: [
      {
        title: { ru: 'Платформа', en: 'Platform' },
        scope: 'task',
        openByDefault: true,
        items: [
          { key: 'pmodels', label: { ru: 'Много моделей одним ключом', en: 'Many models, one key' } },
          { key: 'popen', label: { ru: 'Открытые веса', en: 'Open weights' } },
          { key: 'pgpu', label: { ru: 'Аренда GPU по часам', en: 'GPU rental by the hour' } },
          { key: 'phost', label: { ru: 'Размещение своей модели', en: 'Host your own model' } },
        ],
      },
    ],
  },
];
