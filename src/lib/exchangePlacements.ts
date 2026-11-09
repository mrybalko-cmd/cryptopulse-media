/**
 * Платные размещения площадки. Каждое включается отдельно, у каждого свой срок
 * и своя ссылка, и ни одно из них не влияет на место в рейтинге: номер считает
 * только rankExchanges, по обороту.
 */

export type VenueButtonColor = 'violet' | 'orange' | 'green';

export const VENUE_BUTTON_COLORS: { value: VenueButtonColor; label: string }[] = [
  { value: 'violet', label: 'Фиолетовый' },
  { value: 'orange', label: 'Оранжевый' },
  { value: 'green', label: 'Зелёный' },
];

export function venueButtonColor(value: string | null | undefined): VenueButtonColor {
  return value === 'orange' || value === 'green' ? value : 'violet';
}

export interface VenuePlacements {
  extendedTradeUrl?: string | null;
  tradeUrl?: string | null;
  tradeUntil?: string | null;
  extendedEnabled?: boolean | null;
  extendedUntil?: string | null;
  adEnabled?: boolean | null;
  adUntil?: string | null;
  adUrl?: string | null;
}

/** Срок необязателен: пустой значит «пока не выключат вручную». */
function withinTerm(until: string | null | undefined): boolean {
  return !until || new Date(until).getTime() >= Date.now();
}

/** Партнёрская ссылка кнопки в таблице, если её срок не истёк. Иначе «Подробнее». */
export function activeTradeUrl(venue: VenuePlacements): string | null {
  return venue.tradeUrl && withinTerm(venue.tradeUntil) ? venue.tradeUrl : null;
}

export function hasExtendedProfile(venue: VenuePlacements): boolean {
  return Boolean(venue.extendedEnabled) && withinTerm(venue.extendedUntil);
}

/** Рекламный блок без своей ссылки не показывается: ему некуда вести. */
export function hasActiveAd(venue: VenuePlacements): boolean {
  return Boolean(venue.adEnabled && venue.adUrl) && withinTerm(venue.adUntil);
}

/** Факты расширенного профиля вводятся одной строкой через запятую, на странице их до трёх. */
export function extendedFacts(raw: string | null | undefined): string[] {
  return (raw ?? '').split(',').map(fact => fact.trim()).filter(Boolean).slice(0, 3);
}

/** Кнопка «Торговать» в шапке профиля: у расширенного профиля своя ссылка, иначе общая. */
export function profileTradeUrl(venue: VenuePlacements): string | null {
  return (hasExtendedProfile(venue) && venue.extendedTradeUrl) || activeTradeUrl(venue);
}

/** «Как начать» вводится строками: «Регистрация | Почта или телефон». */
export function extendedSteps(raw: string | null | undefined): { title: string; note: string }[] {
  return (raw ?? '')
    .split('\n')
    .map(line => {
      const [title, ...note] = line.split('|');
      return { title: title.trim(), note: note.join('|').trim() };
    })
    .filter(step => step.title)
    .slice(0, 6);
}

/** Вопросы разделены пустой строкой: первая строка вопрос, остальные ответ. Вопрос без ответа не показываем. */
export function extendedFaq(raw: string | null | undefined): { question: string; answer: string }[] {
  return (raw ?? '')
    .split(/\n\s*\n/)
    .map(block => {
      const [question, ...answer] = block.trim().split('\n');
      return { question: (question ?? '').trim(), answer: answer.join('\n').trim() };
    })
    .filter(item => item.question && item.answer);
}
