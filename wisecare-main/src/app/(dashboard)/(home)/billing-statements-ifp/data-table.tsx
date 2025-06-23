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
} from '@tanstack/react-table'
import { Suspense, useState } from 'react'

import AddBillingStatementButton from '@/app/(dashboard)/(home)/billing-statements/add-billing-statement-button'
import { useBillingContext } from '@/app/(dashboard)/(home)/billing-statements/billing-provider'
import BillingStatementModal from '@/components/billing-statement/billing-statement-modal'
import TableSearch from '@/components/table-search'
import { Skeleton } from '@/components/ui/skeleton'
import getBillingStatements from '@/queries/get-billing-statements'
import { Tables } from '@/types/database.types'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import DataTableRow from './data-table-row'
import { createBrowserClient } from '@/utils/supabase-client'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

const DataTable = <TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState<any>('')

  const table = useReactTable({
    data,
    columns,
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

  const supabase = createBrowserClient()
  const { count, isLoading } = useQuery(getBillingStatements(supabase))

  const { isEditModalOpen, setIsEditModalOpen, originalData } =
    useBillingContext()

  return (
    <div className="flex flex-col">
      <PageHeader>
        <div className="flex w-full flex-col gap-6 sm:flex-row sm:justify-between">
          <div>
            <PageTitle>Billing Statements</PageTitle>
            {isLoading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <PageDescription>{count} Billing Statements</PageDescription>
            )}
          </div>
          <div className="flex flex-row gap-4">
            <TableSearch table={table} />
            <AddBillingStatementButton />
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
              {/* @ts-ignore */}
              <DataTableRow table={table} columns={columns} />
            </TableBody>
          </Table>
        </div>
        <TablePagination table={table} />
      </div>

      {isEditModalOpen && (
        <Suspense fallback={<div>Loading...</div>}>
          <BillingStatementModal
            originalData={originalData as any & Tables<'billing_statements'>}
            open={isEditModalOpen}
            setOpen={setIsEditModalOpen}
          />
        </Suspense>
      )}
    </div>
  )
}

export default DataTable
