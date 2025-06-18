alter table "public"."accounts" drop constraint "accounts_current_hmo_provider_id_fkey";

alter table "public"."accounts" rename column "current_hmo_provider_id" to "old_hmo_provider_id";

alter table "public"."accounts" add constraint "accounts_current_hmo_provider_id_fkey" FOREIGN KEY (old_hmo_provider_id) REFERENCES hmo_providers(id) ON DELETE SET NULL not valid;

alter table "public"."accounts" validate constraint "accounts_current_hmo_provider_id_fkey";

