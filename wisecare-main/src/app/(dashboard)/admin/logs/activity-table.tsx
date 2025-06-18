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
import { createBrowserClient } from '@/utils/supabase-client'

const ActivityTable = () => {
  const supabase = createBrowserClient()
  const { data, isPending } = useQuery(getActivityLog(supabase))

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
        {isPending &&
          [1, 2, 3].map((i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-1/2" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-1/2" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-1/2" />
              </TableCell>
            </TableRow>
          ))}
        {data &&
          data.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{log.user_id}</TableCell>
              <TableCell>{log.description}</TableCell>
              <TableCell>{format(new Date(log.created_at), 'PPpp')}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

export default ActivityTable
