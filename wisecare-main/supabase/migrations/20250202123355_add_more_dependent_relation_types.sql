alter type "public"."dependent_type" rename to "dependent_type__old_version_to_be_dropped";

create type "public"."dependent_type" as enum ('spouse', 'child', 'parent', 'principal', 'sibling');

alter table "public"."company_employees" alter column dependent_relation type "public"."dependent_type" using dependent_relation::text::"public"."dependent_type";

drop type "public"."dependent_type__old_version_to_be_dropped";


