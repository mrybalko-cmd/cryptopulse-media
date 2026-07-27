import { formatPragueDateTime } from '@/lib/admin/timezone';

export function formatDateTime(iso?: string): string {
  return formatPragueDateTime(iso);
}
