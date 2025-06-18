alter table "public"."accounts_column_visibility" drop constraint "accounts_column_visibility_pkey";

drop index if exists "public"."accounts_column_visibility_pkey";

alter table "public"."accounts_column_visibility" drop column "id";

alter table "public"."accounts_column_visibility" alter column "user_id" set default auth.uid();

CREATE UNIQUE INDEX accounts_column_visibility_pkey ON public.accounts_column_visibility USING btree (user_id);

alter table "public"."accounts_column_visibility" add constraint "accounts_column_visibility_pkey" PRIMARY KEY using index "accounts_column_visibility_pkey";


