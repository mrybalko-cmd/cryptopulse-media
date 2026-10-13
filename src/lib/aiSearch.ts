/**
 * Поиск по каталогу AI-сервисов — чистые функции, без обращений к базе и к DOM.
 *
 * Весь каталог уже лежит в странице, поэтому искать на сервере незачем: запрос
 * туда и обратно занял бы больше, чем перебор полусотни карточек в браузере.
 * Отдельный файл — чтобы прогнать поиск скриптом и увидеть, что «элевен лабс»
 * и «eleven labs» приводят к одной карточке, не поднимая проект.
 *
 * Три решения, которые стоит объяснить.
 *
 * 1. Сравниваем по кускам слова, а не по целым словам. Человек печатает
 *    «клонировани» и останавливается, не дописав окончание, — и это нормальный
 *    запрос, а не опечатка.
 *
 * 2. Кириллица переводится в латиницу, и обе стороны сравнения проходят через
 *    один и тот же перевод. «Элевен лабс» ищется среди ElevenLabs, потому что
 *    оба превращаются в «elevenlabs», а не потому, что где-то лежит список
 *    синонимов, который придётся пополнять руками.
 *
 * 3. Опечатка прощается одна и только в словах от пяти букв. На коротких
 *    словах расстояние в одну букву превращает «код» в «кот», и выдача
 *    наполняется случайным.
 */

export interface SearchableService {
  name: string;
  slug: string;
  /** Всё, что написано в карточке: подзаголовок, «чем выделяется», фишки, плюсы. */
  text: string[];
  /** Название задачи и подписи признаков — по ним тоже ищут. */
  tags: string[];
}

/* ── Приведение к одному виду ─────────────────────────────────────── */

const RU_TO_LAT: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z',
  и: 'i', й: 'i', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r',
  с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch',
  ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  // Украинские буквы: ими пишут те же запросы.
  і: 'i', ї: 'i', є: 'e', ґ: 'g',
};

/** Нижний регистр, без знаков препинания, одиночные пробелы. */
export function normalise(input: string): string {
  return input
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

/** Та же строка, но целиком латиницей — для сравнения через алфавиты. */
export function translit(input: string): string {
  let out = '';
  for (const ch of input) out += RU_TO_LAT[ch] ?? ch;
  return out;
}

/**
 * Расстояние Левенштейна с потолком: считать точную величину незачем, нужно
 * только знать, уложились в допуск или нет.
 */
function within(a: string, b: string, max: number): boolean {
  if (Math.abs(a.length - b.length) > max) return false;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let best = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return false;
    prev = cur;
  }
  return prev[b.length] <= max;
}

/* ── Поиск ────────────────────────────────────────────────────────── */

/** Готовая к сравнению строка карточки: сама и её латинская копия. */
export interface Haystack {
  plain: string;
  latin: string;
  words: string[];
}

export function haystackOf(s: SearchableService): Haystack {
  const plain = normalise([s.name, s.slug, ...s.text, ...s.tags].join(' '));
  return { plain, latin: translit(plain), words: plain.split(' ').filter(Boolean) };
}

/** Одно слово запроса найдено в карточке. */
function hasToken(h: Haystack, token: string): boolean {
  if (h.plain.includes(token)) return true;
  const lat = translit(token);
  if (lat !== token && h.latin.includes(lat)) return true;
  // Опечатка прощается одна и только в словах подлиннее.
  if (token.length < 5) return false;
  return h.words.some(w => Math.abs(w.length - token.length) <= 1 && within(w, token, 1));
}

/**
 * Совпала ли карточка с запросом.
 *
 * Слова запроса соединяются через «и»: «бесплатный видео» означает «и то, и
 * другое», а не «что-нибудь из двух». Иначе второе слово только добавляло бы
 * лишнее к найденному первым, и уточнить запрос было бы нечем.
 */
export function matches(h: Haystack, query: string): boolean {
  const tokens = normalise(query).split(' ').filter(Boolean);
  if (!tokens.length) return true;
  return tokens.every(t => hasToken(h, t));
}

/**
 * Насколько карточка подходит запросу: чем меньше число, тем выше в списке.
 *
 * Точное совпадение с названием важнее совпадения где-то в тексте — иначе
 * запрос «canva» отдаёт первой карточку, где Canva лишь упомянута.
 */
export function rank(s: SearchableService, h: Haystack, query: string): number {
  const q = normalise(query);
  if (!q) return 0;
  const name = normalise(s.name);
  if (name === q) return 0;
  if (name.startsWith(q)) return 1;
  if (name.includes(q)) return 2;
  if (translit(name).includes(translit(q))) return 3;
  if (h.plain.includes(q)) return 4;
  return 5;
}
