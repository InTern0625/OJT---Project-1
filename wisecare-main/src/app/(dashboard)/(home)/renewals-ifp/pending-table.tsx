'use client'

import getRenewalStatements from '@/queries/get-renewal-statements'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import renewalStatementsColumns from './renewal-statements-columns'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'

const PendingTable = () => {
  const supabase = createBrowserClient()

  const { data } = useQuery(getRenewalStatements(supabase))
  const now = new Date()
  const threeMonthsLater = new Date()
  threeMonthsLater.setMonth(now.getMonth() + 3)
  const filteredData = (data || [])
  .filter((item: any) => {
    const accountType = item.program_type?.name?.toUpperCase()
    const expiration = item.expiration_date ? new Date(item.expiration_date) : null

    const isTypeValid = accountType
      ? (accountType.startsWith('PREPAID') ||
      accountType.startsWith('FAMILY') ||
      accountType.startsWith('INDIVIDUAL')) 
      : false
    const isExpirationValid = expiration !== null && expiration <= threeMonthsLater 
    return isTypeValid && isExpirationValid
  })
  .map((item: any) => ({
    ...item,
    program_type_id: item.program_type?.id ?? null, 
  }))

  return <DataTable columns={renewalStatementsColumns} data={filteredData || []} />
}
export default PendingTable
