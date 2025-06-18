create policy "Enable read access based on created_by"
on "public"."pending_accounts"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = created_by));


create policy "Enable read access for admin"
on "public"."pending_accounts"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "Enable update access for admin"
on "public"."pending_accounts"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "Enable update for users based on created_by"
on "public"."pending_accounts"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = created_by));



