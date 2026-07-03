import puppeteer from 'puppeteer';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const SITE = 'https://cryptopulse.media';
const SCRATCHPAD = '/private/tmp/claude-501/-Users-maksymrybalko-Desktop-AI/f482ddd0-ec45-4e3b-9ede-d733ce3cc6e8/scratchpad';

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();

// --- Десктоп: лента новостей ---
await page.setViewport({ width: 1280, height: 900 });
await page.goto(`${SITE}/ru/news`, { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(1500);
await page.screenshot({ path: `${SCRATCHPAD}/news_desktop_ru.png`, fullPage: true });

// --- Мобильная: лента новостей ---
await page.setViewport({ width: 390, height: 844 });
await page.goto(`${SITE}/ru/news`, { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(1500);
await page.screenshot({ path: `${SCRATCHPAD}/news_mobile_ru.png`, fullPage: false });

// --- Анализ структуры ленты ---
await page.setViewport({ width: 1280, height: 900 });
await page.goto(`${SITE}/ru/news`, { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(1000);

const newsStructure = await page.evaluate(() => {
  // Считаем карточки и list items
  const cards = document.querySelectorAll('a[href*="/ru/news/"]');
  const externalLinks = document.querySelectorAll('a[target="_blank"]');
  
  // Ищем наши материалы (с иконкой молнии / "Наш материал")
  const ourBadges = document.querySelectorAll('.bg-red-600');
  const pinBadges = document.querySelectorAll('.bg-yellow-500');
  
  // Структура страницы
  const sections = Array.from(document.querySelectorAll('h2, h3')).map(h => ({
    tag: h.tagName, text: h.textContent.trim().slice(0, 60)
  }));
  
  // Все ссылки на новости
  const allNewsLinks = Array.from(cards).map(a => ({
    href: a.href,
    text: a.querySelector('h3')?.textContent.trim().slice(0, 60),
    isExternal: a.target === '_blank',
    hasBadge: !!a.querySelector('.bg-red-600, .bg-yellow-500'),
  }));

  return {
    totalNewsLinks: cards.length,
    externalLinks: externalLinks.length,
    ourBadges: ourBadges.length,
    pinBadges: pinBadges.length,
    sections,
    links: allNewsLinks.slice(0, 20),
  };
});
console.log('=== Структура страницы /ru/news ===');
console.log(JSON.stringify(newsStructure, null, 2));

// --- Главная: как наши новости отображаются ---
await page.goto(`${SITE}/ru`, { waitUntil: 'networkidle2', timeout: 30000 });
await sleep(1000);
const homeNews = await page.evaluate(() => {
  const section = document.querySelector('[data-section="news"], section');
  const newsLinks = Array.from(document.querySelectorAll('a[href*="/ru/news/"]'));
  return {
    count: newsLinks.length,
    items: newsLinks.map(a => ({
      href: a.href.replace('https://cryptopulse.media', ''),
      title: a.querySelector('h3, p')?.textContent.trim().slice(0, 60),
    })).slice(0, 8),
  };
});
console.log('\n=== Наши новости на главной ===');
console.log(JSON.stringify(homeNews, null, 2));

await browser.close();
