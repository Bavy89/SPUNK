'use server';
import { createSupabaseClient } from '@/supabase-clients/server';

export async function getAllGroups(productionId?: string) {
  const supabase = await createSupabaseClient();
  let query = supabase
    .from('groups')
    .select('id, name, weekday, production_id, production:productions(id, name)')
    .order('name');
  if (productionId) query = query.eq('production_id', productionId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createGroup(input: {
  name: string;
  production_id: string;
  weekday?: string;
}) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('groups')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateGroup(id: string, input: {
  name?: string;
  weekday?: string;
}) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('groups')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteGroup(id: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.from('groups').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
