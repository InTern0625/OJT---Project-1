'use client'

import AccountsColumns from '@/app/(dashboard)/(home)/accounts-corporate-sme/columns/accounts-columns'
import getAccounts from '@/queries/get-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import DataTable from './data-table'
import { createBrowserClient } from '@/utils/supabase-client'
import { Skeleton } from '@/components/ui/skeleton'

interface AccountsTableProps {
  initialPageIndex: number
  initialPageSize: number
}

const AccountsTable = ({ initialPageIndex, initialPageSize }: AccountsTableProps) => {
  const supabase = createBrowserClient()
  const { data, isLoading } = useQuery(getAccounts(supabase))
  if (isLoading) {
     return <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
  }
  const columns = AccountsColumns()
  const filteredData = (data || [])
    .filter(
    (item: any) =>{
        const isBusiness = item.account_type !== null;
        const isIFP = item.program_type !== null;

        return (isBusiness && !isIFP) || (!isBusiness && !isIFP);
    })
    .map((item: any) => ({
      ...item,
      account_type_id: item.account_type?.id ?? null,
    }))
  return <DataTable columns={columns} data={filteredData || []} 
          initialPageIndex={initialPageIndex}
          initialPageSize={initialPageSize} />
}
export default AccountsTable
