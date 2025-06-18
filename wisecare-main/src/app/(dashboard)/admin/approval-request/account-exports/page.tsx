import AccountExportRequestModal from '@/app/(dashboard)/admin/approval-request/account-exports/account-export-request-modal'
import { AccountExportRequestsProvider } from '@/app/(dashboard)/admin/approval-request/account-exports/account-export-requests-provider'
import AccountExportRequestsTable from '@/app/(dashboard)/admin/approval-request/account-exports/account-export-requests-table'
import getPendingAccountExports from '@/queries/get-pending-account-exports'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Account Export Requests',
  }
}

const ExportRequestPage = async () => {
  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()
  await prefetchQuery(
    queryClient,
    getPendingAccountExports(supabase, 'accounts', 'desc'),
  )
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AccountExportRequestsProvider>
        <AccountExportRequestsTable />
        <AccountExportRequestModal />
      </AccountExportRequestsProvider>
    </HydrationBoundary>
  )
}

export default ExportRequestPage
