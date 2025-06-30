'use client'

import AccountsCount from '@/app/(dashboard)/(home)/accounts-corporate-sme/accounts-count'
import ExportAccountRequests from '@/app/(dashboard)/(home)/accounts-corporate-sme/export-requests/export-account-requests'
import ExportAccountsModal from '@/app/(dashboard)/(home)/accounts-corporate-sme/export-requests/export-accounts-modal'
import { useColumnStates } from '@/app/(dashboard)/(home)/accounts-corporate-sme/mutations/column-states'
import AccountRequest from '@/app/(dashboard)/(home)/accounts-corporate-sme/request/account-request'
import { PageHeader, PageTitle } from '@/components/page-header'
import TablePagination from '@/components/table-pagination'
import TableSearch from '@/components/table-search'
import TableViewOptions from '@/components/table-view-options'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { useUserServer } from '@/providers/UserProvider'
import getAccountsColumnVisibilityByUserId from '@/queries/get-accounts-column-visibility-by-user-id'
import { createBrowserClient } from '@/utils/supabase-client'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
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
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AccountsProvider from './accounts-provider'
import AddAccountButton from './add-account-button'
import getAccountsColumnSortingByUserId from '@/queries/get-accounts-column-sorting-by-user-id'

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
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUserServer()
  const supabase = createBrowserClient()
  const { upsertAccIFPColumnVisibility, upsertAccIFPColumnSorting } = useColumnStates()

  // get column visibility
  const { data: columnVisibilityData } = useQuery(
    getAccountsColumnVisibilityByUserId(supabase, "columns_sme_renewals"),
  )

  // get column sorting
  const { data: columnSortingData } = useQuery(
    getAccountsColumnSortingByUserId(supabase, "columns_sme_renewals"),
  )

  const [sorting, setSorting] = useState<SortingState>(
    (columnSortingData?.columns_sme_renewals as unknown as SortingState) ?? [],
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    (columnVisibilityData?.columns_sme_renewals as VisibilityState) ?? {},
  )
  const [globalFilter, setGlobalFilter] = useState<any>('')
  const [isAccountLoading, setIsAccountLoading] = useState(false)

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

    upsertAccIFPColumnVisibility([
      {
        user_id: user.id,
        columns_sme_renewals: columnVisibility,
      },
    ])
  }, [columnVisibility, supabase, toast, upsertAccIFPColumnVisibility, user?.id])

  useEffect(() => {
    if (!user?.id) return

    upsertAccIFPColumnSorting([
      {
        user_id: user.id,
        columns_sme_renewals: sorting,
      },
    ])
  }, [sorting, supabase, toast, upsertAccIFPColumnSorting, user?.id])

  return (
    <AccountsProvider>
      <div className="flex flex-col">
        <PageHeader>
          <div className="flex w-full flex-col gap-6 sm:flex-row sm:justify-between">
            <div>
              <PageTitle>Accounts</PageTitle>
              <AccountsCount />
            </div>
            <div className="flex flex-row gap-4">
              <TableSearch table={table} />
              <AddAccountButton />
              <ExportAccountsModal exportData={'accounts'} />
            </div>
          </div>
        </PageHeader>
        <div className="flex flex-row">
          {['marketing', 'after-sales'].includes(
            user?.user_metadata?.department,
          ) && <AccountRequest />}
          <ExportAccountRequests />
          <TableViewOptions table={table} />
        </div>
        <div className="bg-card h-full">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup: any) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header: any) => {
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
                          router.push(`/accounts-corporate-sme/${row.original.id}`)
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
    </AccountsProvider>
  )
}

export default DataTable
