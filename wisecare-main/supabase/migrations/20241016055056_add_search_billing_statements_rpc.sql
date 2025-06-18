DROP FUNCTION IF EXISTS public.search_billing_statements;

CREATE OR REPLACE FUNCTION public.search_billing_statements(billing_term varchar, start_offset integer, end_offset integer)
RETURNS table(
  id uuid, account_id uuid, account_name text, mode_of_premium text, due_date date, or_number text, or_date date, sa_number text, amount float, 
  total_contract_value float, balance float, billing_period int, amount_billed float, amount_paid float, 
  commission_rate float, commission_earned float, created_at timestamptz, updated_at timestamptz, total_count bigint
)
LANGUAGE plpgsql
AS $$
  begin
    return query
      SELECT 
        b.id, b.account_id, a.company_name::text as account_name, mp.name::text as mode_of_premium, b.due_date, b.or_number, b.or_date, b.sa_number, b.amount, 
        b.total_contract_value, b.balance, b.billing_period, b.amount_billed, b.amount_paid, 
        b.commission_rate, b.commission_earned, b.created_at, b.updated_at, COUNT(*) OVER() AS total_count
      FROM billing_statements b
      LEFT JOIN mode_of_premium mp ON b.mode_of_premium_id = mp.id
      LEFT JOIN accounts a ON b.account_id = a.id
      WHERE billing_term = '' OR billing_term % ANY(STRING_TO_ARRAY(b.or_number, ' '))
      OR billing_term % ANY(STRING_TO_ARRAY(b.sa_number, ' '))
      OR billing_term % ANY(STRING_TO_ARRAY(mp.name, ' '))
      OR billing_term % ANY(STRING_TO_ARRAY(a.company_name, ' '))
      OFFSET start_offset LIMIT end_offset - start_offset + 1;
  end;
$$;
