/** Разовая сверка: что лежит в базе после наполнения. */
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
const env = Object.fromEntries(readFileSync('.env.local','utf8').split('\n')
  .filter(l=>l.includes('=')&&!l.trim().startsWith('#'))
  .map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(), l.slice(i+1).trim().replace(/^["']|["']$/g,'')];}));
const c = createClient({projectId:env.SANITY_PROJECT_ID||env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset:env.SANITY_DATASET||env.NEXT_PUBLIC_SANITY_DATASET||'production',apiVersion:'2024-01-01',useCdn:false});
const r = await c.fetch(`{
  "jobs": count(*[_type=="aiJob"]),
  "services": count(*[_type=="aiService"]),
  "checked": count(*[_type=="aiService" && defined(priceCheckedAt)]),
  "noDate": *[_type=="aiService" && !defined(priceCheckedAt)].name,
  "orphan": *[_type=="aiService" && !defined(job->slug.current)].name,
  "noHighlight": *[_type=="aiService" && (!defined(highlight.ru) || !defined(highlight.en))].name,
  "noLogo": count(*[_type=="aiService" && !defined(logo)]),
  "byJob": *[_type=="aiJob"]|order(order asc){"j":name.ru,"n":count(*[_type=="aiService" && job._ref==^._id])}
}`);
console.log('задач:', r.jobs, '· карточек:', r.services, '· с датой сверки:', r.checked);
console.log('без даты:', r.noDate.join(', '));
console.log('без задачи:', r.orphan.length ? r.orphan.join(', ') : 'нет');
console.log('без «чем выделяется»:', r.noHighlight.length ? r.noHighlight.join(', ') : 'нет');
console.log('без логотипа (ждут загрузки):', r.noLogo);
console.log(r.byJob.map(x=>`${x.j}: ${x.n}`).join(' · '));
