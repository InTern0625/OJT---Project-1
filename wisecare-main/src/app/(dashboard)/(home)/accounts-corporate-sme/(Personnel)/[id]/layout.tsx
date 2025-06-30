import CompanyHeader from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/company-header'
import getAccountById from '@/queries/get-account-by-id'
import getEmployeeCount from '@/queries/get-employee-count'
import getRole from '@/utils/get-role'
import { createServerClient } from '@/utils/supabase'
import {
  fetchQueryInitialData,
  prefetchQuery,
} from '@supabase-cache-helpers/postgrest-react-query'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params
  const supabase = createServerClient(await cookies())
  const { data } = await supabase
    .from('accounts')
    .select('company_name')
    .eq('id', params.id)
    .single()

  return { title: data?.company_name }
}

interface Props {
  children: ReactNode
  params: Promise<{ id: string }>
}

const Layout: FC<Props> = async (props) => {
  const params = await props.params

  const { children } = props

  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()

  // fetch the account data to check if the account exists
  const [_key, initialData] = await fetchQueryInitialData(
    getAccountById(supabase, params.id),
  )

  // if the account does not exist, return a 404
  if (!initialData?.data) notFound()

  const userRole = await getRole()

  // prefetch the account and employee count data
  // to be used in company header
  await prefetchQuery(queryClient, getAccountById(supabase, params.id))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CompanyHeader id={params.id} userRole={userRole} />
      <div className="p-8 lg:mx-auto lg:max-w-6xl">{children}</div>
    </HydrationBoundary>
  )
}

export default Layout
