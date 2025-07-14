'use client'

import getBillingStatements from '@/queries/get-billing-statements'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import pendingColumns from './billing-statements-columns'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'

const PendingTable = () => {
  const supabase = createBrowserClient()

  const { data, isLoading } = useQuery(getBillingStatements(supabase))
  if (isLoading) return null
  const filteredData = (data || [])
    .filter(
      (item: any) =>{
        const isBusiness = item.accounts.account_type !== null;
        const isIFP = item.accounts.program_type !== null;

        return (!isBusiness && isIFP) || (!isBusiness && !isIFP);
    })
    .map((item: any) => ({
      ...item,
      account_type_id: item.account_type?.id ?? null,
    }))
  return <DataTable columns={pendingColumns} data={filteredData || []} />
}
export default PendingTable
