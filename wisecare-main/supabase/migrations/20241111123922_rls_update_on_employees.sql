create policy "Enable update for users based on created_by"
on "public"."pending_company_employees"
as permissive
for update
to authenticated
using (((( SELECT auth.uid() AS uid) = created_by) AND (is_approved = false) AND (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'marketing'::text, 'finance'::text, 'after-sales'::text, 'under-writing'::text])))))))));



