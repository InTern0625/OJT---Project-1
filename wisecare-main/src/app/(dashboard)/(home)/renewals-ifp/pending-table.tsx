'use client'

import getRenewalStatements from '@/queries/get-renewal-statements'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import RenewalStatementsColumns from './renewal-statements-columns'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'
import { useState, useEffect, useMemo } from 'react'
import getAccountsColumnSortingByUserId from '@/queries/get-accounts-column-sorting-by-user-id'
import getTypesIDbyName from '@/queries/get-typesIDbyName'  
import { TypeTabs } from '@/app/(dashboard)/admin/types/type-card'

interface PendingTableProps {
  initialPageIndex: number
  initialPageSize: number
}

const PendingTable = ({ initialPageIndex, initialPageSize}: PendingTableProps) => {
  const supabase = createBrowserClient()
  const now = new Date()
  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(now.getMonth() + 3)
  
const [customSortStatus, setCustomSortStatus] = useState<string | null>(null)
  const { data: columnSortingData } = useQuery(
    getAccountsColumnSortingByUserId(supabase, "columns_ifp_renewals"),
  )
  const [customSortID, setCustomSortID] = useState<string | null>(null)
  const [searchMode, setSearchMode] = useState<'company' | 'agent'>('company')
  const [searchTerm, setSearchTerm] = useState('')
  
  //Pagination
  const [pageIndex, setPageIndex] = useState(initialPageIndex)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [previousData, setPreviousData] = useState<any[]>([])
  const from = pageIndex * pageSize
  
  const to = from + pageSize - 1

  //Get ID of custom sort
  useEffect(() => {
    const fetchSortID = async () => {
      const sortKey = (columnSortingData?.columns_ifp_renewals?.[0] as any)?.id
      const storedRaw = columnSortingData?.custom__sort_ifp_renewals ?? null
      setCustomSortStatus(storedRaw)

      if (!customSortStatus || !sortKey) return

      let tableName: TypeTabs | null = null
      if (sortKey === 'status_type_name') {
        tableName = 'status_types'
      } else if (sortKey === 'program_type_name') {
        tableName = 'program_types'
      } else if (sortKey === 'room_plan_name') {
        tableName = 'room_plans'
      }else {
        return
      }
      const { data, error } = await getTypesIDbyName(supabase, tableName, customSortStatus)
      if (error) {
        return
      }

      setCustomSortID(data?.id ?? null)
    }

    fetchSortID()
  }, [supabase, customSortStatus, columnSortingData])

  const accountQuery = useMemo(() => {
    return getRenewalStatements(supabase, { 
      accountType: 'IFP',
      range: { start: from, end: to },
      sortOrder: {
        col: (columnSortingData?.columns_ifp_renewals?.[0] as any)?.id, 
        desc: (columnSortingData?.columns_ifp_renewals?.[0] as any)?.desc
      },
      customSort: {
        key: (columnSortingData?.columns_ifp_renewals?.[0] as any)?.id,
        value: customSortID
      },
      search: {
        key: searchMode,
        value: searchTerm
      }
    })
  }, [supabase, from, to, columnSortingData, customSortID, searchMode, searchTerm])

  const { data, count, isLoading } = useQuery(accountQuery)

  const accountData = (data || []).map((item: any) => ({
    ...item,
    account_type_id: item.account_type?.id ?? null,
  }))
  useEffect(() => {
    if (data && !isLoading) {
      setPreviousData(data)
    }
  }, [data, isLoading])

  const columns = RenewalStatementsColumns({
    customSortStatus,
    setCustomSortStatus,
  })

  const displayData = isLoading ? previousData : accountData

  return <DataTable 
    columns={columns} 
    data={displayData ?? []}
    pageCount={Math.ceil((count || 0) / pageSize)}
    pageIndex={pageIndex}
    pageSize={pageSize}
    onPageChange={setPageIndex}
    onPageSizeChange={setPageSize}
    customSortStatus={customSortStatus} 
    searchMode={searchMode}
    setSearchMode={setSearchMode}
    searchTerm={searchTerm}
    setSearchTerm={setSearchTerm}
    customSortID={customSortID}
  />
}
export default PendingTable
