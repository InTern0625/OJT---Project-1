create type "public"."export_type" as enum ('accounts', 'employees');

create table "public"."pending_export_requests" (
    "id" uuid not null default gen_random_uuid(),
    "export_type" export_type not null,
    "created_by" uuid not null default gen_random_uuid(),
    "is_approved" boolean not null default false,
    "is_active" boolean not null default true,
    "account_id" uuid,
    "updated_at" timestamp with time zone not null default now(),
    "data" jsonb,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."pending_export_requests" enable row level security;

CREATE UNIQUE INDEX pending_export_requests_pkey ON public.pending_export_requests USING btree (id);

alter table "public"."pending_export_requests" add constraint "pending_export_requests_pkey" PRIMARY KEY using index "pending_export_requests_pkey";

alter table "public"."pending_export_requests" add constraint "pending_export_requests_account_id_fkey" FOREIGN KEY (account_id) REFERENCES accounts(id) not valid;

alter table "public"."pending_export_requests" validate constraint "pending_export_requests_account_id_fkey";

alter table "public"."pending_export_requests" add constraint "pending_export_requests_created_by_fkey" FOREIGN KEY (created_by) REFERENCES user_profiles(user_id) not valid;

alter table "public"."pending_export_requests" validate constraint "pending_export_requests_created_by_fkey";

grant delete on table "public"."pending_export_requests" to "anon";

grant insert on table "public"."pending_export_requests" to "anon";

grant references on table "public"."pending_export_requests" to "anon";

grant select on table "public"."pending_export_requests" to "anon";

grant trigger on table "public"."pending_export_requests" to "anon";

grant truncate on table "public"."pending_export_requests" to "anon";

grant update on table "public"."pending_export_requests" to "anon";

grant delete on table "public"."pending_export_requests" to "authenticated";

grant insert on table "public"."pending_export_requests" to "authenticated";

grant references on table "public"."pending_export_requests" to "authenticated";

grant select on table "public"."pending_export_requests" to "authenticated";

grant trigger on table "public"."pending_export_requests" to "authenticated";

grant truncate on table "public"."pending_export_requests" to "authenticated";

grant update on table "public"."pending_export_requests" to "authenticated";

grant delete on table "public"."pending_export_requests" to "service_role";

grant insert on table "public"."pending_export_requests" to "service_role";

grant references on table "public"."pending_export_requests" to "service_role";

grant select on table "public"."pending_export_requests" to "service_role";

grant trigger on table "public"."pending_export_requests" to "service_role";

grant truncate on table "public"."pending_export_requests" to "service_role";

grant update on table "public"."pending_export_requests" to "service_role";


