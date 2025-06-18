
insert into storage.buckets
  (id, name, public)
values
  ('accounts', 'accounts', false);

create policy "Give  authenticated select access to folder benefits"
on "storage"."objects"
as permissive
for select
to authenticated
using (((bucket_id = 'accounts'::text) AND ((storage.foldername(name))[1] = 'benefits'::text)));


create policy "Give users authenticated insert access to folder benefits"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'accounts'::text) AND ((storage.foldername(name))[1] = 'benefits'::text)));