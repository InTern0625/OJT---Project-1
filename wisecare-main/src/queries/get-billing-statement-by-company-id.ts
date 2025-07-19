import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getBillingStatementByCompanyId = (
  supabase: TypedSupabaseClient,
  id: string,
) => {
  return supabase
    .from('billing_statements')
    .select(
      `
      id,
      account_id,
      mode_of_payments(name, id),
      billing_date,
      due_date,
      or_number,
      or_date,
      sa_number,
      total_contract_value,
      balance,
      billing_period,
      billing_start,
      billing_end,
      is_active,
      amount_billed,
      amount_paid,
      commission_rate,
      commission_earned,
      created_at,
      account:accounts!inner(id, company_name, is_active)
      `,
    )
    .eq('account_id', id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .throwOnError()
}

export default getBillingStatementByCompanyId
