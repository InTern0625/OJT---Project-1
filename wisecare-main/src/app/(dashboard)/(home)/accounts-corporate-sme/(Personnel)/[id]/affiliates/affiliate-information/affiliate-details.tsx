import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tables } from '@/types/database.types'
import { format } from 'date-fns'
import {
  LucideIcon,
  House,
  Building2,
} from 'lucide-react'
import { FC, ReactNode } from 'react'

const AffiliateDetailsItem = (item: {
  label: string
  value: string
  icon: LucideIcon
}) => {
  const Icon = item.icon
  return (
    <div className="flex items-center gap-3">
      <Icon className="text-muted-foreground h-5 w-5 shrink-0" />
      <div className="flex flex-col">
        <span className="text-sm font-semibold">{item.label}</span>
        <span className="text-muted-foreground text-sm capitalize">
          {item.value}
        </span>
      </div>
    </div>
  )
}

interface AffiliateDetailsProps {
  button: ReactNode
  affiliateData: Tables<'company_affiliates'>
}

const AffiliateDetails: FC<AffiliateDetailsProps> = ({
  button,
  affiliateData,
}) => {
  const data = [
    {
      label: 'Affiliate Name',
      value: affiliateData.affiliate_name,
      icon: Building2,
    },
    {
      label: 'Affiliate Address',
      value: affiliateData.affiliate_address,
      icon: House,
    }
  ]

  return (
    <Dialog>
      <DialogTrigger asChild={true}>{button}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Affiliate Details</DialogTitle>
          <DialogDescription>View the affiliate details</DialogDescription>
        </DialogHeader>

        <h4 className="mt-5 text-center text-xl font-semibold">
          {affiliateData.affiliate_name || ''}
        </h4>
        <div className="grid grid-cols-1 gap-7 py-4 ">
          {data.map((affiliate) => (
            <AffiliateDetailsItem
              key={affiliate.label}
              label={affiliate.label}
              icon={affiliate.icon}
              value={affiliate.value?.toString() ?? 'N/A'}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AffiliateDetails
