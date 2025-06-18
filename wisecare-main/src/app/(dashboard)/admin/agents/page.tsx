'use server'
import { PageHeader, PageTitle } from '@/components/page-header'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { cookies } from 'next/headers'
import AgentsCount from './agents-count'
import AgentsList from './agents-list'
import AddAgent from '@/app/(dashboard)/admin/agents/create/add-agent'
import getAgents from '@/queries/get-agents'
import { Metadata } from 'next'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Manage Agents',
  }
}

const AgentsPage = async () => {
  const queryClient = new QueryClient()
  const supabase = createServerClient(await cookies())

  await prefetchQuery(queryClient, getAgents(supabase))
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-8">
        <PageHeader>
          <div>
            <PageTitle>Agents</PageTitle>
            <AgentsCount />
          </div>
          <AddAgent />
        </PageHeader>

        <AgentsList />
      </div>
    </HydrationBoundary>
  )
}

export default AgentsPage
