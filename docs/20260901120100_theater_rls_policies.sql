-- ============================================================
-- Theater domain — RLS policies
-- Kjøres etter 20260901120000_theater_core_schema.sql
-- ============================================================

alter table profiles enable row level security;
alter table productions enable row level security;
alter table groups enable row level security;
alter table characters enable row level security;
alter table children enable row level security;
alter table child_aliases enable row level security;
alter table guardians enable row level security;
alter table child_groups enable row level security;
alter table castings enable row level security;
alter table scenes enable row level security;
alter table scene_characters enable row level security;
alter table events enable row level security;
alter table event_characters enable row level security;
alter table event_groups enable row level security;
alter table event_children enable row level security;
alter table performance_casts enable row level security;

create or replace function is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_admin from profiles where id = auth.uid()),
    false
  );
$$;

-- profiles
drop policy if exists "profiles: self read" on profiles;
create policy "profiles: self read" on profiles
  for select using (auth.uid() = id or is_admin());
drop policy if exists "profiles: self update" on profiles;
create policy "profiles: self update" on profiles
  for update using (auth.uid() = id);

-- productions
drop policy if exists "productions: read all" on productions;
create policy "productions: read all" on productions for select using (auth.role() = 'authenticated');
drop policy if exists "productions: admin write" on productions;
create policy "productions: admin write" on productions for all using (is_admin()) with check (is_admin());

-- groups
drop policy if exists "groups: read all" on groups;
create policy "groups: read all" on groups for select using (auth.role() = 'authenticated');
drop policy if exists "groups: admin write" on groups;
create policy "groups: admin write" on groups for all using (is_admin()) with check (is_admin());

-- characters
drop policy if exists "characters: read all" on characters;
create policy "characters: read all" on characters for select using (auth.role() = 'authenticated');
drop policy if exists "characters: admin write" on characters;
create policy "characters: admin write" on characters for all using (is_admin()) with check (is_admin());

-- children
drop policy if exists "children: read all" on children;
create policy "children: read all" on children for select using (auth.role() = 'authenticated');
drop policy if exists "children: admin write" on children;
create policy "children: admin write" on children for all using (is_admin()) with check (is_admin());

-- child_aliases
drop policy if exists "child_aliases: read all" on child_aliases;
create policy "child_aliases: read all" on child_aliases for select using (auth.role() = 'authenticated');
drop policy if exists "child_aliases: admin write" on child_aliases;
create policy "child_aliases: admin write" on child_aliases for all using (is_admin()) with check (is_admin());

-- guardians
drop policy if exists "guardians: read own or admin" on guardians;
create policy "guardians: read own or admin" on guardians
  for select using (auth.uid() = user_id or is_admin());
drop policy if exists "guardians: admin write" on guardians;
create policy "guardians: admin write" on guardians
  for all using (is_admin()) with check (is_admin());

-- child_groups
drop policy if exists "child_groups: read all" on child_groups;
create policy "child_groups: read all" on child_groups for select using (auth.role() = 'authenticated');
drop policy if exists "child_groups: admin write" on child_groups;
create policy "child_groups: admin write" on child_groups for all using (is_admin()) with check (is_admin());

-- castings
drop policy if exists "castings: read all" on castings;
create policy "castings: read all" on castings for select using (auth.role() = 'authenticated');
drop policy if exists "castings: admin write" on castings;
create policy "castings: admin write" on castings for all using (is_admin()) with check (is_admin());

-- scenes
drop policy if exists "scenes: read all" on scenes;
create policy "scenes: read all" on scenes for select using (auth.role() = 'authenticated');
drop policy if exists "scenes: admin write" on scenes;
create policy "scenes: admin write" on scenes for all using (is_admin()) with check (is_admin());

-- scene_characters
drop policy if exists "scene_characters: read all" on scene_characters;
create policy "scene_characters: read all" on scene_characters for select using (auth.role() = 'authenticated');
drop policy if exists "scene_characters: admin write" on scene_characters;
create policy "scene_characters: admin write" on scene_characters for all using (is_admin()) with check (is_admin());

-- events
drop policy if exists "events: read all" on events;
create policy "events: read all" on events for select using (auth.role() = 'authenticated');
drop policy if exists "events: admin write" on events;
create policy "events: admin write" on events for all using (is_admin()) with check (is_admin());

-- event_characters
drop policy if exists "event_characters: read all" on event_characters;
create policy "event_characters: read all" on event_characters for select using (auth.role() = 'authenticated');
drop policy if exists "event_characters: admin write" on event_characters;
create policy "event_characters: admin write" on event_characters for all using (is_admin()) with check (is_admin());

-- event_groups
drop policy if exists "event_groups: read all" on event_groups;
create policy "event_groups: read all" on event_groups for select using (auth.role() = 'authenticated');
drop policy if exists "event_groups: admin write" on event_groups;
create policy "event_groups: admin write" on event_groups for all using (is_admin()) with check (is_admin());

-- event_children
drop policy if exists "event_children: read all" on event_children;
create policy "event_children: read all" on event_children for select using (auth.role() = 'authenticated');
drop policy if exists "event_children: admin write" on event_children;
create policy "event_children: admin write" on event_children for all using (is_admin()) with check (is_admin());

-- performance_casts
drop policy if exists "performance_casts: read all" on performance_casts;
create policy "performance_casts: read all" on performance_casts for select using (auth.role() = 'authenticated');
drop policy if exists "performance_casts: admin write" on performance_casts;
create policy "performance_casts: admin write" on performance_casts for all using (is_admin()) with check (is_admin());

-- ============================================================
-- Trigger: opprett profiles-rad automatisk ved signup.
-- NB: Hvis nextbase-starteren allerede har en tilsvarende trigger/funksjon
-- for `profiles`, IKKE opprett denne på nytt — utvid heller den eksisterende
-- funksjonen til også å sette `is_admin` (default false er allerede fint).
-- ============================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
