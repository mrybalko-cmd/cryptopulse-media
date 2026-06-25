'use client';

import { useState } from 'react';
import { Link2, Check } from 'lucide-react';

interface ShareButtonsProps {
  url: string;
  title: string;
  locale: string;
  vertical?: boolean;
}

export default function ShareButtons({ url, title, locale, vertical = true }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const twitterHref = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const btnClass =
    'w-9 h-9 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-accent hover:border-accent/40 transition-colors';

  return (
    <div className={vertical ? 'flex flex-col gap-2' : 'flex items-center gap-2'}>
      <a
        href={twitterHref}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
        aria-label="Share on X (Twitter)"
        title="X (Twitter)"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </a>
      <a
        href={facebookHref}
        target="_blank"
        rel="noopener noreferrer"
        className={btnClass}
        aria-label="Share on Facebook"
        title="Facebook"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54v-2.89h2.54V9.797c0-2.506 1.493-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
        </svg>
      </a>
      <button
        onClick={copyLink}
        className={btnClass}
        aria-label={locale === 'ru' ? 'Скопировать ссылку' : 'Copy link'}
        title={locale === 'ru' ? 'Скопировать ссылку' : 'Copy link'}
      >
        {copied ? <Check size={15} className="text-positive" /> : <Link2 size={15} />}
      </button>
    </div>
  );
}
