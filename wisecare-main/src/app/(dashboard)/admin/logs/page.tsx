'use server'
import ActivityTable from '@/app/(dashboard)/admin/logs/activity-table'
import { PageHeader, PageTitle } from '@/components/page-header'
import getActivityLog from '@/queries/get-activity-log'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { cookies } from 'next/headers'
import { Metadata } from 'next'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Activity Log',
  }
}

const ActivityLogsPage = async () => {
  const queryClient = new QueryClient()
  const supabase = createServerClient(await cookies())

  await prefetchQuery(queryClient, getActivityLog(supabase))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageHeader>
        <div>
          <PageTitle>Activity Log</PageTitle>
        </div>
      </PageHeader>
      <div className="border-border mx-5 mt-5 border-y">
        <ActivityTable />
      </div>
    </HydrationBoundary>
  )
}

export default ActivityLogsPage
