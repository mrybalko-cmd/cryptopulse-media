/**
 * The long-form country page: how its fields are stored and how they parse.
 *
 * Everything a country page shows is editable from /admin/regulation, which
 * ruled out a schema of nested Sanity arrays — the admin is plain HTML forms,
 * and a repeating-group editor is a lot of surface for six timeline rows. The
 * repeating parts are therefore line-based text, one record per line, columns
 * separated by `|`. Editors get a textarea and a worked example; we get a
 * parser small enough to read in one sitting.
 *
 * Every parser here is deliberately forgiving. A missing column, a stray blank
 * line, spaces around the pipe — none of it should be able to break a live
 * page, because the person editing is writing prose, not filling in a database.
 */

/** A run of body text, optionally a link. */
export interface TextRun {
  text: string;
  href?: string;
}

export type BodyBlock =
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; runs: TextRun[] };

export interface Figure {
  /** Uppercase label above the value. */
  label: string;
  /** The value itself — "0%", "Обязательна", "1800+". */
  value: string;
  /** The quiet line under it. Optional. */
  note?: string;
  /**
   * What the number means, not what it is.
   *
   * Zero tax and a mandatory licence are both facts, but one is good news and
   * the other is a hurdle, and colour is how a reader scanning six tiles tells
   * them apart. It has to be stated rather than guessed: "0%" is welcome in a
   * tax tile and alarming in an "exchanges licensed" one.
   */
  tone?: 'ok' | 'warn';
}

export interface TimelineEvent {
  when: string;
  text: string;
  /** The one event worth pulling the eye — marked with a leading `*`. */
  highlight: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SourceLink {
  title: string;
  url: string;
}

/** One country page in one language, ready to render. */
export interface CountryPageContent {
  intro: string;
  figures: Figure[];
  body: BodyBlock[];
  allowed: string[];
  restricted: string[];
  timeline: TimelineEvent[];
  faq: FaqItem[];
  sources: SourceLink[];
  seoTitle?: string;
  seoDescription?: string;
}

/** Non-empty, trimmed lines. Blank lines are how editors breathe. */
function lines(raw?: string): string[] {
  if (!raw) return [];
  return raw.split('\n').map(l => l.trim()).filter(Boolean);
}

/** Split a line on `|` and trim each column. */
function columns(line: string): string[] {
  return line.split('|').map(c => c.trim());
}

/**
 * `МЕТКА | значение | подпись | тон` — the six tiles under the short answer.
 * Note and tone are optional; a line with only a label is dropped, since a tile
 * with a heading and no number is worse than no tile.
 */
export function parseFigures(raw?: string): Figure[] {
  return lines(raw)
    .map((line): Figure | null => {
      const [label, value, note, tone] = columns(line);
      if (!label || !value) return null;
      // Built without the key rather than with `undefined`: the project runs
      // exactOptionalPropertyTypes, where those are not the same thing.
      return {
        label,
        value,
        ...(note ? { note } : {}),
        ...(tone === 'ok' || tone === 'warn' ? { tone } : {}),
      };
    })
    .filter((f): f is Figure => f !== null);
}

/** One item per line. Used for both "можно" and "ограничено". */
export function parseList(raw?: string): string[] {
  return lines(raw).map(l => l.replace(/^[-–—•*]\s*/, ''));
}

/**
 * `Март 2022 | что произошло`, and `*` at the head of the line marks the one
 * event that gets the gold dot.
 */
export function parseTimeline(raw?: string): TimelineEvent[] {
  return lines(raw)
    .map(line => {
      const highlight = line.startsWith('*');
      const [when, text] = columns(highlight ? line.slice(1).trim() : line);
      if (!when || !text) return null;
      return { when, text, highlight };
    })
    .filter((e): e is TimelineEvent => e !== null);
}

/** `Вопрос? | Ответ` — one pair per line, both required. */
export function parseFaq(raw?: string): FaqItem[] {
  return lines(raw)
    .map(line => {
      const [question, ...rest] = columns(line);
      const answer = rest.join(' | ').trim();
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((f): f is FaqItem => f !== null);
}

/** `Название | https://…` — the url must look like one or the row is dropped. */
export function parseSources(raw?: string): SourceLink[] {
  return lines(raw)
    .map(line => {
      const [title, url] = columns(line);
      if (!title || !url || !/^https?:\/\//i.test(url)) return null;
      return { title, url };
    })
    .filter((s): s is SourceLink => s !== null);
}

/**
 * Inline links, `[якорь](https://…)`.
 *
 * This is the part that has bitten us before: a half-done implementation once
 * shipped `[текст](url)` to readers as literal brackets on six live pages. The
 * regex therefore requires a complete, well-formed pair — anything malformed
 * stays plain text rather than becoming visible punctuation.
 */
const LINK = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g;

export function parseRuns(text: string): TextRun[] {
  const runs: TextRun[] = [];
  let at = 0;
  for (const m of text.matchAll(LINK)) {
    const start = m.index ?? 0;
    if (start > at) runs.push({ text: text.slice(at, start) });
    runs.push({ text: m[1], href: m[2] });
    at = start + m[0].length;
  }
  if (at < text.length) runs.push({ text: text.slice(at) });
  return runs.length ? runs : [{ text }];
}

/**
 * The long sections. Paragraphs are separated by a blank line; a line opening
 * with `## ` or `### ` is a heading. No other markup — the field is for prose,
 * and every extra construct is one more thing that can render wrong.
 */
export function parseBody(raw?: string): BodyBlock[] {
  if (!raw) return [];
  const blocks: BodyBlock[] = [];
  // Walked line by line, never chunk by chunk: a heading and the paragraph
  // under it are normally typed with a single newline between them, and
  // treating the whole chunk as a heading swallowed the paragraph into it.
  for (const chunk of raw.split(/\n\s*\n/)) {
    if (!chunk.trim()) continue;
    let buffer: string[] = [];
    const flush = () => {
      if (!buffer.length) return;
      blocks.push({ kind: 'p', runs: parseRuns(buffer.join(' ')) });
      buffer = [];
    };
    for (const raw of chunk.split('\n')) {
      const row = raw.trim();
      if (!row) continue;
      if (row.startsWith('### ')) { flush(); blocks.push({ kind: 'h3', text: row.slice(4).trim() }); }
      else if (row.startsWith('## ')) { flush(); blocks.push({ kind: 'h2', text: row.slice(3).trim() }); }
      else buffer.push(row);
    }
    flush();
  }
  return blocks;
}

/** How many words a page carries — used by the admin list to flag thin ones. */
export function countWords(...parts: (string | undefined)[]): number {
  return parts.filter(Boolean).join(' ').split(/\s+/).filter(Boolean).length;
}
