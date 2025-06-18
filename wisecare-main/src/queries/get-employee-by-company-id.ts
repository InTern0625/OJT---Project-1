import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getEmployeeByCompanyId = (
  supabase: TypedSupabaseClient,
  companyId: string,
) => {
  return supabase
    .from('company_employees')
    .select(
      `
      id,
      account_id,
      first_name,
      last_name,
      middle_name,
      suffix,
      birth_date,
      gender,
      civil_status,
      card_number,
      effective_date,
      room_plan,
      maximum_benefit_limit,
      member_type,
      dependent_relation,
      expiration_date,
      cancelation_date,
      remarks,
      principal_member_name,
      created_at
    `,
    )
    .eq('account_id', companyId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
}

export default getEmployeeByCompanyId
