-- Add is_approved to profiles (default false = pending admin approval)
alter table villekulla.profiles
  add column if not exists is_approved boolean not null default false;

-- Admins are always considered approved; regular users need explicit approval
create or replace function villekulla.is_approved()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(
    (select is_approved or is_admin from villekulla.profiles where id = auth.uid()),
    false
  );
$$;

grant execute on function villekulla.is_approved() to anon, authenticated, service_role;
