import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getAllAccounts = (supabase: TypedSupabaseClient) => {
  return supabase
    .from('accounts')
    .select('id, company_name')
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .throwOnError()
}

export default getAllAccounts
