'use client'

import processChartData from '@/app/(dashboard)/(home)/(dashboard)/commission/process-commission-chart'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { subMonths, startOfMonth } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { createBrowserClient } from '@/utils/supabase-client'

const chartConfig = {
  commission_earned: {
    label: 'Commission Earned:',
    color: 'hsl(210, 100%, 50%)',
  },
} satisfies ChartConfig

const CommissionChart = () => {
  const supabase = createBrowserClient()
  const { data } = useQuery(
    // @ts-ignore
    supabase
      .from('billing_statements')
      .select('commission_earned, or_date, id')
      .order('created_at', { ascending: true })
      .eq('is_active', true)
      .gte('created_at', subMonths(startOfMonth(new Date()), 12).toISOString()),
  )

  const processedData = useMemo(() => processChartData(data), [data])

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <AreaChart
        accessibilityLayer
        data={processedData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="commission_earned"
          type="natural"
          fill="hsl(210, 100%, 50%)"
          fillOpacity={0.4}
          stroke="hsl(210, 100%, 50%)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  )
}

export default CommissionChart
