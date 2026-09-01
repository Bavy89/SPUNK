'use server';
import { createSupabaseClient } from '@/supabase-clients/server';

export async function getUpcomingEvents(limit = 5) {
  const supabase = await createSupabaseClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('events')
    .select(`
      id, title, type, starts_at, ends_at, location, comment,
      production:productions(id, name, slug),
      event_groups(group:groups(id, name)),
      event_characters(character:characters(id, name))
    `)
    .gte('starts_at', now)
    .order('starts_at', { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getAllEvents(productionId?: string) {
  const supabase = await createSupabaseClient();

  let query = supabase
    .from('events')
    .select(`
      id, title, type, starts_at, ends_at, location, comment,
      production:productions(id, name, slug),
      event_groups(group:groups(id, name)),
      event_characters(character:characters(id, name))
    `)
    .order('starts_at', { ascending: true });

  if (productionId) {
    query = query.eq('production_id', productionId);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

type EventType = 'rehearsal' | 'performance' | 'other';

export async function createEvent(input: {
  production_id: string;
  title?: string;
  type?: EventType;
  starts_at: string;
  ends_at?: string;
  location?: string;
  comment?: string;
}) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('events')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateEvent(id: string, input: {
  title?: string;
  type?: EventType;
  starts_at?: string;
  ends_at?: string;
  location?: string;
  comment?: string;
}) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('events')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteEvent(id: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
