import { TypedSupabaseClient } from '@/types/typedSupabaseClient'
// agent:user_profiles!agent_id(first_name, last_name, user_id),
const getCompanyAffiliates = (
  supabase: TypedSupabaseClient,
  parentCompanyId: string
) => {
  return supabase
    .from('company_affiliates')
    .select(`
  id,
  affiliate_name,
  affiliate_address,
  parent_company_id (company_name:string)
  `)
    .eq('id', parentCompanyId)
}

export default getCompanyAffiliates