alter table "public"."accounts" rename column "effectivity_date" to "effective_date";

alter table "public"."accounts" add column "original_effective_date" date;


