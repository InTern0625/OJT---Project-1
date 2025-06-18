create policy "Enable users read access"
on "public"."pending_export_requests"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = created_by) AND (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'marketing'::text, 'finance'::text, 'after-sales'::text, 'under-writing'::text])))))))));


create policy "Enable users to update based on created by"
on "public"."pending_export_requests"
as permissive
for update
to public
using (((( SELECT auth.uid() AS uid) = created_by) AND (is_approved = false) AND (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'marketing'::text, 'finance'::text, 'after-sales'::text, 'under-writing'::text])))))))));



