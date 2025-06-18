'use client'
import React from 'react'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import getExports from '@/queries/get-approved-exports'
import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'
import { createBrowserClient } from '@/utils/supabase-client'

const EmployeeDownloadsFileItem = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/file-manager/employee-files/employee-downloads-file-item'
    ),
  {
    loading: () => (
      <Skeleton className="flex h-40 w-40 flex-col items-center justify-center gap-4 rounded-2xl" />
    ),
  },
)

const EmployeeDownloads = () => {
  const supabase = createBrowserClient()

  const { data } = useQuery(getExports(supabase, 'asc'))
  const employees = data?.filter((item) => item.export_type === 'employees')

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] place-items-center justify-items-center gap-6">
      {employees?.map((exportFiles) => (
        <EmployeeDownloadsFileItem
          data={exportFiles as any}
          key={exportFiles.id}
        />
      ))}
    </div>
  )
}

export default EmployeeDownloads
