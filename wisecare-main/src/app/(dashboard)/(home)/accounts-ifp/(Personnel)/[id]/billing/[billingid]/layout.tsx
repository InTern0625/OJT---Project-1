'use server'

import getBillingStatementById from '@/queries/get-billing-statement-by-id'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { ReactNode } from 'react'

const BillingStatementEditLayout = async (props: {
  children: ReactNode
  params: Promise<{ billingid: string }>
}) => {
  const params = await props.params

  const { children } = props

  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()

  if (!params.billingid) return notFound()

  await prefetchQuery(
    queryClient,
    getBillingStatementById(supabase, params.billingid),
  )

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  )
}

export default BillingStatementEditLayout
