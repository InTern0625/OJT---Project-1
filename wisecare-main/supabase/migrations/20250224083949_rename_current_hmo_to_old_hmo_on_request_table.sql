alter table "public"."pending_accounts" drop constraint "pending_accounts_current_hmo_provider_id_fkey";

alter table "public"."pending_accounts" rename column "current_hmo_provider_id" to "old_hmo_provider_id";

alter table "public"."pending_accounts" add constraint "pending_accounts_current_hmo_provider_id_fkey" FOREIGN KEY (old_hmo_provider_id) REFERENCES hmo_providers(id) ON DELETE SET NULL not valid;

alter table "public"."pending_accounts" validate constraint "pending_accounts_current_hmo_provider_id_fkey";

