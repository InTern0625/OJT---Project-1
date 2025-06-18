create policy "allow admin to update plan_types"
  on plan_types
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

create policy "allow admin to update mode_of_payments"
  on mode_of_payments
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
