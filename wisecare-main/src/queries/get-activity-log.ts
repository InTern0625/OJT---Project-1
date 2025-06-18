import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getActivityLog = (supabase: TypedSupabaseClient) => {
  return supabase
    .from('activity_logs')
    .select('id, user_id, description, created_at')
    .order('created_at', { ascending: false })
    .limit(50)
    .throwOnError()
}

export default getActivityLog
