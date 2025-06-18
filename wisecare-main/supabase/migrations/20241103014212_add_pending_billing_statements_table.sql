create table "public"."pending_billing_statements" (
    "id" uuid not null default uuid_generate_v4(),
    "due_date" date,
    "or_number" text,
    "or_date" date,
    "sa_number" text,
    "amount" double precision,
    "total_contract_value" double precision,
    "balance" double precision,
    "billing_period" integer,
    "is_active" boolean not null default true,
    "amount_billed" double precision,
    "amount_paid" double precision,
    "commission_rate" double precision,
    "commission_earned" double precision,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "account_id" uuid not null,
    "mode_of_payment_id" uuid,
    "created_by" uuid not null,
    "is_approved" boolean not null default false,
    "operation_type" pending_operation not null,
    "is_delete_billing_statement" boolean not null default false
);


alter table "public"."pending_billing_statements" enable row level security;

CREATE UNIQUE INDEX pending_billing_statements_pkey ON public.pending_billing_statements USING btree (id);

alter table "public"."pending_billing_statements" add constraint "pending_billing_statements_pkey" PRIMARY KEY using index "pending_billing_statements_pkey";

alter table "public"."pending_billing_statements" add constraint "billing_statements_billing_period_check" CHECK (((billing_period >= 1) AND (billing_period <= 31))) not valid;

alter table "public"."pending_billing_statements" validate constraint "billing_statements_billing_period_check";

alter table "public"."pending_billing_statements" add constraint "pending_billing_statements_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL not valid;

alter table "public"."pending_billing_statements" validate constraint "pending_billing_statements_account_id_fkey";

alter table "public"."pending_billing_statements" add constraint "pending_billing_statements_created_by_fkey" FOREIGN KEY (created_by) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."pending_billing_statements" validate constraint "pending_billing_statements_created_by_fkey";

alter table "public"."pending_billing_statements" add constraint "pending_billing_statements_mode_of_payment_id_fkey" FOREIGN KEY (mode_of_payment_id) REFERENCES mode_of_payments(id) ON DELETE SET NULL not valid;

alter table "public"."pending_billing_statements" validate constraint "pending_billing_statements_mode_of_payment_id_fkey";

grant delete on table "public"."pending_billing_statements" to "anon";

grant insert on table "public"."pending_billing_statements" to "anon";

grant references on table "public"."pending_billing_statements" to "anon";

grant select on table "public"."pending_billing_statements" to "anon";

grant trigger on table "public"."pending_billing_statements" to "anon";

grant truncate on table "public"."pending_billing_statements" to "anon";

grant update on table "public"."pending_billing_statements" to "anon";

grant delete on table "public"."pending_billing_statements" to "authenticated";

grant insert on table "public"."pending_billing_statements" to "authenticated";

grant references on table "public"."pending_billing_statements" to "authenticated";

grant select on table "public"."pending_billing_statements" to "authenticated";

grant trigger on table "public"."pending_billing_statements" to "authenticated";

grant truncate on table "public"."pending_billing_statements" to "authenticated";

grant update on table "public"."pending_billing_statements" to "authenticated";

grant delete on table "public"."pending_billing_statements" to "service_role";

grant insert on table "public"."pending_billing_statements" to "service_role";

grant references on table "public"."pending_billing_statements" to "service_role";

grant select on table "public"."pending_billing_statements" to "service_role";

grant trigger on table "public"."pending_billing_statements" to "service_role";

grant truncate on table "public"."pending_billing_statements" to "service_role";

grant update on table "public"."pending_billing_statements" to "service_role";

create policy "Enable insert for users based on created_by"
on "public"."pending_billing_statements"
as permissive
for insert
to authenticated
with check (((( SELECT auth.uid() AS uid) = created_by) AND (is_approved = false) AND (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['finance'::text])))))))));


create policy "Enable read for users based on created_by"
on "public"."pending_billing_statements"
as permissive
for select
to authenticated
using (((( SELECT auth.uid() AS uid) = created_by) AND (is_approved = false) AND (EXISTS ( SELECT 1
   FROM user_profiles
  WHERE ((user_profiles.user_id = ( SELECT auth.uid() AS uid)) AND (user_profiles.department_id IN ( SELECT departments.id
           FROM departments
          WHERE (departments.name = ANY (ARRAY['finance'::text])))))))));



