'use client'

import chartConfig from '@/app/(dashboard)/(home)/(dashboard)/client-acquisition/chart-config'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { useMemo, useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import { format, subYears } from 'date-fns'
import { createBrowserClient } from '@/utils/supabase-client'

const ClientAcquisitionChart = () => {
  const [rerender, setRerender] = useState(0)
  const supabase = createBrowserClient()
  const { data } = useQuery(
    supabase
      .from('accounts')
      .select('company_name, created_at')
      .gte(
        'created_at',
        new Date(subYears(new Date(), 1)).toLocaleString('en-US', {
          timeZone: 'UTC',
        }),
      )
      .lte(
        'created_at',
        new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' }),
      )
      .throwOnError(),
  )

  const formattedData = useMemo(() => {
    if (!data) return []

    const startDate = subYears(new Date(), 1)
    const endDate = new Date()
    const months = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      months.push(format(new Date(currentDate), 'yyyy-MM'))
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    const reducedData = data.reduce(
      (
        acc: { date: string; count: number }[],
        item: { created_at: string; company_name: string },
      ) => {
        const date = new Date(item.created_at)
        const monthYear = format(date, 'yyyy-MM')
        const existingEntry = acc.find((entry) => entry.date === monthYear)
        if (existingEntry) {
          existingEntry.count += 1
        } else {
          acc.push({ date: monthYear, count: 1 })
        }
        return acc
      },
      [],
    )
    const completeData = months.map((month) => {
      const entry = reducedData.find((data) => data.date === month)
      return entry ? entry : { date: month, count: 0 }
    })

    // force rerender to ensure chart updates
    setRerender(rerender + 1)
    return completeData

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  return (
    <ChartContainer
      config={chartConfig}
      className="mt-6 h-[300px] w-full"
      key={rerender}
    >
      <LineChart accessibilityLayer data={formattedData} margin={{ top: 20 }}>
        <CartesianGrid vertical={true} strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value)
            return date.toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              className="w-[150px]"
              nameKey="count"
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })
              }}
            />
          }
        />
        <Line
          dataKey="count"
          type="natural"
          stroke={`var(--color-count)`}
          strokeWidth={4}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

export default ClientAcquisitionChart
