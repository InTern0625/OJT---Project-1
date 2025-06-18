drop trigger if exists "log_mode_of_premium_activity" on "public"."mode_of_premium";

drop policy "allow admin to insert mode_of_premium" on "public"."mode_of_premium";

drop policy "allow admin to update mode_of_premium" on "public"."mode_of_premium";

drop policy "allow authenticated users to read mode_of_premium" on "public"."mode_of_premium";

revoke delete on table "public"."mode_of_premium" from "anon";

revoke insert on table "public"."mode_of_premium" from "anon";

revoke references on table "public"."mode_of_premium" from "anon";

revoke select on table "public"."mode_of_premium" from "anon";

revoke trigger on table "public"."mode_of_premium" from "anon";

revoke truncate on table "public"."mode_of_premium" from "anon";

revoke update on table "public"."mode_of_premium" from "anon";

revoke delete on table "public"."mode_of_premium" from "authenticated";

revoke insert on table "public"."mode_of_premium" from "authenticated";

revoke references on table "public"."mode_of_premium" from "authenticated";

revoke select on table "public"."mode_of_premium" from "authenticated";

revoke trigger on table "public"."mode_of_premium" from "authenticated";

revoke truncate on table "public"."mode_of_premium" from "authenticated";

revoke update on table "public"."mode_of_premium" from "authenticated";

revoke delete on table "public"."mode_of_premium" from "service_role";

revoke insert on table "public"."mode_of_premium" from "service_role";

revoke references on table "public"."mode_of_premium" from "service_role";

revoke select on table "public"."mode_of_premium" from "service_role";

revoke trigger on table "public"."mode_of_premium" from "service_role";

revoke truncate on table "public"."mode_of_premium" from "service_role";

revoke update on table "public"."mode_of_premium" from "service_role";

alter table "public"."mode_of_premium" drop constraint "mode_of_premium_pkey";

drop index if exists "public"."mode_of_premium_pkey";

drop table "public"."mode_of_premium";

alter table "public"."company_employees" add column "middle_name" text;

alter table "public"."company_employees" add column "suffix" text;

alter table "public"."company_employees" alter column "first_name" set data type text using "first_name"::text;

alter table "public"."company_employees" alter column "last_name" set data type text using "last_name"::text;


