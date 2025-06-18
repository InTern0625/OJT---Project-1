create table activity_logs (
  id bigserial primary key,
  user_id uuid references auth.users,
  table_name text,
  action text,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table activity_logs enable row level security;

create policy "Allow admin users to write activity logs"
on activity_logs
for insert
to authenticated
with check (
  exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
);

create policy "Allow admin users to read activity logs"
on activity_logs
for select
to authenticated
using (
  exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
);

create or replace function log_types_activity()
returns trigger as $$
begin
  insert into activity_logs (user_id, table_name, action, description)
  values (auth.uid(), TG_TABLE_NAME, TG_OP, 
    case 
      when TG_OP = 'INSERT' then 'Created ' || NEW.name || ' on ' || TG_TABLE_NAME
      when TG_OP = 'UPDATE' then 'Updated ' || TG_TABLE_NAME || ' from ' || OLD.name || ' to ' || NEW.name
      when TG_OP = 'DELETE' then 'Deleted '|| OLD.name || ' on ' || TG_TABLE_NAME
      else TG_OP
    end);
  return new;
end;
$$ language plpgsql;

create trigger log_hmo_provider_activity
after insert or update or delete on hmo_providers
for each row execute function log_types_activity();

create trigger log_mode_of_payment_activity
after insert or update or delete on mode_of_payments
for each row execute function log_types_activity();

create trigger log_mode_of_premium_activity
after insert or update or delete on mode_of_premium
for each row execute function log_types_activity();

create trigger log_plan_type_activity
after insert or update or delete on plan_types
for each row execute function log_types_activity();

create trigger log_account_type_activity
after insert or update or delete on account_types
for each row execute function log_types_activity();


-- -- USER PROFILES
-- create or replace function log_user_profiles_activity()
-- returns trigger as $$
-- begin
--   insert into activity_logs (user_id, table_name, action)
--   values ((select user_id from user_profiles where user_id = new.id), TG_TABLE_NAME, TG_OP);
--   return new;
-- end;
-- $$ language plpgsql;

-- create trigger log_user_profiles_activity
-- after insert or update or delete on user_profiles
-- for each row execute function log_user_profiles_activity();