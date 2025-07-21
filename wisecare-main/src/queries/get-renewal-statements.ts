import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

interface renewalFilters {
  accountType?: string
  customSort?: {key: string | null, value: string | null}
  sortOrder?: {col: string | null, desc: boolean }
  search?: {key: string | null, value: string | null}
  range?: { start: number; end: number }
}

const getRenewalStatements = (supabase: TypedSupabaseClient, filters: renewalFilters = {}) => {
  const now = new Date()
  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(now.getMonth() + 3)
  let query = supabase
    .from('accounts')
    .select(
      `
      is_active,
      id,
      agent:agent_id(first_name, last_name),
      company_name,
      company_address,
      nature_of_business,
      hmo_provider: hmo_providers!hmo_provider_id(name),
      account_type: account_types(name, id),
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
      mode_of_payment:mode_of_payment_id(name, id),
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
      gender_type: gender_types!gender_types_id(name),
      civil_status: civil_status_types!civil_status_id(name),
      card_number,
      room_plan: room_plans!room_plan_id(name),
      mbl,
      premium,
      program_type: program_types!program_types_id(name),
      status_type: status_types!status_id(name),
      contact_number
  `,
      {
        count: 'exact',
      },
    )
    .eq('is_active', true)
    .eq('is_account_active', true)
    .lte('expiration_date', threeMonthsLater.toISOString())
    .order('expiration_date', { ascending: false })
    .throwOnError()
  if (filters.customSort?.key && filters.customSort?.value && filters.customSort.value !== "") {
    if (filters.customSort.key === "account_type_name") {
      query = query.eq("account_type_id", filters.customSort.value)
    } else if (filters.customSort.key === "status_type_name") {
      query = query.eq("status_id", filters.customSort.value)
    }
  } else if (filters.sortOrder?.col && !(filters.sortOrder.col == "account_type_name" || filters.sortOrder.col == "status_type_name")) {
    //Normal sorting only run if custom key or value is undefined
    query = query.order(filters.sortOrder.col, { ascending: !filters.sortOrder.desc })
  } else {
    //if none
    query = query.order('created_at', { ascending: false })
  }

  //Account Type Filter
  if (filters.accountType === "Business") {
    query = query.or('and(account_type.not.is.null,program_type.is.null),and(account_type.is.null,program_type.is.null)');
  }else if (filters.accountType === "IFP"){
    query = query.or('and(account_type.is.null,program_type.not.is.null),and(account_type.is.null,program_type.is.null)');
  }

  // Pagination
  if (filters.range) {
    const { start, end } = filters.range
    query = query.range(start, end)
  }

  return query
}

export default getRenewalStatements
