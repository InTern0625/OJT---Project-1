'use client'

import {
  PageHeader,
  PageTitle,
  PageDescription,
} from '@/components/page-header'
import AddUser from '@/app/(dashboard)/admin/users/create/add-user'
import getUsers from '@/queries/get-users'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { createBrowserClient } from '@/utils/supabase-client'

const UserListHeader = () => {
  const supabase = createBrowserClient()
  const { data, isPending } = useQuery(getUsers(supabase))

  return (
    <PageHeader>
      <div>
        <PageTitle>Users</PageTitle>
        <PageDescription>
          {isPending && <Skeleton className="h-4 w-20" />}
          {data?.length} {data?.length === 1 ? 'User' : 'Users'}
        </PageDescription>
      </div>
      <AddUser />
    </PageHeader>
  )
}
export default UserListHeader
