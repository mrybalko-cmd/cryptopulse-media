export function getGoogleCalendarUrl(title: string, description: string, dateISO: string, sourceUrl?: string | null) {
  const date = new Date(dateISO);
  const startStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const endDate = new Date(date);
  endDate.setUTCDate(endDate.getUTCDate() + 1);
  const endStr = endDate.toISOString().slice(0, 10).replace(/-/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${startStr}/${endStr}`,
    details: sourceUrl ? `${description}\n\n${sourceUrl}` : description,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
