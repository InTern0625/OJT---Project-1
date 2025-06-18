'use server'

import { cookies } from 'next/headers'
import { createServerClient } from './supabase'
import { notFound, redirect } from 'next/navigation'

const pageProtect = async (departments: string[]) => {
  const supabase = createServerClient(await cookies())

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: userProfileData, error: userProfileError } = await supabase
    .from('user_profiles')
    .select('departments(name)')
    .eq('user_id', user?.id)
    .single()

  if (userProfileError) {
    return notFound()
  }

  // @ts-ignore
  if (!departments.includes(userProfileData.departments.name as any)) {
    return notFound()
  }
}

export default pageProtect
