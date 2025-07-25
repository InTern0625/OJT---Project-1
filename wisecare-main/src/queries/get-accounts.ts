import { TypedSupabaseClient } from '@/types/typedSupabaseClient'
import { emitKeypressEvents } from 'readline'
interface AccountFilters {
  accountType?: string
  customSort?: {key: string | null, value: string | null}
  sortOrder?: {col: string | null, desc: boolean }
  search?: {key: string | null, value: string | null}
  range?: { start: number; end: number }
  agentIds?: string[]
}

const getAccounts = (supabase: TypedSupabaseClient, filters: AccountFilters = {}) => {
  let query = supabase
    .from('accounts')
    .select(
      `
  id,
  agent:agent_id(first_name, last_name),
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
  is_account_active,
  is_editing,
  editing_user,
  editing_timestampz,
  editing:editing_user(first_name, last_name),
  birthdate,
  card_number,
  room_plan: room_plan_id(name, id),
  mbl,
  premium,
  program_type: program_types(name, id),
  gender_type: gender_types_id(name, id),
  civil_status: civil_status_id(name, id),
  status_type: status_id(name, id)
  `,
      {
        count: 'exact',
        head: false,
      },
    )
    .eq('is_active', true)
  
  
  // Sort Filters
  if (filters.customSort?.key && filters.customSort?.value && filters.customSort.value !== "") {
    if (filters.customSort.key === "account_type_name") {
      query = query.eq("account_type_id", filters.customSort.value)
    } else if (filters.customSort.key === "status_type_name") {
      query = query.eq("status_id", filters.customSort.value)
    } else if (filters.customSort.key === "program_type_id") {
      query = query.eq("program_type_id", filters.customSort.value)
    } else if (filters.customSort.key === "room_plan_id") {
      query = query.eq("room_plan_id", filters.customSort.value)
    }
  } else if (filters.sortOrder?.col && !(filters.sortOrder.col == "account_type_name" || filters.sortOrder.col == "status_type_name")) {
    //Normal sorting only run if custom key or value is undefined
    query = query.order(filters.sortOrder.col, { ascending: !filters.sortOrder.desc })
  } else {
    //if none
    query = query.order('created_at', { ascending: false })
  }

  //Account type filter
  if (filters.accountType === "Business") {
    query = query.or(
      'and(account_type_id.not.is.null,program_types_id.is.null),and(account_type_id.is.null,program_types_id.is.null)'
    );
  } else if (filters.accountType === "IFP") {
    query = query.or(
      'and(account_type_id.is.null,program_types_id.not.is.null),and(account_type_id.is.null,program_types_id.is.null)'
    );
  }


  //Search filter
  const searchValue = filters.search?.value ?? ''
  if (filters.search?.key === 'company' && searchValue) {
    query = query.ilike('company_name', `${searchValue}%`)
  }
  if (filters.agentIds && filters.agentIds.length > 0 && filters.search?.key === "agent") {
    query = query.in('agent_id', filters.agentIds)
  }
  if (filters.agentIds && filters.search?.key === "agent"){
    query = query.in('agent_id', filters.agentIds)
  }
  // Pagination
  if (filters.range) {
    const { start, end } = filters.range
    query = query.range(start, end)
  }
  return query
}
export default getAccounts
