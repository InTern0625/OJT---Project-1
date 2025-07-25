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
import getUserIDbyName from '@/queries/get-user-name-by-id'  

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
  const [userID, setUserID] = useState<string[] | null>(null)

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
      } else if (sortKey === 'program_type_name') {
        tableName = 'program_types'
      } else if (sortKey === 'room_plan_name'){
        tableName = 'room_plans'
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
    const fetchUserID = async() => {
      if (searchMode == "agent"){
        const { data, error } = await getUserIDbyName(supabase, searchTerm) 
        if (error) return
        const ids = data?.map((d) => d.user_id) ?? undefined
        setUserID(ids)
      }
    }
    fetchUserID()
  }, [supabase, searchTerm, searchMode])

  useEffect(() => {
    setPageIndex(0)
  }, [searchTerm, searchMode])

  const accountQuery = useMemo(() => {
    const originalSortKey = (columnSortingData?.columns_ifp_accounts?.[0] as any)?.id
    const sortKey =
      originalSortKey === 'status'
        ? 'expiration_date'
        : originalSortKey === 'age'
        ? 'birthdate'
        : originalSortKey

    return getAccounts(supabase, { 
      accountType: 'IFP',
      range: { start: from, end: to },
      sortOrder: {
        col: sortKey, 
        desc: (columnSortingData?.columns_ifp_accounts?.[0] as any)?.desc
      },
      customSort: {
        key: sortKey,
        value: customSortID
      },
      search: {
        key: searchMode,
        value: searchTerm
      },
      agentIds: searchMode === 'agent' ? userID ?? [] : undefined
    })
  }, [supabase, from, to, columnSortingData, customSortID, searchMode, searchTerm, userID])

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
            customSortID={customSortID}
          />
}
export default AccountsTable
