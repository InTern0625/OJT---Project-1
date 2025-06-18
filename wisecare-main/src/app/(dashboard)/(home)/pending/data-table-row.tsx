import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { TableCell, TableRow } from '@/components/ui/table'
import { Column, ColumnDef, Table, flexRender } from '@tanstack/react-table'
import { useState } from 'react'
import UpdatePendingForm from './update-pending-form'

interface TableRowProps<TData> {
  table: Table<TData>
  columns: ColumnDef<TData>[]
}

const DataTableRow = <TData,>({ table, columns }: TableRowProps<TData>) => {
  const [openForm, setOpenForm] = useState<string | null>(null)

  return (
    <>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <>
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && 'selected'}
              onClick={() => setOpenForm(row.id)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>

            {openForm === row.id && (
              <TableCell colSpan={columns.length}>
                <UpdatePendingForm
                  // @ts-ignore
                  accountId={row.original.id}
                  setOpenForm={setOpenForm}
                />
              </TableCell>
            )}
          </>
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

export default DataTableRow
