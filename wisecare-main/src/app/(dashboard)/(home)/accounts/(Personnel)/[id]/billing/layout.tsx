'use server'
import pageProtect from '@/utils/page-protect'

const BillingLayout = async ({ children }: { children: React.ReactNode }) => {
  await pageProtect(['finance', 'admin'])
  return <>{children}</>
}

export default BillingLayout
