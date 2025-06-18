'use server'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const supabase = createServerClient(await cookies())
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) {
    return redirect('/')
  }
  return <>{children}</>
}

export default AuthLayout
