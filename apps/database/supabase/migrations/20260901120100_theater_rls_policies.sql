-- ============================================================
-- Theater domain — RLS policies (villekulla schema)
-- ============================================================

alter table villekulla.profiles enable row level security;
alter table villekulla.productions enable row level security;
alter table villekulla.groups enable row level security;
alter table villekulla.characters enable row level security;
alter table villekulla.children enable row level security;
alter table villekulla.child_aliases enable row level security;
alter table villekulla.guardians enable row level security;
alter table villekulla.child_groups enable row level security;
alter table villekulla.castings enable row level security;
alter table villekulla.scenes enable row level security;
alter table villekulla.scene_characters enable row level security;
alter table villekulla.events enable row level security;
alter table villekulla.event_characters enable row level security;
alter table villekulla.event_groups enable row level security;
alter table villekulla.event_children enable row level security;
alter table villekulla.performance_casts enable row level security;

create or replace function villekulla.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_admin from villekulla.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function villekulla.is_admin() to anon, authenticated, service_role;

-- profiles
drop policy if exists "profiles: self read" on villekulla.profiles;
create policy "profiles: self read" on villekulla.profiles
  for select using (auth.uid() = id or villekulla.is_admin());
drop policy if exists "profiles: self update" on villekulla.profiles;
create policy "profiles: self update" on villekulla.profiles
  for update using (auth.uid() = id);

-- productions
drop policy if exists "productions: read all" on villekulla.productions;
create policy "productions: read all" on villekulla.productions for select using (auth.role() = 'authenticated');
drop policy if exists "productions: admin write" on villekulla.productions;
create policy "productions: admin write" on villekulla.productions for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- groups
drop policy if exists "groups: read all" on villekulla.groups;
create policy "groups: read all" on villekulla.groups for select using (auth.role() = 'authenticated');
drop policy if exists "groups: admin write" on villekulla.groups;
create policy "groups: admin write" on villekulla.groups for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- characters
drop policy if exists "characters: read all" on villekulla.characters;
create policy "characters: read all" on villekulla.characters for select using (auth.role() = 'authenticated');
drop policy if exists "characters: admin write" on villekulla.characters;
create policy "characters: admin write" on villekulla.characters for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- children
drop policy if exists "children: read all" on villekulla.children;
create policy "children: read all" on villekulla.children for select using (auth.role() = 'authenticated');
drop policy if exists "children: admin write" on villekulla.children;
create policy "children: admin write" on villekulla.children for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- child_aliases
drop policy if exists "child_aliases: read all" on villekulla.child_aliases;
create policy "child_aliases: read all" on villekulla.child_aliases for select using (auth.role() = 'authenticated');
drop policy if exists "child_aliases: admin write" on villekulla.child_aliases;
create policy "child_aliases: admin write" on villekulla.child_aliases for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- guardians
drop policy if exists "guardians: read own or admin" on villekulla.guardians;
create policy "guardians: read own or admin" on villekulla.guardians
  for select using (auth.uid() = user_id or villekulla.is_admin());
drop policy if exists "guardians: admin write" on villekulla.guardians;
create policy "guardians: admin write" on villekulla.guardians
  for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- child_groups
drop policy if exists "child_groups: read all" on villekulla.child_groups;
create policy "child_groups: read all" on villekulla.child_groups for select using (auth.role() = 'authenticated');
drop policy if exists "child_groups: admin write" on villekulla.child_groups;
create policy "child_groups: admin write" on villekulla.child_groups for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- castings
drop policy if exists "castings: read all" on villekulla.castings;
create policy "castings: read all" on villekulla.castings for select using (auth.role() = 'authenticated');
drop policy if exists "castings: admin write" on villekulla.castings;
create policy "castings: admin write" on villekulla.castings for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- scenes
drop policy if exists "scenes: read all" on villekulla.scenes;
create policy "scenes: read all" on villekulla.scenes for select using (auth.role() = 'authenticated');
drop policy if exists "scenes: admin write" on villekulla.scenes;
create policy "scenes: admin write" on villekulla.scenes for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- scene_characters
drop policy if exists "scene_characters: read all" on villekulla.scene_characters;
create policy "scene_characters: read all" on villekulla.scene_characters for select using (auth.role() = 'authenticated');
drop policy if exists "scene_characters: admin write" on villekulla.scene_characters;
create policy "scene_characters: admin write" on villekulla.scene_characters for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- events
drop policy if exists "events: read all" on villekulla.events;
create policy "events: read all" on villekulla.events for select using (auth.role() = 'authenticated');
drop policy if exists "events: admin write" on villekulla.events;
create policy "events: admin write" on villekulla.events for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- event_characters
drop policy if exists "event_characters: read all" on villekulla.event_characters;
create policy "event_characters: read all" on villekulla.event_characters for select using (auth.role() = 'authenticated');
drop policy if exists "event_characters: admin write" on villekulla.event_characters;
create policy "event_characters: admin write" on villekulla.event_characters for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- event_groups
drop policy if exists "event_groups: read all" on villekulla.event_groups;
create policy "event_groups: read all" on villekulla.event_groups for select using (auth.role() = 'authenticated');
drop policy if exists "event_groups: admin write" on villekulla.event_groups;
create policy "event_groups: admin write" on villekulla.event_groups for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- event_children
drop policy if exists "event_children: read all" on villekulla.event_children;
create policy "event_children: read all" on villekulla.event_children for select using (auth.role() = 'authenticated');
drop policy if exists "event_children: admin write" on villekulla.event_children;
create policy "event_children: admin write" on villekulla.event_children for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- performance_casts
drop policy if exists "performance_casts: read all" on villekulla.performance_casts;
create policy "performance_casts: read all" on villekulla.performance_casts for select using (auth.role() = 'authenticated');
drop policy if exists "performance_casts: admin write" on villekulla.performance_casts;
create policy "performance_casts: admin write" on villekulla.performance_casts for all using (villekulla.is_admin()) with check (villekulla.is_admin());

-- ============================================================
-- Trigger: opprett profiles-rad automatisk ved signup
-- ============================================================
create or replace function villekulla.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into villekulla.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_villekulla on auth.users;
create trigger on_auth_user_created_villekulla
  after insert on auth.users
  for each row execute procedure villekulla.handle_new_user();
