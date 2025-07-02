'use client'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import getActivityLog from '@/queries/get-activity-log'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { format } from 'date-fns'
import getUsers from '@/queries/get-users'
import { createBrowserClient } from '@/utils/supabase-client'

const ActivityTable = () => {
  const supabase = createBrowserClient()
  const { data: logs, isPending: logsPending } = useQuery(getActivityLog(supabase))
  const { data: users, isPending: usersPending } = useQuery(getUsers(supabase))

  // get name from uID 
  const getName = (userId: string | null) => {
    const user = users?.find((u) => u.user_id === userId)
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown'
  }

  const isLoading = logsPending || usersPending

  return (
    <Table className="border-border border-x">
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Action</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          [1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
              <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
              <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
            </TableRow>
          ))}
        {logs &&
          logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{getName(log.user_id)}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{format(new Date(log.created_at), 'PPpp')}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}


export default ActivityTable
