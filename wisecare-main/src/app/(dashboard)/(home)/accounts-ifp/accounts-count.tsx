import { PageDescription } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import getAccounts from '@/queries/get-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { useMemo } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

const AccountsCount = () => {
  const supabase = createBrowserClient()
  const { data: count, isLoading } = useQuery(getAccounts(supabase))

  const activeCount = useMemo(() => {
    return (count || []).filter(
      (item: any) =>
        item.program_type !== null &&
        item.status_type?.name?.toLowerCase() === 'active'
    ).length;
  }, [count]);
  const inactiveCount = useMemo(() => {
    return (count || []).filter(
      (item: any) =>
        item.program_type !== null &&
        item.status_type?.name?.toLowerCase() === 'inactive'
    ).length;
  }, [count]);
  const otherCounts = useMemo(() => {
    return (count || []).filter(
      (item: any) =>
        item.program_type !== null &&
        item.status_type?.name?.toLowerCase() !== 'inactive' &&
        item.status_type?.name?.toLowerCase() !== 'active'
    ).length;
  }, [count]);

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-4 w-20" />
      ) : (
        <PageDescription>
          {activeCount} Active Accounts | {inactiveCount} Inactive Accounts | {otherCounts} Others
        </PageDescription>
      )}
    </>
  )
}

export default AccountsCount
