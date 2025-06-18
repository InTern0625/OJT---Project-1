import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getAgents = (supabase: TypedSupabaseClient) => {
  return supabase
    .from('user_profiles')
    .select(
      'user_id, first_name, last_name, email, created_at, departments!inner(name)',
      {
        count: 'exact',
      },
    )
    .eq('departments.name', 'agent')
    .order('created_at', { ascending: false })
    .throwOnError()
}

export default getAgents
