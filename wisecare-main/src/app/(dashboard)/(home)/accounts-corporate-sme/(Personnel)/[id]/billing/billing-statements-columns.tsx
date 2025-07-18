import { formatCurrency } from '@/app/(dashboard)/(home)/accounts-corporate-sme/columns/accounts-columns'
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
    accessorKey: 'billing_date',
    header: ({ column }) => <TableHeader column={column} title="Billing Date" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.billing_date}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.billing_date ?? '',
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
    accessorKey: 'due_date',
    header: ({ column }) => <TableHeader column={column} title="Due Date" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.due_date}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.due_date ?? '',
  },
  {
    accessorKey: 'billing_start',
    header: ({ column }) => <TableHeader column={column} title="Billing Start" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.billing_start}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.billing_start ?? '',
  },
  {
    accessorKey: 'billing_end',
    header: ({ column }) => <TableHeader column={column} title="Billing End" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.billing_end}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.billing_end ?? '',
  },
  {
    accessorKey: 'mode_of_payments.name',
    header: ({ column }) => <TableHeader column={column} title="Mode of Payments" />,
    cell: ({ row }) => (
      <span className="capitalize">{(row as any).original.mode_of_payments?.name ?? ''}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.mode_of_payments?.name ?? '',
  },
  {
    accessorKey: 'or_date',
    header: ({ column }) => <TableHeader column={column} title="OR Date" />,
    cell: ({ row }) => (
      <span className="capitalize">{row.original.or_date}</span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.or_date ?? '',
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
    accessorKey: 'amount_paid',
    header: ({ column }) => (
      <TableHeader column={column} title="Amount Paid" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">
        {formatCurrency(row.original.amount_paid)}
      </span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.amount_paid ?? '',
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => (
      <TableHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">
        {formatCurrency(row.original.balance)}
      </span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.balance ?? '',
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
    accessorKey: 'commission_rate',
    header: ({ column }) => (
      <TableHeader column={column} title="Commission Rate" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.commission_rate}
      </span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.commission_rate ?? '',
  },
  {
    accessorKey: 'total_contract_value',
    header: ({ column }) => (
      <TableHeader column={column} title="Total Contract Value" />
    ),
    cell: ({ row }) => (
      <span className="capitalize">
        {formatCurrency(row.original.total_contract_value)}
      </span>
    ),
    accessorFn: (originalRow) => (originalRow as any)?.total_contract_value ?? '',
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
              href={`/accounts-corporate-sme/${billingStatement.account_id}/billing/${billingStatement.id}`}
              className="cursor-pointer"
            >
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
            </Link>
            <Link
              href={`/accounts-corporate-sme/${billingStatement.account_id}/billing/${billingStatement.id}/edit`}
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
