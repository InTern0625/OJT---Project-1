create table hmo_providers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

create table plan_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

create table mode_of_payments (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

create table account_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

create table mode_of_premium (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

-- add rls
alter table hmo_providers enable row level security;
alter table plan_types enable row level security;
alter table mode_of_payments enable row level security;
alter table account_types enable row level security;
alter table mode_of_premium enable row level security;


-- allow authenticated users to read all tables
create policy "allow authenticated users to read"
  on hmo_providers
  for select
  to authenticated
  using (true);

create policy "allow authenticated users to read plan_types"
  on plan_types
  for select
  to authenticated
  using (true);

create policy "allow authenticated users to read mode_of_payments"
  on mode_of_payments
  for select
  to authenticated
  using (true);

create policy "allow authenticated users to read account_types"
  on account_types
  for select
  to authenticated
  using (true);

create policy "allow authenticated users to read mode_of_premium"
  on mode_of_premium
  for select
  to authenticated
  using (true);


-- allow admin to insert
create policy "allow admin to insert hmo_providers"
  on hmo_providers
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  );

create policy "allow admin to insert plan_types"
  on plan_types
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  );

create policy "allow admin to insert mode_of_payments"
  on mode_of_payments
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  );

create policy "allow admin to insert account_types"
  on account_types
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  );

create policy "allow admin to insert mode_of_premium"
  on mode_of_premium
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  );


-- allow admin to update
create policy "allow admin to update hmo_providers"
  on hmo_providers
  for update
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  )
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  );

create policy "allow admin to update account_types"
  on account_types
  for update
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  )
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  );

create policy "allow admin to update mode_of_premium"
  on mode_of_premium
  for update
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  )
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id = (select id from departments where name = 'admin')
    )
  );


