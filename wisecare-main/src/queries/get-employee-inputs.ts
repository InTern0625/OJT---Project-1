import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getEmployeeInputs = (supabase: TypedSupabaseClient, id: string) => {
  return supabase
    .from('company_employees')
    .select(
      `
      id,
      first_name,
      last_name,
      middle_name,
      suffix,
      birth_date,
      gender_type_id,
      civil_status_id,
      card_number,
      effective_date,
      room_plan_id,
      maximum_benefit_limit
      `,
    )
    .eq('account_id', id)
    .order('created_at', { ascending: false })
    .throwOnError()
}

export default getEmployeeInputs
