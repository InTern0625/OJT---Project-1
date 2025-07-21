'use client'

import AccountsColumns from '@/app/(dashboard)/(home)/accounts-ifp/columns/accounts-columns'
import getAccounts from '@/queries/get-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'
import { useState, useEffect, useMemo } from 'react'
import getAccountsColumnSortingByUserId from '@/queries/get-accounts-column-sorting-by-user-id'
import getTypesIDbyName from '@/queries/get-typesIDbyName'  
import { TypeTabs } from '@/app/(dashboard)/admin/types/type-card'

interface AccountsTableProps {
  initialPageIndex: number
  initialPageSize: number
}

const AccountsTable = ({ initialPageIndex, initialPageSize}: AccountsTableProps) => {
  const supabase = createBrowserClient()
  const [customSortStatus, setCustomSortStatus] = useState<string | null>(null)
  const { data: columnSortingData } = useQuery(
    getAccountsColumnSortingByUserId(supabase, "columns_ifp_accounts"),
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
  //const { data, count, isLoading } = useQuery(getAccounts(supabase))
  //Get ID of custom sort
  useEffect(() => {
    const fetchSortID = async () => {
      const sortKey = (columnSortingData?.columns_ifp_accounts?.[0] as any)?.id
      const storedRaw = columnSortingData?.custom__sort_ifp_accounts ?? null
      setCustomSortStatus(storedRaw)

      if (!customSortStatus || !sortKey) return

      let tableName: TypeTabs | null = null
      if (sortKey === 'status_type_name') {
        tableName = 'status_types'
      } else if (sortKey === 'account_type_name') {
        tableName = 'account_types'
      } else {
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

  useEffect(() => {
    setPageIndex(0)
  }, [searchTerm, searchMode])

  

  const baseQuery = useMemo(() => {
    return getAccounts(supabase, { 
      accountType: 'IFP',
      sortOrder: {
        col: (columnSortingData?.columns_ifp_accounts?.[0] as any)?.id, 
        desc: (columnSortingData?.columns_ifp_accounts?.[0] as any)?.desc
      },
      customSort: {
        key: (columnSortingData?.columns_ifp_accounts?.[0] as any)?.id,
        value: customSortID
      },
      search: {
        key: searchMode,
        value: searchTerm
      }
    })
  }, [supabase, from, to, columnSortingData, customSortID, searchMode, searchTerm])

  const accountQuery = useMemo(() => {
    return baseQuery.range(from, to)
  }, [baseQuery, from, to])

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

  const columns = AccountsColumns({
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
          />
}
export default AccountsTable
