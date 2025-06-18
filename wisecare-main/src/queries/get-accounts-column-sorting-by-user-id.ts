import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

// we dont need to pass userId here because we already have the user id in the supabase auth session
const getAccountsColumnSortingByUserId = (supabase: TypedSupabaseClient) => {
  return supabase
    .from('accounts_column_sorting')
    .select('columns')
    .maybeSingle()
    .throwOnError()
}

export default getAccountsColumnSortingByUserId
