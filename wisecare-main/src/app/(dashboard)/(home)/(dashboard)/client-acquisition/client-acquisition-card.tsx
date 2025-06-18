import ClientAcquisitionChart from '@/app/(dashboard)/(home)/(dashboard)/client-acquisition/client-acquisition-chart'
import { Card } from '@/components/ui/card'

const ClientAcquisitionCard = () => {
  return (
    <Card className="bg-navigation col-span-1 rounded-2xl shadow-md md:col-span-4">
      <div className="flex flex-col pt-10 pr-5 pl-10">
        <h3 className="text-xl font-semibold text-white md:text-2xl">
          Accounts Acquisition
        </h3>
        <span className="text-navigation-foreground text-sm font-medium">
          Number of new accounts (last 12 months)
        </span>
      </div>
      <div className="pt-4">
        <ClientAcquisitionChart />
      </div>
    </Card>
  )
}

export default ClientAcquisitionCard
