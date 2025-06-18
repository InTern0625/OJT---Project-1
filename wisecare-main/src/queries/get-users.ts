import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getUsers = (supabase: TypedSupabaseClient) => {
  return supabase
    .from('user_profiles')
    .select('user_id, first_name, last_name, departments!inner(name), email', {
      count: 'exact',
    })
    .neq('departments.name', 'agent')
    .order('created_at', { ascending: false })
    .throwOnError()
}

export default getUsers
