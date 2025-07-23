import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getAffiliateCount = (supabase: TypedSupabaseClient, id: string) => {
  return supabase
    .from('company_affiliates')
    .select('id', { count: 'exact', head: true })
    .eq('parent_company_id', id)
    .eq('is_active', true)
    .throwOnError()
}

export default getAffiliateCount
