/**
 * Где в тексте материала встаёт баннер. Возвращает индекс блока, ПОСЛЕ
 * которого он ставится, или null, если ставить некуда.
 *
 * Правила (утверждены 03.11.2026):
 * - только в промежутке между двумя целыми абзацами или между абзацем и
 *   подзаголовком — баннер не разрывает текст;
 * - не между подзаголовком и его абзацем, не внутри списка, не перед
 *   цитатой, картинкой, таблицей или встроенным постом;
 * - основное место — после первого абзаца длиной от 180 знаков среди первых
 *   трёх блоков; нет такого — после первого абзаца; не подходит промежуток —
 *   к следующему подходящему;
 * - только в первой половине текста и только если абзацев не меньше четырёх.
 */

type Block = {
  _type?: string;
  style?: string;
  listItem?: string;
  children?: Array<{ text?: string }>;
};

const LONG_PARAGRAPH = 180;
const MIN_PARAGRAPHS = 4;
const HEADINGS = new Set(['h2', 'h3', 'h4', 'h5', 'h6']);

const isParagraph = (b: Block | undefined) =>
  !!b && b._type === 'block' && (!b.style || b.style === 'normal') && !b.listItem;

const isHeading = (b: Block | undefined) =>
  !!b && b._type === 'block' && !b.listItem && HEADINGS.has(b.style ?? '');

const textLength = (b: Block) =>
  (b.children ?? []).reduce((n, c) => n + (c.text?.trim().length ?? 0), 0);

/** Промежуток после body[i] годится: слева абзац, справа абзац или подзаголовок. */
const gapFits = (body: Block[], i: number) =>
  isParagraph(body[i]) && textLength(body[i]) > 0 && (isParagraph(body[i + 1]) || isHeading(body[i + 1]));

export function inlineBannerSlot(body: unknown): number | null {
  if (!Array.isArray(body)) return null;
  const blocks = body as Block[];
  if (blocks.filter(b => isParagraph(b) && textLength(b) > 0).length < MIN_PARAGRAPHS) return null;

  const half = Math.ceil(blocks.length / 2);
  const firstLong = blocks.slice(0, 3).findIndex(b => isParagraph(b) && textLength(b) >= LONG_PARAGRAPH);
  const firstPara = blocks.findIndex(b => isParagraph(b) && textLength(b) > 0);
  const start = firstLong >= 0 ? firstLong : firstPara;
  if (start < 0) return null;

  for (let i = start; i < half; i++) {
    if (gapFits(blocks, i)) return i;
  }
  return null;
}
