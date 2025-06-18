'use server'

import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import PendingTable from './pending-table'
import { cookies } from 'next/headers'
import { createServerClient } from '@/utils/supabase'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import getBillingStatements from '@/queries/get-billing-statements'

const PendingPage = async () => {
  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()
  await prefetchQuery(queryClient, getBillingStatements(supabase))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PendingTable />
    </HydrationBoundary>
  )
}

export default PendingPage
