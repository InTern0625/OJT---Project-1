alter table "public"."pending_company_employees" drop constraint "pending_company_employees_created_by_fkey";

alter table "public"."pending_company_employees" alter column "created_by" set not null;

alter table "public"."pending_company_employees" add constraint "pending_company_employees_created_by_fkey1" FOREIGN KEY (created_by) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."pending_company_employees" validate constraint "pending_company_employees_created_by_fkey1";

create policy "Enable read access for admin"
on "public"."pending_company_employees"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));



