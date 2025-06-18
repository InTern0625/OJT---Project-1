create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  description text not null,
  created_at timestamp not null default now(),
  read boolean not null default false
);

alter table notifications enable row level security;

create policy "allow all on own notifications"
on notifications
for all
to authenticated
using (true);
