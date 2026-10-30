import { type AssetCta, ctaClickHref, ctaLabels, inkOn } from '@/lib/assetCtaShared';

/**
 * Кнопка партнёра на монете.
 *
 * Серверный компонент: вся жизнь кнопки — наведение и нажатие — описана в
 * CSS, состояния в JavaScript ей не нужны.
 *
 * Размытие вешается классом `backdrop-blur-[9px]`, а не свойством в CSS:
 * рукописный backdrop-filter в нашей сборке вырезается, и кнопка выходит
 * матовой. Остальная отделка — в globals.css, класс .coin-cta.
 */

type Size = 'default' | 'full' | 'lg' | 'sm';

const SIZE_CLASS: Record<Size, string> = {
  default: '',
  full: 'coin-cta-full',
  lg: 'coin-cta-lg',
  sm: 'coin-cta-sm',
};

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5 11L11 5M6 5h5v5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function AssetCtaButton({
  cta,
  symbol,
  locale,
  fallbackColor,
  size = 'default',
  /** В таблице место на одну кнопку: вторая туда не влезает. */
  singleOnly = false,
}: {
  cta: AssetCta;
  symbol: string;
  locale: string;
  fallbackColor: string;
  size?: Size;
  singleOnly?: boolean;
}) {
  const color = cta.color || fallbackColor;
  const labels = ctaLabels(cta, symbol, locale);
  const sizeClass = SIZE_CLASS[size];
  const style = {
    ['--cta-color' as string]: color,
    ['--cta-ink' as string]: inkOn(color),
  } as React.CSSProperties;

  // Ссылка ведёт на наш маршрут, а не сразу к партнёру: иначе клик нечем
  // посчитать. Маршрут увеличивает счётчик, подставляет метки кампании и
  // отправляет дальше по адресу из документа.
  const buyHref = ctaClickHref(cta._id, 'buy', locale);
  const sellHref = ctaClickHref(cta._id, 'sell', locale);

  // sponsored — метка платного размещения, её Google просит на рекламе.
  // Пишем обе: sponsored понимает Google, nofollow понимают остальные.
  const rel = 'sponsored nofollow noopener noreferrer';

  const buy = labels.buy && (
    <a
      key="buy"
      href={buyHref}
      target="_blank"
      rel={rel}
      style={style}
      className={`coin-cta backdrop-blur-[9px] ${sizeClass}`}
    >
      {labels.buy}
      <Arrow />
    </a>
  );
  const sell = labels.sell && !singleOnly && (
    <a
      key="sell"
      href={sellHref}
      target="_blank"
      rel={rel}
      style={style}
      className={`coin-cta coin-cta-ghost backdrop-blur-[9px] ${sizeClass}`}
    >
      {labels.sell}
    </a>
  );

  // В режиме «только продать» одинокая кнопка остаётся плотной: прозрачный
  // ярус в одиночку читается как неактивная.
  const only = !labels.buy && labels.sell;
  const soleSell = only && (
    <a
      key="sell-solo"
      href={sellHref}
      target="_blank"
      rel={rel}
      style={style}
      className={`coin-cta backdrop-blur-[9px] ${sizeClass}`}
    >
      {labels.sell}
      <Arrow />
    </a>
  );

  return (
    <div className="cta-wrap">
      {only ? soleSell : [buy, sell].filter(Boolean)}
    </div>
  );
}

/** Пометка «Реклама · Партнёр». Выключена по умолчанию, включается в админке. */
export function AssetCtaAdLabel({ cta, locale }: { cta: AssetCta; locale: string }) {
  if (!cta.showAdLabel) return null;
  const isRu = locale === 'ru';
  return (
    <p className="cta-ad">
      <span>{isRu ? 'Реклама' : 'Ad'}</span>
      {cta.partner && <span>{isRu ? 'Партнёр' : 'Partner'}: {cta.partner}</span>}
    </p>
  );
}
