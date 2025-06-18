create table "public"."pending_accounts" (
    "id" uuid not null default gen_random_uuid(),
    "agent_id" uuid,
    "company_name" character varying not null,
    "company_address" text,
    "nature_of_business" text,
    "hmo_provider_id" uuid,
    "previous_hmo_provider_id" uuid,
    "current_hmo_provider_id" uuid,
    "account_type_id" uuid,
    "total_utilization" double precision,
    "total_premium_paid" double precision,
    "signatory_designation" text,
    "contact_person" text,
    "contact_number" text,
    "principal_plan_type_id" uuid,
    "dependent_plan_type_id" uuid,
    "initial_head_count" integer,
    "effectivity_date" date,
    "coc_issue_date" date,
    "expiration_date" date,
    "delivery_date_of_membership_ids" date,
    "orientation_date" date,
    "initial_contract_value" double precision,
    "mode_of_payment_id" uuid,
    "wellness_lecture_date" date,
    "annual_physical_examination_date" date,
    "commision_rate" double precision,
    "additional_benefits" text,
    "special_benefits" text,
    "summary_of_benefits" text,
    "name_of_signatory" text,
    "designation_of_contact_person" text,
    "email_address_of_contact_person" text,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "is_active" boolean not null default true,
    "is_approved" boolean not null default false,
    "created_by" uuid
);


alter table "public"."pending_accounts" enable row level security;

CREATE UNIQUE INDEX pending_accounts_pkey ON public.pending_accounts USING btree (id);

alter table "public"."pending_accounts" add constraint "pending_accounts_pkey" PRIMARY KEY using index "pending_accounts_pkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_account_type_id_fkey" FOREIGN KEY (account_type_id) REFERENCES account_types(id) not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_account_type_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_agent_id_fkey" FOREIGN KEY (agent_id) REFERENCES company_employees(id) not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_agent_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_created_by_fkey" FOREIGN KEY (created_by) REFERENCES user_profiles(user_id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_created_by_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_current_hmo_provider_id_fkey" FOREIGN KEY (current_hmo_provider_id) REFERENCES hmo_providers(id) not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_current_hmo_provider_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_dependent_plan_type_id_fkey" FOREIGN KEY (dependent_plan_type_id) REFERENCES plan_types(id) not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_dependent_plan_type_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_hmo_provider_id_fkey" FOREIGN KEY (hmo_provider_id) REFERENCES hmo_providers(id) not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_hmo_provider_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_mode_of_payment_id_fkey" FOREIGN KEY (mode_of_payment_id) REFERENCES mode_of_payments(id) not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_mode_of_payment_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_previous_hmo_provider_id_fkey" FOREIGN KEY (previous_hmo_provider_id) REFERENCES hmo_providers(id) not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_previous_hmo_provider_id_fkey";

alter table "public"."pending_accounts" add constraint "pending_accounts_principal_plan_type_id_fkey" FOREIGN KEY (principal_plan_type_id) REFERENCES plan_types(id) not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_principal_plan_type_id_fkey";

grant delete on table "public"."pending_accounts" to "anon";

grant insert on table "public"."pending_accounts" to "anon";

grant references on table "public"."pending_accounts" to "anon";

grant select on table "public"."pending_accounts" to "anon";

grant trigger on table "public"."pending_accounts" to "anon";

grant truncate on table "public"."pending_accounts" to "anon";

grant update on table "public"."pending_accounts" to "anon";

grant delete on table "public"."pending_accounts" to "authenticated";

grant insert on table "public"."pending_accounts" to "authenticated";

grant references on table "public"."pending_accounts" to "authenticated";

grant select on table "public"."pending_accounts" to "authenticated";

grant trigger on table "public"."pending_accounts" to "authenticated";

grant truncate on table "public"."pending_accounts" to "authenticated";

grant update on table "public"."pending_accounts" to "authenticated";

grant delete on table "public"."pending_accounts" to "service_role";

grant insert on table "public"."pending_accounts" to "service_role";

grant references on table "public"."pending_accounts" to "service_role";

grant select on table "public"."pending_accounts" to "service_role";

grant trigger on table "public"."pending_accounts" to "service_role";

grant truncate on table "public"."pending_accounts" to "service_role";

grant update on table "public"."pending_accounts" to "service_role";


