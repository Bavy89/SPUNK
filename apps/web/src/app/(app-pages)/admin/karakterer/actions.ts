'use server';
import { revalidatePath } from 'next/cache';
import { createCharacter, updateCharacter, deleteCharacter } from '@/data/theater/characters';

export async function createCharacterAction(formData: FormData) {
  const name = formData.get('name') as string;
  const production_id = formData.get('production_id') as string;
  const category = (formData.get('category') as string) || undefined;
  await createCharacter({ name, production_id, category });
  revalidatePath('/admin/karakterer');
}

export async function updateCharacterAction(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const category = (formData.get('category') as string) || undefined;
  await updateCharacter(id, { name, category });
  revalidatePath('/admin/karakterer');
}

export async function deleteCharacterAction(id: string) {
  await deleteCharacter(id);
  revalidatePath('/admin/karakterer');
}
