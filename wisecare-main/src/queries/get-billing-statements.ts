import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getBillingStatements = (supabase: TypedSupabaseClient) => {
  return supabase
    .from('billing_statements')
    .select(
      `
    id,
    account_id,
      accounts (
        id,
        company_name,
        account_type: account_types!account_type_id(name),
        program_type: program_types!program_types_id(name)
      ),
    due_date,
    or_number,
    or_date,
    sa_number,
    total_contract_value,
    balance,
    billing_period,
    billing_start,
    billing_end,
    amount_billed,
    amount_paid,
    commission_rate,
    commission_earned,
    created_at,
    updated_at,
    account:accounts!inner(id, company_name, is_active),
    mode_of_payment:mode_of_payments(id, name)
  `,
      {
        count: 'exact',
      },
    )
    .order('created_at', { ascending: false })
    .throwOnError()
}

export default getBillingStatements
