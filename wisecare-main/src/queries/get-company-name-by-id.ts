import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getCompanyName = (supabase: TypedSupabaseClient, accountId: string) => {
  return supabase
    .from('accounts')
    .select('company_name')
    .eq("id", accountId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .single()
    .throwOnError()
}

export default getCompanyName