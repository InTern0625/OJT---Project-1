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
        item.account_type?.name === 'SME' ||
        item.account_type?.name === 'CORPORATE',
    )
    .map((item: any) => ({
      ...item,
      account_type_id: item.account_type?.id ?? null,
    }))
  return <DataTable columns={accountsColumns} data={filteredData || []} />
}
export default AccountsTable
