import { TypedSupabaseClient } from '@/types/typedSupabaseClient'
// agent:user_profiles!agent_id(first_name, last_name, user_id),
const getAffiliateId = (
  supabase: TypedSupabaseClient,
  Id: string
) => {
  return supabase
    .from('company_employees')
    .select('company_affiliate') // must include the column here
    .eq('id', Id)
    .single()
}

export default getAffiliateId