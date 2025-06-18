'use server'
import getTypes from '@/queries/get-types'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { cookies } from 'next/headers'
import TypeCard from './type-card'
import { Metadata } from 'next'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Manage Types',
  }
}

const TypesPage = async () => {
  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()

  await prefetchQuery(queryClient, getTypes(supabase, 'account_types'))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TypeCard />
    </HydrationBoundary>
  )
}

export default TypesPage
