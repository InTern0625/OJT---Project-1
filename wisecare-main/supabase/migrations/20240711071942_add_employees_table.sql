create table employees (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  employee_number text not null,
  real_description text not null,
  gender text check (gender in ('male', 'female', 'other')) not null,
  civil_status text check (civil_status in ('single', 'married', 'divorced', 'widowed')) not null,
  birth_date date not null,
  age_of_membership integer not null,
  residential_address text not null,
  email text not null,
  telepone_number text not null,
  mobile_number text not null,
  philhealth text not null,
  plan_description text not null,
  policy_number text not null,
  card_number text not null,
  original_effective_date date not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

alter table employees enable row level security;

create policy "allow read for authenticated users"
on employees
for select
using (auth.uid() = auth.uid());

create policy "allow insert for under-writing department"
on employees
for insert
with check (
  exists (
    select 1
    from user_profiles
    where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'under-writing')
  )
);