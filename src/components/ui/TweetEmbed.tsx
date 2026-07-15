import { ExternalLink } from 'lucide-react';

// Deliberately not the official embed widget (platform.twitter.com/widgets.js)
// — it's a heavy blocking third-party script that can hurt Core Web Vitals.
// This is a static, server-rendered card instead: real content in the HTML,
// no client JS, and a plain link out to the original post on X.
function XLogo() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function TweetEmbed({
  url,
  authorName,
  authorHandle,
  text,
  locale,
}: {
  url: string;
  authorName?: string;
  authorHandle?: string;
  text?: string;
  locale: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose group block my-6 rounded-xl border border-border bg-card p-4 no-underline hover:border-accent/50 transition-colors"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-foreground text-card shrink-0">
          <XLogo />
        </span>
        <div className="min-w-0">
          {authorName && <span className="text-sm font-semibold text-foreground truncate block leading-tight">{authorName}</span>}
          {authorHandle && <span className="text-xs text-muted">@{authorHandle}</span>}
        </div>
      </div>
      {text && <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{text}</p>}
      <span className="flex items-center gap-1 text-xs text-accent mt-3 group-hover:underline">
        {locale === 'ru' ? 'Открыть в X' : 'View on X'} <ExternalLink size={11} />
      </span>
    </a>
  );
}
