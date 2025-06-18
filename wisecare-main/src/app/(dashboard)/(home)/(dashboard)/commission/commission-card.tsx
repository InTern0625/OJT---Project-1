import CommissionChart from '@/app/(dashboard)/(home)/(dashboard)/commission/commission-chart'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const CommissionCard = () => {
  return (
    <Card className="col-span-1 h-[490px] md:col-span-4 xl:col-span-3">
      <CardHeader>
        <CardTitle className="flex flex-row items-center justify-between">
          <span className="text-base font-medium">Total Commission Earned</span>
          <Badge variant="default" className="bg-muted text-muted-foreground">
            Last 12 Months
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CommissionChart />
      </CardContent>
    </Card>
  )
}

export default CommissionCard
