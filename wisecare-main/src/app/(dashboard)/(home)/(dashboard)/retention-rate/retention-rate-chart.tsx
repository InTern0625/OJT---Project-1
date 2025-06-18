'use client'

import chartConfig from '@/app/(dashboard)/(home)/(dashboard)/retention-rate/chart-config'
import { ChartContainer } from '@/components/ui/chart'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { subMonths } from 'date-fns'
import { useMemo } from 'react'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'
import { calculateRetentionRate } from '@/utils/retentionRate'
import { createBrowserClient } from '@/utils/supabase-client'

// Define the type for the data returned from the query
interface AccountStatusChange {
  account_id: string
  is_account_active: boolean
  changed_at: string
}

const periodEnd = new Date()
const periodStart = subMonths(periodEnd, 1)

const RetentionRateChart = () => {
  const supabase = createBrowserClient()

  const { data } = useQuery<AccountStatusChange[]>(
    supabase
      .from('account_status_changes')
      .select('account_id, is_account_active, changed_at')
      .order('changed_at', { ascending: false })
      .throwOnError(),
  )

  const retentionRate = useMemo(
    () => calculateRetentionRate(data ?? [], periodStart, periodEnd),
    [data],
  )

  const chartData = useMemo(
    () => [
      {
        browser: 'safari',
        retentionRate: retentionRate,
        fill: 'var(--color-safari)',
      },
    ],
    [retentionRate],
  )

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <RadialBarChart
        data={chartData}
        innerRadius={80}
        outerRadius={110}
        endAngle={(chartData[0].retentionRate / 100) * 360}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar dataKey="retentionRate" background cornerRadius={10} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {chartData[0].retentionRate}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Retention Rate
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}

export default RetentionRateChart
