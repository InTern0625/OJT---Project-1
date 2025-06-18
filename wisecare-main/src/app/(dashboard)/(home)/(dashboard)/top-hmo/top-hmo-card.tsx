import TopHmoList from '@/app/(dashboard)/(home)/(dashboard)/top-hmo/top-hmo-list'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const TopHmoCard = () => {
  return (
    <Card className="col-span-1 md:col-span-4 lg:col-span-2 xl:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Top HMO Providers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TopHmoList />
      </CardContent>
    </Card>
  )
}

export default TopHmoCard
