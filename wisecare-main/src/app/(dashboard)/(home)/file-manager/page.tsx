'use server'
import AccountDownloads from '@/app/(dashboard)/(home)/file-manager/account-files/account-downloads'
import DownloadsPageTitle from '@/app/(dashboard)/(home)/file-manager/downloads-page-title'
import { DownloadsProvider } from '@/app/(dashboard)/(home)/file-manager/downloads-provider'
import EmployeeDownloads from '@/app/(dashboard)/(home)/file-manager/employee-files/employee-downloads'
import getExports from '@/queries/get-approved-exports'
import { createServerClient } from '@/utils/supabase'
import { prefetchQuery } from '@supabase-cache-helpers/postgrest-react-query'
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { cookies } from 'next/headers'

const DownloadsSheet = dynamic(
  () => import('@/app/(dashboard)/(home)/file-manager/downloads-sheet'),
)

export const metadata = async (): Promise<Metadata> => {
  return {
    title: 'File Manager',
  }
}

const FileManagerPage = async () => {
  const supabase = createServerClient(await cookies())
  const queryClient = new QueryClient()
  await prefetchQuery(queryClient, getExports(supabase))

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DownloadsProvider>
        <div className="flex flex-col">
          <DownloadsPageTitle />
          <div className="space-y-4 p-8">
            <span className="text-sm font-medium"> Accounts </span>
            <AccountDownloads />
          </div>
          <div className="space-y-4 p-8">
            <span className="text-sm font-medium"> Employees </span>
            <EmployeeDownloads />
          </div>
        </div>
        <DownloadsSheet />
      </DownloadsProvider>
    </HydrationBoundary>
  )
}

export default FileManagerPage
