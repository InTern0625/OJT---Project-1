import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getBillingStatementById = (supabase: TypedSupabaseClient, id: string) =>
  supabase
    .from('billing_statements')
    .select(
      `
      id,
      account_id,
      mode_of_payments(name, id),
      due_date,
      or_number,
      or_date,
      sa_number,
      total_contract_value,
      balance,
      billing_period,
      is_active,
      amount_billed,
      amount_paid,
      commission_rate,
      commission_earned,
      created_at,
      account:accounts!inner(id, company_name, is_active)
      `,
    )
    .eq('id', id)
    .eq('is_active', true)
    .single()
    .throwOnError()

export default getBillingStatementById
