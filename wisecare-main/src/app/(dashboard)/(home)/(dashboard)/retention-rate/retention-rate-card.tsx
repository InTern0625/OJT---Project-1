import RetentionRateChart from '@/app/(dashboard)/(home)/(dashboard)/retention-rate/retention-rate-chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { format, subMonths } from 'date-fns'

const RetentionRateCard = () => {
  const lastMonth = subMonths(new Date(), 1)

  return (
    <Card className="col-span-1 md:col-span-4 lg:col-span-2 xl:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-medium">Retention Rate</CardTitle>
        <CardDescription className="text-xs font-medium">
          From {format(lastMonth, 'MMM yyyy')} to{' '}
          {format(new Date(), 'MMM yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <RetentionRateChart />
      </CardContent>
    </Card>
  )
}

export default RetentionRateCard
