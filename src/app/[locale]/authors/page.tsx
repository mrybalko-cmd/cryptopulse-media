export const revalidate = 300;

import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { buildOg, BASE } from '@/lib/metadata';
import Link from 'next/link';
import Image from 'next/image';
import { fetchAuthors } from '@/lib/sanity';
import { Users } from 'lucide-react';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const title = isRu ? 'Наши авторы — CryptoPulse.media' : 'Our Authors — CryptoPulse.media';
  const description = isRu
    ? 'Авторы и аналитики CryptoPulse.media — узнайте больше о команде, которая создаёт криптовалютный контент.'
    : 'Meet the authors and analysts of CryptoPulse.media — the team behind our crypto content.';
  return {
    title,
    description,
    openGraph: buildOg({ url: `${BASE}/${locale}/authors`, title, description, locale }),
    alternates: {
      canonical: `${BASE}/${locale}/authors`,
      languages: { ru: `${BASE}/ru/authors`, en: `${BASE}/en/authors`, 'x-default': `${BASE}/en/authors` },
    },
  };
}

export default async function AuthorsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isRu = locale === 'ru';
  const authors = await fetchAuthors();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: isRu ? 'Авторы CryptoPulse.media' : 'CryptoPulse.media Authors',
    url: `${BASE}/${locale}/authors`,
    about: { '@type': 'Organization', name: 'CryptoPulse.media', url: BASE },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center">
            <Users size={18} className="text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {isRu ? 'Наши авторы' : 'Our Authors'}
          </h1>
        </div>
        <p className="text-muted text-sm leading-relaxed ml-12">
          {isRu
            ? 'Команда аналитиков и редакторов, которые создают материалы для CryptoPulse.media'
            : 'The team of analysts and editors who create content for CryptoPulse.media'}
        </p>
      </div>

      {authors.length === 0 ? (
        <p className="text-muted text-sm">{isRu ? 'Авторы появятся скоро.' : 'Authors coming soon.'}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {authors.map((author: any) => (
            <Link
              key={author._id}
              href={`/${locale}/authors/${author.slug}`}
              className="group flex flex-col gap-4 bg-card border border-border rounded-2xl p-6 hover:border-accent/40 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                {author.photo ? (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-border group-hover:border-accent/40 transition-colors">
                    <Image
                      src={author.photo}
                      alt={author.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full shrink-0 bg-accent/10 border-2 border-border flex items-center justify-center">
                    <span className="text-2xl font-bold text-accent">{author.name.charAt(0)}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-bold text-foreground group-hover:text-accent transition-colors truncate">
                    {author.name}
                  </p>
                  {(isRu ? author.roleRu : author.roleEn) && (
                    <p className="text-xs text-accent mt-0.5 truncate">
                      {isRu ? author.roleRu : author.roleEn}
                    </p>
                  )}
                </div>
              </div>
              {(isRu ? author.bioRu : author.bioEn) && (
                <p className="text-xs text-muted leading-relaxed line-clamp-3">
                  {isRu ? author.bioRu : author.bioEn}
                </p>
              )}
              <span className="text-xs text-accent font-medium mt-auto">
                {isRu ? 'Читать материалы →' : 'View articles →'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
