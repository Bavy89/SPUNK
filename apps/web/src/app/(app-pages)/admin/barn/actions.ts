'use server';
import { revalidatePath } from 'next/cache';
import { createChild, updateChild, deleteChild } from '@/data/theater/children';

export async function createChildAction(formData: FormData) {
  const display_name = formData.get('display_name') as string;
  await createChild({ display_name });
  revalidatePath('/admin/barn');
}

export async function updateChildAction(id: string, formData: FormData) {
  const display_name = formData.get('display_name') as string;
  await updateChild(id, { display_name });
  revalidatePath('/admin/barn');
}

export async function deleteChildAction(id: string) {
  await deleteChild(id);
  revalidatePath('/admin/barn');
}
