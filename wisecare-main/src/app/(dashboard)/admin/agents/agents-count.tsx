'use client'
import { PageDescription } from '@/components/page-header'
import getAgents from '@/queries/get-agents'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createBrowserClient } from '@/utils/supabase-client'

const AgentsCount = () => {
  const supabase = createBrowserClient()

  const { count } = useQuery(getAgents(supabase))

  return <PageDescription>{count} Agents</PageDescription>
}

export default AgentsCount
