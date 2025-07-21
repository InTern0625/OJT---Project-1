'use client'

import AccountsColumns from '@/app/(dashboard)/(home)/accounts-corporate-sme/columns/accounts-columns'
import getAccounts from '@/queries/get-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'
import { useState, useEffect, useMemo } from 'react'
import getAccountsColumnSortingByUserId from '@/queries/get-accounts-column-sorting-by-user-id'
import getTypesIDbyName from '@/queries/get-typesIDbyName'  
import { TypeTabs } from '@/app/(dashboard)/admin/types/type-card'
import { Skeleton } from "@/components/ui/skeleton"

interface AccountsTableProps {
  initialPageIndex: number
  initialPageSize: number
}

const AccountsTable = ({ initialPageIndex, initialPageSize }: AccountsTableProps) => {
  const supabase = createBrowserClient()

  const [customSortStatus, setCustomSortStatus] = useState<string | null>(null)
  const { data: columnSortingData } = useQuery(
    getAccountsColumnSortingByUserId(supabase, "columns_sme_accounts"),
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
      const sortKey = (columnSortingData?.columns_sme_accounts?.[0] as any)?.id
      const storedRaw = columnSortingData?.custom__sort_sme_accounts ?? null
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

  const accountQuery = useMemo(() => {
    return getAccounts(supabase, { 
      accountType: 'Business',
      range: { start: from, end: to },
      sortOrder: {
        col: (columnSortingData?.columns_sme_accounts?.[0] as any)?.id, 
        desc: (columnSortingData?.columns_sme_accounts?.[0] as any)?.desc
      },
      customSort: {
        key: (columnSortingData?.columns_sme_accounts?.[0] as any)?.id,
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

  const columns = AccountsColumns({
    customSortStatus,
    setCustomSortStatus,
  })
  
  const filteredData = (data || [])
    .filter(
    (item: any) =>{
        const isBusiness = item.account_type !== null;
        const isIFP = item.program_type !== null;

        return (isBusiness && !isIFP) || (!isBusiness && !isIFP);
    })
    .map((item: any) => ({
      ...item,
      account_type_id: item.account_type?.id ?? null,
    }))
  
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
