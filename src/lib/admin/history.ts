// Wraps Sanity's own HTTP History API — every write to a document already
// creates a durable revision on Sanity's side (Studio's own "History" panel
// reads the exact same endpoints), so this is a thin client, not a home-grown
// versioning system. https://www.sanity.io/docs/http-reference/history
//
// Known limitation: admin writes all go through the single shared
// SANITY_API_WRITE_TOKEN (not a per-staff token), so the History API's own
// "author" field would show that one shared identity for every edit
// regardless of which admin user actually made it — not reliable enough to
// surface as "who changed this", so it's deliberately left out here rather
// than showing a misleading name.

import { writeClient } from '@/lib/sanity';

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const API_VERSION = 'v2025-02-19';

function historyBase(): string {
  return `https://${PROJECT_ID}.api.sanity.io/${API_VERSION}/data/history/${DATASET}`;
}

export interface HistoryTransaction {
  id: string;
  timestamp: string;
}

export async function fetchDocumentHistory(docId: string, limit = 20): Promise<HistoryTransaction[]> {
  if (!PROJECT_ID || !TOKEN) return [];
  try {
    const url = `${historyBase()}/transactions/${docId}?excludeContent=true&reverse=true&limit=${limit}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` }, cache: 'no-store' });
    if (!res.ok) return [];
    const text = await res.text();
    return text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .map(line => {
        const obj = JSON.parse(line);
        return { id: obj.id as string, timestamp: obj.timestamp as string };
      });
  } catch {
    return [];
  }
}

export async function fetchRevisionContent(docId: string, revisionId: string): Promise<Record<string, unknown> | null> {
  if (!PROJECT_ID || !TOKEN) return null;
  try {
    const url = `${historyBase()}/documents/${docId}?revision=${encodeURIComponent(revisionId)}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` }, cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.documents?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function restoreRevision(docId: string, revisionId: string): Promise<boolean> {
  const content = await fetchRevisionContent(docId, revisionId);
  if (!content) return false;
  const { _id: _ignoredId, _rev: _ignoredRev, _createdAt: _ignoredCreatedAt, _updatedAt: _ignoredUpdatedAt, ...rest } = content;
  await writeClient.createOrReplace({ _id: docId, ...rest } as Record<string, unknown> & { _id: string; _type: string });
  return true;
}
