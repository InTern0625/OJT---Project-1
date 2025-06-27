import { ColumnDef } from '@tanstack/react-table'
import TableHeader from '@/components/table-header'
import { format } from 'date-fns'
import { Tables } from '@/types/database.types'
import {
  formatCurrency,
  formatPercentage,
} from '@/app/(dashboard)/(home)/accounts/columns/accounts-columns'
import normalizeToUTC from '@/utils/normalize-to-utc'

const billingStatementsColumns: ColumnDef<Tables<'billing_statements'>>[] = [
  {
    accessorKey: 'account.company_name',
    header: ({ column }) => <TableHeader column={column} title="Account" />,
  },
  {
    accessorKey: 'mode_of_payment.name',
    header: ({ column }) => (
      <TableHeader column={column} title="Mode of Payment" />
    ),
  },
  {
    accessorKey: 'billing_date',
    header: ({ column }) => (
      <TableHeader column={column} title="Billing Date" />
    ),
    cell: ({ row }) => {
      const dueDate = row.original.due_date
        ? normalizeToUTC(new Date(row.original.due_date))
        : null
      return <div>{dueDate ? format(dueDate, 'MMMM dd, yyyy') : ''}</div> //placeholder
    },

    accessorFn: (originalRow) =>
      originalRow.due_date ? format(originalRow.due_date, 'MMMM dd, yyyy') : '',
  },
  {
    accessorKey: 'due_date',
    header: ({ column }) => <TableHeader column={column} title="Due Date" />,
    cell: ({ row }) => {
      const dueDate = row.original.due_date
        ? normalizeToUTC(new Date(row.original.due_date))
        : null
      return <div>{dueDate ? format(dueDate, 'MMMM dd, yyyy') : ''}</div>
    },
    accessorFn: (originalRow) =>
      originalRow.due_date ? format(originalRow.due_date, 'MMMM dd, yyyy') : '',
  },
  {
    accessorKey: 'or_number',
    header: ({ column }) => <TableHeader column={column} title="OR Number" />,
  },
  {
    accessorKey: 'or_date',
    header: ({ column }) => <TableHeader column={column} title="OR Date" />,
    cell: ({ row }) => {
      const orDate = row.original.or_date
        ? normalizeToUTC(new Date(row.original.or_date))
        : null
      return <div>{orDate ? format(orDate, 'MMMM dd, yyyy') : ''}</div>
    },
    accessorFn: (originalRow) =>
      originalRow.or_date ? format(originalRow.or_date, 'MMMM dd, yyyy') : '',
  },
  {
    accessorKey: 'sa_number',
    header: ({ column }) => <TableHeader column={column} title="SA Number" />,
  },
  {
    accessorKey: 'amount_billed',
    header: ({ column }) => (
      <TableHeader column={column} title="Amount Billed" />
    ),
    cell: ({ getValue }) =>
      formatCurrency(getValue<number | null | undefined>()),
  },
  {
    accessorKey: 'total_contract_value',
    header: ({ column }) => (
      <TableHeader column={column} title="Total Contract Value" />
    ),
    cell: ({ getValue }) =>
      formatCurrency(getValue<number | null | undefined>()),
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => <TableHeader column={column} title="Balance" />,
    cell: ({ getValue }) =>
      formatCurrency(getValue<number | null | undefined>()),
  },
  {
    accessorKey: 'billing_period',
    header: ({ column }) => (
      <TableHeader column={column} title="Billing Period" />
    ),
  },
  {
    accessorKey: 'billing_start',
    header: ({ column }) => <TableHeader column={column} title="Billing Start" />,
    cell: ({ row }) => {
      const billStart = row.original.billing_start
        ? normalizeToUTC(new Date(row.original.billing_start))
        : null
      return <div>{billStart ? format(billStart, 'MMMM dd, yyyy') : ''}</div>
    },
    accessorFn: (originalRow) =>
      originalRow.billing_start ? format(originalRow.billing_start, 'MMMM dd, yyyy') : '',
  },
  {
    accessorKey: 'billing_end',
    header: ({ column }) => <TableHeader column={column} title="Billing End" />,
    cell: ({ row }) => {
      const billEnd = row.original.billing_end
        ? normalizeToUTC(new Date(row.original.billing_end))
        : null
      return <div>{billEnd ? format(billEnd, 'MMMM dd, yyyy') : ''}</div>
    },
    accessorFn: (originalRow) =>
      originalRow.billing_end ? format(originalRow.billing_end, 'MMMM dd, yyyy') : '',
  },
  {
    accessorKey: 'amount_paid',
    header: ({ column }) => <TableHeader column={column} title="Amount Paid" />,
    cell: ({ getValue }) =>
      formatCurrency(getValue<number | null | undefined>()),
  },
  {
    accessorKey: 'commission_rate',
    header: ({ column }) => (
      <TableHeader column={column} title="Commission Rate" />
    ),
    cell: ({ getValue }) =>
      formatPercentage(getValue<number | null | undefined>()),
  },
  {
    accessorKey: 'commission_earned',
    header: ({ column }) => (
      <TableHeader column={column} title="Commission Earned" />
    ),
    cell: ({ getValue }) =>
      formatCurrency(getValue<number | null | undefined>()),
  },
]

export default billingStatementsColumns
