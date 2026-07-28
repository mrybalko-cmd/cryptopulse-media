import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAllSubscriberEmails } from '@/lib/admin/data';

function csvField(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

export async function GET(request: Request) {
  await requireAdminPermission('subscribers');

  const { searchParams } = new URL(request.url);
  const statusParam = searchParams.get('status');
  const status = statusParam === 'active' || statusParam === 'inactive' ? statusParam : 'all';
  const localeParam = searchParams.get('locale');
  const locale = localeParam === 'ru' || localeParam === 'en' ? localeParam : undefined;

  const subscribers = await fetchAllSubscriberEmails(status, locale);

  const header = 'email,locale,source,subscribed_at,active';
  const rows = subscribers.map(s =>
    [csvField(s.email), csvField(s.locale), csvField(s.source || ''), csvField(s.subscribedAt), s.active ? 'true' : 'false'].join(',')
  );
  const csv = [header, ...rows].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cryptopulse-subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
