import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

interface renewalFilters {
  accountType?: string
  customSort?: {key: string | null, value: string | null}
  sortOrder?: {col: string | null, desc: boolean }
  search?: {key: string | null, value: string | null}
  range?: { start: number; end: number }
}

const getRenewalStatementsCount = (supabase: TypedSupabaseClient, filters: renewalFilters = {}) => {
  const now = new Date()
  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(now.getMonth() + 3)
  let query = supabase
    .from('accounts')
    .select(
      `
      is_active,
      id,
      account_type: account_types(name, id),
      expiration_date,
      is_account_active,
      program_type: program_types!program_types_id(name)
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
    /*
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
  }*/

  //Account Type Filter
  if (filters.accountType === "Business") {
    query = query.or('and(account_type.not.is.null,program_type.is.null),and(account_type.is.null,program_type.is.null)');
  }else if (filters.accountType === "IFP"){
    query = query.or('and(account_type.is.null,program_type.not.is.null),and(account_type.is.null,program_type.is.null)');
  }

  return query
}

export default getRenewalStatementsCount
