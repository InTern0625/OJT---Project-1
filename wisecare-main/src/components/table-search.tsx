'use client'
import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'
import { Search } from 'lucide-react'

interface TableSearchProps<TData> {
  table: Table<TData>
  placeholder?: string
}

const TableSearch = <TData,>({
  table,
  placeholder = 'Search accounts',
}: TableSearchProps<TData>) => {
  return (
    <div className="relative">
      <Search className="absolute top-3.5 left-3.5 h-5 w-5 text-[#94a3b8]" />
      <Input
        className="max-w-xs rounded-full pl-10"
        placeholder={placeholder}
        value={table.getState().globalFilter}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
      />
    </div>
  )
}

export default TableSearch
