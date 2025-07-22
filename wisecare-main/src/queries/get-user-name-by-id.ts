import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getUserIDbyName = (
  supabase: TypedSupabaseClient,
  name: string
) => {
  return supabase
    .from('user_profiles')
    .select('user_id')
    .or(`first_name.ilike.${name}%,last_name.ilike.${name}%`)
}

export default getUserIDbyName