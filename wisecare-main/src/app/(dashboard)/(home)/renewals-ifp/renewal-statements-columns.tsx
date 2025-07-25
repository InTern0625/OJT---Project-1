import { ColumnDef } from '@tanstack/react-table'
import TableHeader from '@/components/table-header'
import { Tables } from '@/types/database.types'
import { format } from 'date-fns'
import {
  formatCurrency,
  formatPercentage,
} from '@/app/(dashboard)/(home)/accounts-ifp/columns/accounts-columns'
import { formatDate, isAfter, isBefore, addMonths, differenceInYears } from 'date-fns'
import { useSortingOrder } from '@/utils/custom-sorting'
import { useState } from 'react'
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
  const programOrder = useSortingOrder("program_types")
  const roomOrder = useSortingOrder("room_plans")

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
      },
      enableSorting: true,
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
    {
      accessorKey: 'company_name',
      header: ({ column }) => (
        <TableHeader column={column} title="Complete Name" />
      ),
    },
    {
      accessorKey: 'birthdate',
      header: ({ column }) => (
        <TableHeader column={column} title="Birthdate" />
      ),
      accessorFn: (originalRow) =>
        originalRow?.birthdate ? new Date(originalRow.birthdate) : null,
    },
    {
      id: 'age',
      accessorKey: "birthdate",
      header: ({ column }) => <TableHeader column={column} title="Age" />,
      cell: ({ row }) => {
        const birthdate = row.original.birthdate
        if (!birthdate) return ''
        const age = differenceInYears(new Date(), new Date(birthdate))
        return age
      },
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const a = rowA?.original.birthdate
        const b = rowB?.original.birthdate
        if ((a === null) || (b === null)){
          return 0
        }else{
          return a.localeCompare(b)
        }
        
      },
    },
    {
      accessorKey: 'gender_type.name',
      accessorFn: (originalRow) => (originalRow as any)?.gender_type?.name ?? '',
      header: ({ column }) => (
        <TableHeader column={column} title="Gender" />
      ),
    },
    {
      accessorKey: 'civil_status.name',
      accessorFn: (originalRow) => (originalRow as any)?.civil_status?.name ?? '',
      header: ({ column }) => (
        <TableHeader column={column} title="Civil Status" />
      ),
    },
    {
      accessorKey: 'company_address',
      header: ({ column }) => (
        <TableHeader column={column} title="Complete Address" />
      ),
      accessorFn: (originalRow) => (originalRow as any)?.company_address ?? '',
    },
    {
      accessorKey: 'contact_number',
      header: ({ column }) => (
        <TableHeader column={column} title="Contact Number" />
      ),
    },
    {
      accessorKey: 'email_address_of_contact_person',
      header: ({ column }) => (
        <TableHeader column={column} title="Email Address" />
      ),
    },
    {
      accessorKey: 'card_number',
      header: ({ column }) => (
        <TableHeader column={column} title="Total Utilization" />
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
        originalRow?.effective_date ? new Date(originalRow.effective_date) : null,
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
      accessorKey: 'hmo_provider.name',
      accessorFn: (originalRow) => (originalRow as any)?.hmo_provider?.name ?? '',
      header: ({ column }) => (
        <TableHeader column={column} title="HMO Provider" />
      ),
    },
    {
      accessorKey: 'room_plan.name',
      accessorFn: (originalRow) => (originalRow as any)?.room_plan?.name ?? '',
      header: ({ column }) => (
        <TableHeader 
          column={column} 
          title="Room Plans" 
          customSortOrder={roomOrder}
          onStatusClick={setCustomSortStatus}
        />
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const statusA = rowA.getValue(columnId) as string;
        const statusB = rowB.getValue(columnId) as string;
        return orderSorter(statusA, statusB, roomOrder);
      },
    },
    {
      accessorKey: 'mbl',
      header: ({ column }) => (
        <TableHeader column={column} title="Premium" />
      ),
    },
    {
      accessorKey: 'program_type.name',
      accessorFn: (originalRow) => (originalRow as any)?.program_type?.name ?? '',
      header: ({ column }) => (
        <TableHeader 
          column={column} 
          title="Program Types" 
          customSortOrder={programOrder}
          onStatusClick={setCustomSortStatus}
        />
      ),
      sortingFn: (rowA, rowB, columnId) => {
        const statusA = rowA.getValue(columnId) as string;
        const statusB = rowB.getValue(columnId) as string;
        return orderSorter(statusA, statusB, programOrder);
      },
    },
    {
      accessorKey: 'premium',
      header: ({ column }) => (
        <TableHeader column={column} title="Premium" />
      ),
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
    
  ]
  return columns
}


export default RenewalStatementsColumns
