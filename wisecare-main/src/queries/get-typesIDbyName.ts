import { TypedSupabaseClient } from '@/types/typedSupabaseClient'
import { TypeTabs } from '../app/(dashboard)/admin/types/type-card'

const getTypesIDbyName = (
  supabase: TypedSupabaseClient,
  page: TypeTabs,
  name: string
) => {
  return supabase
    .from(page)
    .select('id')
    .eq('is_active', true)
    .ilike('name', name)
    .maybeSingle()
    .throwOnError()
}


export default getTypesIDbyName
