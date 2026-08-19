import { type RegStatus } from '@/lib/regulationData';
import type { RegCountry } from '@/lib/regulation';

/**
 * Текст под картой.
 *
 * Порядок утверждён на макете: «Зачем эта карта» → отдельный блок про MiCA →
 * содержательные разделы → «Ответы на вопросы». Счётчики берутся из данных,
 * а не из копии, поэтому текст не сможет утверждать «7 запретов» после того,
 * как кто-то поменяет страну в админке.
 */
/** Вопросы отдаются и в разметку страницы (FAQPage), и в сам блок — один источник. */
export function regulationFaq(isRu: boolean): [string, string][] {
  return isRu
    ? [
        ['Законно ли владеть криптовалютой в моей стране?',
         'Найдите страну на карте или в указателе: зелёный и жёлтый означают, что владеть можно, красный — что операции запрещены. Читайте подробности: у статуса «с ограничениями» запрет часто касается только оплаты товаров, а не хранения.'],
        ['Где криптовалюта — законное платёжное средство?',
         'Практически нигде. Сальвадор принял биткоин как законное средство платежа в 2021 году, но с января 2025 года приём стал добровольным. В остальных странах криптовалюта считается имуществом или финансовым активом, но не деньгами.'],
        ['Что будет, если торговать из страны с запретом?',
         'Зависит от страны. В Алжире предусмотрены лишение свободы и штраф до миллиона динаров, в Непале — до трёх лет и штраф от одной до трёх сумм сделки, в Египте — штраф до 10 миллионов фунтов. В Бангладеш отдельного закона о владении нет, запрет держится на валютном законодательстве 1947 года.'],
        ['Что лицензия MiCA даёт обычному пользователю?',
         'Одно практическое следствие: у площадки, работающей в Евросоюзе законно, есть запись в реестре ESMA, а деньги и монеты клиентов должны храниться отдельно от собственных средств биржи. Проверить реестр стоит до того, как заводить деньги.'],
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
        ['What does a MiCA licence mean for an ordinary user?',
         'One practical consequence: a platform operating lawfully in the EU appears in the ESMA register, and client money and coins must be held apart from the exchange’s own funds. Worth checking the register before you send anything.'],
        ['Can a country change its status?',
         'Yes, and more often than you would think: three of our 46 countries changed status in the past year. That is why every entry carries the date it was last checked and a link to the regulator.'],
        ['Is mining treated separately from trading?',
         'Often, yes. Russia legalised mining in 2024, while crypto itself only gains legal status as property in September 2026. Uzbekistan set aside a dedicated mining zone with tax breaks running to 2035.'],
      ];
}

export default function RegulationGuide({
  locale,
  countries,
}: {
  locale: string;
  countries: RegCountry[];
}) {
  const isRu = locale === 'ru';
  const names = (s: RegStatus) =>
    countries.filter(c => c.status === s).map(c => (isRu ? c.name.ru : c.name.en)).join(', ');

  const h3 = 'text-[17px] font-bold text-foreground mt-9 mb-2.5';
  const p = 'text-[14.5px] leading-relaxed text-muted mb-3';

  const micaDates = isRu
    ? [
        ['31 мая 2023', 'Регламент принят'],
        ['30 июня 2024', 'Правила для стейблкоинов'],
        ['30 дек. 2024', 'Правила для площадок'],
        ['1 июля 2026', 'Конец переходного периода'],
      ]
    : [
        ['31 May 2023', 'Regulation adopted'],
        ['30 June 2024', 'Stablecoin rules'],
        ['30 Dec 2024', 'Platform rules'],
        ['1 July 2026', 'Transition ends'],
      ];

  const faq = regulationFaq(isRu);

  return (
    <section className="pt-8 border-t border-border">
      <div className="max-w-3xl">
        <h2 className="text-lg font-bold text-foreground mb-4">
          {isRu ? 'Зачем эта карта' : 'Why this map exists'}
        </h2>

        <p className="text-[15px] leading-relaxed text-foreground mb-3">
          {isRu
            ? `Законность криптовалюты не бывает общей: она всегда конкретна — конкретная страна, конкретное действие, конкретный год. Держать монеты, платить ими в магазине, майнить и заводить деньги на биржу могут регулироваться по-разному внутри одного и того же законодательства. Карта показывает ${countries.length} юрисдикций и разводит эти вещи по отдельности.`
            : `The legality of crypto is never general: it is always specific — a specific country, a specific action, a specific year. Holding coins, paying with them, mining and funding an exchange account can each be governed differently inside the same body of law. The map covers ${countries.length} jurisdictions and keeps those things apart.`}
        </p>
        <p className={p}>
          {isRu
            ? 'Каждая запись проверена по сайту регулятора — центрального банка, комиссии по ценным бумагам или профильного органа. Рядом со статусом стоит дата проверки и ссылка на первоисточник: закон меняется быстрее, чем обновляются пересказы в интернете, и дата здесь важнее формулировки.'
            : 'Every entry is checked against its regulator — the central bank, the securities commission or the relevant authority. Beside each status sits the date it was checked and a link to the source: the law moves faster than the summaries written about it, and the date matters more than the wording.'}
        </p>
        <p className={p}>
          {isRu
            ? 'Это не юридическая консультация и не замена юристу. Карта отвечает на вопрос «в какую сторону смотреть», а не «что делать в моей ситуации».'
            : 'This is not legal advice and no substitute for a lawyer. The map tells you which way to look, not what to do in your particular case.'}
        </p>
      </div>

      <div className="reg-mica my-10">
        <span className="reg-mica-tag">{isRu ? 'Регламент ЕС 2023/1114' : 'Regulation (EU) 2023/1114'}</span>
        <h3 className="text-[19px] sm:text-[21px] font-bold text-foreground mt-3 mb-3">
          {isRu ? 'MiCA: Европа стала одним рынком' : 'MiCA: Europe became one market'}
        </h3>
        <div className="max-w-2xl">
          <p className={p}>
            {isRu
              ? 'До MiCA площадке приходилось получать разрешение в каждой стране Евросоюза отдельно, и правила в них расходились. Регламент заменил 27 наборов требований одним: лицензия поставщика услуг, полученная в одной стране, действует во всех остальных.'
              : 'Before MiCA a platform needed separate approval in every EU country, and the rules diverged between them. The regulation replaced 27 sets of requirements with one: a service-provider licence obtained in a single member state works across all the others.'}
          </p>
          <p className={p}>
            {isRu
              ? 'С 1 июля 2026 года переходный период закончился: обслуживать клиентов Евросоюза без такой лицензии больше нельзя. Работающие законно площадки перечислены в реестре ESMA — это самый быстрый способ проверить биржу перед первым переводом.'
              : 'The transition ended on 1 July 2026: serving EU clients without that licence is no longer permitted. Platforms operating lawfully appear in the ESMA register — the quickest way to check an exchange before your first transfer.'}
          </p>
          <p className={p}>
            {isRu
              ? 'Отдельная часть регламента касается стейблкоинов: эмитент обязан держать резервы, публиковать их состав и погашать монету по номиналу по требованию держателя. Именно эти требования заставили часть площадок убрать отдельные стейблкоины из европейских листингов.'
              : 'A separate part of the regulation covers stablecoins: the issuer must hold reserves, publish their composition and redeem the coin at par on demand. Those requirements are why some platforms pulled certain stablecoins from their European listings.'}
          </p>
          <p className={p}>
            {isRu
              ? 'Чего MiCA не делает — не трогает налоги. Ставка на прибыль от криптовалюты остаётся национальной, поэтому Германия и Португалия с их нулём после года владения соседствуют в одном союзе с Италией, поднявшей ставку до 33%.'
              : 'What MiCA does not do is touch tax. The rate on crypto gains stays national, which is why Germany and Portugal, with their zero after a year of holding, sit in the same union as Italy, which raised its rate to 33%.'}
          </p>
        </div>
        <div className="reg-mica-dates">
          {micaDates.map(([date, label]) => (
            <div key={date} className="reg-mica-date">
              <span className="reg-num">{date}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl">
        <h3 className={h3}>{isRu ? 'Четыре статуса на карте' : 'Four statuses on the map'}</h3>
        <p className={p}>
          <b className="text-foreground">{isRu ? 'Разрешено.' : 'Legal.'}</b>{' '}
          {isRu
            ? 'Криптовалюту можно свободно покупать, держать и продавать, биржи работают по лицензии. Законным платёжным средством она при этом почти нигде не является — это разные вещи, и их часто путают.'
            : 'Crypto can be freely bought, held and sold, and exchanges operate under licence. That is not the same as legal tender, which it is almost nowhere — the two are routinely confused.'}
        </p>
        <p className={p}>
          <b className="text-foreground">{isRu ? 'С ограничениями.' : 'Restricted.'}</b>{' '}
          {isRu
            ? 'Владеть можно, но с оговорками: запрет расплачиваться в магазинах, обязательная идентификация, высокий налог или торговля только через одобренные площадки.'
            : 'Holding is allowed with conditions: no paying for goods, mandatory identification, heavy taxation, or trading only through approved venues.'}
        </p>
        <p className={p}>
          <b className="text-foreground">{isRu ? 'Запрещено.' : 'Banned.'}</b>{' '}
          {names('banned')}.{' '}
          {isRu
            ? 'Строгость разная: где-то блокируют доступ к биржам, а в Алжире с 2025 года уголовно наказуемо даже простое хранение.'
            : 'Severity differs: some block access to exchanges, while Algeria has criminalised even holding since 2025.'}
        </p>
        <p className={p}>
          <b className="text-foreground">{isRu ? 'Серая зона.' : 'Grey zone.'}</b>{' '}
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

        <h3 className={h3}>{isRu ? 'Ответы на вопросы' : 'Answers to common questions'}</h3>
        <div className="reg-faq">
          {faq.map(([q, a]) => (
            <details key={q} className="reg-q">
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
