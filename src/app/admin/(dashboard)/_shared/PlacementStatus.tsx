/**
 * Состояние баннера или кнопки монеты: одна функция на оба раздела, чтобы
 * фильтр, пилюля и полоса на странице записи считали одинаково.
 */
export type PlacementState = 'stopped' | 'pending' | 'expired' | 'live';

export function placementState(d: { active: boolean; startAt?: string; endAt?: string }): PlacementState {
  if (!d.active) return 'stopped';
  const now = Date.now();
  if (d.endAt && new Date(d.endAt).getTime() < now) return 'expired';
  if (d.startAt && new Date(d.startAt).getTime() > now) return 'pending';
  return 'live';
}

/** Текст строки-подтверждения по параметрам адреса, которые ставит toggle-действие. */
export function noticeText(sp: { toggled?: string; name?: string }, gender: 'm' | 'f'): string | null {
  if (sp.toggled !== 'stopped' && sp.toggled !== 'resumed') return null;
  const noun = gender === 'm' ? 'Баннер' : 'Кнопка';
  const name = sp.name ? ` «${sp.name}»` : '';
  return sp.toggled === 'stopped'
    ? `${noun}${name} ${gender === 'm' ? 'остановлен' : 'остановлена'}. Статистика сохранена.`
    : `${noun}${name} снова на сайте.`;
}

const LABELS: Record<PlacementState, { m: string; f: string }> = {
  live: { m: 'На сайте', f: 'На сайте' },
  stopped: { m: 'Остановлен', f: 'Остановлена' },
  pending: { m: 'Ещё не начался', f: 'Ещё не началась' },
  expired: { m: 'Срок вышел', f: 'Срок вышел' },
};

const TONES: Record<PlacementState, string> = {
  live: 'text-emerald-500 bg-emerald-500/12',
  stopped: 'text-red-400 bg-red-500/12',
  pending: 'text-amber-500 bg-amber-500/14',
  expired: 'text-amber-500 bg-amber-500/14',
};

export default function PlacementStatus({
  doc,
  gender,
}: {
  doc: { active: boolean; startAt?: string; endAt?: string };
  /** Баннер — он, кнопка — она. */
  gender: 'm' | 'f';
}) {
  const state = placementState(doc);
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11.5px] font-bold ${TONES[state]}`}>
      <span className="w-[7px] h-[7px] rounded-full bg-current" aria-hidden="true" />
      {LABELS[state][gender]}
    </span>
  );
}
