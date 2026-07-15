const HOUR_MS = 60 * 60 * 1000;

// Studio document-list marker so it's obvious at a glance which items are
// actually live on the site vs. still a draft or waiting on a scheduled
// publishedAt — purely derived from fields already on the document, no
// extra query needed per row.
export function publishStatusDot(id: string | undefined, publishedAt: string | undefined): string {
  if (id?.startsWith('drafts.')) return '🔴';
  if (!publishedAt) return '🔴';
  const diff = new Date(publishedAt).getTime() - Date.now();
  if (diff <= 0) return '🟢';
  return diff <= HOUR_MS ? '🟡' : '🔴';
}
