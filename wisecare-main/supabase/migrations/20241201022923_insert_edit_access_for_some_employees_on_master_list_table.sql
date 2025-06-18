drop policy "Enable insert for admin" on "public"."company_employees";

drop policy "Enable update access for admin" on "public"."company_employees";

create policy "Enable insert for some departments"
on "public"."company_employees"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['after-sales'::text, 'under-writing'::text, 'admin'::text]))))))));


create policy "Enable update access for some departments"
on "public"."company_employees"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['after-sales'::text, 'under-writing'::text, 'admin'::text]))))))));



