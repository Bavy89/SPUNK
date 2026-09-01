'use server';
import { revalidatePath } from 'next/cache';
import { createGroup, updateGroup, deleteGroup } from '@/data/theater/groups';

export async function createGroupAction(formData: FormData) {
  const name = formData.get('name') as string;
  const production_id = formData.get('production_id') as string;
  const weekday = (formData.get('weekday') as string) || undefined;
  await createGroup({ name, production_id, weekday });
  revalidatePath('/admin/grupper');
}

export async function updateGroupAction(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const weekday = (formData.get('weekday') as string) || undefined;
  await updateGroup(id, { name, weekday });
  revalidatePath('/admin/grupper');
}

export async function deleteGroupAction(id: string) {
  await deleteGroup(id);
  revalidatePath('/admin/grupper');
}
