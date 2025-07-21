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
import { useEffect, useState, SetStateAction, Dispatch, useMemo } from 'react'
import TableViewOptions from '@/components/table-view-options'
import { useBillingContext } from '@/app/(dashboard)/(home)/billing-statements-corporate-sme/billing-provider'
import TableSearch from '@/components/table-search-accounts'
import { Skeleton } from '@/components/ui/skeleton'
import getRenewalStatements from '@/queries/get-renewal-statements'
import { Tables } from '@/types/database.types'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import DataTableRow from './data-table-row'
import { createBrowserClient } from '@/utils/supabase-client'
import { fuzzyStartsWith } from '@/utils/filter-agent-company'
import getAccountsColumnVisibilityByUserId from '@/queries/get-accounts-column-visibility-by-user-id'
import getAccountsColumnSortingByUserId from '@/queries/get-accounts-column-sorting-by-user-id'
import { useColumnStates } from '@/app/(dashboard)/(home)/accounts-corporate-sme/mutations/column-states'
import { useToast } from '@/components/ui/use-toast'
import { useUserServer } from '@/providers/UserProvider'
import { useRouter } from 'next/navigation'
import ExportAccountRequests from '@/app/(dashboard)/(home)/accounts-corporate-sme/export-requests/export-account-requests'
import ExportAccountsModal from '@/app/(dashboard)/(home)/accounts-corporate-sme/export-requests/export-accounts-modal'
import { isAfter, isBefore, addMonths } from 'date-fns'
import getRenewalStatementsCount from '@/queries/get-renewal-counts'

interface IData {
  id: string
}
interface DataTableProps<TData extends IData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  customSortStatus?: string | null
  data: TData[]
  pageCount: number
  pageIndex: number
  pageSize: number
  onPageChange: (index: number) => void
  onPageSizeChange: (size: number) => void
  searchMode: 'company' | 'agent'          
  setSearchMode: Dispatch<SetStateAction<'company' | 'agent'>>
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
  customSortID: string | null
}

const DataTable = <TData extends IData, TValue>({
  columns,
  customSortStatus,
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  searchMode,
  setSearchMode,
  searchTerm,
  setSearchTerm,
  customSortID,
}: DataTableProps<TData, TValue>) => {
  const supabase = createBrowserClient()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useUserServer()
  const { upsertRenewalSMEColumnVisibility, upsertRenewalSMEColumnSorting } = useColumnStates()
  const [isAccountLoading, setIsAccountLoading] = useState(false)
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

  const table = useReactTable({
    data,
    columns,
    manualPagination: true, 
    pageCount,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: (updater) => {
      const newState = typeof updater === 'function' ? updater({ pageIndex, pageSize }) : updater
      onPageChange(newState.pageIndex)
      onPageSizeChange(newState.pageSize)
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setSearchTerm,
    globalFilterFn: fuzzyStartsWith(searchMode),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
      columnVisibility,
      globalFilter: searchTerm,
    }
  })
  
  useEffect(() => {
      if (!user?.id) return
  
      upsertRenewalSMEColumnVisibility([
        {
          user_id: user.id,
          columns_sme_renewals: columnVisibility,
        },
      ])
    }, [columnVisibility, supabase, toast, upsertRenewalSMEColumnVisibility, user?.id])
  
  useEffect(() => {
    if (!user?.id) return

    const sortedId = sorting[0]?.id
    const allowed = ["status_type_name", "account_type_name"]
    const effectiveCustomSort = sortedId && allowed.includes(sortedId) ? customSortStatus : null

    upsertRenewalSMEColumnSorting([
      {
        user_id: user.id,
        columns_sme_renewals: sorting,
        custom__sort_sme_renewals: effectiveCustomSort ?? null
      }
    ])
  }, [sorting, supabase, toast, upsertRenewalSMEColumnSorting, user?.id, customSortStatus])
  
  //Upcoming and overdue renewals
  const dateToday = new Date()
  const renewalCountQuery = useMemo(() => {
    return getRenewalStatementsCount(supabase, { 
      accountType: 'Business'
    })
  }, [supabase])
  const { data: renewalCount, count, isLoading } = useQuery(renewalCountQuery)
  const upcomingCount = (renewalCount ?? []).filter((row) => 
    (row as any).expiration_date &&
    isAfter((row as any).expiration_date, dateToday) &&
    isBefore((row as any).expiration_date, addMonths(dateToday, 3))
  ).length
  const overdueCount = (renewalCount ?? []).filter((row) =>
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
            <ExportAccountsModal 
              exportData={'accounts'} 
              exportType ='renewals'
              columnSortingID={(columnSortingData?.columns_sme_renewals?.[0] as any)?.id}
              customSortID={customSortID}
            />
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
                          router.push(
  `/renewals-corporate-sme/${row.original.id}?fromPage=${currentPage}&pageSize=${pageSize}&fromPath=/renewals-corporate-sme`)
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
