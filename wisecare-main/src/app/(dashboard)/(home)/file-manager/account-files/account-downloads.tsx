'use client'
import React from 'react'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import getExports from '@/queries/get-approved-exports'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'
import { createBrowserClient } from '@/utils/supabase-client'

const AccountDownloadsFileItem = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/file-manager/account-files/account-downloads-file-item'
    ),
  {
    loading: () => (
      <Skeleton className="flex h-40 w-40 flex-col items-center justify-center gap-4 rounded-2xl" />
    ),
  },
)

const AccountDownloads = () => {
  const supabase = createBrowserClient()

  const { data } = useQuery(getExports(supabase, 'asc'))
  const accounts = data?.filter((item) => item.export_type === 'accounts')

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] place-items-center justify-items-center gap-6">
      {accounts?.map((exportFiles) => (
        <AccountDownloadsFileItem
          key={exportFiles.id}
          data={exportFiles as any}
        />
      ))}
    </div>
  )
}

export default AccountDownloads
