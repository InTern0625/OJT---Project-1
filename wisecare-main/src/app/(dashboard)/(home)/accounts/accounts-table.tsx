'use client'

import accountsColumns from '@/app/(dashboard)/(home)/accounts/columns/accounts-columns'
import getAccounts from '@/queries/get-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'

const AccountsTable = () => {
  const supabase = createBrowserClient()
  const { data } = useQuery(getAccounts(supabase))

  return <DataTable columns={accountsColumns} data={(data as any) || []} />
}
export default AccountsTable
