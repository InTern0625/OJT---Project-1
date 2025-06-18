create extension if not exists "hypopg" with schema "extensions";

create extension if not exists "index_advisor" with schema "extensions";


create table "public"."account_status_changes" (
    "id" uuid not null default gen_random_uuid(),
    "account_id" uuid not null,
    "is_account_active" boolean not null,
    "changed_at" timestamp with time zone not null default now()
);


alter table "public"."account_status_changes" enable row level security;

CREATE UNIQUE INDEX account_status_changes_pkey ON public.account_status_changes USING btree (id);

alter table "public"."account_status_changes" add constraint "account_status_changes_pkey" PRIMARY KEY using index "account_status_changes_pkey";

alter table "public"."account_status_changes" add constraint "account_status_changes_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) not valid;

alter table "public"."account_status_changes" validate constraint "account_status_changes_account_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.log_account_status_change()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  INSERT INTO account_status_changes (account_id, is_account_active, changed_at)
  VALUES (NEW.id, NEW.is_account_active, CURRENT_TIMESTAMP);
  RETURN NEW;
END;$function$
;

grant delete on table "public"."account_status_changes" to "anon";

grant insert on table "public"."account_status_changes" to "anon";

grant references on table "public"."account_status_changes" to "anon";

grant select on table "public"."account_status_changes" to "anon";

grant trigger on table "public"."account_status_changes" to "anon";

grant truncate on table "public"."account_status_changes" to "anon";

grant update on table "public"."account_status_changes" to "anon";

grant delete on table "public"."account_status_changes" to "authenticated";

grant insert on table "public"."account_status_changes" to "authenticated";

grant references on table "public"."account_status_changes" to "authenticated";

grant select on table "public"."account_status_changes" to "authenticated";

grant trigger on table "public"."account_status_changes" to "authenticated";

grant truncate on table "public"."account_status_changes" to "authenticated";

grant update on table "public"."account_status_changes" to "authenticated";

grant delete on table "public"."account_status_changes" to "service_role";

grant insert on table "public"."account_status_changes" to "service_role";

grant references on table "public"."account_status_changes" to "service_role";

grant select on table "public"."account_status_changes" to "service_role";

grant trigger on table "public"."account_status_changes" to "service_role";

grant truncate on table "public"."account_status_changes" to "service_role";

grant update on table "public"."account_status_changes" to "service_role";

create policy "Enable all access for admin"
on "public"."account_status_changes"
as permissive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


CREATE TRIGGER account_status_change_trigger AFTER INSERT OR UPDATE ON public.accounts FOR EACH ROW EXECUTE FUNCTION log_account_status_change();


