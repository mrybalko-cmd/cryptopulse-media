/**
 * Проверка поиска по каталогу.
 *
 * Запуск: node --experimental-strip-types scripts/check-ai-search.ts
 *
 * Держится отдельно от одноразовых скриптов (те с подчёркиванием в имени):
 * поиск — то, чем люди пользуются вместо фильтра, и его поведение должно
 * быть видно без поднятия проекта.
 */
import { haystackOf, matches, rank, normalise, translit, type SearchableService } from '../src/lib/aiSearch.ts';

const CAT: SearchableService[] = [
  {
    name: 'ElevenLabs', slug: 'elevenlabs',
    text: ['Клонирование голоса и озвучка на 30 языках', 'Естественный синтез речи'],
    tags: ['Голос и музыка', 'Есть бесплатный тариф', 'Есть API'],
  },
  {
    name: 'Canva', slug: 'canva',
    text: ['Дизайн для тех, кто не дизайнер', 'Генерация элементов дизайна'],
    tags: ['Дизайн и макеты', 'Есть мобильное приложение'],
  },
  {
    name: 'Runway', slug: 'runway',
    text: ['Работает как виртуальная киностудия', 'Оживление статичных картинок'],
    tags: ['Генерация видео', 'Есть API'],
  },
  {
    name: 'Moises', slug: 'moises',
    text: ['Разбирает готовый трек на отдельные дорожки', 'Изоляция вокала'],
    tags: ['Голос и музыка'],
  },
];

const H = new Map(CAT.map(s => [s.name, haystackOf(s)]));
const find = (q: string) =>
  CAT.filter(s => matches(H.get(s.name)!, q))
    .sort((a, b) => rank(a, H.get(a.name)!, q) - rank(b, H.get(b.name)!, q))
    .map(s => s.name);

let bad = 0;
const ok = (name: string, got: unknown, want: unknown) => {
  const good = JSON.stringify(got) === JSON.stringify(want);
  if (!good) bad++;
  console.log(`${good ? '✓' : '✗'} ${name}: ${JSON.stringify(got)}${good ? '' : ` (ждали ${JSON.stringify(want)})`}`);
};

ok('пустой запрос — весь каталог', find('').length, 4);
ok('по названию', find('canva'), ['Canva']);
ok('регистр не важен', find('CANVA'), ['Canva']);
ok('по тексту карточки', find('клонирование'), ['ElevenLabs']);
ok('по куску слова', find('клонировани'), ['ElevenLabs']);
ok('по названию задачи', find('голос и музыка'), ['ElevenLabs', 'Moises']);
ok('по признаку', find('есть api'), ['ElevenLabs', 'Runway']);
ok('два слова — и то, и другое', find('голос вокал'), ['Moises']);
ok('кириллицей про латиницу', find('элевен'), ['ElevenLabs']);
ok('с пробелом внутри названия', find('элевен лабс'), ['ElevenLabs']);
ok('опечатка в длинном слове', find('киностудья'), ['Runway']);
ok('опечатка в коротком не прощается', find('кот'), []);
ok('ничего не нашлось', find('квантовый компьютер'), []);
ok('точное название выше упоминания', find('runway'), ['Runway']);

ok('нормализация', normalise('  Ёлка, ёлка!  '), 'елка елка');
ok('транслитерация', translit('элевен лабс'), 'eleven labs');

console.log(bad ? `\nпровалено: ${bad}` : '\nвсё сошлось');
process.exit(bad ? 1 : 0);
