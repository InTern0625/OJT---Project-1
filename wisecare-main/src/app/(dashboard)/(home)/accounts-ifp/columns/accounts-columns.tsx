'use client'
import ActiveBadge from '@/components/active-badge'
import TableHeader from '@/components/table-header'
import { Tables } from '@/types/database.types'
import normalizeToUTC from '@/utils/normalize-to-utc'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns'
import { differenceInYears } from 'date-fns'
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
export const AccountsColumns = ({
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
        const typeA = rowA.getValue(columnId) as string;
        const typeB = rowB.getValue(columnId) as string;
        return orderSorter(typeA, typeB, roomOrder);
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
        const typeA = rowA.getValue(columnId) as string;
        const typeB = rowB.getValue(columnId) as string;
        return orderSorter(typeA, typeB, programOrder);
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


export default AccountsColumns
