import { SupabaseClient } from '@supabase/supabase-js'

const isAdmin = async (supabase: SupabaseClient): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return false

  const { data, error } = await supabase
    .from('user_profiles')
    .select('departments(name)')
    .eq('user_id', user.id)
    .single()

  if (error || !data) return false

  // @ts-ignore
  return data.departments.name === 'admin'
}

export default isAdmin
