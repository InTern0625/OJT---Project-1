import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

export type TypeTabs =
  | 'account_types'
  | 'hmo_providers'
  | 'mode_of_payments'
  | 'plan_types'
  | 'program_types'
  | 'room_plans'

const getTypes = (supabase: TypedSupabaseClient, page: TypeTabs) => {
  return supabase
    .from(page)
    .select('name, id, created_at')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .throwOnError()
}

export default getTypes
