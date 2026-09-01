'use server';
import { createSupabaseClient } from '@/supabase-clients/server';

export async function getAllCharacters(productionId?: string) {
  const supabase = await createSupabaseClient();
  let query = supabase
    .from('characters')
    .select('id, name, category, production_id, production:productions(id, name)')
    .order('name');
  if (productionId) query = query.eq('production_id', productionId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createCharacter(input: {
  name: string;
  production_id: string;
  category?: string;
}) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('characters')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateCharacter(id: string, input: {
  name?: string;
  category?: string;
}) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('characters')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCharacter(id: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.from('characters').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
