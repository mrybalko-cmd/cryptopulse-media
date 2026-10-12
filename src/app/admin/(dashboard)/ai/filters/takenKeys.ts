import type { AdminAiJob } from '@/lib/admin/aiData';

/**
 * Где какой ключ признака уже занят.
 *
 * Один ключ не должен значить разное в двух группах: карточки помечаются
 * именно ключом, и «4k» в видео и «4k» в изображениях отбирали бы друг друга.
 * Форма показывает, в какой задаче ключ уже живёт, — так редактор понимает,
 * что делать, вместо того чтобы подбирать свободное имя наугад.
 *
 * Своя задача исключается: её собственные ключи не конфликт, а то, что
 * редактор прямо сейчас правит.
 */
export function collectTakenKeys(jobs: AdminAiJob[], exceptId?: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const job of jobs) {
    if (job._id === exceptId) continue;
    for (const g of job.facetGroups) {
      for (const f of g.items) {
        if (!out[f.key]) out[f.key] = `${job.nameRu || job.slug} · ${g.titleRu}`;
      }
    }
  }
  return out;
}
