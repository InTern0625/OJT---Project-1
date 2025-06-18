'use server'
import { ApprovalRequestProvider } from '@/app/(dashboard)/admin/approval-request/accounts/approval-request-provider'
import ApprovalRequestTable from '@/app/(dashboard)/admin/approval-request/accounts/approval-request-table'
import { FeatureFlagProvider } from '@/providers/FeatureFlagProvider'
import getPendingAccounts from '@/queries/get-pending-accounts'
import { accountBenefitUpload } from '@/utils/flags'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { cookies } from 'next/headers'
import { Suspense } from 'react'

const ApprovalRequestInfo = dynamic(
  () =>
    import(
      '@/app/(dashboard)/admin/approval-request/accounts/approval-request-info'
    ),
)

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Review Accounts',
  }
}

const ApprovalRequestPage = async () => {
  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()
  await prefetchQuery(queryClient, getPendingAccounts(supabase, 'desc'))

  const isAccountBenefitUploadEnabled = await accountBenefitUpload()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FeatureFlagProvider
        flags={{ 'account-benefit-upload': isAccountBenefitUploadEnabled }}
      >
        <ApprovalRequestProvider>
          <ApprovalRequestTable />
          <Suspense fallback={<div>Loading...</div>}>
            <ApprovalRequestInfo />
          </Suspense>
        </ApprovalRequestProvider>
      </FeatureFlagProvider>
    </HydrationBoundary>
  )
}

export default ApprovalRequestPage
