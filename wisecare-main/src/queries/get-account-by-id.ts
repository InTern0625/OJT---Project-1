import { TypedSupabaseClient } from '@/types/typedSupabaseClient'
// agent:user_profiles!agent_id(first_name, last_name, user_id),
const getAccountById = (supabase: TypedSupabaseClient, id: string) => {
  return supabase
    .from('accounts')
    .select(
      `
      id, 
      is_active,
      status_type: status_types!status_id(name,id),
      is_account_active,
      agent:agent_id(first_name, last_name, user_id),
      company_name, 
      remarks,
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
      mode_of_payment:mode_of_payments!mode_of_payment_id(name, id), 
      wellness_lecture_date, 
      annual_physical_examination_date, 
      commision_rate, 
      additional_benefits, 
      summary_of_benefits, 
      name_of_signatory, 
      designation_of_contact_person, 
      email_address_of_contact_person, 
      created_at, 
      updated_at,
      special_benefits_files,
      contract_proposal_files,
      additional_benefits_files,
      special_benefits,
      contract_proposal,
      additional_benefits_text,
      birthdate,
      card_number,
      room_plan: room_plan_id(name, id),
      mbl,
      premium,
      program_type: program_types_id(name, id),
      gender_type: gender_types_id(name, id),
      civil_status_type: civil_status_id(name,id)
      `,
    )
    .eq('id', id)
    .maybeSingle()
}

export default getAccountById