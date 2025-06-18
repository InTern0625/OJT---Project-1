alter table "public"."pending_export_requests" add column "approved_at" timestamp with time zone;

alter table "public"."pending_export_requests" add column "approved_by" uuid;

alter table "public"."pending_export_requests" alter column "created_by" set default auth.uid();

alter table "public"."pending_export_requests" add constraint "pending_export_requests_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES user_profiles(user_id) not valid;

alter table "public"."pending_export_requests" validate constraint "pending_export_requests_approved_by_fkey";


