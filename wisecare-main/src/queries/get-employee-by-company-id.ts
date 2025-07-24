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
      card_number,
      effective_date,
      maximum_benefit_limit,
      member_type,
      dependent_relation,
      expiration_date,
      cancelation_date,
      remarks,
      principal_member_name,
      created_at,
      gender_type: gender_types_id(name, id),
      civil_status_type: civil_status_id(name, id),
      room_plan_type: room_plan_id(name, id),
      affiliate: company_affiliate_id(affiliate_name, affiliate_address)
    `,
    )
    .eq('account_id', companyId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
}

export default getEmployeeByCompanyId
