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
    item.account_type?.name?.toUpperCase().startsWith('SME') ||
    item.account_type?.name?.toUpperCase().startsWith('CORPORATE') ||
    item.account_type?.name === null || 
    item.account_type?.name === undefined
  )
  .map((item: any) => ({
    ...item,
    account_type_id: item.account_types?.id ?? null, 
  }))

  return <DataTable columns={renewalStatementsColumns} data={filteredData || []} />
}
export default PendingTable
