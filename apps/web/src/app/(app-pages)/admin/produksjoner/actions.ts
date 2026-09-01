'use server';
import { revalidatePath } from 'next/cache';
import { createProduction, updateProduction, deleteProduction } from '@/data/theater/productions';

export async function createProductionAction(formData: FormData) {
  const name = formData.get('name') as string;
  const slug = (formData.get('slug') as string) || name.toLowerCase().replace(/\s+/g, '-');
  const description = (formData.get('description') as string) || undefined;
  await createProduction({ name, slug, description });
  revalidatePath('/admin/produksjoner');
}

export async function updateProductionAction(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const description = (formData.get('description') as string) || undefined;
  await updateProduction(id, { name, description });
  revalidatePath('/admin/produksjoner');
}

export async function deleteProductionAction(id: string) {
  await deleteProduction(id);
  revalidatePath('/admin/produksjoner');
}
