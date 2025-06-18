drop policy "allow admin to insert account_types" on "public"."account_types";

drop policy "allow admin to update account_types" on "public"."account_types";

drop policy "allow specific departments to insert accounts" on "public"."accounts";

drop policy "allow specific departments to update accounts" on "public"."accounts";

drop policy "Users can insert their own column visibility" on "public"."accounts_column_visibility";

drop policy "Users can update their own column visibility" on "public"."accounts_column_visibility";

drop policy "Users can view their own column visibility" on "public"."accounts_column_visibility";

drop policy "Allow admin users to read activity logs" on "public"."activity_logs";

drop policy "Allow admin users to write activity logs" on "public"."activity_logs";

drop policy "admin and finance department users to insert billing_statements" on "public"."billing_statements";

drop policy "admin and finance department users to read billing_statements" on "public"."billing_statements";

drop policy "admin and finance department users to update billing_statements" on "public"."billing_statements";

drop policy "all departments can insert company employees except agent" on "public"."company_employees";

drop policy "all departments can update company employees except agent" on "public"."company_employees";

drop policy "allow admin to insert hmo_providers" on "public"."hmo_providers";

drop policy "allow admin to update hmo_providers" on "public"."hmo_providers";

drop policy "allow admin to insert mode_of_payments" on "public"."mode_of_payments";

drop policy "allow admin to update mode_of_payments" on "public"."mode_of_payments";

drop policy "allow admin to insert mode_of_premium" on "public"."mode_of_premium";

drop policy "allow admin to update mode_of_premium" on "public"."mode_of_premium";

drop policy "allow admin to insert plan_types" on "public"."plan_types";

drop policy "allow admin to update plan_types" on "public"."plan_types";

create policy "allow admin to insert account_types"
on "public"."account_types"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "allow admin to update account_types"
on "public"."account_types"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))))
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "allow specific departments to insert accounts"
on "public"."accounts"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'marketing'::text, 'finance'::text, 'after-sales'::text, 'under-writing'::text]))))))));


create policy "allow specific departments to update accounts"
on "public"."accounts"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'marketing'::text, 'finance'::text, 'after-sales'::text, 'under-writing'::text]))))))))
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'marketing'::text, 'finance'::text, 'after-sales'::text, 'under-writing'::text]))))))));


create policy "Users can insert their own column visibility"
on "public"."accounts_column_visibility"
as permissive
for insert
to public
with check ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can update their own column visibility"
on "public"."accounts_column_visibility"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Users can view their own column visibility"
on "public"."accounts_column_visibility"
as permissive
for select
to public
using ((( SELECT auth.uid() AS uid) = user_id));


create policy "Allow admin users to read activity logs"
on "public"."activity_logs"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "Allow admin users to write activity logs"
on "public"."activity_logs"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "admin and finance department users to insert billing_statements"
on "public"."billing_statements"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'finance'::text]))))))));


create policy "admin and finance department users to read billing_statements"
on "public"."billing_statements"
as permissive
for select
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'finance'::text]))))))));


create policy "admin and finance department users to update billing_statements"
on "public"."billing_statements"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'finance'::text]))))))))
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'finance'::text]))))))));


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


create policy "allow admin to insert hmo_providers"
on "public"."hmo_providers"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "allow admin to update hmo_providers"
on "public"."hmo_providers"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))))
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "allow admin to insert mode_of_payments"
on "public"."mode_of_payments"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "allow admin to update mode_of_payments"
on "public"."mode_of_payments"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))))
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "allow admin to insert mode_of_premium"
on "public"."mode_of_premium"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "allow admin to update mode_of_premium"
on "public"."mode_of_premium"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))))
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "allow admin to insert plan_types"
on "public"."plan_types"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "allow admin to update plan_types"
on "public"."plan_types"
as permissive
for update
to authenticated
using ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))))
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id = ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));



