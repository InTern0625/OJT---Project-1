import { PageDescription } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import getAccounts from '@/queries/get-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { useMemo } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

const AccountsCount = () => {
  const supabase = createBrowserClient()
  const { data: count, isLoading } = useQuery(getAccounts(supabase))

  const activeCount = useMemo(
    () => count?.filter(
      (item: any) =>
        item.account_type?.name === 'Individual' ||
        item.account_type?.name === 'Family'
    ).filter((account: any) => account.is_account_active).length,
    [count],
  )
  const inactiveCount = useMemo(
    () => count?.filter(
      (item: any) =>
        item.account_type?.name === 'Individual' ||
        item.account_type?.name === 'Family'
    ).filter((account: any) => !account.is_account_active).length,
    [count],
  )

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-4 w-20" />
      ) : (
        <PageDescription>
          {activeCount} Active Accounts | {inactiveCount} Inactive Accounts
        </PageDescription>
      )}
    </>
  )
}

export default AccountsCount
