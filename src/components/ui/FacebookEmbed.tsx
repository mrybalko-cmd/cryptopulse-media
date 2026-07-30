import { ExternalLink } from 'lucide-react';

// Static, server-rendered Facebook post card — same rationale as TweetEmbed:
// no heavy third-party embed script (sdk.js), real content in the HTML, and a
// plain link out to the original post. Keeps Core Web Vitals clean.
function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function FacebookEmbed({
  url,
  authorName,
  text,
  locale,
}: {
  url: string;
  authorName?: string;
  text?: string;
  locale: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose group block my-6 rounded-xl border border-border bg-card p-4 no-underline shadow-sm hover:border-article-accent/50 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-2.5 mb-2">
        <span className="flex items-center justify-center w-9 h-9 rounded-full bg-[#1877F2] text-white shrink-0">
          <FacebookLogo />
        </span>
        <div className="min-w-0">
          {authorName && <span className="text-sm font-semibold text-foreground truncate block leading-tight">{authorName}</span>}
          <span className="text-xs text-muted">Facebook</span>
        </div>
      </div>
      {text && <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{text}</p>}
      <span className="flex items-center gap-1 text-xs font-medium text-article-accent mt-3 group-hover:underline">
        {locale === 'ru' ? 'Открыть в Facebook' : 'View on Facebook'} <ExternalLink size={11} />
      </span>
    </a>
  );
}
