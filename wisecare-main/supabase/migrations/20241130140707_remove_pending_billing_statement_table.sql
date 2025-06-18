drop policy "Enable insert access for admin" on "public"."pending_billing_statements";

drop policy "Enable insert for users based on created_by" on "public"."pending_billing_statements";

drop policy "Enable read access for users based on created_by" on "public"."pending_billing_statements";

drop policy "Enable read for users based on created_by" on "public"."pending_billing_statements";

drop policy "Enable update for admin" on "public"."pending_billing_statements";

drop policy "Enable update for users based on created_by" on "public"."pending_billing_statements";

revoke delete on table "public"."pending_billing_statements" from "anon";

revoke insert on table "public"."pending_billing_statements" from "anon";

revoke references on table "public"."pending_billing_statements" from "anon";

revoke select on table "public"."pending_billing_statements" from "anon";

revoke trigger on table "public"."pending_billing_statements" from "anon";

revoke truncate on table "public"."pending_billing_statements" from "anon";

revoke update on table "public"."pending_billing_statements" from "anon";

revoke delete on table "public"."pending_billing_statements" from "authenticated";

revoke insert on table "public"."pending_billing_statements" from "authenticated";

revoke references on table "public"."pending_billing_statements" from "authenticated";

revoke select on table "public"."pending_billing_statements" from "authenticated";

revoke trigger on table "public"."pending_billing_statements" from "authenticated";

revoke truncate on table "public"."pending_billing_statements" from "authenticated";

revoke update on table "public"."pending_billing_statements" from "authenticated";

revoke delete on table "public"."pending_billing_statements" from "service_role";

revoke insert on table "public"."pending_billing_statements" from "service_role";

revoke references on table "public"."pending_billing_statements" from "service_role";

revoke select on table "public"."pending_billing_statements" from "service_role";

revoke trigger on table "public"."pending_billing_statements" from "service_role";

revoke truncate on table "public"."pending_billing_statements" from "service_role";

revoke update on table "public"."pending_billing_statements" from "service_role";

alter table "public"."pending_billing_statements" drop constraint "billing_statements_billing_period_check";

alter table "public"."pending_billing_statements" drop constraint "pending_billing_statements_account_id_fkey";

alter table "public"."pending_billing_statements" drop constraint "pending_billing_statements_billing_statement_id_fkey";

alter table "public"."pending_billing_statements" drop constraint "pending_billing_statements_created_by_fkey";

alter table "public"."pending_billing_statements" drop constraint "pending_billing_statements_mode_of_payment_id_fkey";

alter table "public"."pending_billing_statements" drop constraint "pending_billing_statements_pkey";

drop index if exists "public"."pending_billing_statements_pkey";

drop table "public"."pending_billing_statements";


