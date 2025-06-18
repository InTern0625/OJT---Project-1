'use client'
import { useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { FC, useCallback } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface NotificationItemProps {
  id: string
  title: string
  description: string
}

const NotificationItem: FC<NotificationItemProps> = ({
  id,
  title,
  description,
}) => {
  const supabase = createBrowserClient()

  const { mutateAsync } = useUpdateMutation(
    // @ts-ignore
    supabase.from('notifications'),
    ['id'],
    'read',
  )
  const handleReadNotification = useCallback(() => {
    mutateAsync({ id, read: true })
  }, [id, mutateAsync])

  return (
    <div
      onClick={handleReadNotification}
      className="hover:bg-muted/50 flex cursor-pointer flex-col px-7 py-4"
    >
      <span className="text-sm font-medium">{title}</span>
      <span className="text-muted-foreground text-sm">{description}</span>
    </div>
  )
}

export default NotificationItem
