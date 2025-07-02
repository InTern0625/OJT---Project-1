'use server'
import getAccounts from '@/queries/get-accounts'
import getAccountsColumnSortingByUserId from '@/queries/get-accounts-column-sorting-by-user-id'
import getAccountsColumnVisibilityByUserId from '@/queries/get-accounts-column-visibility-by-user-id'
import { accountBenefitUpload } from '@/utils/flags'
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
import AccountsTable from './accounts-table'
import { FeatureFlagProvider } from '@/providers/FeatureFlagProvider'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Accounts',
  }
}

const AccountsPage = async () => {
  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()
  await prefetchQuery(queryClient, getAccounts(supabase))
  await prefetchQuery(
    queryClient,
    getAccountsColumnVisibilityByUserId(supabase, "columns_ifp_accounts"),
  )
  await prefetchQuery(queryClient, getAccountsColumnSortingByUserId(supabase, "columns_ifp_accounts"))

  await pageProtect([
    'marketing',
    'after-sales',
    'under-writing',
    'finance',
    'admin',
  ])

  const isAccountBenefitUploadEnabled = await accountBenefitUpload()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeatureFlagProvider
        flags={{
          'account-benefit-upload': isAccountBenefitUploadEnabled,
        }}
      >
        <AccountsTable />
      </FeatureFlagProvider>
    </HydrationBoundary>
  )
}

export default AccountsPage
