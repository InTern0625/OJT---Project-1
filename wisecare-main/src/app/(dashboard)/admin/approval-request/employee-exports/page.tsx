import EmployeeExportRequestsModal from '@/app/(dashboard)/admin/approval-request/employee-exports/employee-export-requests-modal'
import { EmployeeExportRequestsProvider } from '@/app/(dashboard)/admin/approval-request/employee-exports/employee-export-requests-provider'
import EmployeeExportsRequestsTable from '@/app/(dashboard)/admin/approval-request/employee-exports/employee-exports-requests-table'
import getAllPendingEmployeeExports from '@/queries/get-all-pending-employee-exports'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Employee Export Requests',
  }
}

const Page = async () => {
  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()
  await prefetchQuery(
    queryClient,
    getAllPendingEmployeeExports(supabase, 'employees', 'desc'),
  )
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployeeExportRequestsProvider>
        <EmployeeExportsRequestsTable />
        <EmployeeExportRequestsModal />
      </EmployeeExportRequestsProvider>
    </HydrationBoundary>
  )
}

export default Page
