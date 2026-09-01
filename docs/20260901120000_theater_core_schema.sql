-- ============================================================
-- Theater domain — core schema
-- NB: Sjekk om `profiles` allerede finnes fra nextbase-starteren.
-- Hvis den gjør det: fjern `create table profiles` under og legg
-- heller `is_admin` til i en ALTER TABLE-migrasjon mot den eksisterende.
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- Profiler / admin-flagg ----------
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------- Produksjoner (Trollmannen, Luciakoret, ...) ----------
create table if not exists productions (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

-- ---------- Grupper / partier ----------
create table if not exists groups (
  id uuid primary key default gen_random_uuid(),
  production_id uuid not null references productions(id) on delete cascade,
  name text not null,
  weekday text,
  created_at timestamptz not null default now(),
  unique (production_id, name)
);

-- ---------- Karakterer / roller ----------
create table if not exists characters (
  id uuid primary key default gen_random_uuid(),
  production_id uuid not null references productions(id) on delete cascade,
  name text not null,
  category text,
  created_at timestamptz not null default now(),
  unique (production_id, name)
);

-- ---------- Barn (kanonisk) ----------
create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists child_aliases (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  alias text not null,
  unique (alias)
);

-- ---------- Foresatte ↔ barn ----------
create table if not exists guardians (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  relationship text,
  created_at timestamptz not null default now(),
  unique (user_id, child_id)
);

-- ---------- Barn ↔ gruppe/parti ----------
create table if not exists child_groups (
  child_id uuid not null references children(id) on delete cascade,
  group_id uuid not null references groups(id) on delete cascade,
  primary key (child_id, group_id)
);

-- ---------- Casting: barn ↔ karakter ----------
create table if not exists castings (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references characters(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  cast_slot text not null default 'A',
  created_at timestamptz not null default now(),
  unique (character_id, child_id)
);

-- ---------- Scener ----------
create table if not exists scenes (
  id uuid primary key default gen_random_uuid(),
  production_id uuid not null references productions(id) on delete cascade,
  act text,
  scene_number text not null,
  title text,
  page_number int,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists scene_characters (
  scene_id uuid not null references scenes(id) on delete cascade,
  character_id uuid not null references characters(id) on delete cascade,
  primary key (scene_id, character_id)
);

-- ---------- Hendelser: øvelser og forestillinger ----------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_type') then
    create type event_type as enum ('rehearsal', 'performance', 'other');
  end if;
end $$;

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  production_id uuid not null references productions(id) on delete cascade,
  type event_type not null default 'rehearsal',
  starts_at timestamptz not null,
  ends_at timestamptz,
  location text,
  title text,
  raw_note text,
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists event_characters (
  event_id uuid not null references events(id) on delete cascade,
  character_id uuid not null references characters(id) on delete cascade,
  primary key (event_id, character_id)
);

create table if not exists event_groups (
  event_id uuid not null references events(id) on delete cascade,
  group_id uuid not null references groups(id) on delete cascade,
  primary key (event_id, group_id)
);

create table if not exists event_children (
  event_id uuid not null references events(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  note text,
  primary key (event_id, child_id)
);

-- ---------- Forestillingscast: rolle -> barn per forestillingsdato ----------
create table if not exists performance_casts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events(id) on delete cascade,
  character_id uuid not null references characters(id) on delete cascade,
  child_id uuid not null references children(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, character_id)
);

-- ---------- Indekser ----------
create index if not exists idx_events_production_starts on events(production_id, starts_at);
create index if not exists idx_castings_child on castings(child_id);
create index if not exists idx_child_groups_child on child_groups(child_id);
create index if not exists idx_performance_casts_child on performance_casts(child_id);
create index if not exists idx_event_children_child on event_children(child_id);

-- ---------- View: barnets samlede kalender ----------
create or replace view child_schedule as
  select
    c.id as child_id,
    e.id as event_id,
    e.production_id,
    e.type,
    e.starts_at,
    e.ends_at,
    e.location,
    e.title,
    e.comment,
    ch.name as character_name,
    null::text as group_name,
    'character'::text as source
  from castings cast_row
  join children c on c.id = cast_row.child_id
  join characters ch on ch.id = cast_row.character_id
  join event_characters ec on ec.character_id = ch.id
  join events e on e.id = ec.event_id

  union all

  select
    c.id as child_id,
    e.id as event_id,
    e.production_id,
    e.type,
    e.starts_at,
    e.ends_at,
    e.location,
    e.title,
    e.comment,
    null::text as character_name,
    g.name as group_name,
    'group'::text as source
  from child_groups cg
  join children c on c.id = cg.child_id
  join groups g on g.id = cg.group_id
  join event_groups eg on eg.group_id = g.id
  join events e on e.id = eg.event_id

  union all

  select
    ec2.child_id,
    e.id as event_id,
    e.production_id,
    e.type,
    e.starts_at,
    e.ends_at,
    e.location,
    e.title,
    coalesce(e.comment, '') || case when ec2.note is not null then ' (' || ec2.note || ')' else '' end as comment,
    null::text as character_name,
    null::text as group_name,
    'direct'::text as source
  from event_children ec2
  join events e on e.id = ec2.event_id;

-- ---------- View: barnets rolle på en forestillingsdato ----------
create or replace view child_performance_roles as
  select
    pc.child_id,
    pc.event_id,
    e.starts_at,
    ch.name as character_name,
    e.location
  from performance_casts pc
  join events e on e.id = pc.event_id
  join characters ch on ch.id = pc.character_id;
