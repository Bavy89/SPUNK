'use server';
import { revalidatePath } from 'next/cache';
import { createSupabaseClient } from '@/supabase-clients/server';

export async function approveUserAction(id: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase
    .from('profiles')
    .update({ is_approved: true })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/brukere');
}

export async function revokeUserAction(id: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase
    .from('profiles')
    .update({ is_approved: false })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath('/admin/brukere');
}
