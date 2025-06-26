'use client'

import getBillingStatements from '@/queries/get-billing-statements'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import pendingColumns from './billing-statements-columns'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'

const PendingTable = () => {
  const supabase = createBrowserClient()

  const { data } = useQuery(getBillingStatements(supabase))
  const filteredData = (data || [])
    .filter(
      (item: any) =>
        item.accounts.account_type?.name === 'SME' ||
        item.accounts.account_type?.name === 'Corporate',
    )
    .map((item: any) => ({
      ...item,
      account_type_id: item.account_type?.id ?? null,
    }))
  return <DataTable columns={pendingColumns} data={filteredData || []} />
}
export default PendingTable
