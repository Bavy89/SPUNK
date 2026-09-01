'use server';
import { createSupabaseClient } from '@/supabase-clients/server';

export async function getAllProductions() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('productions')
    .select('id, name, slug, description, created_at')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createProduction(input: {
  name: string;
  slug: string;
  description?: string;
}) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('productions')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduction(id: string, input: {
  name?: string;
  slug?: string;
  description?: string;
}) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('productions')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduction(id: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.from('productions').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
