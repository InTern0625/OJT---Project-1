import React from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { ColumnDef, flexRender, Table } from '@tanstack/react-table'
import { useAccountExportRequestsContext } from '@/app/(dashboard)/admin/approval-request/account-exports/account-export-requests-provider'

interface AccountExportRequestsRowsProps<TData> {
  table: Table<TData>
  columns: ColumnDef<TData>[]
}

const AccountExportRequestsRows = <TData,>({
  table,
  columns,
}: AccountExportRequestsRowsProps<TData>) => {
  const { setIsModalOpen, setSelectedData } = useAccountExportRequestsContext()

  const handleOnClick = (originalData: TData) => {
    setIsModalOpen(true)
    setSelectedData(originalData)
  }
  return (
    <>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            className="hover:bg-muted! cursor-pointer"
            onClick={() => handleOnClick(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-16 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </>
  )
}

export default AccountExportRequestsRows
