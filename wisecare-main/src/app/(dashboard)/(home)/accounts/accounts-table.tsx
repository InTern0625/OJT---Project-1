'use client'

import accountsColumns from '@/app/(dashboard)/(home)/accounts/columns/accounts-columns'
import getAccounts from '@/queries/get-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'
import { useSearchParams } from 'next/navigation'

interface AccountsTableProps {
  initialPageIndex: number
  initialPageSize: number
}

const AccountsTable = ({ initialPageIndex, initialPageSize}: AccountsTableProps) => {
  const supabase = createBrowserClient()
  const { data } = useQuery(getAccounts(supabase))

  return <DataTable 
            columns={accountsColumns} 
            data={(data as any) || []} 
            initialPageIndex={initialPageIndex}
            initialPageSize={initialPageSize}/>
}
export default AccountsTable
