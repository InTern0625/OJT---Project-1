'use server'
import AdminNavigationClient from '@/components/layout/navigation/admin-navigation-client'
import isAdmin from '@/utils/is-admin'
import { createServerClient } from '@/utils/supabase'
import { cookies } from 'next/headers'

const AdminNavigation = async () => {
  const supabase = createServerClient(await cookies())
  if (!(await isAdmin(supabase))) return null

  return <AdminNavigationClient />
}

export default AdminNavigation
