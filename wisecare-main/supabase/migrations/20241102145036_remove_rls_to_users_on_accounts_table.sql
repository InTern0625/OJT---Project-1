drop policy "allow specific departments to insert accounts" on "public"."accounts";

drop policy "allow specific departments to update accounts" on "public"."accounts";

create policy "Enable insert access for admin"
on "public"."accounts"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));



