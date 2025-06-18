'use client'

import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import DataTable from './data-table'
import pendingColumns from './pending-columns'
import getBillingStatements from '@/queries/get-billing-statements'
import { createBrowserClient } from '@/utils/supabase-client'

const PendingTable = () => {
  const supabase = createBrowserClient()
  const { data } = useQuery(getBillingStatements(supabase))

  return <DataTable columns={pendingColumns} data={data as any} />
}
export default PendingTable
