import puppeteer from 'puppeteer';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SITE = 'https://cryptopulse.media';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

// --- Находим invalid HTML nesting ---
await page.goto(`${SITE}/en`, { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(1000);

const invalidNesting = await page.evaluate(() => {
  const issues = [];
  
  // p inside p
  document.querySelectorAll('p p').forEach(el => {
    issues.push({ type: 'p>p', outer: el.closest('p').outerHTML.slice(0, 150) });
  });
  
  // a inside a
  document.querySelectorAll('a a').forEach(el => {
    issues.push({ type: 'a>a', outer: el.closest('a')?.outerHTML.slice(0, 150) });
  });
  
  // div/block inside p
  document.querySelectorAll('p div, p article, p section, p ul, p ol, p h1, p h2, p h3, p figure').forEach(el => {
    const p = el.closest('p');
    issues.push({ type: `p>${el.tagName}`, html: p?.outerHTML.slice(0, 200) });
  });
  
  // button inside button
  document.querySelectorAll('button button').forEach(el => {
    issues.push({ type: 'button>button', html: el.outerHTML.slice(0, 100) });
  });

  return issues;
});
console.log('=== Invalid HTML nesting на /en ===');
console.log(JSON.stringify(invalidNesting, null, 2));

// --- Проверяем /ru/news главную ---
await page.goto(`${SITE}/ru/news`, { waitUntil: 'networkidle2', timeout: 20000 });
const newsNesting = await page.evaluate(() => {
  const issues = [];
  document.querySelectorAll('a a').forEach(el => {
    issues.push({ type: 'a>a', html: el.closest('a')?.outerHTML.slice(0, 200) });
  });
  document.querySelectorAll('p div, p p').forEach(el => {
    issues.push({ type: `p>${el.tagName}`, html: el.closest('p')?.outerHTML.slice(0, 200) });
  });
  return issues;
});
console.log('\n=== Invalid nesting на /ru/news ===');
console.log(JSON.stringify(newsNesting, null, 2));

// --- Поиск: кликаем на кнопку и ищем input ---
await page.goto(`${SITE}/ru`, { waitUntil: 'domcontentloaded', timeout: 20000 });
await sleep(500);

const searchBtnClicked = await page.evaluate(() => {
  const btns = Array.from(document.querySelectorAll('button'));
  const searchBtn = btns.find(b => b.textContent.trim().includes('Поиск'));
  if (searchBtn) { searchBtn.click(); return true; }
  return false;
});
console.log('\n=== Поиск: кнопка нажата:', searchBtnClicked);
await sleep(800);
const afterClick = await page.evaluate(() => {
  const inputs = Array.from(document.querySelectorAll('input'));
  return inputs.map(i => ({ type: i.type, placeholder: i.placeholder, visible: i.offsetParent !== null }));
});
console.log('Input после клика:', JSON.stringify(afterClick, null, 2));

// Если появился input, вводим и смотрим результаты
if (afterClick.some(i => i.visible)) {
  const input = await page.$('input:not([type="hidden"])');
  if (input) {
    await input.type('bitcoin', { delay: 80 });
    await sleep(2000);
    const searchResults = await page.evaluate(() => {
      const resultItems = document.querySelectorAll('[role="option"], [data-result], li a, .search-result');
      const anyResults = document.querySelectorAll('a[href*="/news/"], a[href*="/articles/"]');
      return { itemCount: resultItems.length, anyLinks: anyResults.length };
    });
    console.log('Результаты поиска:', JSON.stringify(searchResults));
  }
}

// --- Скриншот главной (desktop) ---
await page.goto(`${SITE}/ru`, { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(1000);
await page.screenshot({ path: '/private/tmp/claude-501/-Users-maksymrybalko-Desktop-AI/f482ddd0-ec45-4e3b-9ede-d733ce3cc6e8/scratchpad/desktop_home.png', fullPage: false });
console.log('\nСкриншот главной сохранён');

// --- Скриншот мобильная ---
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${SITE}/ru`, { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(1000);
await page.screenshot({ path: '/private/tmp/claude-501/-Users-maksymrybalko-Desktop-AI/f482ddd0-ec45-4e3b-9ede-d733ce3cc6e8/scratchpad/mobile_home.png', fullPage: false });
console.log('Скриншот мобильной главной сохранён');

// --- Скриншот новость RU ---
await page.setViewport({ width: 1280, height: 800 });
await page.goto(`${SITE}/ru/news/cio-bitwise-strategy-btc`, { waitUntil: 'networkidle2', timeout: 25000 });
await sleep(1500);
await page.screenshot({ path: '/private/tmp/claude-501/-Users-maksymrybalko-Desktop-AI/f482ddd0-ec45-4e3b-9ede-d733ce3cc6e8/scratchpad/desktop_news.png', fullPage: false });
console.log('Скриншот новости сохранён');

await browser.close();
