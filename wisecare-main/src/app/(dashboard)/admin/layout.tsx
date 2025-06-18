'use server'
import pageProtect from '@/utils/page-protect'
import { ReactNode } from 'react'

const AdminLayout = async ({ children }: { children: ReactNode }) => {
  await pageProtect(['admin'])
  return <>{children}</>
}

export default AdminLayout
