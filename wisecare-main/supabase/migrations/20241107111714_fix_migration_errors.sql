drop policy "allow authenticated users to read accounts" on "public"."accounts";

drop policy "all departments can insert company employees except agent" on "public"."company_employees";

drop policy "all departments can update company employees except agent" on "public"."company_employees";

drop policy "user can see company employees" on "public"."company_employees";

create policy "allow read access for employees of wisecare"
on "public"."accounts"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'finance'::text, 'marketing'::text, 'after-sales'::text, 'under-writing'::text]))))))));


create policy "user can see company employees"
on "public"."company_employees"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'finance'::text, 'marketing'::text, 'after-sales'::text, 'under-writing'::text]))))))));



