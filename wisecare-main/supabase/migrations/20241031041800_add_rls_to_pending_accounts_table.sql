create policy "Enable ALL access for admin"
on "public"."pending_accounts"
as restrictive
for all
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text]))))))));


create policy "Enable insert based on created_by"
on "public"."pending_accounts"
as restrictive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = created_by));


create policy "Enable select for users based on created_by"
on "public"."pending_accounts"
as restrictive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Enable update access based on created_by"
on "public"."pending_accounts"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = created_by));



