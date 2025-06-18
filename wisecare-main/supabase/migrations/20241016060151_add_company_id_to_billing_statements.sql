ALTER TABLE billing_statements
ADD COLUMN account_id uuid references accounts(id) ON DELETE SET NULL;
