create table departments (
  id serial primary key,
  name text
);
alter table departments enable row level security;

create policy "user can see departments"
on departments
for select
to authenticated
using (true);

-- insert departments
insert into departments (name) values ('marketing'), ('after-sales'), ('under-writing'), ('finance'), ('admin'), ('agent');

create table user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade not null,
  first_name varchar(255),
  last_name varchar(255),
  email varchar(255),
  department_id integer references departments(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- create unique index user_profiles_user_id_idx on user_profiles(user_id);

-- enable rls
alter table user_profiles enable row level security;

create policy "user can see user profiles"
on user_profiles
for select
to authenticated
using (true);

-- function to create new user_profile when a new user is created
create or replace function public.create_user_profile()
  returns trigger as $$
  begin
    insert into public.user_profiles (user_id, first_name, last_name, email, department_id)
    values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.email, (select id from public.departments where name = new.raw_user_meta_data->>'department'));
    return new;
  end;
$$ language plpgsql security definer;

create trigger create_user_profile
  after insert on auth.users
  for each row
  execute function public.create_user_profile();