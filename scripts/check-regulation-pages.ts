/**
 * Checks every published country page against the mistakes we have actually
 * made before: a related slug that resolves to nothing (the card silently
 * disappears), Latin letters loose in Russian prose, a link that will render as
 * literal brackets, and a page too thin to deserve a URL.
 */
import { readFileSync } from 'node:fs';
import { createClient } from '@sanity/client';
import { parseFigures, parseFaq, parseSources, parseTimeline, parseList, parseBody } from '../src/lib/regulationPage';

const env = Object.fromEntries(readFileSync('.env.local','utf8').split('\n')
  .filter(l=>l.includes('=')&&!l.trim().startsWith('#'))
  .map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,'')]}));
const c = createClient({projectId:env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset:'production', apiVersion:'2024-01-01', token:env.SANITY_API_WRITE_TOKEN, useCdn:false});

const FIELDS = ['intro','figures','body','allowed','restricted','timeline','faq','sources','related','seoTitle','seoDescription'] as const;

async function main() {
  const rows: any[] = await c.fetch(`*[_type=="regulationCountry" && hasPage==true]|order(name.ru asc){iso2,"slug":slug.current,"nameRu":name.ru,page}`);
  let problems = 0;
  const say = (s: string) => { console.log('    ⚠ ' + s); problems++; };

  for (const r of rows) {
    console.log(`\n${r.nameRu} (/${r.slug})`);
    for (const lang of ['ru','en'] as const) {
      const g = (f: typeof FIELDS[number]) => (r.page?.[f]?.[lang] ?? '') as string;
      const words = FIELDS.filter(f=>!f.startsWith('seo')).map(g).join(' ').split(/\s+/).filter(Boolean).length;

      const figures = parseFigures(g('figures'));
      const faq = parseFaq(g('faq'));
      const sources = parseSources(g('sources'));
      const timeline = parseTimeline(g('timeline'));
      console.log(`  ${lang}: ${words} слов · цифр ${figures.length} · вопросов ${faq.length} · вех ${timeline.length} · источников ${sources.length}`);

      if (words < 600) say(`${lang}: мало текста (${words})`);
      if (figures.length < 4) say(`${lang}: цифр меньше четырёх`);
      if (faq.length < 4) say(`${lang}: вопросов меньше четырёх`);
      if (!sources.length) say(`${lang}: нет источников`);
      if (!timeline.some(e=>e.highlight)) say(`${lang}: в хронологии не выделено главное событие`);

      // a link that never became a link — the bug that once shipped live
      const body = g('body');
      const bad = body.match(/\[[^\]\n]+\]\((?!https?:\/\/)[^)]*\)/g);
      if (bad) say(`${lang}: ссылка не станет ссылкой — ${bad[0]}`);

      // Latin words adrift in Russian prose, ignoring the names we mean to keep
      if (lang === 'ru') {
        // The url half of a markdown link is Latin by definition, and a lone
        // capital is a tax category ("категория E"), not a stray English word.
        // Both tripped the first version of this check, which is how a warning
        // stops being read at all.
        const prose = [g('intro'), g('body'), g('faq')]
          .join(' ')
          .replace(/\]\((https?:\/\/[^)]+)\)/g, ']')
          .replace(/\bhttps?:\/\/\S+/g, '');
        // A hand-kept allow-list of names does not scale past a few countries —
        // it grew to twenty entries and still cried wolf on SEC, Mt.Gox and
        // 1099-DA. What actually signals English leaking into Russian prose is
        // a *lowercase* Latin word. Acronyms, brand names and anything with an
        // internal capital are how we legitimately write regulators and laws.
        const latin = [...new Set((prose.match(/[A-Za-z][A-Za-z.\-]*/g) ?? []))]
          .filter(w => /^[a-z]+$/.test(w.replace(/[.\-]/g, '')));
        if (latin.length) say(`ru: латиница в тексте — ${latin.slice(0,6).join(', ')}`);
      }

      // a related slug that resolves to nothing renders as nothing at all
      const slugs = parseList(g('related'));
      if (slugs.length) {
        const found: string[] = await c.fetch(
          `*[(_type=="news"||_type=="article") && language==$lang && slug.current in $slugs].slug.current`,
          { slugs, lang }
        );
        const missing = slugs.filter(s=>!found.includes(s));
        if (missing.length) say(`${lang}: материал не найден — ${missing.join(', ')}`);
      } else {
        say(`${lang}: нет ссылок на наши материалы`);
      }

      // headings actually parsed out, not left as literal ## in a paragraph
      const blocks = parseBody(body);
      const stray = blocks.filter(b=>b.kind==='p' && b.runs.some(r=>r.text.includes('## ')));
      if (stray.length) say(`${lang}: решётки заголовка попали в абзац`);
      if (!blocks.some(b=>b.kind==='h2')) say(`${lang}: в тексте нет ни одного заголовка`);
    }
  }
  console.log(problems ? `\nнайдено замечаний: ${problems}` : '\nзамечаний нет');
}
main().catch(e=>{console.error(e); process.exit(1);});
