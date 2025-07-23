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
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form'
import { cookies } from 'next/headers'
import AccountsTable from './accounts-table'
import { FeatureFlagProvider } from '@/providers/FeatureFlagProvider'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Accounts',
  }
}

const AccountsPage = async ({
  searchParams: searchParamsPromise,
}: {
  searchParams?: { [key: string]: string | string[] | undefined }
}) => {
  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()
  const searchParams = await searchParamsPromise

  await prefetchQuery(queryClient, getAccounts(supabase))
  await prefetchQuery(
    queryClient,
    getAccountsColumnVisibilityByUserId(supabase, "columns_sme_accounts"),
  )
  await prefetchQuery(queryClient, getAccountsColumnSortingByUserId(supabase, "columns_sme_accounts"))

  await pageProtect([
    'marketing',
    'after-sales',
    'under-writing',
    'finance',
    'admin',
  ])

  const isAccountBenefitUploadEnabled = await accountBenefitUpload()

  const initialPageIndex = Number(searchParams?.fromPage ?? '0')
  const initialPageSize = Number(searchParams?.pageSize ?? '10')

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeatureFlagProvider
        flags={{
          'account-benefit-upload': isAccountBenefitUploadEnabled,
        }}
      >
        <AccountsTable  initialPageIndex={initialPageIndex} initialPageSize={initialPageSize}/>
      </FeatureFlagProvider>
    </HydrationBoundary>
  )
}

export default AccountsPage