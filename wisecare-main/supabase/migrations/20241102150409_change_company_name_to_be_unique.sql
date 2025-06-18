alter table "public"."accounts" alter column "company_name" set not null;

alter table "public"."accounts" alter column "company_name" set data type text using "company_name"::text;

CREATE UNIQUE INDEX accounts_company_name_key ON public.accounts USING btree (company_name);

alter table "public"."accounts" add constraint "accounts_company_name_key" UNIQUE using index "accounts_company_name_key";


