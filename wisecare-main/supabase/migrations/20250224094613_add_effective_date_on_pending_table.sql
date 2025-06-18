alter table "public"."pending_accounts" rename column "effectivity_date" to "effective_date";

alter table "public"."pending_accounts" add column "original_effective_date" date;


