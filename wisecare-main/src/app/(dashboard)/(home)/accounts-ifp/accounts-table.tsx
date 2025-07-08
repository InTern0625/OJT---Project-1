'use client'

import accountsColumns from '@/app/(dashboard)/(home)/accounts-ifp/columns/accounts-columns'
import getAccounts from '@/queries/get-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'

const AccountsTable = () => {
  const supabase = createBrowserClient()
  const { data, isLoading } = useQuery(getAccounts(supabase))
  if (isLoading) return null
  const filteredData = (data || [])
    .filter(
      (item: any) =>
        item.program_type !== null
    )
    .map((item: any) => ({
      ...item,
      account_type_id: item.account_type?.id ?? null,
    }))
    console.log(filteredData)

  return <DataTable columns={accountsColumns} data={filteredData || []} />
}
export default AccountsTable
