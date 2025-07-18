import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

// we dont need to pass userId here because we already have the user id in the supabase auth session
const getAccountsColumnVisibilityByUserId = (
  supabase: TypedSupabaseClient, 
  columns: string
) => {
  return supabase
    .from('accounts_column_visibility')
    .select("*")
    .maybeSingle()
    .throwOnError()
}

export default getAccountsColumnVisibilityByUserId
