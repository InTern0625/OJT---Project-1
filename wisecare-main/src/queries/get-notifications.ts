import { TypedSupabaseClient } from '@/types/typedSupabaseClient'

const getNotifications = (supabase: TypedSupabaseClient, user_id?: string) => {
  return supabase
    .from('notifications')
    .select('id, title, description, created_at')
    .eq('user_id', user_id || '')
    .eq('read', false)
    .order('created_at', { ascending: false })
    .throwOnError()
}

export default getNotifications
