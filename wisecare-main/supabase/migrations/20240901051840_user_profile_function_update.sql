create or replace function public.update_user_profile()
  returns trigger as $$
  begin
    update public.user_profiles
    set first_name = new.raw_user_meta_data->>'first_name',
        last_name = new.raw_user_meta_data->>'last_name',
        email = new.email,
        department_id = (select id from public.departments where name = new.raw_user_meta_data->>'department'),
        updated_at = now()
    where user_id = new.id;
    return new;
  end;
$$ language plpgsql security definer;

create trigger update_user_profile
  after update on auth.users
  for each row
  execute function public.update_user_profile();
