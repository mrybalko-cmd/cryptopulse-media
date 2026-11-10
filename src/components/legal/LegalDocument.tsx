import { Fragment } from 'react';
import type { LegalDoc } from '@/lib/legalTexts';

const EMAIL = /([\w.+-]+@[\w-]+\.[\w.]+[a-z])/i;

/** Адрес почты в тексте делаем ссылкой, сам текст не меняется. */
function withMailto(text: string) {
  return text.split(EMAIL).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={`mailto:${part}`}>{part}</a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

/** Правовой документ: заголовок, строка с датой и блоки текста как в оригинале. */
export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{doc.title}</h1>
      <p className="text-muted text-xs mb-8">{doc.updated}</p>

      <div className="prose prose-invert prose-sm max-w-none
        prose-headings:text-foreground prose-headings:font-semibold
        prose-p:text-muted prose-p:leading-relaxed
        prose-a:text-accent prose-a:underline prose-a:decoration-accent/50 hover:prose-a:decoration-accent
        prose-li:text-muted prose-strong:text-foreground
      ">
        {doc.blocks.map((b, i) =>
          'h' in b ? (
            <h2 key={i}>{b.h}</h2>
          ) : 'ul' in b ? (
            <ul key={i}>
              {b.ul.map((item, j) => <li key={j}>{withMailto(item)}</li>)}
            </ul>
          ) : (
            <p key={i}>{withMailto(b.p)}</p>
          ),
        )}
      </div>
    </>
  );
}
