import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { buildOg, buildTwitter, BASE } from '@/lib/metadata';
import { fetchCalendarEvents } from '@/lib/sanity';
import { CATEGORY_COLOR, CATEGORY_LABELS, tint } from '@/lib/calendarMeta';
import PopularSidebar from '@/components/ui/PopularSidebar';
import { SITE_NAME } from '@/lib/site';

/**
 * Архив прошедших событий.
 *
 * Раньше прошедшие лежали плоским списком внутри <details> на главной
 * странице раздела: ни группировки, ни адреса, ни возможности сослаться.
 * Здесь они собраны по месяцам, и у каждого видно, чем оно кончилось, если
 * редакция это заполнила.
 *
 * Сделана одна страница со всеми месяцами, а не адрес на каждый месяц: на
 * два-три события в месяце отдельная страница была бы тонкой, и поиск
 * относится к таким хуже, чем к одной насыщенной.
 */

type Props = { params: Promise<{ locale: string }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Архив событий крипторынка' : 'Crypto Market Events Archive';
  const description = isRu
    ? `Прошедшие события крипторынка по месяцам: разлоки, листинги, решения регуляторов и отчётность — с итогом там, где редакция ${SITE_NAME} его подвела.`
    : `Past crypto market events by month: unlocks, listings, regulatory decisions and macro reports, with the outcome where ${SITE_NAME} editors recorded one.`;
  const url = `${BASE}/${locale}/calendar/archive`;

  return {
    title,
    description,
    openGraph: buildOg({ url, title, description, locale }),
    twitter: buildTwitter({ url, title, description, locale }),
    alternates: {
      canonical: url,
      languages: {
        ru: `${BASE}/ru/calendar/archive`,
        en: `${BASE}/en/calendar/archive`,
        'x-default': `${BASE}/en/calendar/archive`,
      },
    },
  };
}

export default async function CalendarArchivePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const loc = isRu ? 'ru' : 'en';

  const events = await fetchCalendarEvents();
  const todayISO = new Date().toISOString().slice(0, 10);
  const past = events.filter((e) => e.date < todayISO).reverse();

  const months: { key: string; label: string; items: typeof past }[] = [];
  for (const e of past) {
    const key = e.date.slice(0, 7);
    let m = months[months.length - 1];
    if (!m || m.key !== key) {
      m = {
        key,
        label: new Date(e.date)
          .toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
          .replace(/\s*г\.$/, ''),
        items: [],
      };
      months.push(m);
    }
    m.items.push(e);
  }

  const withOutcome = past.filter((e) => e.outcome?.[loc]).length;

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_256px] lg:gap-8">
        <div className="cal-stage">
          <Link
            href={`/${locale}/calendar`}
            className="mb-5 inline-flex items-center gap-1.5 text-[12px] font-bold text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft size={13} />
            {isRu ? 'Криптокалендарь' : 'Crypto Calendar'}
          </Link>

          <h1 className="mb-2 text-2xl font-bold text-foreground sm:text-3xl">
            {isRu ? 'Архив событий' : 'Events archive'}
          </h1>
          <p className="mb-7 max-w-[68ch] text-sm leading-relaxed text-muted">
            {isRu
              ? `Что уже произошло на крипторынке: ${past.length} ${past.length === 1 ? 'событие' : 'событий'} по месяцам. У ${withOutcome} из них редакция подвела итог — чем дело кончилось и как это отразилось на рынке.`
              : `What has already happened in the crypto market: ${past.length} events by month. For ${withOutcome} of them our editors recorded an outcome, so you can see how it actually landed.`}
          </p>

          {months.length === 0 ? (
            <p className="text-sm text-muted">{isRu ? 'Архив пока пуст.' : 'The archive is empty so far.'}</p>
          ) : (
            <div className="flex flex-col gap-4">
              {months.map((month) => (
                <section
                  key={month.key}
                  id={month.key}
                  className="scroll-mt-24 rounded-[20px] p-4 cal-glass backdrop-blur-[22px] backdrop-saturate-150 sm:p-5"
                >
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="whitespace-nowrap text-[12px] font-black uppercase tracking-[0.11em] text-foreground">
                      {month.label}
                    </h2>
                    <span className="h-px flex-1 bg-[var(--glass-edge)]" />
                    <span className="whitespace-nowrap text-[10.5px] tabular-nums text-muted">
                      {month.items.length}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    {month.items.map((e) => {
                      const color = CATEGORY_COLOR[e.category] || CATEGORY_COLOR.other;
                      const d = new Date(e.date);
                      return (
                        <Link
                          key={e._id}
                          href={`/${locale}/calendar/${e.slug}`}
                          className="grid grid-cols-[62px_minmax(0,1fr)] items-start gap-3 border-t border-[var(--glass-edge)] py-3 transition-colors first:border-t-0 hover:text-foreground sm:grid-cols-[72px_minmax(0,1fr)_132px_auto] sm:items-center"
                        >
                          <time
                            dateTime={e.date}
                            className="whitespace-nowrap text-[11px] font-semibold tabular-nums text-muted"
                          >
                            {d.toLocaleDateString(isRu ? 'ru-RU' : 'en-GB', {
                              day: 'numeric',
                              month: 'short',
                              timeZone: 'UTC',
                            })}
                          </time>
                          <span className="min-w-0 text-[12.5px] font-semibold text-foreground">{e.title[loc]}</span>
                          <span
                            className="hidden items-center gap-1.5 justify-self-start rounded-full px-2 py-0.5 text-[10.5px] font-extrabold sm:inline-flex"
                            style={{ color, background: tint(color, 0.13), border: `1px solid ${tint(color, 0.3)}` }}
                          >
                            <span className="block h-1.5 w-1.5 rounded-full" style={{ background: color }} />
                            {CATEGORY_LABELS[e.category]?.[loc] || e.category}
                          </span>
                          <span className="col-span-2 text-[11px] leading-relaxed text-muted sm:col-span-1 sm:max-w-[220px] sm:text-right">
                            {e.outcome?.[loc] || ''}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        <PopularSidebar locale={locale} />
      </div>
    </div>
  );
}
