import React from 'react'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import getPendingAccountExports from '@/queries/get-pending-account-exports'
import ExportAccountRequestListItem from '@/app/(dashboard)/(home)/accounts/export-requests/export-account-request-list-item'
import { createBrowserClient } from '@/utils/supabase-client'

const ExportAccountRequestList = () => {
  const supabase = createBrowserClient()

  const { data: pendingAccountExports } = useQuery(
    getPendingAccountExports(supabase, 'accounts'),
  )
  return (
    <div>
      <div className="grid grid-cols-1 divide-y">
        {pendingAccountExports?.map((pendingExports) => (
          <ExportAccountRequestListItem
            key={pendingExports.id}
            data={pendingExports as any}
          />
        ))}
      </div>
    </div>
  )
}

export default ExportAccountRequestList
