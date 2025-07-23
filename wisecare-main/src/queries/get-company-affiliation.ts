import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getAffiliation = (supabase: TypedSupabaseClient, accountId: string) => {
  return supabase
    .from('company_affiliates')
    .select('id, parent_company_id, affiliate_name')
    .eq("parent_company_id", accountId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })
    .throwOnError()
}

export default getAffiliation
