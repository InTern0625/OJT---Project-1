import { TypedSupabaseClient } from '@/types/typedSupabaseClient'
// agent:user_profiles!agent_id(first_name, last_name, user_id),
const getCompanyAffiliates = (
  supabase: TypedSupabaseClient,
  parentCompanyId: string
) => {
  return supabase
    .from('company_affiliates')
    .select('id, parent_company_id, affiliate_name, affiliate_address')
    .eq('parent_company_id', parentCompanyId)
}

export default getCompanyAffiliates