'use client'

import countHmo from '@/app/(dashboard)/(home)/(dashboard)/top-hmo/count-hmo'
import { Progress } from '@/components/ui/progress'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createBrowserClient } from '@/utils/supabase-client'

const getColorClass = (percentage: number) => {
  if (percentage < 5) {
    return 'bg-red-500'
  } else if (percentage < 15) {
    return 'bg-orange-500'
  } else if (percentage < 30) {
    return 'bg-yellow-500'
  } else {
    return 'bg-green-500'
  }
}

const TopHmoList = () => {
  const supabase = createBrowserClient()
  const { data, error } = useQuery(
    supabase
      .from('accounts')
      .select('hmo_provider:hmo_provider_id(name), company_name')
      .eq('is_active', true)
      .eq('is_account_active', true)
      .throwOnError(),
  )

  const hmoData = countHmo(
    data as unknown as {
      hmo_provider: { name: string }
      company_name: string
    }[],
  )

  // Sort the hmoData by count in descending order
  const sortedHmoData = hmoData.sort((a, b) => b.count - a.count)

  // Limit to top 3 HMO providers
  const topThreeHmoData = sortedHmoData.slice(0, 3)

  if (error) {
    return <div>Error loading data</div>
  }

  if (!data) {
    return <div>Loading...</div>
  }

  return (
    <ul className="space-y-6">
      {topThreeHmoData.map((provider, index) => {
        const colorClass = getColorClass(provider.percentage)
        return (
          <li key={provider.hmo_provider} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{provider.hmo_provider}</span>
              <span className="text-muted-foreground text-sm">
                {provider.count} accounts
              </span>
            </div>
            <Progress value={provider.percentage} indicatorColor={colorClass} />
            <div className="flex items-center justify-between text-xs">
              <span
                className={`font-medium ${colorClass.replace('bg-', 'text-')}`}
              >
                Rank {index + 1}
              </span>
              <span className="text-muted-foreground">
                {provider.percentage.toFixed(2)}%
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default TopHmoList
