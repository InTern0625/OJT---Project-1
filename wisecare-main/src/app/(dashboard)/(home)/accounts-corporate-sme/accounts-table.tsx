'use client'

import accountsColumns from '@/app/(dashboard)/(home)/accounts-corporate-sme/columns/accounts-columns'
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
      item.account_type?.name?.toUpperCase().startsWith('SME') ||
      item.account_type?.name?.toUpperCase().startsWith('CORPORATE') ||
      item.account_type?.name === null
    )
    .map((item: any) => ({
      ...item,
      account_type_id: item.account_type?.id ?? null,
    }))
  console.log(filteredData)
  return <DataTable columns={accountsColumns} data={filteredData || []} />
}
export default AccountsTable
