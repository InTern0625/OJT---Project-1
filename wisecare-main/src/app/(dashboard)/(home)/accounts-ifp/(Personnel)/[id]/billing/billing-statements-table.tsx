'use client'

import BillingMobileTable from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/billing/billing-mobile-table'
import BillingStatementsColumns from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/billing/billing-statements-columns'
import TotalSelected from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/billing/total-selected'
import TablePagination from '@/components/table-pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import getBillingStatementByCompanyId from '@/queries/get-billing-statement-by-company-id'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'
import { useRouter } from 'next/navigation'
import { Skeleton } from '@/components/ui/skeleton'

const BillingStatementsTable = ({ companyId }: { companyId: string }) => {
  const supabase = createBrowserClient()
  const { data, isLoading } = useQuery(getBillingStatementByCompanyId(supabase, companyId))
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState<any>('')
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: (data as any) || [],
    columns: BillingStatementsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      globalFilter,
      rowSelection,
    },
  })

  if (isLoading) {
    return <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  }
  return (
    <div className="space-y-2">
      <TotalSelected table={table} />
      <div className="hidden rounded-md border lg:block">
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
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell, index) => (
                    <TableCell 
                      key={cell.id}
                      onClick={() => {
                        if(index === 0) return
                        router.push(`/accounts-ifp/${companyId}/billing/${row.original.id}`);
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={BillingStatementsColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <BillingMobileTable table={table} />

      {/* Pagination */}
      <TablePagination table={table} />
    </div>
  )
}

export default BillingStatementsTable
