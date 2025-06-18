create type "public"."pending_operation" as enum ('insert', 'update', 'delete');

drop policy "Enable ALL access for admin" on "public"."pending_accounts";

drop policy "Enable insert based on created_by" on "public"."pending_accounts";

drop policy "Enable select for users based on created_by" on "public"."pending_accounts";

drop policy "Enable update access based on created_by" on "public"."pending_accounts";

alter table "public"."pending_accounts" drop constraint "pending_accounts_account_type_id_fkey";

alter table "public"."pending_accounts" drop constraint "pending_accounts_agent_id_fkey";

alter table "public"."pending_accounts" drop constraint "pending_accounts_current_hmo_provider_id_fkey";

alter table "public"."pending_accounts" drop constraint "pending_accounts_dependent_plan_type_id_fkey";

alter table "public"."pending_accounts" drop constraint "pending_accounts_hmo_provider_id_fkey";

alter table "public"."pending_accounts" drop constraint "pending_accounts_mode_of_payment_id_fkey";

alter table "public"."pending_accounts" drop constraint "pending_accounts_previous_hmo_provider_id_fkey";

alter table "public"."pending_accounts" drop constraint "pending_accounts_principal_plan_type_id_fkey";

alter table "public"."pending_accounts" add column "account_id" uuid;

alter table "public"."pending_accounts" add column "operation_type" pending_operation not null;

alter table "public"."pending_accounts" add constraint "pending_accounts_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_account_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_account_type_id_fkey" FOREIGN KEY (account_type_id) REFERENCES account_types(id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_account_type_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_agent_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_current_hmo_provider_id_fkey" FOREIGN KEY (current_hmo_provider_id) REFERENCES hmo_providers(id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_current_hmo_provider_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_dependent_plan_type_id_fkey" FOREIGN KEY (dependent_plan_type_id) REFERENCES plan_types(id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_dependent_plan_type_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_hmo_provider_id_fkey" FOREIGN KEY (hmo_provider_id) REFERENCES hmo_providers(id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_hmo_provider_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_mode_of_payment_id_fkey" FOREIGN KEY (mode_of_payment_id) REFERENCES mode_of_payments(id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_mode_of_payment_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_previous_hmo_provider_id_fkey" FOREIGN KEY (previous_hmo_provider_id) REFERENCES hmo_providers(id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_previous_hmo_provider_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_principal_plan_type_id_fkey" FOREIGN KEY (principal_plan_type_id) REFERENCES plan_types(id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_principal_plan_type_id_fkey";

create policy "Enable insert for admin"
on "public"."pending_accounts"
as permissive
for insert
to authenticated
with check ((EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = 'admin'::text)))))));


create policy "Enable insert for employees based on created_by"
on "public"."pending_accounts"
as permissive
for insert
to authenticated
with check (((( SELECT auth.uid() AS uid) = created_by) AND (is_approved = false) AND (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'marketing'::text, 'finance'::text, 'after-sales'::text, 'under-writing'::text])))))))));



