import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'

interface AffiliateTableSearchProps<TData> {
  table: Table<TData>
}

const AffiliatesTableSearch = <TData,>({
  table,
}: AffiliateTableSearchProps<TData>) => {
  return (
    <Input
      placeholder="Search..."
      value={table.getState().globalFilter}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      className="max-w-sm"
    />
  )
}

export default AffiliatesTableSearch
