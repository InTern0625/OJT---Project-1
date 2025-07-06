import { useBillingContext } from '@/app/(dashboard)/(home)/billing-statements-ifp/billing-provider'
import { TableCell, TableRow } from '@/components/ui/table'
import { ColumnDef, Table, flexRender } from '@tanstack/react-table'

interface TableRowProps<TData> {
  table: Table<TData>
  columns: ColumnDef<TData>[]
}

const DataTableRow = <TData,>({ table, columns }: TableRowProps<TData>) => {
  const { setOriginalData, setIsEditModalOpen } = useBillingContext()

  const handleOnClick = (originalData: TData) => {
    setOriginalData(originalData)
    setIsEditModalOpen(true)
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

export default DataTableRow
