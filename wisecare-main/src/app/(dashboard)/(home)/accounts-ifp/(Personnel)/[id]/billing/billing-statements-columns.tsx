import { formatCurrency } from '@/app/(dashboard)/(home)/accounts-ifp/columns/accounts-columns'
import TableHeader from '@/components/table-header'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tables } from '@/types/database.types'
import { ColumnDef } from '@tanstack/react-table'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'

const BillingStatementsColumns: ColumnDef<Tables<'billing_statements'>>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'or_number',
    header: ({ column }) => <TableHeader column={column} title="OR Number" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.or_number}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.or_number ?? '',
  },
  {
    accessorKey: 'sa_number',
    header: ({ column }) => <TableHeader column={column} title="SA Number" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.sa_number}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.sa_number ?? '',
  },
  {
    accessorKey: 'amount_billed',
    header: ({ column }) => (
      <TableHeader column={column} title="Amount Billed" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">
        {formatCurrency(row.original.amount_billed)}
      </span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.amount_billed ?? '',
  },
  {
    accessorKey: 'commission_earned',
    header: ({ column }) => (
      <TableHeader column={column} title="Commission Earned" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">
        {formatCurrency(row.original.commission_earned)}
      </span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.commission_earned ?? '',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const billingStatement = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 cursor-pointer p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link
              href={`/accounts-ifp/${billingStatement.account_id}/billing/${billingStatement.id}`}
              className="cursor-pointer"
            >
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
            </Link>
            <Link
              href={`/accounts-ifp/${billingStatement.account_id}/billing/${billingStatement.id}/edit`}
              className="cursor-pointer"
            >
              <DropdownMenuItem>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default BillingStatementsColumns
