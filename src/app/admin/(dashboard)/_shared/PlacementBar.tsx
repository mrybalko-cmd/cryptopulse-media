import { formatPragueDateTime } from '@/lib/admin/timezone';
import { PlacementToggleButton } from './PlacementToggle';
import PlacementStatus, { placementState } from './PlacementStatus';

/**
 * Полоса над формой баннера или кнопки монеты: статус, что с ним сейчас
 * происходит на сайте, и кнопка «Остановить / Возобновить показ».
 */
export default function PlacementBar({
  doc,
  gender,
  stats,
  action,
  name,
  back,
}: {
  doc: { _id: string; active: boolean; startAt?: string; endAt?: string; stoppedAt?: string };
  gender: 'm' | 'f';
  /** «12 904 показа и 77 кликов» — то, что сохраняется при остановке. */
  stats: string;
  action: (formData: FormData) => Promise<void>;
  name: string;
  back: string;
}) {
  const state = placementState(doc);
  const it = gender === 'm' ? 'баннер' : 'кнопка';
  const text =
    state === 'stopped'
      ? `${doc.stoppedAt ? `С ${formatPragueDateTime(doc.stoppedAt)} ` : 'Сейчас '}${it} не показывается на сайте. Набрано ${stats}, эти цифры не обнуляются.`
      : state === 'live'
        ? `Сейчас ${it} на сайте. Набрано ${stats}. После остановки цифры сохранятся.`
        : state === 'pending'
          ? `${gender === 'm' ? 'Баннер включён' : 'Кнопка включена'}, но дата начала ещё не наступила.`
          : `${gender === 'm' ? 'Баннер включён' : 'Кнопка включена'}, но срок показа вышел. Набрано ${stats}.`;

  return (
    <div
      className={`flex flex-wrap items-center gap-3 rounded-xl border px-3.5 py-3 mb-6 ${
        state === 'stopped'
          ? 'border-red-500/30 bg-red-500/8'
          : 'border-[var(--admin-border)] bg-[var(--admin-panel)]'
      }`}
    >
      <PlacementStatus doc={doc} gender={gender} />
      <p className="m-0 flex-[1_1_260px] min-w-0 text-[12.5px] text-[var(--admin-text-secondary)]">{text}</p>
      <form action={action}>
        <input type="hidden" name="id" value={doc._id} />
        <input type="hidden" name="active" value={doc.active ? 'false' : 'true'} />
        <input type="hidden" name="name" value={name} />
        <input type="hidden" name="back" value={back} />
        <PlacementToggleButton active={doc.active} wide />
      </form>
    </div>
  );
}
