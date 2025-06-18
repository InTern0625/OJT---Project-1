drop policy "Enable insert for admin" on "public"."pending_company_employees";

drop policy "Enable insert for users based on created_by" on "public"."pending_company_employees";

drop policy "Enable read access for admin" on "public"."pending_company_employees";

drop policy "Enable read access for users based on created_by" on "public"."pending_company_employees";

drop policy "Enable update for admin" on "public"."pending_company_employees";

drop policy "Enable update for users based on created_by" on "public"."pending_company_employees";

revoke delete on table "public"."pending_company_employees" from "anon";

revoke insert on table "public"."pending_company_employees" from "anon";

revoke references on table "public"."pending_company_employees" from "anon";

revoke select on table "public"."pending_company_employees" from "anon";

revoke trigger on table "public"."pending_company_employees" from "anon";

revoke truncate on table "public"."pending_company_employees" from "anon";

revoke update on table "public"."pending_company_employees" from "anon";

revoke delete on table "public"."pending_company_employees" from "authenticated";

revoke insert on table "public"."pending_company_employees" from "authenticated";

revoke references on table "public"."pending_company_employees" from "authenticated";

revoke select on table "public"."pending_company_employees" from "authenticated";

revoke trigger on table "public"."pending_company_employees" from "authenticated";

revoke truncate on table "public"."pending_company_employees" from "authenticated";

revoke update on table "public"."pending_company_employees" from "authenticated";

revoke delete on table "public"."pending_company_employees" from "service_role";

revoke insert on table "public"."pending_company_employees" from "service_role";

revoke references on table "public"."pending_company_employees" from "service_role";

revoke select on table "public"."pending_company_employees" from "service_role";

revoke trigger on table "public"."pending_company_employees" from "service_role";

revoke truncate on table "public"."pending_company_employees" from "service_role";

revoke update on table "public"."pending_company_employees" from "service_role";

alter table "public"."pending_company_employees" drop constraint "pending_company_employees_account_id_fkey";

alter table "public"."pending_company_employees" drop constraint "pending_company_employees_company_employee_id_fkey";

alter table "public"."pending_company_employees" drop constraint "pending_company_employees_created_by_fkey1";

alter table "public"."pending_company_employees" drop constraint "pending_company_employees_pkey";

drop index if exists "public"."pending_company_employees_pkey";

drop table "public"."pending_company_employees";


