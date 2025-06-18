import TableHeader from '@/components/table-header'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'

// note: don't use any type.
// this is not used yet
const pendingColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'company_name',
    header: ({ column }) => (
      <TableHeader column={column} title="Company Name" />
    ),
  },
  {
    accessorKey: 'agent.first_name',
    header: ({ column }) => <TableHeader column={column} title="Agent" />,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <TableHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      return <div>{format(row.getValue('created_at'), 'MMMM dd, yyyy p')}</div>
    },
  },
]

export default pendingColumns
