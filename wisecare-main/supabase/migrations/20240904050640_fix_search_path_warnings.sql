-- create user profile
create or replace function public.create_user_profile()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
  begin
    insert into public.user_profiles (user_id, first_name, last_name, email, department_id)
    values (new.id, new.raw_user_meta_data->>'first_name', new.raw_user_meta_data->>'last_name', new.email, (select id from public.departments where name = new.raw_user_meta_data->>'department'));
    return new;
  end;
$$ security definer;

-- update user profile
create or replace function public.update_user_profile()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
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
$$ security definer;

-- log types activity
create or replace function log_types_activity()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
  begin
    insert into public.activity_logs (user_id, table_name, action, description)
  values (auth.uid(), TG_TABLE_NAME, TG_OP, 
    case 
      when TG_OP = 'INSERT' then 'Created ' || NEW.name || ' on ' || TG_TABLE_NAME
      when TG_OP = 'UPDATE' then 'Updated ' || TG_TABLE_NAME || ' from ' || OLD.name || ' to ' || NEW.name
      when TG_OP = 'DELETE' then 'Deleted '|| OLD.name || ' on ' || TG_TABLE_NAME
      else TG_OP
    end);
  return new;
end;
$$ security definer;

-- notify all finance users new account
create or replace function notify_all_finance_users_new_account()
  returns trigger
  language plpgsql
  set search_path = ''
as $$
  begin
  INSERT INTO public.notifications (user_id, title, description)
  SELECT user_id, NEW.company_name || ' has been created', 'A new account has been successfully created for ' || NEW.company_name || '.'
  FROM public.user_profiles
  WHERE department_id = (SELECT id FROM public.departments WHERE name = 'finance');
  RETURN NEW;
END;
$$ security definer;