'use client'
import getNotifications from '@/queries/get-notifications'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { User } from '@supabase/supabase-js'
import { Bell } from 'lucide-react'
import { FC } from 'react'
import { Button } from '../../ui/button'
import { Popover, PopoverTrigger } from '../../ui/popover'
import { Tables } from '@/types/database.types'
import dynamic from 'next/dynamic'
import { createBrowserClient } from '@/utils/supabase-client'

const NotificationContent = dynamic(
  () => import('@/components/layout/notification/notification-content'),
  {
    ssr: false,
  },
)

interface Props {
  user: User | null
}

const NotificationBell: FC<Props> = ({ user }) => {
  const supabase = createBrowserClient()

  const { data, isPending } = useQuery(getNotifications(supabase, user?.id))

  return (
    <Popover>
      <PopoverTrigger asChild={true}>
        <Button variant={'ghost'} size={'icon'} className="relative">
          {data && data.length > 0 && (
            <span className="absolute top-1.5 right-2.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500"></span>
            </span>
          )}
          <Bell className="text-muted-foreground/50" />
        </Button>
      </PopoverTrigger>
      <NotificationContent
        data={data as Tables<'notifications'>[]}
        isPending={isPending}
      />
    </Popover>
  )
}

export default NotificationBell
