import getTypes from '@/queries/get-types'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createBrowserClient } from '@/utils/supabase-client'
import { TypeTabs } from '../app/(dashboard)/admin/types/type-card'

export const useSortingOrder = (sortType: string) => {
  const supabase = createBrowserClient()
  const sorting = sortType as TypeTabs  
  const { data: sortingTypeList } = useQuery(getTypes(supabase, sorting))
  return sortingTypeList?.map(type => type.name) || []
}

export const createCustomSorter = (statusOrder: string[]) => {
  return (a: string, b: string) => {
    const valA = a || ''
    const valB = b || ''
    
    const indexA = statusOrder.indexOf(valA)
    const indexB = statusOrder.indexOf(valB)
    
    if (indexA === -1 && indexB === -1) return valA.localeCompare(valB)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  }
}