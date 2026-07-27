import { notFound } from 'next/navigation';
import { requireAdminPermission } from '@/lib/admin/auth';
import { fetchAdminCalendarEventById } from '@/lib/admin/data';
import { updateCalendarEventAction, deleteCalendarEventAction } from '../actions';
import CalendarEventForm from '../CalendarEventForm';
import DeleteButton from '../../_shared/DeleteButton';

export default async function EditCalendarEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminPermission('calendar');
  const { id } = await params;
  const event = await fetchAdminCalendarEventById(id);
  if (!event) notFound();

  const boundAction = async (formData: FormData) => {
    'use server';
    await updateCalendarEventAction(id, formData);
  };
  const boundDelete = async () => {
    'use server';
    await deleteCalendarEventAction(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-[19px] font-bold">{event.titleRu}</h1>
        <DeleteButton action={boundDelete} confirmMessage={`Удалить событие «${event.titleRu}» безвозвратно? Это действие нельзя отменить.`} />
      </div>
      <CalendarEventForm event={event} action={boundAction} />
    </div>
  );
}
