'use client'

import getRenewalStatements from '@/queries/get-renewal-statements'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import RenewalStatementsColumns from './renewal-statements-columns'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'

const PendingTable = () => {
  const supabase = createBrowserClient()
  const now = new Date()
  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(now.getMonth() + 3)
  const columns = RenewalStatementsColumns()
  
  const { data } = useQuery(getRenewalStatements(supabase))
  
  const filteredData = (data || [])
  .filter((item: any) => {
    const accountType = item.account_types?.name?.toUpperCase()
    const expiration = item.expiration_date ? new Date(item.expiration_date) : null
    const isBusiness = item.account_types !== null
    const isIFP = item.program_type !== null

    const isExpirationValid = expiration !== null && expiration <= threeMonthsLater 
    return ((isBusiness && !isIFP) || (!isBusiness && !isIFP)) && isExpirationValid
  })
  .map((item: any) => ({
    ...item,
    account_type_id: item.account_types?.id ?? null, 
  }))
  return <DataTable columns={columns} data={filteredData || []} />
}
export default PendingTable
