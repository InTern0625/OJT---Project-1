'use client'

import {
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/page-header'
import TablePagination from '@/components/table-pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { Suspense, useState, useEffect } from 'react'
import TableViewOptions from '@/components/table-view-options'
import { useBillingContext } from '@/app/(dashboard)/(home)/billing-statements-corporate-sme/billing-provider'
import TableSearch from '@/components/table-search'
import { Skeleton } from '@/components/ui/skeleton'
import getRenewalStatements from '@/queries/get-renewal-statements'
import { Tables } from '@/types/database.types'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import DataTableRow from './data-table-row'
import { createBrowserClient } from '@/utils/supabase-client'
import getAccountsColumnVisibilityByUserId from '@/queries/get-accounts-column-visibility-by-user-id'
import getAccountsColumnSortingByUserId from '@/queries/get-accounts-column-sorting-by-user-id'
import { useColumnStates } from '@/app/(dashboard)/(home)/accounts-corporate-sme/mutations/column-states'
import { useToast } from '@/components/ui/use-toast'
import { useUserServer } from '@/providers/UserProvider'
import { useRouter } from 'next/navigation'
import ExportAccountRequests from '@/app/(dashboard)/(home)/accounts-corporate-sme/export-requests/export-account-requests'
import ExportAccountsModal from '@/app/(dashboard)/(home)/accounts-corporate-sme/export-requests/export-accounts-modal'

interface IData {
  id: string
}
interface DataTableProps<TData extends IData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const DataTable = <TData extends IData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const supabase = createBrowserClient()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUserServer()
  const { upsertRenewalIFPColumnVisibility, upsertRenewalIFPColumnSorting } = useColumnStates()
  const [isAccountLoading, setIsAccountLoading] = useState(false)
  // get column visibility
  const { data: columnVisibilityData } = useQuery(
    getAccountsColumnVisibilityByUserId(supabase, "columns_ifp_renewals"),
  )

  // get column sorting
  const { data: columnSortingData } = useQuery(
    getAccountsColumnSortingByUserId(supabase, "columns_ifp_renewals"),
  )
  const [sorting, setSorting] = useState<SortingState>(
    (columnSortingData?.columns_ifp_renewals as unknown as SortingState) ?? [],
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    (columnVisibilityData?.columns_ifp_renewals as VisibilityState) ?? {},
  )
  const [globalFilter, setGlobalFilter] = useState<any>('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
  })
  
  useEffect(() => {
      if (!user?.id) return
  
      upsertRenewalIFPColumnVisibility([
        {
          user_id: user.id,
          columns_ifp_renewals: columnVisibility,
        },
      ])
    }, [columnVisibility, supabase, toast, upsertRenewalIFPColumnVisibility, user?.id])
  useEffect(() => {
    if (!user?.id) return

    upsertRenewalIFPColumnSorting([
      {
        user_id: user.id,
        columns_ifp_renewals: sorting,
      },
    ])
  }, [sorting, supabase, toast, upsertRenewalIFPColumnSorting, user?.id])

  const totalCount = table.getFilteredRowModel().rows.length

  const { isEditModalOpen, setIsEditModalOpen, originalData } =
    useBillingContext()

  return (
    <div className="flex flex-col">
      <PageHeader>
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <PageTitle>Renewal Statements</PageTitle>
              <PageDescription>{totalCount} Renewal Statements</PageDescription>
          </div>
          <div className="flex flex-row gap-4">
            <TableSearch table={table} />
            <ExportAccountsModal exportData={'accounts'} exportType ='renewals'/>
          </div>
        </div>
      </PageHeader>
      <div className="flex flex-row">
        <TableViewOptions table={table} />
      </div>
      <div className="bg-card flex h-full flex-col justify-between">
        <div className="h-full rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className={`hover:bg-muted/50 cursor-pointer transition-colors ${isAccountLoading ? 'cursor-wait' : ''}`}
                      onClick={() => {
                        setIsAccountLoading(true)
                        router.push(`/accounts-ifp/${row.original.id}`)
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-16 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination table={table} />
      </div>

    </div>
  )
}

export default DataTable
