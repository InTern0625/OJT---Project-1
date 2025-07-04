'use client'

import getBillingStatements from '@/queries/get-billing-statements'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import pendingColumns from './billing-statements-columns'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'

const PendingTable = () => {
  const supabase = createBrowserClient()

  const { data } = useQuery(getBillingStatements(supabase))

  return <DataTable columns={pendingColumns} data={(data as any) || []} />
}
export default PendingTable
