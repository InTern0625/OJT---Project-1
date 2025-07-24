'use client'
import { Input } from '@/components/ui/input'
import { Table } from '@tanstack/react-table'
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TableSearchProps<TData> {
  table: Table<TData>
  placeholder?: string
  searchMode: 'company' | 'agent'
  setSearchMode: React.Dispatch<React.SetStateAction<'company' | 'agent'>>
}

const TableSearchAccounts = <TData,>({
  table,
  placeholder = 'Search accounts',
  searchMode,
  setSearchMode,
}: TableSearchProps<TData>) => {
  return (
     <div className="relative w-full max-w-xs">
      <Search className="absolute left-4.5 top-3.5 h-5 w-5 text-muted-foreground" />
      <Input
        className="pl-11 pr-24 rounded-full"
        placeholder={`Search by ${searchMode === 'company' ? 'Company' : 'Agent'}`}
        value={table.getState().globalFilter}
        onChange={(e) => table.setGlobalFilter(e.target.value)}
      />
      <Button
        type="button"
        size="lg"
        onClick={() =>
          setSearchMode(prev => (prev === 'company' ? 'agent' : 'company'))
        }
        className="absolute right-3 top-[6px] h-6 px-2 text-xs"
      >
        {searchMode === 'company' ? 'Company' : 'Agent'}
      </Button>
    </div>
  )
}

export default TableSearchAccounts