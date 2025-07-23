'use server'

import { BillingProvider } from '@/app/(dashboard)/(home)/billing-statements-corporate-sme/billing-provider'
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
import getAccountsColumnSortingByUserId from '@/queries/get-accounts-column-sorting-by-user-id'
import getAccountsColumnVisibilityByUserId from '@/queries/get-accounts-column-visibility-by-user-id'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Renewal Statements',
  }
}
const RenewalStatementsPage = async ({
  searchParams: searchParamsPromise,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) => {
  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()
  const searchParams = await searchParamsPromise

  await prefetchQuery(queryClient, getRenewalStatements(supabase))
  await prefetchQuery(
      queryClient,
      getAccountsColumnVisibilityByUserId(supabase, "columns_sme_renewals"),
    )
  await prefetchQuery(queryClient, getAccountsColumnSortingByUserId(supabase, "columns_sme_renewals"))
  
  await pageProtect(['admin', 'after-sales', 'marketing'])
  const initialPageIndex = Number(searchParams?.fromPage ?? '0')
  const initialPageSize = Number(searchParams?.pageSize ?? '10')
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BillingProvider>
        <PendingTable initialPageIndex={initialPageIndex} initialPageSize={initialPageSize} />
      </BillingProvider>
    </HydrationBoundary>
  )
}

export default RenewalStatementsPage