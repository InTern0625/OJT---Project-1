alter table "public"."pending_company_employees" add column "company_employee_id" uuid;

alter table "public"."company_employees" add constraint "company_employees_created_by_fkey1" FOREIGN KEY (created_by) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."company_employees" validate constraint "company_employees_created_by_fkey1";

alter table "public"."pending_company_employees" add constraint "pending_company_employees_company_employee_id_fkey" FOREIGN KEY (company_employee_id) REFERENCES company_employees(id) ON DELETE SET NULL not valid;

alter table "public"."pending_company_employees" validate constraint "pending_company_employees_company_employee_id_fkey";

create policy "Enable insert for admin"
on "public"."company_employees"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "Enable insert for admin"
on "public"."pending_company_employees"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "Enable update for admin"
on "public"."pending_company_employees"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));



