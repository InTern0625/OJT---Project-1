create table "public"."pending_company_employees" (
    "id" uuid not null default uuid_generate_v4(),
    "is_active" boolean not null default true,
    "account_id" uuid,
    "first_name" character varying(255),
    "last_name" character varying(255),
    "birth_date" date,
    "gender" character varying(255),
    "civil_status" character varying(255),
    "card_number" character varying(255),
    "effective_date" date,
    "room_plan" character varying(255),
    "maximum_benefit_limit" character varying(255),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "created_by" uuid,
    "is_approved" boolean not null default false,
    "is_delete_employee" boolean not null default false,
    "operation_type" pending_operation not null,
    "batch_id" uuid not null
);


alter table "public"."pending_company_employees" enable row level security;

CREATE UNIQUE INDEX pending_company_employees_pkey ON public.pending_company_employees USING btree (id);

alter table "public"."pending_company_employees" add constraint "pending_company_employees_pkey" PRIMARY KEY using index "pending_company_employees_pkey";

alter table "public"."pending_company_employees" add constraint "pending_company_employees_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE not valid;

alter table "public"."pending_company_employees" validate constraint "pending_company_employees_account_id_fkey";

alter table "public"."pending_company_employees" add constraint "pending_company_employees_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL not valid;

alter table "public"."pending_company_employees" validate constraint "pending_company_employees_created_by_fkey";

grant delete on table "public"."pending_company_employees" to "anon";

grant insert on table "public"."pending_company_employees" to "anon";

grant references on table "public"."pending_company_employees" to "anon";

grant select on table "public"."pending_company_employees" to "anon";

grant trigger on table "public"."pending_company_employees" to "anon";

grant truncate on table "public"."pending_company_employees" to "anon";

grant update on table "public"."pending_company_employees" to "anon";

grant delete on table "public"."pending_company_employees" to "authenticated";

grant insert on table "public"."pending_company_employees" to "authenticated";

grant references on table "public"."pending_company_employees" to "authenticated";

grant select on table "public"."pending_company_employees" to "authenticated";

grant trigger on table "public"."pending_company_employees" to "authenticated";

grant truncate on table "public"."pending_company_employees" to "authenticated";

grant update on table "public"."pending_company_employees" to "authenticated";

grant delete on table "public"."pending_company_employees" to "service_role";

grant insert on table "public"."pending_company_employees" to "service_role";

grant references on table "public"."pending_company_employees" to "service_role";

grant select on table "public"."pending_company_employees" to "service_role";

grant trigger on table "public"."pending_company_employees" to "service_role";

grant truncate on table "public"."pending_company_employees" to "service_role";

grant update on table "public"."pending_company_employees" to "service_role";

create policy "Enable insert for users based on created_by"
on "public"."pending_company_employees"
as permissive
for insert
to authenticated
with check (((( SELECT auth.uid() AS uid) = created_by) AND (is_approved = false) AND (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'marketing'::text, 'finance'::text, 'after-sales'::text, 'under-writing'::text])))))))));


create policy "Enable read access for users based on created_by"
on "public"."pending_company_employees"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = created_by) AND (is_approved = false) AND (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['admin'::text, 'marketing'::text, 'finance'::text, 'after-sales'::text, 'under-writing'::text])))))))));



