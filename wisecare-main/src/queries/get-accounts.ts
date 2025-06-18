import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getAccounts = (supabase: TypedSupabaseClient) => {
  return supabase
    .from('accounts')
    .select(
      `
  id,
  agent:user_profiles(first_name, last_name),
  company_name,
  company_address,
  nature_of_business,
  hmo_provider:hmo_provider_id(name, id),
  previous_hmo_provider:previous_hmo_provider_id(name, id),
  old_hmo_provider:old_hmo_provider_id(name, id),
  account_type:account_types(name, id),
  total_utilization,
  total_premium_paid,
  signatory_designation,
  contact_person,
  contact_number,
  principal_plan_type:principal_plan_type_id(name, id),
  dependent_plan_type:dependent_plan_type_id(name, id),
  initial_head_count,
  effective_date,
  original_effective_date,
  coc_issue_date,
  expiration_date,
  delivery_date_of_membership_ids,
  orientation_date,
  initial_contract_value,
  mode_of_payment:mode_of_payment_id(name, id),
  wellness_lecture_date,
  annual_physical_examination_date,
  commision_rate,
  additional_benefits,
  special_benefits,
  summary_of_benefits,
  created_at,
  updated_at,
  name_of_signatory,
  designation_of_contact_person,
  email_address_of_contact_person,
  is_account_active

  `,
      {
        count: 'exact',
        head: false,
      },
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false })
}

export default getAccounts
