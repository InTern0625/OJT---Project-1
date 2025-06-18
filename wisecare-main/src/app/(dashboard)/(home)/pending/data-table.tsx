'use client'

import {
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/page-header'
import TablePagination from '@/components/table-pagination'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Search } from 'lucide-react'
import { useState } from 'react'

import TableViewOptions from '@/components/table-view-options'
import DataTableRow from './data-table-row'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const DataTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  })
  return (
    // <AccountsProvider>
    <div className="flex flex-col">
      <PageHeader>
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <PageTitle>Pending</PageTitle>
            <PageDescription>5 Accounts</PageDescription>
          </div>
          <div className="flex flex-row gap-4">
            <div className="relative">
              <Search className="absolute top-3.5 left-3.5 h-5 w-5 text-[#94a3b8]" />
              <Input
                className="max-w-xs rounded-full pl-10"
                placeholder="Search accounts"
                value={
                  (table
                    .getColumn('company_name')
                    ?.getFilterValue() as string) ?? ''
                }
                onChange={(event) =>
                  table
                    .getColumn('company_name')
                    ?.setFilterValue(event.target.value)
                }
              />
            </div>
            {/* <AddAccountButton /> */}
          </div>
        </div>
      </PageHeader>
      {/* <TableViewOptions table={table} /> */}
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
              {/* @ts-ignore */}
              <DataTableRow table={table} columns={columns} />
            </TableBody>
          </Table>
        </div>
        <TablePagination table={table} />
      </div>
    </div>
    // </AccountsProvider>
  )
}

export default DataTable
