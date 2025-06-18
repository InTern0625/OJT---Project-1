drop policy "allow authenticated users to read accounts" on accounts;
drop policy "allow specific departments to insert accounts" on accounts;
drop policy "allow specific departments to update accounts" on accounts;


create policy "allow authenticated users to read accounts"
  on accounts
  for select
  to authenticated
  using (true);

create policy "allow specific departments to insert accounts"
  on accounts
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id in (select id from departments where name in ('admin', 'marketing', 'finance', 'after-sales', 'under-writing'))
    )
  );

create policy "allow specific departments to update accounts"
  on accounts
  for update
  to authenticated
  using (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id in (select id from departments where name in ('admin', 'marketing', 'finance', 'after-sales', 'under-writing'))
    )
  )
  with check (
    exists (
      select 1
      from user_profiles
      where user_profiles.user_id = auth.uid() and user_profiles.department_id in (select id from departments where name in ('admin', 'marketing', 'finance', 'after-sales', 'under-writing'))
    )
  );