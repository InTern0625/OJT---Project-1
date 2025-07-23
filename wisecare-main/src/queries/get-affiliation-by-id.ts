import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getTypesIDbyName = (
  supabase: TypedSupabaseClient,
  accountId: string,
  name: string
) => {
  return supabase
    .from('company_affiliates')
    .select('id')
    .eq('is_active', true)
    .eq("parent_company_id", accountId)
    .ilike('name', name)
    .maybeSingle()
    .throwOnError()
}


export default getTypesIDbyName
