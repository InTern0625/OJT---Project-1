'use client'

import AffiliatesActionsDropdown from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-actions-dropdown'
import AffiliateMobileTable from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-mobile-table'
import affiliatesColumns from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-columns'
import AffiliatesTableSearch from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-table-search'
import ImportAffiliateButton from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/import/import-affiliates-button'
import TablePagination from '@/components/table-pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import getAffiliatesByCompanyId from '@/queries/get-affiliates-by-company-id'
import { Tables } from '@/types/database.types'
import { cn } from '@/utils/tailwind'
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
import { AlertTriangle } from 'lucide-react'
import { useMemo, useState } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface DataTableProps {
  companyId: string
  role: string
}

const AffiliatesDataTable = ({ companyId, role }: DataTableProps) => {
  const supabase = createBrowserClient()
  const { data } = useQuery<Tables<'company_affiliates'>[]>(
    // @ts-expect-error
    getAffiliatesByCompanyId(supabase, companyId),
  )

  // find duplicates
  const { duplicates } = useMemo(() => {
    const counts: { [key: string]: number } = {}
    const uniqueSet = new Set<string>()
    const uniqueData: Tables<'company_affiliates'>[] = []

    data &&
      data.forEach((affiliate) => {
        const key = `${affiliate.affiliate_name}`
        counts[key] = (counts[key] || 0) + 1
        if (!uniqueSet.has(key)) {
          uniqueSet.add(key)
          uniqueData.push(affiliate)
        }
      })

    const duplicates = Object.fromEntries(
      Object.entries(counts).filter(([_, count]) => count > 1),
    )

    return { duplicates }
  }, [data])

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState<any>('')

  const table = useReactTable({
    data: (data as any) ?? [],
    columns: affiliatesColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: 'includesString',
    state: {
      sorting,
      columnVisibility,
      globalFilter,
    },
  })

  // check if the user is after-sales, under-writing, or admin
  // before rendering the import button
  const isAfterSalesAndUnderWriting = [
    'after-sales',
    'under-writing',
    'admin',
  ].includes(role)

  return (
    <TooltipProvider>
      <div className="flex flex-row items-center justify-between gap-2 py-4">
        <div className="flex w-full flex-col items-start lg:flex-row lg:items-center lg:gap-10">
          <AffiliatesTableSearch table={table} />
        </div>
        <div className="flex items-center space-x-1">
          {isAfterSalesAndUnderWriting && <ImportAffiliateButton />}
          <AffiliatesActionsDropdown companyId={companyId} />
        </div>
      </div>

      {/* Desktop Table */}
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
              table.getRowModel().rows.map((row) => {
                const key = `${row.original.affiliate_name}`
                const isDuplicate = duplicates[key]

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cn(
                      isDuplicate ? 'bg-yellow-100 hover:bg-yellow-200' : ''
                    )}
                  >
                    {row.getVisibleCells().map((cell, index) => (
                      <TableCell key={cell.id}>
                        <div className="flex items-center">
                          {/* duplicate warning tooltip and icon */}
                          {isDuplicate && index === 0 && (
                            <Tooltip>
                              <TooltipTrigger>
                                <AlertTriangle className="mr-2 h-4 w-4 text-yellow-500" />
                              </TooltipTrigger>
                              <TooltipContent>
                                Duplicate affiliate found
                              </TooltipContent>
                            </Tooltip>
                          )}
                          {/* cell content */}
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={affiliatesColumns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Table */}
      <AffiliateMobileTable table={table} />

      {/* Pagination */}
      <TablePagination table={table} />
    </TooltipProvider>
  )
}

export default AffiliatesDataTable
