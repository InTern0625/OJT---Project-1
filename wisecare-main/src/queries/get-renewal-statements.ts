import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getRenewalStatements = (supabase: TypedSupabaseClient) => {
  return supabase
    .from('accounts')
    .select(
      `
      is_active,
      id,
      company_name,
      company_address,
      nature_of_business,
      hmo_provider: hmo_providers!hmo_provider_id(name),
      account_types (name),
      total_utilization,
      total_premium_paid,
      signatory_designation,
      contact_person,
      initial_head_count,
      effective_date,
      coc_issue_date,
      expiration_date,
      delivery_date_of_membership_ids,
      orientation_date,
      initial_contract_value,
      mode_of_payments (name),
      wellness_lecture_date,
      annual_physical_examination_date,
      commision_rate,
      summary_of_benefits,
      created_at,
      updated_at,
      name_of_signatory,
      designation_of_contact_person,
      email_address_of_contact_person,
      is_account_active,
      original_effective_date,
      special_benefits_files,
      contract_proposal_files,
      additional_benefits_files,
      principal_plan_type:plan_types!principal_plan_type_id(name),
      dependent_plan_type:plan_types!dependent_plan_type_id(name),
      birthdate,
      gender,
      civil_status,
      card_number,
      room_plan_id,
      mbl,
      premium,
      program_type: program_types!program_types_id(name)
  `,
      {
        count: 'exact',
      },
    )
    .eq('is_active', true)
    .eq('is_account_active', true)
    .order('expiration_date', { ascending: false })
    .throwOnError()
}

export default getRenewalStatements
