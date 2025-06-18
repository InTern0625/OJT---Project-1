create type "public"."dependent_type" as enum ('spouse', 'child', 'parent');

create type "public"."member_type" as enum ('principal', 'dependent');

alter table "public"."company_employees" add column "cancelation_date" date;

alter table "public"."company_employees" add column "dependent_relation" dependent_type;

alter table "public"."company_employees" add column "expiration_date" date;

alter table "public"."company_employees" add column "member_type" member_type;

alter table "public"."company_employees" add column "remarks" text;


