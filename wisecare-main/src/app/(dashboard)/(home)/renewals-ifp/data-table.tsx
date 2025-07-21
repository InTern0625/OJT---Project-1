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
import TableSearch from '@/components/table-search-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createBrowserClient } from '@/utils/supabase-client'
import { fuzzyStartsWith } from '@/utils/filter-agent-company'
import getAccountsColumnVisibilityByUserId from '@/queries/get-accounts-column-visibility-by-user-id'
import getAccountsColumnSortingByUserId from '@/queries/get-accounts-column-sorting-by-user-id'
import { useColumnStates } from '@/app/(dashboard)/(home)/accounts-ifp/mutations/column-states'
import { useToast } from '@/components/ui/use-toast'
import { useUserServer } from '@/providers/UserProvider'
import { useRouter } from 'next/navigation'
import ExportAccountsModal from '@/app/(dashboard)/(home)/accounts-ifp/export-requests/export-accounts-modal'
import { isAfter, isBefore, addMonths } from 'date-fns'

interface IData {
  id: string
}
interface DataTableProps<TData extends IData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchMode: 'Company' | 'Agent'
  setSearchMode: (mode: 'Company' | 'Agent') => void
}

const DataTable = <TData extends IData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const [searchMode, setSearchMode] = useState<'company' | 'agent'>('company')
  const supabase = createBrowserClient()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUserServer()
  const { upsertRenewalIFPColumnVisibility, upsertRenewalIFPColumnSorting } = useColumnStates()
  const [isAccountLoading, setIsAccountLoading] = useState(false)
  // get column visibility
  const { data: columnVisibilityData } = useQuery(
    getAccountsColumnVisibilityByUserId(supabase, "columns_ifp_accounts"),
  )

  // get column sorting
  const { data: columnSortingData } = useQuery(
    getAccountsColumnSortingByUserId(supabase, "columns_ifp_accounts"),
  )
  const [sorting, setSorting] = useState<SortingState>(
    (columnSortingData?.columns_ifp_accounts as unknown as SortingState) ?? [],
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    (columnVisibilityData?.columns_ifp_accounts as VisibilityState) ?? {},
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
    globalFilterFn: fuzzyStartsWith(searchMode),
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
          columns_ifp_accounts: columnVisibility,
        },
      ])
    }, [columnVisibility, supabase, toast, upsertRenewalIFPColumnVisibility, user?.id])
  useEffect(() => {
    if (!user?.id) return

    upsertRenewalIFPColumnSorting([
      {
        user_id: user.id,
        columns_ifp_accounts: sorting,
      },
    ])
  }, [sorting, supabase, toast, upsertRenewalIFPColumnSorting, user?.id])

   //Upcoming and overdue renewals
  const dateToday = new Date()
  const upcomingCount = data.filter((row) => 
    (row as any).expiration_date &&
    isAfter((row as any).expiration_date, dateToday) &&
    isBefore((row as any).expiration_date, addMonths(dateToday, 3))
  ).length
  const overdueCount = data.filter((row) =>
    (row as any).expiration_date &&
    isBefore((row as any).expiration_date, dateToday)
  ).length

  return (
    <div className="flex flex-col">
      <PageHeader>
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <PageTitle>Renewal Statements</PageTitle>
              <PageDescription>{upcomingCount} Upcoming Statements | {overdueCount} Overdue Statements </PageDescription>
          </div>
          <div className="flex flex-row gap-4">
            <TableSearch table={table} searchMode={searchMode} setSearchMode={setSearchMode}/>
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
                          const currentPage = table.getState().pagination.pageIndex
                          const pageSize = table.getState().pagination.pageSize
                          router.push(`/renewals-ifp/${row.original.id}?fromPage=${currentPage}&pageSize=${pageSize}&fromPath=/renewals-ifp`)
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
