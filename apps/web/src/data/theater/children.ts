'use server';
import { createSupabaseClient } from '@/supabase-clients/server';

export async function getChildProfile(id: string) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('children')
    .select(`
      id,
      display_name,
      child_groups(
        group:groups(id, name, weekday, production_id,
          production:productions(id, name)
        )
      ),
      castings(
        cast_slot,
        character:characters(id, name, category, production_id,
          production:productions(id, name)
        )
      )
    `)
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function getChildEvents(id: string, productionId: string) {
  const supabase = await createSupabaseClient();

  // Hent gruppene barnet er med i for denne produksjonen
  const { data: groupData } = await supabase
    .from('child_groups')
    .select('group_id, group:groups!inner(production_id)')
    .eq('child_id', id)
    .eq('group.production_id', productionId);

  const groupIds = (groupData ?? []).map((g) => g.group_id);

  // Hent karakterene barnet spiller i denne produksjonen
  const { data: castData } = await supabase
    .from('castings')
    .select('character_id, character:characters!inner(production_id)')
    .eq('child_id', id)
    .eq('character.production_id', productionId);

  const charIds = (castData ?? []).map((c) => c.character_id);

  // Hent events koblet til barnets grupper
  const { data: groupEvents } = groupIds.length > 0
    ? await supabase
        .from('event_groups')
        .select('event:events(id, title, type, starts_at, ends_at, location, raw_note, comment)')
        .in('group_id', groupIds)
        .eq('event.production_id', productionId)
    : { data: [] };

  // Hent events koblet til barnets karakterer
  const { data: charEvents } = charIds.length > 0
    ? await supabase
        .from('event_characters')
        .select('event:events(id, title, type, starts_at, ends_at, location, raw_note, comment)')
        .in('character_id', charIds)
        .eq('event.production_id', productionId)
    : { data: [] };

  // Slå sammen og dedupliser
  const eventMap = new Map<string, {
    id: string; title: string | null; type: string;
    starts_at: string; ends_at: string | null;
    location: string | null; raw_note: string | null; comment: string | null;
  }>();

  for (const row of [...(groupEvents ?? []), ...(charEvents ?? [])]) {
    const e = row.event as typeof eventMap extends Map<string, infer V> ? V : never;
    if (e && e.id) eventMap.set(e.id, e);
  }

  return Array.from(eventMap.values()).sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
  );
}

export async function getAllChildren() {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('children')
    .select('id, display_name, created_at, child_groups(group:groups(id, name))')
    .order('display_name');
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createChild(input: { display_name: string }) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('children')
    .insert(input)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateChild(id: string, input: { display_name?: string }) {
  const supabase = await createSupabaseClient();
  const { data, error } = await supabase
    .from('children')
    .update(input)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteChild(id: string) {
  const supabase = await createSupabaseClient();
  const { error } = await supabase.from('children').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
