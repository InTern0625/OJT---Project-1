-- Drop the existing policy for updating company employees
drop policy if exists "underwriting can update company employees" on company_employees;

-- Create a new policy for updating company employees
create policy "all departments can update company employees except agent"
on company_employees
for update
to authenticated
using (
  exists (
    select 1
    from user_profiles
    where user_profiles.user_id = auth.uid() 
    and user_profiles.department_id in (
      select id from departments where name in ('marketing', 'after-sales', 'under-writing', 'finance', 'admin')
    )
  )
)
with check (
  exists (
    select 1
    from user_profiles
    where user_profiles.user_id = auth.uid() 
    and user_profiles.department_id in (
      select id from departments where name in ('marketing', 'after-sales', 'under-writing', 'finance', 'admin')
    )
  )
);

-- Drop the existing policy for inserting company employees
drop policy if exists "underwriting can insert company employees" on company_employees;

-- Create a new policy for inserting company employees
create policy "all departments can insert company employees except agent"
on company_employees
for insert
to authenticated
with check (
  exists (
    select 1
    from user_profiles
    where user_profiles.user_id = auth.uid() 
    and user_profiles.department_id in (
      select id from departments where name in ('marketing', 'after-sales', 'under-writing', 'finance', 'admin')
    )
  )
);
