drop policy "Enable insert access for some department" on "public"."accounts";

drop policy "Enable update for some departments" on "public"."accounts";

create policy "Enable insert access for some department"
on "public"."accounts"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'finance'::text, 'under-writing'::text]))))))));


create policy "Enable update for some departments"
on "public"."accounts"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'finance'::text, 'under-writing'::text]))))))));



