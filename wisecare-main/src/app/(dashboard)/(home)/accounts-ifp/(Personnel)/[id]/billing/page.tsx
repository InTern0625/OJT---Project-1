'use server'
import CompanyProvider from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-provider'
import BillingStatementsTable from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/billing/billing-statements-table'
import StatsCard from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/billing/stats-card'
import AddBillingStatementButton from '@/app/(dashboard)/(home)/billing-statements/add-billing-statement-button'
import getBillingStatementByCompanyId from '@/queries/get-billing-statement-by-company-id'
import getRole from '@/utils/get-role'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { cookies } from 'next/headers'

const BillingPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params
  const companyId = params.id

  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()
  await prefetchQuery(
    queryClient,
    getBillingStatementByCompanyId(supabase, companyId),
  )

  const role = await getRole()

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CompanyProvider companyId={companyId} role={role || ''}>
        <div className="ring-offset-background focus-visible:ring-ring mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden">
          <div className="ml-auto flex w-full flex-col gap-4 pb-4 lg:flex-row lg:items-end lg:justify-between">
            <StatsCard companyId={companyId} />
            <AddBillingStatementButton />
          </div>
          <BillingStatementsTable companyId={companyId} />
        </div>
      </CompanyProvider>
    </HydrationBoundary>
  )
}

export default BillingPage
