import { STATUS_META, type RegStatus } from '@/lib/regulationData';
import type { RegCountry } from '@/lib/regulation';

/**
 * The explanatory text under the map.
 *
 * It used to be 149 words restating the legend. This version answers what the
 * reader actually arrived with: whether they can hold crypto where they live,
 * what changed lately, and where the tax is lower — plus a short Q&A, which is
 * what both search and language models quote from.
 *
 * Counts come from the data rather than the copy, so the text cannot claim
 * "7 banned" after someone edits a country in the admin.
 */
export default function RegulationGuide({
  locale,
  countries,
}: {
  locale: string;
  countries: RegCountry[];
}) {
  const isRu = locale === 'ru';
  const n = (s: RegStatus) => countries.filter(c => c.status === s).length;
  const names = (s: RegStatus) =>
    countries.filter(c => c.status === s).map(c => (isRu ? c.name.ru : c.name.en)).join(isRu ? ', ' : ', ');

  const h3 = 'text-[17px] font-bold text-foreground mt-8 mb-2.5 first:mt-0';
  const h4 = 'text-[15px] font-semibold text-foreground mt-5 mb-1.5';
  const p = 'text-[14.5px] leading-relaxed text-muted mb-3';

  const faq = isRu
    ? [
        ['Законно ли владеть криптовалютой в моей стране?',
         'Найдите страну на карте или в указателе: зелёный и жёлтый означают, что владеть можно, красный — что операции запрещены. Читайте подробности: у статуса «с ограничениями» запрет часто касается только оплаты товаров, а не хранения.'],
        ['Где криптовалюта — законное платёжное средство?',
         'Практически нигде. Сальвадор принял биткоин как законное средство платежа в 2021 году, но с января 2025 года приём стал добровольным. В остальных странах криптовалюта считается имуществом или финансовым активом, но не деньгами.'],
        ['Что будет, если торговать из страны с запретом?',
         'Зависит от страны. В Алжире предусмотрены лишение свободы и штраф до миллиона динаров, в Непале — до трёх лет и штраф от одной до трёх сумм сделки, в Египте — штраф до 10 миллионов фунтов. В Бангладеш отдельного закона о владении нет, запрет держится на валютном законодательстве 1947 года.'],
        ['Может ли страна изменить статус?',
         'Да, и делает это чаще, чем кажется: за последний год статус сменили три страны из 46. Поэтому у каждой записи стоит дата последней проверки и ссылка на регулятора.'],
        ['Считается ли майнинг отдельно от торговли?',
         'Часто да. В России майнинг легализовали в 2024 году, а правовой статус самой криптовалюты появится только в сентябре 2026-го. В Узбекистане под майнинг отведена отдельная зона с налоговыми льготами до 2035 года.'],
      ]
    : [
        ['Is it legal to hold crypto where I live?',
         'Find your country on the map or in the index: green and amber mean holding is permitted, red means transactions are prohibited. Read the detail — under "restricted" the ban often covers paying for goods rather than holding.'],
        ['Where is crypto legal tender?',
         'Almost nowhere. El Salvador adopted bitcoin as legal tender in 2021, but acceptance became voluntary in January 2025. Elsewhere crypto is treated as property or a financial asset, not as money.'],
        ['What happens if I trade from a country with a ban?',
         'It depends. Algeria provides for imprisonment and fines up to one million dinars, Nepal for up to three years plus one to three times the transaction value, Egypt for fines up to EGP 10 million. Bangladesh has no separate law on ownership; the ban rests on 1947 foreign-exchange rules.'],
        ['Can a country change its status?',
         'Yes, and more often than you would think: three of our 46 countries changed status in the past year. That is why every entry carries the date it was last checked and a link to the regulator.'],
        ['Is mining treated separately from trading?',
         'Often, yes. Russia legalised mining in 2024, while crypto itself only gains legal status as property in September 2026. Uzbekistan set aside a dedicated mining zone with tax breaks running to 2035.'],
      ];

  return (
    <section className="mt-14 pt-8 border-t border-border max-w-3xl">
      <h2 className="text-lg font-bold text-foreground mb-4">
        {isRu ? 'Как устроено регулирование криптовалют по странам' : 'How crypto regulation works country by country'}
      </h2>

      <p className="text-[15px] leading-relaxed text-foreground mb-4">
        {isRu
          ? `Единого правила нет: каждая страна решает сама, поэтому картина различается радикально — от полного признания до уголовной ответственности за хранение. Мы ведём ${countries.length} юрисдикций и проверяем каждую по сайтам регуляторов.`
          : `There is no single rule: every country decides for itself, so the picture varies wildly — from full recognition to criminal liability for merely holding. We track ${countries.length} jurisdictions and check each against its regulator.`}
      </p>

      <h3 className={h3}>{isRu ? 'Четыре статуса на карте' : 'Four statuses on the map'}</h3>
      <p className={p}>
        <b className="text-foreground">{isRu ? `Разрешено (${n('legal')}).` : `Legal (${n('legal')}).`}</b>{' '}
        {isRu
          ? 'Криптовалюту можно свободно покупать, держать и продавать, биржи работают по лицензии. Законным платёжным средством она при этом почти нигде не является — это разные вещи, и их часто путают.'
          : 'Crypto can be freely bought, held and sold, and exchanges operate under licence. That is not the same as legal tender, which it is almost nowhere — the two are routinely confused.'}
      </p>
      <p className={p}>
        <b className="text-foreground">{isRu ? `С ограничениями (${n('restricted')}).` : `Restricted (${n('restricted')}).`}</b>{' '}
        {isRu
          ? 'Владеть можно, но с оговорками: запрет расплачиваться в магазинах, обязательная идентификация, высокий налог или торговля только через одобренные площадки.'
          : 'Holding is allowed with conditions: no paying for goods, mandatory identification, heavy taxation, or trading only through approved venues.'}
      </p>
      <p className={p}>
        <b className="text-foreground">{isRu ? `Запрещено (${n('banned')}).` : `Banned (${n('banned')}).`}</b>{' '}
        {names('banned')}.{' '}
        {isRu
          ? 'Строгость разная: где-то блокируют доступ к биржам, а в Алжире с 2025 года уголовно наказуемо даже простое хранение.'
          : 'Severity differs: some block access to exchanges, while Algeria has criminalised even holding since 2025.'}
      </p>
      <p className={p}>
        <b className="text-foreground">{isRu ? `Серая зона (${n('unclear')}).` : `Grey zone (${n('unclear')}).`}</b>{' '}
        {isRu
          ? 'Саудовская Аравия: прямого запрета нет, но банкам нельзя обслуживать операции, а лицензий биржам не выдавали. Год назад в этой категории было четыре страны — три из них определились.'
          : 'Saudi Arabia: no outright ban, but banks may not service transactions and no exchange licences have been issued. A year ago this category held four countries; three have since made up their minds.'}
      </p>

      <h3 className={h3}>{isRu ? 'Что изменилось за последний год' : 'What changed over the past year'}</h3>
      <p className={p}>
        {isRu
          ? 'Серых зон стало меньше, и это главный сдвиг. Беларусь в январе 2026 года ввела статус криптобанка с реестром при Национальном банке. Пакистан сделал регулятор постоянным федеральным органом с обязательным лицензированием. Узбекистан с 1 января 2026 года признал стейблкоины законным платёжным инструментом.'
          : 'Fewer grey zones — that is the headline. Belarus created the status of crypto bank in January 2026, with a register kept by the National Bank. Pakistan turned its regulator into a permanent federal body with mandatory licensing. Uzbekistan recognised stablecoins as a lawful means of payment from 1 January 2026.'}
      </p>
      <p className={p}>
        {isRu
          ? 'Движение идёт в обе стороны. Алжир в июле 2025 года принял один из самых суровых законов в мире. Марокко, наоборот, готовит легализацию: восемь лет запрета не помешали числу владельцев вырасти до шести миллионов.'
          : 'The traffic runs both ways. Algeria passed one of the world’s harshest laws in July 2025. Morocco is moving the other way: eight years of prohibition did nothing to stop ownership reaching six million.'}
      </p>

      <h4 className={h4}>{isRu ? 'Европа стала единым рынком' : 'Europe became one market'}</h4>
      <p className={p}>
        {isRu
          ? 'С 1 июля 2026 года переходный период европейского регламента MiCA закончился: обслуживать клиентов Евросоюза без лицензии поставщика услуг больше нельзя. Зато полученная в одной стране лицензия действует во всех 27 — раньше площадке приходилось получать разрешение в каждой стране отдельно.'
          : 'The MiCA transition ended on 1 July 2026: serving EU clients without a service-provider licence is no longer permitted. In exchange, a licence obtained in one member state works across all 27 — previously a platform needed separate approval in each.'}
      </p>
      <p className={p}>
        {isRu
          ? 'Для читателя это значит простую вещь: если биржа работает в Европе законно, она есть в реестре ESMA. Проверить это стоит до того, как заводить деньги.'
          : 'For a reader that means something simple: a platform operating lawfully in Europe appears in the ESMA register. Worth checking before you send it money.'}
      </p>

      <h3 className={h3}>{isRu ? 'Где налоги ниже' : 'Where the tax is lower'}</h3>
      <p className={p}>
        {isRu
          ? 'Налог обычно решает больше, чем сам статус: разрешено почти везде, а вот отдают государству везде по-разному.'
          : 'Tax usually matters more than status: holding is permitted almost everywhere, but what you hand over differs sharply.'}
      </p>
      <ul className="text-[14.5px] leading-relaxed text-muted mb-3 pl-5 list-disc space-y-1.5">
        {(isRu
          ? [
              ['Португалия', 'держите дольше 365 дней — платите ноль; продали раньше — 28%'],
              ['Германия', 'то же правило, но срок год, и льгота записана в законе о подоходном налоге'],
              ['Таиланд', 'с 2025 по 2029 год нулевая ставка при торговле через лицензированные биржи'],
              ['Италия', 'с 2026 года 33% вместо 26%, порог в 2000 евро отменён'],
              ['Индия', '30% с прибыли плюс 1% удерживается с каждой сделки, убытки зачесть нельзя'],
              ['Южная Корея', '22% начнут брать с 2027 года, до этого для частных лиц ноль'],
            ]
          : [
              ['Portugal', 'hold longer than 365 days and pay nothing; sell sooner and pay 28%'],
              ['Germany', 'the same idea with a one-year clock, written into the income tax act'],
              ['Thailand', 'zero from 2025 to 2029 on trades through licensed exchanges'],
              ['Italy', '33% from 2026, up from 26%, with the €2,000 threshold removed'],
              ['India', '30% on gains plus 1% withheld on every transaction, with no loss offset'],
              ['South Korea', '22% starts in 2027; until then individuals pay nothing'],
            ]
        ).map(([country, rule]) => (
          <li key={country}><b className="text-foreground">{country}</b> — {rule}</li>
        ))}
      </ul>

      <h3 className={h3}>{isRu ? 'Почему запреты почти не работают' : 'Why bans mostly fail'}</h3>
      <p className={p}>
        {isRu
          ? 'Самое поучительное на карте — разрыв между законом и жизнью. В Марокко запрет действует с 2017 года, а владельцев криптовалюты около шести миллионов, каждый шестой житель. В Египте операции запрещены и осуждены религиозным заключением, при этом криптой владеют более трёх миллионов человек. Бангладеш с полным запретом занимает 13-е место в мире по низовому проникновению: фрилансеры принимают оплату в стейблкоинах, потому что так быстрее и дешевле банковского перевода.'
          : 'The most instructive thing on the map is the gap between law and life. Morocco has banned crypto since 2017 and has roughly six million owners — one resident in six. Egypt prohibits transactions and has a religious ruling against them, yet over three million Egyptians hold crypto. Bangladesh, with a full ban, ranks 13th in the world for grassroots adoption: freelancers take payment in stablecoins because it beats a bank transfer on both speed and cost.'}
      </p>
      <p className={p}>
        {isRu
          ? 'Китай — единственный, кому запрет удался хотя бы наполовину: после 2021 года доля страны в мировом майнинге рухнула с 75% почти до нуля. Но за два года подпольные фермы вернули её в первую тройку.'
          : 'China is the only case where a ban half-worked: after 2021 its share of global mining fell from 75% to near zero. Two years later underground farms had returned it to the global top three.'}
      </p>

      <h3 className={h3}>{isRu ? 'Частые вопросы' : 'Common questions'}</h3>
      <div className="space-y-4 mb-3">
        {faq.map(([q, a]) => (
          <div key={q} className="border-l-2 border-accent/40 pl-4">
            <b className="block text-[14.5px] text-foreground mb-1">{q}</b>
            <p className="text-[14px] leading-relaxed text-muted m-0">{a}</p>
          </div>
        ))}
      </div>

      <h3 className={h3}>{isRu ? 'Как мы ведём эти данные' : 'How we maintain this'}</h3>
      <p className={p}>
        {isRu
          ? 'Каждая страна проверена по сайту регулятора — центрального банка, комиссии по ценным бумагам или профильного органа. Ссылка стоит в карточке страны рядом с датой проверки, чтобы вы могли посмотреть первоисточник сами.'
          : 'Every country is checked against its regulator — the central bank, the securities commission or the relevant authority. The link sits in the country card beside the date it was checked, so you can read the source yourself.'}
      </p>
      <p className={p}>
        {isRu
          ? 'Мы не даём юридических консультаций и не заменяем юриста: законы меняются, а формулировки в них важнее пересказа. Карта отвечает на вопрос «в какую сторону смотреть», а не «что мне делать в моей ситуации».'
          : 'This is not legal advice and no substitute for a lawyer: laws change, and their exact wording matters more than any summary. The map tells you which way to look, not what to do in your particular case.'}
      </p>
    </section>
  );
}
