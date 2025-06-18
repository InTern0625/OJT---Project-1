'use client'
import React from 'react'
import {
  PageDescription,
  PageHeader,
  PageTitle,
} from '@/components/page-header'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import getExports from '@/queries/get-approved-exports'
import { Skeleton } from '@/components/ui/skeleton'
import ExportButton from '@/app/(dashboard)/(home)/file-manager/export/export-button'
import { createBrowserClient } from '@/utils/supabase-client'

const DownloadsPageTitle = () => {
  const supabase = createBrowserClient()
  const { count, isPending } = useQuery(getExports(supabase))

  return (
    <PageHeader>
      <div className="flex w-full flex-col gap-6 sm:flex-row sm:justify-between">
        <div>
          <PageTitle>Download Export Files</PageTitle>
          {isPending ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <PageDescription>{count} files </PageDescription>
          )}
        </div>
        <ExportButton />
      </div>
    </PageHeader>
  )
}

export default DownloadsPageTitle
