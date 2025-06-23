import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'

interface EmployeesTableSearchProps<TData> {
  table: Table<TData>
}

const EmployeesTableSearch = <TData,>({
  table,
}: EmployeesTableSearchProps<TData>) => {
  return (
    <Input
      placeholder="Search..."
      value={table.getState().globalFilter}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      className="max-w-sm"
    />
  )
}

export default EmployeesTableSearch
