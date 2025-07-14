import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getPendingAccounts = (
  supabase: TypedSupabaseClient,
  sort: 'asc' | 'desc' = 'desc',
) => {
  return supabase
    .from('pending_accounts')
    .select(
      `
    id,
    agent:agent_id(first_name, last_name, user_id),
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
    name_of_signatory,
    designation_of_contact_person,
    email_address_of_contact_person,
    created_at,
    updated_at,
    is_active,
    is_approved,
    created_by(first_name, last_name),
    account_id,
    operation_type,
    is_delete_account,
    special_benefits_files,
    contract_proposal,
    contract_proposal_files,
    additional_benefits_text,
    additional_benefits_files,
    birthdate,
    card_number,
    room_plan: room_plan_id(name, id),
    mbl,
    premium,
    program_type: program_types_id(name, id),
    gender_type: gender_types_id(name, id),
    civil_status: civil_status_id(name, id),
    status_type: status_id(name, id)
  `,
      {
        count: 'exact',
      },
    )
    .eq('is_approved', false)
    .eq('is_active', true)
    .order('created_at', { ascending: sort === 'asc' })
    .throwOnError()

  // we don't need to check for the created_by column
  //since RLS already handle this for us
}

export default getPendingAccounts
