'use server';
import { revalidatePath } from 'next/cache';
import { createEvent, updateEvent, deleteEvent } from '@/data/theater/events';

type EventType = 'rehearsal' | 'performance' | 'other';

function toEventType(val: string | null): EventType {
  if (val === 'performance' || val === 'rehearsal') return val;
  return 'other';
}

export async function createEventAction(formData: FormData) {
  const production_id = formData.get('production_id') as string;
  const title = (formData.get('title') as string) || undefined;
  const type = toEventType(formData.get('type') as string);
  const starts_at = formData.get('starts_at') as string;
  const ends_at = (formData.get('ends_at') as string) || undefined;
  const location = (formData.get('location') as string) || undefined;
  const comment = (formData.get('comment') as string) || undefined;

  await createEvent({ production_id, title, type, starts_at, ends_at, location, comment });
  revalidatePath('/admin/hendelser');
  revalidatePath('/oversikt');
  revalidatePath('/dashboard');
}

export async function updateEventAction(id: string, formData: FormData) {
  const title = (formData.get('title') as string) || undefined;
  const type = toEventType(formData.get('type') as string);
  const starts_at = formData.get('starts_at') as string;
  const ends_at = (formData.get('ends_at') as string) || undefined;
  const location = (formData.get('location') as string) || undefined;
  const comment = (formData.get('comment') as string) || undefined;

  await updateEvent(id, { title, type: type as EventType, starts_at, ends_at, location, comment });
  revalidatePath('/admin/hendelser');
  revalidatePath('/oversikt');
  revalidatePath('/dashboard');
}

export async function deleteEventAction(id: string) {
  await deleteEvent(id);
  revalidatePath('/admin/hendelser');
  revalidatePath('/oversikt');
  revalidatePath('/dashboard');
}
