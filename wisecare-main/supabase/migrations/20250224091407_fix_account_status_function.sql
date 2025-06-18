set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.log_account_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  IF EXISTS (
    SELECT 1
    FROM user_profiles
    WHERE user_profiles.user_id = (SELECT auth.uid() AS uid)
      AND user_profiles.department_id IN (
        SELECT departments.id
        FROM departments
        WHERE departments.name = 'admin'::text
      )
  ) THEN
    INSERT INTO account_status_changes (account_id, is_account_active, changed_at)
    VALUES (NEW.id, NEW.is_account_active, CURRENT_TIMESTAMP);
  END IF;
  RETURN NEW;
END;$function$
;


