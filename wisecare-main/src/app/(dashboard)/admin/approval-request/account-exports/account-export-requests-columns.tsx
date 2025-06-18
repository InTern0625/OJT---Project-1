import React from 'react'
import { Tables } from '@/types/database.types'
import TableHeader from '@/components/table-header'
import { ColumnDef } from '@tanstack/react-table'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'

const accountExportRequestsColumns: ColumnDef<
  Tables<'pending_export_requests'>
>[] = [
  {
    accessorKey: 'created_by',
    header: ({ column }) => (
      <TableHeader column={column} title="Requested By" />
    ),
    accessorFn: (row) =>
      `${(row.created_by as any)?.first_name} ${
        (row.created_by as any)?.last_name
      }`,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <TableHeader column={column} title="Requested At" />
    ),
    cell: ({ row }) => {
      return (
        <div>
          {formatDistanceToNow(new Date(row.original.created_at), {
            addSuffix: true,
          })}
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Button size={'icon'} variant="ghost">
          <MoreHorizontal className="cursor-pointer" />
        </Button>
      )
    },
  },
]

export default accountExportRequestsColumns
