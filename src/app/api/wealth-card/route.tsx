import { ImageResponse } from 'next/og';
import { BrandMark } from '@/lib/brandMark';
import { SITE_BRAND, SITE_HOST, SITE_ZONE } from '@/lib/site';
import { fetchWealthCrypto, btcShare } from '@/lib/wealthCrypto';
import {
  computeWealth, parseWealthState, formatInt, formatMoney, formatCompactMoney,
  formatDecimal, yearsWord,
} from '@/lib/wealth';

/**
 * Картинка, которой делятся из калькулятора состояний.
 *
 * Отдельный маршрут, а не opengraph-image страницы: opengraph-image рисуется
 * один раз на адрес, а здесь у каждого человека свои числа. Страница при этом
 * остаётся статической — параметры приходят только сюда, картинку человек
 * скачивает и вкладывает сам.
 *
 * Satori умеет не всё: у каждого div обязан быть явный display, текст рядом с
 * элементом должен лежать в своём элементе, grid не работает вовсе. Отсюда
 * ряды из плиток вместо сетки и отдельные span'ы под каждое слово, где рядом
 * стоят разные начертания.
 */
export const size = { width: 1200, height: 630 };

const INK = '#f2f5f8';
const INK_2 = '#a8b2be';
const INK_3 = '#77828f';
const GOLD = '#e0ab3a';
const EDGE = 'rgba(255,255,255,0.16)';
const GLASS = 'rgba(255,255,255,0.05)';

/**
 * Кегль числа ступенями по длине строки. «7 917» и «79 166 666 667» одним
 * размером не живут: длинное уезжает за поле карточки, а короткое теряется.
 */
function yearsFontSize(text: string) {
  const n = text.length;
  if (n <= 11) return 163;
  if (n <= 13) return 138;
  if (n <= 15) return 117;
  return 96;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', flex: 1,
        border: `1px solid ${EDGE}`, borderRadius: 16, background: GLASS, padding: '16px 19px',
      }}
    >
      <div style={{ display: 'flex', fontSize: 16, color: INK_3, marginBottom: 10 }}>{label}</div>
      <div style={{ display: 'flex', fontSize: 35, fontWeight: 800, color: INK }}>{value}</div>
    </div>
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') === 'ru' ? 'ru' : 'en';
  const isRu = locale === 'ru';
  const state = parseWealthState(url.search);
  const { billionaire, savedPerYear, years } = computeWealth(state);
  const crypto = await fetchWealthCrypto();

  const whose = isRu ? billionaire.possessive.ru : billionaire.possessive.en;
  const yearsText = Number.isFinite(years) ? formatInt(years, locale) : '∞';
  const fs = yearsFontSize(yearsText);

  const btc = crypto ? btcShare(billionaire.netWorth, crypto.btcPrice) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          padding: '48px 55px', background: '#0b0e12', position: 'relative',
        }}
      >
        {/* Ореолы: без них стекло плиток ниже неотличимо от матовой заливки. */}
        <div style={{ position: 'absolute', top: -170, left: -110, width: 560, height: 560, borderRadius: '50%', background: 'rgba(139,92,246,0.55)', filter: 'blur(110px)', display: 'flex' }} />
        <div style={{ position: 'absolute', bottom: -180, right: -90, width: 440, height: 440, borderRadius: '50%', background: 'rgba(6,182,212,0.4)', filter: 'blur(110px)', display: 'flex' }} />

        {/* шапка: знак и раздел */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <BrandMark size={36} simplified={false} />
            <div style={{ display: 'flex', fontSize: 34, fontWeight: 800, color: INK, letterSpacing: -0.6 }}>
              {SITE_BRAND}
            </div>
            <div style={{ display: 'flex', fontSize: 26, fontWeight: 700, color: INK_3 }}>{SITE_ZONE}</div>
          </div>
          <div
            style={{
              display: 'flex', fontSize: 16, fontWeight: 700, letterSpacing: 2.4, color: INK_3,
              textTransform: 'uppercase', border: `1px solid ${EDGE}`, borderRadius: 999,
              padding: '12px 20px', background: GLASS,
            }}
          >
            {isRu ? 'Состояние миллиардеров' : 'Billionaire wealth'}
          </div>
        </div>

        {/* число лет — то единственное, ради чего картинкой поделятся */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <div
              style={{
                display: 'flex', fontSize: fs, fontWeight: 800, lineHeight: 0.92, letterSpacing: -fs * 0.05,
                backgroundImage: 'linear-gradient(90deg, #a855f7 0%, #6366f1 44%, #22d3ee 100%)',
                backgroundClip: 'text', color: 'transparent',
              }}
            >
              {yearsText}
            </div>
            <div style={{ display: 'flex', fontSize: Math.round(fs * 0.27), fontWeight: 800, color: INK_2, marginLeft: Math.round(fs * 0.16) }}>
              {yearsWord(years, locale)}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', marginTop: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: INK }}>
              {isRu ? 'столько мне копить на состояние' : 'that is how long I would save for'}
            </div>
            <div style={{ display: 'flex', fontSize: 30, color: INK_2, marginLeft: 10 }}>
              {isRu
                ? `${whose} — ${formatCompactMoney(billionaire.netWorth, locale)}`
                : `${whose} ${formatCompactMoney(billionaire.netWorth, locale)}`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 26 }}>
            <Stat label={isRu ? 'мой доход в месяц' : 'my monthly income'} value={formatMoney(state.inc, locale)} />
            <Stat label={isRu ? 'откладываю' : 'I save'} value={`${state.rate}%`} />
            <Stat label={isRu ? 'в год выходит' : 'that is per year'} value={formatMoney(savedPerYear, locale)} />
          </div>
        </div>

        {/* биткоин — второе число карточки, и единственный крипто-угол */}
        <div
          style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            borderTop: `1px solid ${EDGE}`, paddingTop: 23, marginTop: 19,
          }}
        >
          {btc ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', fontSize: 16, color: INK_3, marginBottom: 10 }}>
                {isRu ? 'это состояние в биткоинах' : 'this fortune in bitcoin'}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <div style={{ display: 'flex', fontSize: 47, fontWeight: 800, color: GOLD, letterSpacing: -1.5 }}>
                  {formatInt(btc.coins, locale)}
                </div>
                <div style={{ display: 'flex', fontSize: 20, fontWeight: 800, color: GOLD, marginLeft: 8 }}>BTC</div>
                <div style={{ display: 'flex', fontSize: 21, fontWeight: 800, color: GOLD, marginLeft: 20 }}>
                  {formatDecimal(btc.pctOfCap, locale, 1)}%
                </div>
                <div style={{ display: 'flex', fontSize: 21, fontWeight: 700, color: INK_2, marginLeft: 7 }}>
                  {isRu ? 'всей эмиссии' : 'of all bitcoin'}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', fontSize: 21, color: INK_2 }}>
              {isRu ? 'Считаем честно: доход, норма сбережений и годы' : 'Honest maths: income, savings rate, years'}
            </div>
          )}
          <div style={{ display: 'flex', fontSize: 19, fontWeight: 700, color: INK_3, paddingBottom: 6 }}>
            {SITE_HOST}/{locale}/calculators/wealth
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        // Одни и те же параметры всегда дают одну и ту же картинку, меняется
        // только курс биткоина. Час на границе сети, неделя на отдачу
        // устаревшей копии, пока рисуется свежая: перерисовывать чаще незачем,
        // а каждая перерисовка — это вызов функции.
        'Cache-Control': 'public, max-age=0, s-maxage=3600, stale-while-revalidate=604800',
      },
    }
  );
}
