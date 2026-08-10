import { client, writeClient } from '@/lib/sanity';
import type { AdminSession } from './permissions';

export interface ActivityLogEntry {
  action: 'delete' | 'unpublish' | 'republish' | 'permissions_changed' | 'user_created';
  entityType: string;
  entityTitle: string;
  entityId?: string;
}

export async function logActivity(session: AdminSession, entry: ActivityLogEntry): Promise<void> {
  try {
    await writeClient.create({
      _type: 'adminActivityLog',
      action: entry.action,
      entityType: entry.entityType,
      entityTitle: entry.entityTitle,
      entityId: entry.entityId,
      adminName: session.name,
      adminEmail: session.email,
      timestamp: new Date().toISOString(),
    });
  } catch {
    // best-effort — a missed log entry should never block the actual action
  }
}

export interface AdminActivityLogItem {
  _id: string;
  action: string;
  entityType: string;
  entityTitle: string;
  entityId?: string;
  adminName: string;
  adminEmail: string;
  timestamp: string;
}

export async function fetchActivityLog(limit = 50): Promise<AdminActivityLogItem[]> {
  return client.fetch(
    `*[_type == "adminActivityLog"] | order(timestamp desc) [0...${limit}]{
      _id, action, entityType, entityTitle, entityId, adminName, adminEmail, timestamp
    }`
  );
}
