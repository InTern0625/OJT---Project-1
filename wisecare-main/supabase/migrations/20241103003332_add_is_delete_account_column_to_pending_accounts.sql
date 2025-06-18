alter table "public"."accounts" alter column "is_active" set not null;

alter table "public"."pending_accounts" add column "is_delete_account" boolean not null default false;

create policy "Enable update for admin"
on "public"."accounts"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));



