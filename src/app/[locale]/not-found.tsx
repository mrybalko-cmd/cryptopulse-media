import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations('notFound');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
      <h1 className="text-3xl font-bold text-foreground mb-3">{t('title')}</h1>
      <p className="text-muted mb-8">{t('description')}</p>
      <Link
        href={`/${locale}`}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
      >
        <ArrowLeft size={14} />
        {t('cta')}
      </Link>
    </div>
  );
}
