'use client'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { subMonths } from 'date-fns'
import { Users } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { genConfig } from 'react-nice-avatar'
import { createBrowserClient } from '@/utils/supabase-client'

const Avatar = dynamic(() => import('react-nice-avatar'), { ssr: false })

const TopAgentsList = () => {
  const supabase = createBrowserClient()

  const { data } = useQuery(
    supabase
      .from('user_profiles')
      .select(
        `user_id, 
        first_name, 
        last_name, 
        departments(name), 
        accounts: accounts!accounts_agent_id_fkey(created_at)
      `,
      )
      .eq('departments.name', 'agent')
      .throwOnError(),
  )
  const topAgents = useMemo(() => {
    if (!data) return []

    const periodStart = subMonths(new Date(), 12)

    return data
      .map((agent) => ({
        ...agent,
        recentAccountsCount: agent.accounts.filter(
          (account) => new Date(account.created_at) >= periodStart,
        ).length,
      }))
      .sort((a, b) => b.recentAccountsCount - a.recentAccountsCount)
      .slice(0, 5)
  }, [data])

  return (
    <div className="space-y-4">
      {topAgents.map((agent, index) => {
        const config = genConfig(agent.user_id)

        return (
          <div key={agent.user_id} className="flex items-center space-x-4">
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground flex h-6 w-6 flex-row items-center justify-center rounded-full"
            >
              {index + 1}
            </Badge>
            <Avatar className="h-10 w-10" {...config} />
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold">
                {agent.first_name} {agent.last_name}
              </h3>
              <div className="flex items-center space-x-2">
                <Users className="text-muted-foreground h-4 w-4" />
                <span className="text-sm">
                  {agent.recentAccountsCount} Clients
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default TopAgentsList
