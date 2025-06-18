alter table billing_statements enable row level security;

drop policy if exists "finance department users to read billing_statements" on billing_statements;

drop policy if exists "finance department users to insert billing_statements" on billing_statements;

drop policy if exists "finance department users to update billing_statements" on billing_statements;

create policy "admin and finance department users to read billing_statements" on billing_statements for
select
  to authenticated using (
    exists (
      select
        1
      from
        user_profiles
      where
        user_profiles.user_id = auth.uid ()
        and user_profiles.department_id in (
          select
            id
          from
            departments
          where
            name in ('admin', 'finance')
        )
    )
  );

create policy "admin and finance department users to insert billing_statements" on billing_statements for insert to authenticated
with
  check (
    exists (
      select
        1
      from
        user_profiles
      where
        user_profiles.user_id = auth.uid ()
        and user_profiles.department_id in (
          select
            id
          from
            departments
          where
            name in ('admin', 'finance')
        )
    )
  );

create policy "admin and finance department users to update billing_statements" on billing_statements for
update to authenticated using (
  exists (
    select
      1
    from
      user_profiles
    where
      user_profiles.user_id = auth.uid ()
      and user_profiles.department_id in (
        select
          id
        from
          departments
        where
          name in ('admin', 'finance')
      )
  )
)
with
  check (
    exists (
      select
        1
      from
        user_profiles
      where
        user_profiles.user_id = auth.uid ()
        and user_profiles.department_id in (
          select
            id
          from
            departments
          where
            name in ('admin', 'finance')
        )
    )
  );