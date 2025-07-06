'use client'

import getRenewalStatements from '@/queries/get-renewal-statements'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import renewalStatementsColumns from './renewal-statements-columns'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'

const PendingTable = () => {
  const supabase = createBrowserClient()
  const now = new Date()
  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(now.getMonth() + 3)
  const { data } = useQuery(getRenewalStatements(supabase))
  
  const filteredData = (data || [])
  .filter((item: any) => {
    const accountType = item.account_types?.name?.toUpperCase()
    const expiration = item.expiration_date ? new Date(item.expiration_date) : null

    const isTypeValid = accountType
      ? (accountType.startsWith('SME') ||
      accountType.startsWith('CORPORATE'))
      : false
    const isExpirationValid = expiration !== null && expiration <= threeMonthsLater 
    return isTypeValid && isExpirationValid
  })
  .map((item: any) => ({
    ...item,
    account_type_id: item.account_types?.id ?? null, 
  }))
  return <DataTable columns={renewalStatementsColumns} data={filteredData || []} />
}
export default PendingTable
