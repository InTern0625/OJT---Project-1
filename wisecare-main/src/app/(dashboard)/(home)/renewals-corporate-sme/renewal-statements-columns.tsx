import { ColumnDef } from '@tanstack/react-table'
import TableHeader from '@/components/table-header'
import { Tables } from '@/types/database.types'
import { format } from 'date-fns'
import {
  formatCurrency,
  formatPercentage,
} from '@/app/(dashboard)/(home)/accounts-corporate-sme/columns/accounts-columns'
import { formatDate, isAfter, isBefore, addMonths } from 'date-fns'
import { useState } from 'react'
import { useSortingOrder } from '@/utils/custom-sorting'
import normalizeToUTC from '@/utils/normalize-to-utc'

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

export const RenewalStatementsColumns = ({
  customSortStatus,
  setCustomSortStatus,
}: {
  customSortStatus: string | null;
  setCustomSortStatus: (status: string | null) => void;
}) => {  
  const statusOrder = useSortingOrder("status_types")
  const accountOrder = useSortingOrder("account_types")

  const orderSorter = (a: string, b: string, sortOrder: string[]) => {
    // Bring Sort selection to top
    if (customSortStatus) {
      if (a === customSortStatus) return -1;
      if (b === customSortStatus) return 1;
    }

    // Fall back to default order
    const indexA = sortOrder.indexOf(a);
    const indexB = sortOrder.indexOf(b);
    
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  };

  const columns: ColumnDef<Tables<'accounts'>>[] = [
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
    }
  },
  {
    accessorKey: 'status_type.name',
    accessorFn: (originalRow) => (originalRow as any)?.status_type?.name ?? '',
    header: ({ column }) => (
      <TableHeader 
        column={column} 
        title="Account Status" 
        customSortOrder={statusOrder}
        onStatusClick={setCustomSortStatus}
      />
    ),
    sortingFn: (rowA, rowB, columnId) => {
      const statusA = rowA.getValue(columnId) as string;
      const statusB = rowB.getValue(columnId) as string;
      return orderSorter(statusA, statusB, statusOrder);
    },
  },
  { accessorKey: 'company_name', header: ({ column }) => <TableHeader column={column} title="Company Name" /> },
  { accessorKey: 'company_address', header: ({ column }) => <TableHeader column={column} title="Address" /> },
  { accessorKey: 'nature_of_business', header: ({ column }) => <TableHeader column={column} title="Business Nature" /> },
  {
    accessorKey: 'hmo_providers.name',
    header: ({ column }) => <TableHeader column={column} title="HMO Provider" />,
    cell: ({ row }) => (row.original as any).hmo_provider?.name ?? '-',
  },
  {
    accessorKey: 'account_types.name',
    header: ({ column }) => 
      <TableHeader 
        column={column} 
        title="Account Type"
        customSortOrder={accountOrder}
        onStatusClick={setCustomSortStatus}
      />,
    cell: ({ row }) => (row.original as any).account_types?.name ?? '-',
    sortingFn: (rowA, rowB, columnId) => {
      const statusA = rowA.getValue(columnId) as string;
      const statusB = rowB.getValue(columnId) as string;
      return orderSorter(statusA, statusB, accountOrder);
    },
  },
  {
    accessorKey: 'agent',
    header: ({ column }) => <TableHeader column={column} title="Agent" />,
    cell: ({ row }) => {
      if (
        //@ts-ignore
        !row.original.agent ||
        //@ts-ignore
        !row.original.agent.first_name ||
        //@ts-ignore
        !row.original.agent.last_name
      ) {
        return ''
      }
      return (
        // @ts-ignore
        `${row.original.agent.first_name} ${row.original.agent.last_name}`
      )
    },
    accessorFn: (originalRow) =>
      `${(originalRow as any).agent?.first_name ?? ''} ${(originalRow as any).agent?.last_name ?? ''}`,
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
    header: ({ column }) => (
      <TableHeader column={column} title="Effective Date" />
    ),
    cell: ({ row }) => {
      const effectiveDate = row.original.effective_date
      ? normalizeToUTC(new Date(row.original.effective_date))
      : null
      return (
        <div>
          {effectiveDate ? format(effectiveDate, 'MMMM dd, yyyy') : ''}
        </div>
      )
    },
    accessorFn: (originalRow) =>
        originalRow?.effective_date ? new Date(originalRow.effective_date) : null,
  },
  {
    accessorKey: 'coc_issue_date',
    header: ({ column }) => (
      <TableHeader column={column} title="COC Issue Date" />
    ),
    cell: ({ row }) => {
      const cocIssueDate = row.original.coc_issue_date
      ? normalizeToUTC(new Date(row.original.coc_issue_date))
      : null
      return (
        <div>
          {cocIssueDate ? format(cocIssueDate, 'MMMM dd, yyyy') : ''}
        </div>
      )
    },
    accessorFn: (originalRow) =>
        originalRow?.coc_issue_date ? new Date(originalRow.coc_issue_date) : null,
  },
  {
    accessorKey: 'expiration_date',
    header: ({ column }) => (
      <TableHeader column={column} title="Expiration Date" />
    ),
    cell: ({ row }) => {
      const expirationDate = row.original.expiration_date
      ? normalizeToUTC(new Date(row.original.expiration_date))
      : null
      return (
        <div>
          {expirationDate ? format(expirationDate, 'MMMM dd, yyyy') : ''}
        </div>
      )
    },
    accessorFn: (originalRow) =>
        originalRow?.expiration_date ? new Date(originalRow.expiration_date) : null,
  },
  {
    accessorKey: 'mode_of_payment.name',
    accessorFn: (originalRow) => (originalRow as any)?.mode_of_payment?.name ?? '',
    header: ({ column }) => (
      <TableHeader column={column} title="Mode of Payment" />
    ),
  },
  {
    accessorKey: 'delivery_date_of_membership_ids',
    header: ({ column }) => (
      <TableHeader column={column} title="ID Delivery Date" />
    ),
    cell: ({ row }) => {
      const deliveryDateOfMembershipIds = row.original.delivery_date_of_membership_ids
      ? normalizeToUTC(new Date(row.original.delivery_date_of_membership_ids))
      : null
      return (
        <div>
          {deliveryDateOfMembershipIds ? format(deliveryDateOfMembershipIds, 'MMMM dd, yyyy') : ''}
        </div>
      )
    },
    accessorFn: (originalRow) =>
        originalRow?.delivery_date_of_membership_ids ? new Date(originalRow.delivery_date_of_membership_ids) : null,
  },
  {
    accessorKey: 'orientation_date',
    header: ({ column }) => (
      <TableHeader column={column} title="Orientation Date" />
    ),
    cell: ({ row }) => {
      const orientationDate = row.original.orientation_date
      ? normalizeToUTC(new Date(row.original.orientation_date))
      : null
      return (
        <div>
          {orientationDate ? format(orientationDate, 'MMMM dd, yyyy') : ''}
        </div>
      )
    },
    accessorFn: (originalRow) =>
        originalRow?.orientation_date ? new Date(originalRow.orientation_date) : null,
  },
  {
    accessorKey: 'initial_contract_value',
    header: ({ column }) => <TableHeader column={column} title="Contract Value" />,
    cell: ({ row }) => formatCurrency(row.original.initial_contract_value),
  },
  {
    accessorKey: 'mode_of_payments.name',
    header: ({ column }) => <TableHeader column={column} title="Payment Mode" />,
    cell: ({ row }) => (row.original as any).mode_of_payments?.name ?? '-',
  },
  {
    accessorKey: 'wellness_lecture_date',
    header: ({ column }) => (
      <TableHeader column={column} title="Wellness Lecture" />
    ),
    cell: ({ row }) => {
      const wellnessLecture = row.original.wellness_lecture_date
      ? normalizeToUTC(new Date(row.original.wellness_lecture_date))
      : null
      return (
        <div>
          {wellnessLecture ? format(wellnessLecture, 'MMMM dd, yyyy') : ''}
        </div>
      )
    },
    accessorFn: (originalRow) =>
        originalRow?.wellness_lecture_date ? new Date(originalRow.wellness_lecture_date) : null,
  },
  {
    accessorKey: 'annual_physical_examination_date',
    header: ({ column }) => (
      <TableHeader column={column} title="Annual Physical Examination" />
    ),
    cell: ({ row }) => {
      const annualPhysicalExamination = row.original.annual_physical_examination_date
      ? normalizeToUTC(new Date(row.original.annual_physical_examination_date))
      : null
      return (
        <div>
          {annualPhysicalExamination ? format(annualPhysicalExamination, 'MMMM dd, yyyy') : ''}
        </div>
      )
    },
    accessorFn: (originalRow) =>
        originalRow?.annual_physical_examination_date ? new Date(originalRow.annual_physical_examination_date) : null,
  },
  {
    accessorKey: 'commision_rate',
    header: ({ column }) => <TableHeader column={column} title="Commission" />,
    cell: ({ row }) => formatPercentage(row.original.commision_rate),
  },
  { accessorKey: 'summary_of_benefits', header: ({ column }) => <TableHeader column={column} title="Benefits" /> },
  { accessorKey: 'name_of_signatory', header: ({ column }) => <TableHeader column={column} title="Signatory Name" /> },
  { accessorKey: 'designation_of_contact_person', header: ({ column }) => <TableHeader column={column} title="Contact Designation" /> },
  { accessorKey: 'email_address_of_contact_person', header: ({ column }) => <TableHeader column={column} title="Contact Email" /> },
  {
    accessorKey: 'original_effective_date',
    header: ({ column }) => (
      <TableHeader column={column} title="Original Effective" />
    ),
    cell: ({ row }) => {
      const originalEffective = row.original.original_effective_date
      ? normalizeToUTC(new Date(row.original.original_effective_date))
      : null
      return (
        <div>
          {originalEffective ? format(originalEffective, 'MMMM dd, yyyy') : ''}
        </div>
      )
    },
    accessorFn: (originalRow) =>
        originalRow?.original_effective_date ? new Date(originalRow.original_effective_date) : null,
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
    cell: ({ row }) => (row.original as any).principal_plan_type?.name ?? '-',
  },
  {
    accessorKey: 'dependent_plan_type.name',
    header: ({ column }) => <TableHeader column={column} title="Dependent Plan" />,
    cell: ({ row }) => (row.original as any).dependent_plan_type?.name ?? '-',
  },
  ]
  return columns
}

export default RenewalStatementsColumns
