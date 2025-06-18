alter table billing_statements
drop column mode_of_premium_id;

alter table billing_statements
add column mode_of_payment_id uuid references mode_of_payments(id) on delete set null;
