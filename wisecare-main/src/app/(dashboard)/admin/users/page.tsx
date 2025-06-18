'use server'
import UserListHeader from '@/app/(dashboard)/admin/users/user-list-header'
import getUsers from '@/queries/get-users'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { cookies } from 'next/headers'
import UserList from './user-list'
import { Metadata } from 'next'

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'Users',
  }
}

const UsersPage = async () => {
  const queryClient = new QueryClient()
  const supabase = createServerClient(await cookies())

  await prefetchQuery(queryClient, getUsers(supabase))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="space-y-8">
        <UserListHeader />
        <UserList />
      </div>
    </HydrationBoundary>
  )
}

export default UsersPage
