import Link from 'next/link';
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { urlFor } from '@/lib/sanityImage';
import { BASE } from '@/lib/metadata';
import YouTubeEmbed from './YouTubeEmbed';
import TweetEmbed from './TweetEmbed';

// Shared Portable Text renderer for both article and news detail pages —
// they used to duplicate this whole block; now the shared surface (image,
// link, quote/embed types) only needs updating in one place.
export default function RichText({
  value,
  fallbackAlt,
  locale,
}: {
  value: any[];
  fallbackAlt: string;
  locale: string;
}) {
  const components: PortableTextComponents = {
    types: {
      image: ({ value }: { value: any }) => {
        if (!value?.asset) return null;
        const src = urlFor(value).width(900).url();
        return (
          <figure className="my-6">
            <img
              src={src}
              alt={value.alt || fallbackAlt}
              loading="lazy"
              className="w-full h-auto rounded-lg"
            />
            {value.alt && (
              <figcaption className="text-xs text-muted text-center mt-2">{value.alt}</figcaption>
            )}
          </figure>
        );
      },
      youtubeEmbed: ({ value }: { value: any }) => (
        <YouTubeEmbed url={value.url} caption={value.caption} />
      ),
      tweetEmbed: ({ value }: { value: any }) => (
        <TweetEmbed
          url={value.url}
          authorName={value.authorName}
          authorHandle={value.authorHandle}
          text={value.text}
          locale={locale}
        />
      ),
      quoteBlock: ({ value }: { value: any }) => {
        const { text, quoteAuthor, source, style } = value;
        const attribution = [quoteAuthor, source].filter(Boolean).join(', ');
        if (style === 'accent') {
          return (
            <blockquote className="not-prose not-italic border-l-4 border-accent bg-accent/5 rounded-r-lg px-5 py-4 my-6">
              <p className="text-foreground text-base font-medium leading-relaxed">{text}</p>
              {attribution && <cite className="block not-italic text-xs text-muted mt-2">{attribution}</cite>}
            </blockquote>
          );
        }
        if (style === 'attributed') {
          return (
            <blockquote className="not-prose border-l-4 border-border pl-5 my-6">
              <p className="text-muted italic leading-relaxed">&ldquo;{text}&rdquo;</p>
              {attribution && (
                <cite className="block not-italic text-sm font-semibold text-foreground mt-2">— {attribution}</cite>
              )}
            </blockquote>
          );
        }
        return (
          <blockquote className="not-prose border-l-4 border-border pl-5 my-6 text-muted italic leading-relaxed">
            {text}
          </blockquote>
        );
      },
    },
    marks: {
      link: ({ value, children }) => {
        const href = value?.href ?? '';
        const isInternal = href.startsWith('/') || href.startsWith(BASE);
        if (isInternal) {
          const path = href.startsWith(BASE) ? href.slice(BASE.length) || '/' : href;
          return (
            <Link
              href={path}
              className="text-blue-500 underline decoration-blue-500 hover:text-blue-600 hover:decoration-blue-600"
            >
              {children}
            </Link>
          );
        }
        const relParts = [
          'noopener', 'noreferrer',
          ...(value?.rel === 'nofollow' ? ['nofollow'] : []),
        ];
        return (
          <a
            href={href}
            target="_blank"
            rel={relParts.join(' ')}
            className="text-blue-500 underline decoration-blue-500 hover:text-blue-600 hover:decoration-blue-600"
          >
            {children}
          </a>
        );
      },
      large: ({ children }) => <span className="text-base sm:text-lg">{children}</span>,
      small: ({ children }) => <span className="text-xs">{children}</span>,
    },
  };

  return (
    <div className="prose prose-invert prose-sm max-w-none
      prose-headings:text-foreground prose-headings:font-semibold
      prose-p:text-muted prose-p:leading-relaxed
      prose-a:text-blue-500 prose-a:underline prose-a:decoration-blue-500 hover:prose-a:text-blue-600 hover:prose-a:decoration-blue-600
      prose-strong:text-foreground
      prose-li:text-muted prose-li:marker:text-muted
      prose-blockquote:border-accent prose-blockquote:text-muted
      prose-code:text-accent prose-code:bg-card prose-code:px-1 prose-code:rounded
    ">
      <PortableText value={value} components={components} />
    </div>
  );
}
