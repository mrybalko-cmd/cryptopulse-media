import puppeteer from 'puppeteer';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SITE = 'https://cryptopulse.media';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 800 });

// --- 1. Собираем JS ошибки на /en с полным ожиданием ---
const errors418 = [];
page.on('console', msg => { if (msg.type() === 'error') errors418.push(msg.text()); });
page.on('pageerror', err => errors418.push(err.message));

await page.goto(`${SITE}/en`, { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(2000);

console.log('=== JS ошибки на /en ===');
errors418.forEach(e => console.log(e.slice(0, 400)));

// --- 2. Time-зависимые элементы (hydration mismatch кандидаты) ---
const hydration = await page.evaluate(() => {
  const results = [];
  document.querySelectorAll('span, p, time, div').forEach(el => {
    const txt = el.textContent.trim();
    if ((txt.match(/ago$|назад$|minutes|hours|days/) || txt.match(/^\d{2}:\d{2}/)) && el.children.length === 0) {
      results.push({ tag: el.tagName, text: txt.slice(0, 60), suppressHydration: el.hasAttribute('data-suppress') });
    }
  });
  return results.slice(0, 8);
});
console.log('\n=== Time-элементы (кандидаты на hydration mismatch) ===');
console.log(JSON.stringify(hydration, null, 2));

// --- 3. Переключатель языка на детальной новости ---
errors418.length = 0;
await page.goto(`${SITE}/ru/news`, { waitUntil: 'domcontentloaded', timeout: 20000 });
const firstLink = await page.$('a[href*="/ru/news/"]:not([href="/ru/news"])');
const newsUrl = firstLink ? await firstLink.evaluate(el => el.href) : null;
console.log('\n=== Переключение языка на новости ===');
console.log('Статья:', newsUrl);

if (newsUrl) {
  await page.goto(newsUrl, { waitUntil: 'networkidle2', timeout: 25000 });
  await sleep(3500); // даём время API /translation-link

  const langSwitch = await page.evaluate(() => {
    const header = document.querySelector('header');
    const links = Array.from(header?.querySelectorAll('a') || []);
    const lang = links.find(l => /^EN$|^RU$/.test(l.textContent.trim()));
    return lang ? { text: lang.textContent.trim(), href: lang.href } : null;
  });
  console.log('Lang switch в header:', JSON.stringify(langSwitch));
  
  // Ищем также кнопку/ссылку переключения языка где угодно на странице
  const allLangLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a')).filter(a => {
      const text = a.textContent.trim();
      return text === 'EN' || text === 'RU';
    }).map(a => ({ text: a.textContent.trim(), href: a.href, inHeader: !!a.closest('header') }));
  });
  console.log('Все lang ссылки:', JSON.stringify(allLangLinks));
}

// --- 4. Поиск ---
console.log('\n=== Поиск ===');
await page.goto(`${SITE}/ru`, { waitUntil: 'domcontentloaded', timeout: 20000 });
await sleep(1000);

const allInputs = await page.evaluate(() =>
  Array.from(document.querySelectorAll('input')).map(i => ({
    type: i.type, placeholder: i.placeholder, id: i.id, class: i.className.slice(0, 60)
  }))
);
console.log('Inputs:', JSON.stringify(allInputs, null, 2));

const allButtons = await page.evaluate(() =>
  Array.from(document.querySelectorAll('button')).map(b => ({
    text: b.textContent.trim().slice(0, 30),
    ariaLabel: b.getAttribute('aria-label'),
  })).filter(b => b.text || b.ariaLabel).slice(0, 15)
);
console.log('Buttons:', JSON.stringify(allButtons, null, 2));

// --- 5. Скорость API запросов ---
console.log('\n=== Мониторинг API запросов ===');
const apiTimes = [];
const reqStartTimes = new Map();
page.on('request', req => { if (req.url().includes('/api/')) reqStartTimes.set(req.url(), Date.now()); });
page.on('response', resp => {
  const url = resp.url();
  if (url.includes('/api/') && reqStartTimes.has(url)) {
    apiTimes.push({ url: url.replace(SITE, ''), status: resp.status(), ms: Date.now() - reqStartTimes.get(url) });
  }
});
await page.goto(newsUrl || `${SITE}/ru/news`, { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(4000);
apiTimes.forEach(r => console.log(`  ${r.status} ${r.url} — ${r.ms}ms`));

await browser.close();
