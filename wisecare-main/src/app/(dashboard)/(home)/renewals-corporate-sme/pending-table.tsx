'use client'

import getRenewalStatements from '@/queries/get-renewal-statements'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import renewalStatementsColumns from './renewal-statements-columns'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'

const PendingTable = () => {
  const supabase = createBrowserClient()

  const { data } = useQuery(getRenewalStatements(supabase))
  const filteredData = (data || []).filter((item: any) => 
    item.account_types?.name === 'SME' ||
    item.account_types?.name === 'CORPORATE' ||
    item.account_types?.name === null
  )
  .map((item: any) => ({
    ...item,
    account_type_id: item.account_types?.id ?? null, 
  }))

  return <DataTable columns={renewalStatementsColumns} data={filteredData || []} />
}
export default PendingTable
