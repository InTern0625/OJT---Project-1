'use server'

import { BillingProvider } from '@/app/(dashboard)/(home)/billing-statements/billing-provider'
import getRenewalStatements from '@/queries/get-renewal-statements'
import pageProtect from '@/utils/page-protect'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import PendingTable from './pending-table'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Renewal Statements',
  }
}

const RenewalStatementsPage = async () => {
  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()
  await prefetchQuery(queryClient, getRenewalStatements(supabase))

  await pageProtect(['finance', 'admin'])

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BillingProvider>
        <PendingTable />
      </BillingProvider>
    </HydrationBoundary>
  )
}

export default RenewalStatementsPage
