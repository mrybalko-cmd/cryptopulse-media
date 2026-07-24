import Image from 'next/image';
import { sanityImageTransform } from '@/lib/sanityImage';
import type { ExchangeProductRaw } from '@/lib/sanity';

// One card shape at every width — a full-bleed product photo (not an icon),
// name/short description below it, and the longer description tucked behind
// a native <details> tap-to-expand, same accordion convention already used
// for the FAQ blocks on /assets/[coin] (CoinGuideLayout).
function ProductCard({ product, locale }: { product: ExchangeProductRaw; locale: string }) {
  const isRu = locale === 'ru';
  const name = isRu ? product.nameRu : product.nameEn;
  const short = isRu ? product.shortRu : product.shortEn;
  const long = isRu ? product.longRu : product.longEn;

  return (
    <details className="group bg-card border border-border rounded-xl overflow-hidden hover:border-accent/50 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <summary className="cursor-pointer select-none list-none">
        <div className="relative w-full aspect-[16/8] bg-background overflow-hidden">
          <Image
            src={sanityImageTransform(product.image, { width: 900, height: 450 })!}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>
        <div className="flex items-start justify-between gap-2 p-3">
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground">{name}</p>
            {short && <p className="text-xs text-muted mt-0.5 line-clamp-2">{short}</p>}
          </div>
          {long && <span className="text-muted group-open:rotate-180 transition-transform shrink-0 mt-0.5">▾</span>}
        </div>
      </summary>
      {long && (
        <div className="px-3 pb-3 pt-0 text-xs text-muted leading-relaxed border-t border-border">
          <p className="pt-3">{long}</p>
        </div>
      )}
    </details>
  );
}

export default function ExchangeProducts({ products, locale }: { products?: ExchangeProductRaw[]; locale: string }) {
  if (!products || products.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {products.map((p, i) => (
        <ProductCard key={i} product={p} locale={locale} />
      ))}
    </div>
  );
}
