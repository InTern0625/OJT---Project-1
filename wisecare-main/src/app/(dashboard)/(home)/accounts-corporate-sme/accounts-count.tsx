import { PageDescription } from '@/components/page-header'
import { Skeleton } from '@/components/ui/skeleton'
import getAccounts from '@/queries/get-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { useMemo } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'
import getTypes from '@/queries/get-types'

const AccountsCount = () => {
  const supabase = createBrowserClient()
  const { data: count, isLoading } = useQuery(getAccounts(supabase))
  const { data: statusTypes } = useQuery(getTypes(supabase, 'status_types'))

  const countsByStatus = useMemo(() => {
    const result: Record<string, number> = {}

    ;(count || []).forEach((item: any) => {
      if (item.account_type !== null) {
        const key = item.status_type?.name?.toLowerCase() || 'unknown'
        result[key] = (result[key] || 0) + 1
      }
    })

    return result
  }, [count])

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-4 w-20" />
      ) : (
        <PageDescription>
          {Object.entries(countsByStatus).map(([status, count], idx, arr) => (
            <span key={status}>
              {count} {status.charAt(0).toUpperCase() + status.slice(1)} Account{count !== 1 ? 's' : ''}
              {idx < arr.length - 1 ? ' | ' : ''}
            </span>
          ))}
        </PageDescription>
      )}
    </>
  )
}

export default AccountsCount
