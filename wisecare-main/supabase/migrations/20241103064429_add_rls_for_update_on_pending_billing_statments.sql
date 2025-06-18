alter table "public"."pending_billing_statements" add column "billing_statement_id" uuid;

alter table "public"."pending_billing_statements" add constraint "pending_billing_statements_billing_statement_id_fkey" FOREIGN KEY (billing_statement_id) REFERENCES billing_statements(id) ON DELETE SET NULL not valid;

alter table "public"."pending_billing_statements" validate constraint "pending_billing_statements_billing_statement_id_fkey";

create policy "Enable insert access for admin"
on "public"."pending_billing_statements"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "Enable read access for users based on created_by"
on "public"."pending_billing_statements"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "Enable update for admin"
on "public"."pending_billing_statements"
as permissive
for update
to public
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "Enable update for users based on created_by"
on "public"."pending_billing_statements"
as permissive
for update
to public
using (((( SELECT auth.uid() AS uid) = created_by) AND (is_approved = false) AND (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['finance'::text])))))))));



