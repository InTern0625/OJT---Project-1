create table "public"."accounts_column_sorting" (
    "user_id" uuid not null,
    "columns" jsonb[] not null,
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp without time zone not null default now()
);


alter table "public"."accounts_column_sorting" enable row level security;

CREATE UNIQUE INDEX accounts_column_sorting_pkey ON public.accounts_column_sorting USING btree (user_id);

alter table "public"."accounts_column_sorting" add constraint "accounts_column_sorting_pkey" PRIMARY KEY using index "accounts_column_sorting_pkey";

alter table "public"."accounts_column_sorting" add constraint "accounts_column_sorting_user_id_fkey" FOREIGN KEY (user_id) REFERENCES user_profiles(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."accounts_column_sorting" validate constraint "accounts_column_sorting_user_id_fkey";

grant delete on table "public"."accounts_column_sorting" to "anon";

grant insert on table "public"."accounts_column_sorting" to "anon";

grant references on table "public"."accounts_column_sorting" to "anon";

grant select on table "public"."accounts_column_sorting" to "anon";

grant trigger on table "public"."accounts_column_sorting" to "anon";

grant truncate on table "public"."accounts_column_sorting" to "anon";

grant update on table "public"."accounts_column_sorting" to "anon";

grant delete on table "public"."accounts_column_sorting" to "authenticated";

grant insert on table "public"."accounts_column_sorting" to "authenticated";

grant references on table "public"."accounts_column_sorting" to "authenticated";

grant select on table "public"."accounts_column_sorting" to "authenticated";

grant trigger on table "public"."accounts_column_sorting" to "authenticated";

grant truncate on table "public"."accounts_column_sorting" to "authenticated";

grant update on table "public"."accounts_column_sorting" to "authenticated";

grant delete on table "public"."accounts_column_sorting" to "service_role";

grant insert on table "public"."accounts_column_sorting" to "service_role";

grant references on table "public"."accounts_column_sorting" to "service_role";

grant select on table "public"."accounts_column_sorting" to "service_role";

grant trigger on table "public"."accounts_column_sorting" to "service_role";

grant truncate on table "public"."accounts_column_sorting" to "service_role";

grant update on table "public"."accounts_column_sorting" to "service_role";

create policy "Enable all for users based on user_id"
on "public"."accounts_column_sorting"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



