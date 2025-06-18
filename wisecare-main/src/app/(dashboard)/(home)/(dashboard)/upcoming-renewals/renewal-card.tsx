'use server'
import RenewalList from '@/app/(dashboard)/(home)/(dashboard)/upcoming-renewals/renewal-list'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const RenewalCard = async () => {
  return (
    <Card className="col-span-1 h-[490px] md:col-span-4 lg:col-span-2 xl:col-span-1">
      <CardHeader>
        <CardTitle className="text-base font-medium">
          Upcoming Renewals
        </CardTitle>
        <CardDescription>List of upcoming expiry dates</CardDescription>
      </CardHeader>
      <CardContent>
        <RenewalList />
      </CardContent>
    </Card>
  )
}

export default RenewalCard
