drop policy "Users can insert their own column visibility" on "public"."accounts_column_visibility";

drop policy "Users can update their own column visibility" on "public"."accounts_column_visibility";

drop policy "Users can view their own column visibility" on "public"."accounts_column_visibility";

CREATE INDEX account_status_changes_account_id_idx ON public.account_status_changes USING btree (account_id);

CREATE INDEX accounts_created_at_idx ON public.accounts USING btree (created_at);

CREATE INDEX accounts_is_active_idx ON public.accounts USING btree (is_active);

CREATE INDEX company_employees_account_id_idx ON public.company_employees USING btree (account_id);

CREATE INDEX company_employees_cancelation_date_idx ON public.company_employees USING btree (cancelation_date);

create policy "Enable all for users based on user_id"
on "public"."accounts_column_visibility"
as permissive
for all
to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



