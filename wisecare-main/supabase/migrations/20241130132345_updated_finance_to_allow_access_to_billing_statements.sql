drop policy "Enable insert access for admin" on "public"."billing_statements";

drop policy "Enable update access for admin" on "public"."billing_statements";

create policy "Enable insert access for finance and admin"
on "public"."billing_statements"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'finance'::text]))))))));


create policy "Enable update access for finance and admin"
on "public"."billing_statements"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'finance'::text]))))))));



