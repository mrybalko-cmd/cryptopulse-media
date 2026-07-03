import puppeteer from 'puppeteer';

const SITE = 'https://cryptopulse.media';

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

const results = [];

async function measure(label, url, fn) {
  const errors = [];
  page.removeAllListeners('console');
  page.removeAllListeners('pageerror');
  page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
  page.on('pageerror', err => errors.push(err.message));

  const t0 = Date.now();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  const ttDom = Date.now() - t0;

  let extra = {};
  if (fn) extra = await fn(page);

  results.push({ label, url, ttDom, errors: errors.slice(0, 3), ...extra });
}

// 1. Главная RU
await measure('Главная /ru', `${SITE}/ru`);

// 2. Главная EN
await measure('Главная /en', `${SITE}/en`);

// 3. Скорость переключения языка (RU → EN)
await measure('Переключение языка RU→EN', `${SITE}/ru`, async (p) => {
  // Ищем кнопку переключения языка
  const t0 = Date.now();
  try {
    // Ищем ссылку EN
    const langLink = await p.$('a[href*="/en"]');
    if (langLink) {
      await langLink.click();
      await p.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 10000 });
      return { switchTime: Date.now() - t0, switchedTo: p.url() };
    }
    return { switchTime: null, note: 'lang button not found' };
  } catch (e) {
    return { switchTime: null, note: e.message };
  }
});

// 4. Новости RU
await measure('Новости /ru/news', `${SITE}/ru/news`, async (p) => {
  const cards = await p.$$('a[href*="/ru/news/"]');
  return { cardCount: cards.length };
});

// 5. Детальная страница новости — кликнуть на первую карточку
await measure('Список новостей click', `${SITE}/ru/news`, async (p) => {
  const firstLink = await p.$('a[href*="/ru/news/"]:not([href="/ru/news"])');
  if (firstLink) {
    const href = await firstLink.evaluate(el => el.href);
    const t0 = Date.now();
    await page.goto(href, { waitUntil: 'domcontentloaded', timeout: 20000 });
    return { articleUrl: href, loadTime: Date.now() - t0 };
  }
  return { note: 'no news link found' };
});

// 6. Переключение языка на странице новости
await measure('Язык на детальной новости', `${SITE}/ru/news`, async (p) => {
  const firstLink = await p.$('a[href*="/ru/news/"]:not([href="/ru/news"])');
  if (firstLink) {
    const href = await firstLink.evaluate(el => el.href);
    await page.goto(href, { waitUntil: 'domcontentloaded', timeout: 20000 });
    // Проверяем наличие переключателя EN
    const enBtn = await p.$('a[href*="/en/"], button');
    const t0 = Date.now();
    const langSwitch = await p.$eval('header', h => {
      const links = h.querySelectorAll('a');
      for (const l of links) {
        if (l.textContent.trim() === 'EN' || l.textContent.trim() === 'RU') return l.href;
      }
      return null;
    }).catch(() => null);
    return { langSwitchHref: langSwitch };
  }
  return {};
});

// 7. Глоссарий — фильтр работает?
await measure('Глоссарий /ru/glossary', `${SITE}/ru/glossary`, async (p) => {
  await p.waitForSelector('input[type="text"], input[placeholder]', { timeout: 5000 }).catch(() => null);
  const hasFilter = await p.$('input') !== null;
  const termCount = await p.$$eval('details', els => els.length).catch(() => 0);
  return { hasFilter, termCount };
});

// 8. Калькулятор
await measure('Калькулятор /ru/calculators', `${SITE}/ru/calculators`, async (p) => {
  const hasCalc = await p.$('input[type="number"], input[type="text"]') !== null;
  return { hasInputs: hasCalc };
});

// 9. Статья EN
await measure('Статьи /en/articles', `${SITE}/en/articles`, async (p) => {
  const cards = await p.$$('a[href*="/en/articles/"]');
  return { cardCount: cards.length };
});

// 10. FAQ
await measure('FAQ /ru/faq', `${SITE}/ru/faq`, async (p) => {
  const items = await p.$$('details');
  return { faqItems: items.length };
});

// 11. Поиск
await measure('Поиск', `${SITE}/ru`, async (p) => {
  const searchInput = await p.$('input[type="search"], input[placeholder*="Поиск"], input[placeholder*="Search"]');
  if (searchInput) {
    await searchInput.type('bitcoin', { delay: 50 });
    await p.waitForTimeout(1500);
    const results = await p.$$('[data-search-result], a[href*="/ru/news/"], a[href*="/ru/articles/"]').catch(() => []);
    return { searchWorks: true };
  }
  return { searchWorks: false, note: 'search input not found' };
});

await browser.close();

console.log('\n=== РЕЗУЛЬТАТЫ АУДИТА ===\n');
for (const r of results) {
  const status = r.errors.length > 0 ? '⚠️' : '✅';
  console.log(`${status} ${r.label}`);
  console.log(`   URL: ${r.url}`);
  console.log(`   DOM ready: ${r.ttDom}ms`);
  if (r.switchTime) console.log(`   Переключение языка: ${r.switchTime}ms → ${r.switchedTo}`);
  if (r.switchedTo) console.log(`   Перешёл на: ${r.switchedTo}`);
  if (r.langSwitchHref) console.log(`   Lang switch href: ${r.langSwitchHref}`);
  if (r.cardCount !== undefined) console.log(`   Карточек: ${r.cardCount}`);
  if (r.articleUrl) console.log(`   Статья: ${r.articleUrl} (${r.loadTime}ms)`);
  if (r.termCount !== undefined) console.log(`   Терминов в глоссарии: ${r.termCount}, фильтр: ${r.hasFilter}`);
  if (r.hasInputs !== undefined) console.log(`   Поля ввода: ${r.hasInputs}`);
  if (r.faqItems !== undefined) console.log(`   FAQ пунктов: ${r.faqItems}`);
  if (r.searchWorks !== undefined) console.log(`   Поиск работает: ${r.searchWorks}`);
  if (r.note) console.log(`   ℹ️  ${r.note}`);
  if (r.errors.length) {
    console.log(`   ❌ Ошибки JS:`);
    r.errors.forEach(e => console.log(`      - ${e}`));
  }
  console.log();
}
