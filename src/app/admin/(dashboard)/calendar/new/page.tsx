import { requireAdminPermission } from '@/lib/admin/auth';
import { createCalendarEventAction } from '../actions';
import CalendarEventForm from '../CalendarEventForm';

export default async function NewCalendarEventPage() {
  await requireAdminPermission('calendar');

  return (
    <div>
      <h1 className="text-[19px] font-bold mb-6">Новое событие</h1>
      <CalendarEventForm action={createCalendarEventAction} />
    </div>
  );
}
