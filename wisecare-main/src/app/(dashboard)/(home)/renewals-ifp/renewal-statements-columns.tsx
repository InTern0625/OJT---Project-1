import { ColumnDef } from '@tanstack/react-table'
import TableHeader from '@/components/table-header'
import { Tables } from '@/types/database.types'
import { format } from 'date-fns'
import {
  formatCurrency,
  formatPercentage,
} from '@/app/(dashboard)/(home)/accounts-ifp/columns/accounts-columns'
import { formatDate, isAfter, isBefore, addMonths } from 'date-fns'

const getStatusFromExpirationDate = (expirationDate: string | null) => {
  const today = new Date()
  if (
    expirationDate &&
    isAfter(new Date(expirationDate), today) &&
    isBefore(new Date(expirationDate), addMonths(today, 3))
  ) {
    return 'upcoming'
  }
  return 'overdue'
}

const getStatusColor = (status: 'upcoming' | 'overdue' | 'renewed') => {
  const baseClass = 'text-white px-3 py-0.5 rounded-full text-sm font-medium'

  switch (status) {
    case 'upcoming':
      return `bg-yellow-500 ${baseClass}`
    case 'overdue':
      return `bg-red-500 ${baseClass}`
    default:
      return `bg-gray-500 ${baseClass}`
  }
}

const formatDateSafe = (date: string | null | undefined) =>
  date ? format(new Date(date), 'MMM d, yyyy') : '-'

type AccountWithJoins = Tables<'accounts'> & {
  hmo_provider?: { name: string | null }
  account_types?: { name: string | null }
  mode_of_payments?: { name: string | null }
  principal_plan_type?: { name: string | null }
  dependent_plan_type?: { name: string | null }
}

const renewalStatementsColumns: ColumnDef<AccountWithJoins>[] = [
  {
    id: 'status',
    header: ({ column }) => (
      <TableHeader column={column} title="Status" />
    ),
    accessorFn: (row) => getStatusFromExpirationDate(row.expiration_date), 
    cell: ({ row }) => {
      const status = getStatusFromExpirationDate(row.original.expiration_date)
      const colorClass = getStatusColor(status)
      return <span className={colorClass}>{status}</span>
    },
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      const statusA = getStatusFromExpirationDate(rowA.original.expiration_date)
      const statusB = getStatusFromExpirationDate(rowB.original.expiration_date)
      const order = ['overdue', 'upcoming', 'renewed']
      return order.indexOf(statusA) - order.indexOf(statusB)
    },
  },
  {
    accessorKey: 'status_type.name',
    accessorFn: (originalRow) => (originalRow as any)?.status_type?.name ?? '',
    header: ({ column }) => (
      <TableHeader column={column} title="Account Status" />
    ),
  },
  { accessorKey: 'company_name', header: ({ column }) => <TableHeader column={column} title="Company Name" /> },
  { accessorKey: 'company_address', header: ({ column }) => <TableHeader column={column} title="Address" /> },
  { accessorKey: 'nature_of_business', header: ({ column }) => <TableHeader column={column} title="Business Nature" /> },
  {
    accessorKey: 'hmo_providers.name',
    header: ({ column }) => <TableHeader column={column} title="HMO Provider" />,
    cell: ({ row }) => row.original.hmo_provider?.name ?? '-',
  },
  {
    accessorKey: 'account_types.name',
    header: ({ column }) => <TableHeader column={column} title="Account Type" />,
    cell: ({ row }) => row.original.account_types?.name ?? '-',
  },
  {
    accessorKey: 'total_utilization',
    header: ({ column }) => <TableHeader column={column} title="Utilization" />,
    cell: ({ row }) => formatCurrency(row.original.total_utilization),
  },
  {
    accessorKey: 'total_premium_paid',
    header: ({ column }) => <TableHeader column={column} title="Premium Paid" />,
    cell: ({ row }) => formatCurrency(row.original.total_premium_paid),
  },
  { accessorKey: 'signatory_designation', header: ({ column }) => <TableHeader column={column} title="Signatory Designation" /> },
  { accessorKey: 'contact_person', header: ({ column }) => <TableHeader column={column} title="Contact Person" /> },
  { accessorKey: 'initial_head_count', header: ({ column }) => <TableHeader column={column} title="Headcount" /> },
  {
    accessorKey: 'effective_date',
    header: ({ column }) => <TableHeader column={column} title="Effective Date" />,
    cell: ({ row }) => formatDateSafe(row.original.effective_date),
  },
  {
    accessorKey: 'coc_issue_date',
    header: ({ column }) => <TableHeader column={column} title="COC Issue Date" />,
    cell: ({ row }) => formatDateSafe(row.original.coc_issue_date),
  },
  {
    accessorKey: 'expiration_date',
    header: ({ column }) => <TableHeader column={column} title="Expiration Date" />,
    cell: ({ row }) => formatDateSafe(row.original.expiration_date),
  },
  {
    accessorKey: 'delivery_date_of_membership_ids',
    header: ({ column }) => <TableHeader column={column} title="ID Delivery Date" />,
    cell: ({ row }) => formatDateSafe(row.original.delivery_date_of_membership_ids),
  },
  {
    accessorKey: 'orientation_date',
    header: ({ column }) => <TableHeader column={column} title="Orientation Date" />,
    cell: ({ row }) => formatDateSafe(row.original.orientation_date),
  },
  {
    accessorKey: 'initial_contract_value',
    header: ({ column }) => <TableHeader column={column} title="Contract Value" />,
    cell: ({ row }) => formatCurrency(row.original.initial_contract_value),
  },
  {
    accessorKey: 'mode_of_payments.name',
    header: ({ column }) => <TableHeader column={column} title="Payment Mode" />,
    cell: ({ row }) => row.original.mode_of_payments?.name ?? '-',
  },
  {
    accessorKey: 'wellness_lecture_date',
    header: ({ column }) => <TableHeader column={column} title="Wellness Lecture" />,
    cell: ({ row }) => formatDateSafe(row.original.wellness_lecture_date),
  },
  {
    accessorKey: 'annual_physical_examination_date',
    header: ({ column }) => <TableHeader column={column} title="APE Date" />,
    cell: ({ row }) => formatDateSafe(row.original.annual_physical_examination_date),
  },
  {
    accessorKey: 'commision_rate',
    header: ({ column }) => <TableHeader column={column} title="Commission" />,
    cell: ({ row }) => formatPercentage(row.original.commision_rate),
  },
  { accessorKey: 'summary_of_benefits', header: ({ column }) => <TableHeader column={column} title="Benefits" /> },
  {
    accessorKey: 'created_at',
    header: ({ column }) => <TableHeader column={column} title="Created At" />,
    cell: ({ row }) => formatDateSafe(row.original.created_at),
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => <TableHeader column={column} title="Updated At" />,
    cell: ({ row }) => formatDateSafe(row.original.updated_at),
  },
  { accessorKey: 'name_of_signatory', header: ({ column }) => <TableHeader column={column} title="Signatory Name" /> },
  { accessorKey: 'designation_of_contact_person', header: ({ column }) => <TableHeader column={column} title="Contact Designation" /> },
  { accessorKey: 'email_address_of_contact_person', header: ({ column }) => <TableHeader column={column} title="Contact Email" /> },
  { accessorKey: 'is_account_active', header: ({ column }) => <TableHeader column={column} title="Account Active" /> },
  {
    accessorKey: 'original_effective_date',
    header: ({ column }) => <TableHeader column={column} title="Original Effective" />,
    cell: ({ row }) => formatDateSafe(row.original.original_effective_date),
  },
  {
    accessorKey: 'special_benefits_files',
    header: ({ column }) => <TableHeader column={column} title="Special Benefits" />,
    cell: ({ row }) => row.original.special_benefits_files ? '📎 File' : '-',
  },
  {
    accessorKey: 'contract_proposal_files',
    header: ({ column }) => <TableHeader column={column} title="Contract Files" />,
    cell: ({ row }) => row.original.contract_proposal_files ? '📎 File' : '-',
  },
  {
    accessorKey: 'additional_benefits_files',
    header: ({ column }) => <TableHeader column={column} title="Additional Benefits" />,
    cell: ({ row }) => row.original.additional_benefits_files ? '📎 File' : '-',
  },
  {
    accessorKey: 'principal_plan_type.name',
    header: ({ column }) => <TableHeader column={column} title="Principal Plan" />,
    cell: ({ row }) => row.original.principal_plan_type?.name ?? '-',
  },
  {
    accessorKey: 'dependent_plan_type.name',
    header: ({ column }) => <TableHeader column={column} title="Dependent Plan" />,
    cell: ({ row }) => row.original.dependent_plan_type?.name ?? '-',
  },
]

export default renewalStatementsColumns
