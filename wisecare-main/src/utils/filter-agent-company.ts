import { Row } from '@tanstack/react-table'

export const fuzzyStartsWith =
  (searchMode: 'company' | 'agent') =>
  (row: Row<any>, _columnId: string, filterValue: string) => {
    const value = row.getValue(searchMode === 'company' ? 'company_name' : 'agent')
    return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase())
}
