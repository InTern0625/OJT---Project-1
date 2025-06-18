'use client'

import React from 'react'
import {
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/page-header'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import getAllPendingEmployeeExports from '@/queries/get-all-pending-employee-exports'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ApprovalRequestDataTableRow from '@/app/(dashboard)/admin/approval-request/accounts/approval-request-data-table-row'
import accountsApprovalColumns from '@/app/(dashboard)/admin/approval-request/accounts/accounts-approval-columns'
import TablePagination from '@/components/table-pagination'
import accountExportRequestsColumns from '@/app/(dashboard)/admin/approval-request/account-exports/account-export-requests-columns'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import employeeExportRequestsColumns from '@/app/(dashboard)/admin/approval-request/employee-exports/employee-export-requests-columns'
import { useState } from 'react'
import EmployeeExportRequestsRows from '@/app/(dashboard)/admin/approval-request/employee-exports/employee-export-requests-rows'
import TableSearch from '@/components/table-search'
import { createBrowserClient } from '@/utils/supabase-client'

const EmployeeExportsRequestsTable = () => {
  const supabase = createBrowserClient()
  const { data, count, isPending } = useQuery(
    getAllPendingEmployeeExports(supabase, 'employees', 'desc'),
  )

  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState<any>('')

  const table = useReactTable({
    data: (data as any) || [],
    columns: employeeExportRequestsColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      globalFilter,
    },
  })

  return (
    <div className="flex flex-col">
      <PageHeader>
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <PageTitle>Pending Employee Exports</PageTitle>
            {isPending ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <PageDescription>{count} export requests</PageDescription>
            )}
          </div>
          <div>
            <TableSearch table={table} placeholder="Search requests" />
          </div>
        </div>
      </PageHeader>

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
              <EmployeeExportRequestsRows
                table={table}
                columns={employeeExportRequestsColumns}
              />
            </TableBody>
          </Table>
        </div>
        <TablePagination table={table} />
      </div>
    </div>
  )
}

export default EmployeeExportsRequestsTable
