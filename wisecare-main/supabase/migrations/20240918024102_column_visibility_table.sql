create table accounts_column_visibility (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null unique references auth.users,
  columns jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table accounts_column_visibility enable row level security;

create policy "Users can view their own column visibility" on accounts_column_visibility for select using (auth.uid() = user_id);
create policy "Users can update their own column visibility" on accounts_column_visibility for update using (auth.uid() = user_id);
create policy "Users can insert their own column visibility" on accounts_column_visibility for insert with check (auth.uid() = user_id);