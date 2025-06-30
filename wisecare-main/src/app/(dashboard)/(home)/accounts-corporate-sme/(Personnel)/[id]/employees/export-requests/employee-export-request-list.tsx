import React from 'react'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-provider'
import getPendingEmployeeExports from '@/queries/get-pending-employee-exports'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import EmployeeExportRequestsListItem from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/employees/export-requests/employee-export-requests-list-item'
import { createBrowserClient } from '@/utils/supabase-client'

const EmployeeExportRequestList = () => {
  const { accountId } = useCompanyContext()
  const supabase = createBrowserClient()

  const { data: pendingEmployeeExports } = useQuery(
    getPendingEmployeeExports(supabase, accountId, 'employees'),
  )

  return (
    <div className="grid grid-cols-1 divide-y">
      {pendingEmployeeExports?.map((pendingExports) => (
        <EmployeeExportRequestsListItem
          key={pendingExports.id}
          data={pendingExports as any}
        />
      ))}
    </div>
  )
}

export default EmployeeExportRequestList
