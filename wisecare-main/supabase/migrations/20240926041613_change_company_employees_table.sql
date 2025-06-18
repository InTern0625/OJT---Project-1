drop table company_employees;

create table company_employees (
  id uuid primary key default uuid_generate_v4() not null,
  is_active boolean not null default true,
  account_id uuid references accounts(id) on delete cascade,
  first_name varchar(255),
  last_name varchar(255),
  birth_date date,
  gender varchar(255),
  civil_status varchar(255),
  card_number varchar(255),
  effective_date date,
  room_plan varchar(255),
  maximum_benefit_limit float,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

-- enable rls
alter table company_employees enable row level security;

create policy "user can see company employees"
on company_employees
for select
to authenticated
using (true);

create policy "underwriting can insert company employees"
on company_employees
for insert
to authenticated
with check (
  exists (
    select 1
    from user_profiles
    where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'under-writing')
  )
);

create policy "underwriting can update company employees"
on company_employees
for update
to authenticated
with check (
  exists (
    select 1
    from user_profiles
    where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'under-writing')
  )
);
