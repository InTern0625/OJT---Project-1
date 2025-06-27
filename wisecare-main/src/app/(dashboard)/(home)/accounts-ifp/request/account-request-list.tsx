import AccountRequestListItem from '@/app/(dashboard)/(home)/accounts-ifp/request/account-request-list-item'
import getPendingAccounts from '@/queries/get-pending-accounts'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createBrowserClient } from '@/utils/supabase-client'

const AccountRequestList = () => {
  const supabase = createBrowserClient()

  const { data: pendingAccounts } = useQuery(getPendingAccounts(supabase))
  return (
    <div className="grid grid-cols-1 divide-y">
      {pendingAccounts?.map((pendingAccount) => (
        <AccountRequestListItem
          key={pendingAccount.id}
          pendingAccount={pendingAccount as any}
        />
      ))}
    </div>
  )
}

export default AccountRequestList
