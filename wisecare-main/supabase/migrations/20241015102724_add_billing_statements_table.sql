create table billing_statements (
  id uuid primary key default uuid_generate_v4(),
  mode_of_premium_id uuid references mode_of_premium(id) on delete set null,
  due_date date,
  or_number text,
  or_date date,
  sa_number text,
  amount float,
  total_contract_value float,
  balance float,
  billing_period int check (billing_period >= 1 and billing_period <= 31),
  is_active boolean not null default true,
  amount_billed float,
  amount_paid float,
  commission_rate float,
  commission_earned float,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- enable rls
alter table billing_statements enable row level security;

create policy "finance department users to read billing_statements"
  on billing_statements
  for select
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id in (select id from departments where name in ('finance'))
    )
  );

create policy "finance department users to insert billing_statements"
  on billing_statements
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id in (select id from departments where name in ('finance'))
    )
  );

create policy "finance department users to update billing_statements"
  on billing_statements
  for update
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id in (select id from departments where name in ('finance'))
    )
  )
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id in (select id from departments where name in ('finance'))
    )
  );