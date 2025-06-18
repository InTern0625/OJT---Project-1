'use client'
import { PopoverContent } from '@radix-ui/react-popover'
import { Skeleton } from '../../ui/skeleton'
import { Tables } from '@/types/database.types'
import dynamic from 'next/dynamic'

const NotificationItem = dynamic(
  () => import('@/components/layout/notification/notification-item'),
  {
    ssr: false,
  },
)

interface NotificationContentProps {
  data: Tables<'notifications'>[]
  isPending: boolean
}
const NotificationContent = ({ data, isPending }: NotificationContentProps) => {
  return (
    <PopoverContent className="border-border bg-card z-50 mr-8 w-80 rounded-xl border shadow-lg">
      <div className="grid">
        <div className="space-y-2 p-6">
          <h4 className="leading-none font-medium">Notifications</h4>
          <p className="text-muted-foreground text-sm">
            You have {data?.length || 0} notifications
          </p>
        </div>
        <div className="grid">
          {data?.map((notification) => (
            <NotificationItem
              key={notification.id}
              id={notification.id}
              title={notification.title}
              description={notification.description}
            />
          ))}
          {isPending &&
            [...Array(5)].map((_, i) => (
              <div
                key={i}
                className="hover:bg-muted/50 flex cursor-pointer flex-col space-y-2 px-7 py-4"
              >
                <span className="text-sm font-medium">
                  <Skeleton className="h-4 w-32" />
                </span>
                <span className="text-muted-foreground text-sm">
                  <Skeleton className="h-4 w-52" />
                </span>
              </div>
            ))}
        </div>
      </div>
    </PopoverContent>
  )
}

export default NotificationContent
