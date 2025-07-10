'use client'
import ActiveBadge from '@/components/active-badge'
import TableHeader from '@/components/table-header'
import { Tables } from '@/types/database.types'
import normalizeToUTC from '@/utils/normalize-to-utc'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { useSortingOrder, createCustomSorter} from '@/utils/custom-sorting'
import { useState } from 'react'

export const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return ''
  }
  return `₱${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

export const formatPercentage = (value: number | null | undefined) => {
  if (value === null || value === undefined) {
    return ''
  }
  return `${value.toFixed(2)}%`
}
export const AccountsColumns = () => {
  const statusOrder = useSortingOrder("status_types")
  
  const [activeSortStatus, setActiveSortStatus] = useState<string | null>(null);
  const statusSorter = (a: string, b: string) => {
    // If clicking "Active", bring Active to top
    if (activeSortStatus) {
      if (a === activeSortStatus) return -1;
      if (b === activeSortStatus) return 1;
    }

    // Fall back to default order
    const indexA = statusOrder.indexOf(a);
    const indexB = statusOrder.indexOf(b);
    
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    
    return indexA - indexB;
  };

  const columns: ColumnDef<Tables<'accounts'>>[] = [
    {
      accessorKey: 'status_type.name',
      accessorFn: (originalRow) => (originalRow as any)?.status_type?.name ?? '',
      header: ({ column }) => (
        <TableHeader 
          column={column} 
          title="Account Status" 
          customSortOrder={statusOrder}
          onStatusClick={setActiveSortStatus}
        />
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const statusA = rowA.getValue(columnId) as string;
        const statusB = rowB.getValue(columnId) as string;
        return statusSorter(statusA, statusB);
      },
    },
    {
      accessorKey: 'company_name',
      header: ({ column }) => (
        <TableHeader column={column} title="Company Name" />
      ),
    },
    {
      accessorKey: 'account_type.name',
      header: ({ column }) => (
        <TableHeader column={column} title="Account Type" />
      ),
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
      accessorKey: 'company_address',
      header: ({ column }) => (
        <TableHeader column={column} title="Company Address" />
      ),
      accessorFn: (originalRow) => (originalRow as any)?.company_address ?? '',
    },
    {
      accessorKey: 'nature_of_business',
      header: ({ column }) => (
        <TableHeader column={column} title="Nature of Business" />
      ),
    },
    {
      accessorKey: 'hmo_provider.name',
      accessorFn: (originalRow) => (originalRow as any)?.hmo_provider?.name ?? '',
      header: ({ column }) => (
        <TableHeader column={column} title="HMO Provider" />
      ),
    },
    {
      accessorKey: 'previous_hmo_provider.name',
      accessorFn: (originalRow) => (originalRow as any)?.previous_hmo_provider?.name ?? '',
      header: ({ column }) => (
        <TableHeader column={column} title="Previous HMO Provider" />
      ),
    },
    {
      accessorKey: 'old_hmo_provider.name',
      accessorFn: (originalRow) => (originalRow as any)?.old_hmo_provider?.name ?? '',
      header: ({ column }) => (
        <TableHeader column={column} title="Old HMO Provider" />
      ),
    },
    {
      accessorKey: 'total_utilization',
      header: ({ column }) => (
        <TableHeader column={column} title="Total Utilization" />
      ),
    },
    {
      accessorKey: 'total_premium_paid',
      header: ({ column }) => (
        <TableHeader column={column} title="Total Premium Paid" />
      ),
      cell: ({ getValue }) =>
        formatCurrency(getValue<number | null | undefined>()),
    },
    {
      accessorKey: 'signatory_designation',
      header: ({ column }) => (
        <TableHeader column={column} title="Signatory Designation" />
      ),
    },
    {
      accessorKey: 'contact_person',
      header: ({ column }) => (
        <TableHeader column={column} title="Contact Person" />
      ),
    },
    {
      accessorKey: 'contact_number',
      header: ({ column }) => (
        <TableHeader column={column} title="Contact Number" />
      ),
    },
    {
      accessorKey: 'principal_plan_type.name',
      accessorFn: (originalRow) => (originalRow as any)?.principal_plan_type?.name ?? '',
      header: ({ column }) => (
        <TableHeader column={column} title="Principal Plan Type" />
      ),
    },
    {
      accessorKey: 'dependent_plan_type.name',
      accessorFn: (originalRow) => (originalRow as any)?.dependent_plan_type?.name ?? '',
      header: ({ column }) => (
        <TableHeader column={column} title="Dependent Plan Type" />
      ),
    },
    {
      accessorKey: 'initial_head_count',
      header: ({ column }) => (
        <TableHeader column={column} title="Initial Head Count" />
      ),
    },
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
          <div>{effectiveDate ? format(effectiveDate, 'MMMM dd, yyyy') : ''}</div>
        )
      },
      accessorFn: (originalRow) =>
        (originalRow as any)?.effective_date
          ? format((originalRow as any).effective_date, 'MMMM dd, yyyy')
          : '',
    },
    {
      accessorKey: 'original_effective_date',
      header: ({ column }) => (
        <TableHeader column={column} title="Original Effective Date" />
      ),
      cell: ({ row }) => {
        const originalEffectiveDate = row.original.original_effective_date
          ? normalizeToUTC(new Date(row.original.original_effective_date))
          : null
        return (
          <div>
            {originalEffectiveDate
              ? format(originalEffectiveDate, 'MMMM dd, yyyy')
              : ''}
          </div>
        )
      },
      accessorFn: (originalRow) =>
        (originalRow as any)?.original_effective_daƒte
          ? format((originalRow as any).original_effective_date, 'MMMM dd, yyyy')
          : '',
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
          <div>{cocIssueDate ? format(cocIssueDate, 'MMMM dd, yyyy') : ''}</div>
        )
      },
      accessorFn: (originalRow) =>
        (originalRow as any)?.coc_issue_date
          ? format((originalRow as any).coc_issue_date, 'MMMM dd, yyyy')
          : '',
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
        (originalRow as any)?.expiration_date
          ? format((originalRow as any).expiration_date, 'MMMM dd, yyyy')
          : '',
    },
    {
      accessorKey: 'delivery_date_of_membership_ids',
      header: ({ column }) => (
        <TableHeader column={column} title="Delivery Date of Membership IDs" />
      ),
      cell: ({ row }) => {
        const deliveryDate = row.original.delivery_date_of_membership_ids
          ? normalizeToUTC(new Date(row.original.delivery_date_of_membership_ids))
          : null
        return (
          <div>{deliveryDate ? format(deliveryDate, 'MMMM dd, yyyy') : ''}</div>
        )
      },
      accessorFn: (originalRow) =>
        (originalRow as any)?.delivery_date_of_membership_ids
          ? format(
              (originalRow as any).delivery_date_of_membership_ids,
              'MMMM dd, yyyy',
            )
          : '',
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
        (originalRow as any)?.orientation_date
          ? format((originalRow as any).orientation_date, 'MMMM dd, yyyy')
          : '',
    },
    {
      accessorKey: 'initial_contract_value',
      header: ({ column }) => (
        <TableHeader column={column} title="Initial Contract Value" />
      ),
      cell: ({ getValue }) =>
        formatCurrency(getValue<number | null | undefined>()),
    },
    {
      accessorKey: 'mode_of_payment.name',
      accessorFn: (originalRow) => (originalRow as any)?.mode_of_payment?.name ?? '',
      header: ({ column }) => (
        <TableHeader column={column} title="Mode of Payment" />
      ),
    },
    {
      accessorKey: 'wellness_lecture_date',
      header: ({ column }) => (
        <TableHeader column={column} title="Wellness Lecture Date" />
      ),
      cell: ({ row }) => {
        const wellnessLectureDate = row.original.wellness_lecture_date
          ? normalizeToUTC(new Date(row.original.wellness_lecture_date))
          : null
        return (
          <div>
            {wellnessLectureDate
              ? format(wellnessLectureDate, 'MMMM dd, yyyy')
              : ''}
          </div>
        )
      },
      accessorFn: (originalRow) =>
        (originalRow as any)?.wellness_lecture_date
          ? format((originalRow as any).wellness_lecture_date, 'MMMM dd, yyyy')
          : '',
    },
    {
      accessorKey: 'annual_physical_examination_date',
      header: ({ column }) => (
        <TableHeader column={column} title="Annual Physical Examination Date" />
      ),
      cell: ({ row }) => {
        const annualPhysicalExaminationDate = row.original
          .annual_physical_examination_date
          ? normalizeToUTC(
              new Date(row.original.annual_physical_examination_date),
            )
          : null
        return (
          <div>
            {annualPhysicalExaminationDate
              ? format(annualPhysicalExaminationDate, 'MMMM dd, yyyy')
              : ''}
          </div>
        )
      },
      accessorFn: (originalRow) =>
        (originalRow as any)?.annual_physical_examination_date
          ? format(
              (originalRow as any).annual_physical_examination_date,
              'MMMM dd, yyyy',
            )
          : '',
    },
    {
      accessorKey: 'commision_rate',
      header: ({ column }) => (
        <TableHeader column={column} title="Commission Rate" />
      ),
      cell: ({ getValue }) =>
        formatPercentage(getValue<number | null | undefined>()),
    },
    {
      accessorKey: 'name_of_signatory',
      header: ({ column }) => (
        <TableHeader column={column} title="Name of Signatory" />
      ),
    },
    {
      accessorKey: 'designation_of_contact_person',
      header: ({ column }) => (
        <TableHeader column={column} title="Designation of Contact Person" />
      ),
    },
    {
      accessorKey: 'email_address_of_contact_person',
      header: ({ column }) => (
        <TableHeader column={column} title="Email Address of Contact Person" />
      ),
    },
  ]
    return columns
}
export default AccountsColumns
