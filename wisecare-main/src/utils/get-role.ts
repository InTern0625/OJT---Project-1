'use server'
import { cookies } from 'next/headers'
import { createServerClient } from './supabase'

const getRole = async (): Promise<string | null> => {
  const supabase = createServerClient(await cookies())

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: userProfileData, error: userProfileError } = await supabase
    .from('user_profiles')
    .select('departments(name)')
    .eq('user_id', user?.id)
    .single()

  if (userProfileError) {
    return null
  }

  // @ts-ignore
  return userProfileData.departments.name
}

export default getRole
