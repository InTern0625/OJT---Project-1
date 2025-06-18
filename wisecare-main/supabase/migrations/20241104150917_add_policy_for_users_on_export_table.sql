drop policy "all departments can insert company employees except agent" on "public"."company_employees";

drop policy "all departments can update company employees except agent" on "public"."company_employees";

drop policy "user can see company employees" on "public"."company_employees";

create policy "all departments can insert company employees except agent"
on "public"."company_employees"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['marketing'::text, 'after-sales'::text, 'under-writing'::text, 'finance'::text, 'admin'::text]))))))));


create policy "all departments can update company employees except agent"
on "public"."company_employees"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['marketing'::text, 'after-sales'::text, 'under-writing'::text, 'finance'::text, 'admin'::text]))))))))
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['marketing'::text, 'after-sales'::text, 'under-writing'::text, 'finance'::text, 'admin'::text]))))))));


create policy "user can see company employees"
on "public"."company_employees"
as permissive
for select
to authenticated
using (true);


create policy "Enable users to insert on table"
on "public"."pending_export_requests"
as permissive
for insert
to authenticated
with check (((( SELECT auth.uid() AS uid) = created_by) AND (is_approved = false) AND (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'marketing'::text, 'finance'::text, 'after-sales'::text, 'under-writing'::text])))))))));



