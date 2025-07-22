import { Badge } from '@/components/ui/badge'
import { Tables } from '@/types/database.types'
import { cn } from '@/utils/tailwind'
import { formatDate, isAfter, isBefore, addMonths } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import Link from 'next/link'
import { FC, useState, useEffect} from 'react'

interface RenewalItemProps {
  data: Tables<'accounts'>
}

const RenewalItem: FC<RenewalItemProps> = ({ data }) => {
  const getStatusFromExpirationDate = () => {
    const today = new Date()

    if (
      data.expiration_date &&
      isAfter(data.expiration_date, today) &&
      isBefore(data.expiration_date, addMonths(today, 3))
    ) {
      return 'upcoming'
    }
    return 'overdue'
  }

  const getStatusColor = (status: 'upcoming' | 'overdue' | 'renewed') => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-500 hover:bg-yellow-600 '
      case 'overdue':
        return 'bg-red-500 hover:bg-red-600 '
      default:
        return 'bg-gray-500 hover:bg-gray-600 '
    }
  }

  //setPath if ifp or sme, dashboard
  const path = data.program_types_id != null
  ? 'renewals-ifp'
  : 'renewals-corporate-sme'  

  const status = getStatusFromExpirationDate()

  return (
    <li className="bg-muted flex items-center justify-between rounded-lg p-4">
      <div>
        <Link href={`/${path}/${data.id}`} className="font-semibold">
          {data.company_name}
        </Link>
        <Link
          href={`/${path}/${data.id}`}
          className="text-muted-foreground mt-1 flex items-center text-sm"
        >
          <CalendarDays className="mr-1 h-4 w-4" />
          {data?.expiration_date &&
            formatDate(data?.expiration_date, 'MMM d, yyyy')}
        </Link>
      </div>
      <div className="text-right">
        <Link href={`/${path}/${data.id}`}>
          <Badge className={cn('mt-1 capitalize', getStatusColor(status))}>
            {status}
          </Badge>
        </Link>
      </div>
    </li>
  )
}

export default RenewalItem
