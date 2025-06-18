import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/(company profile)/company-provider'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import getPendingEmployeeExports from '@/queries/get-pending-employee-exports'
import EmployeeExportRequestList from '@/app/(dashboard)/(home)/accounts/(Personnel)/[id]/employees/export-requests/employee-export-request-list'
import { createBrowserClient } from '@/utils/supabase-client'

const EmployeeExportRequests = () => {
  const { accountId } = useCompanyContext()
  const supabase = createBrowserClient()
  const { count } = useQuery(
    getPendingEmployeeExports(supabase, accountId, 'employees'),
  )

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button
          variant={'outline'}
          size={'sm'}
          className="flex h-8 w-fit rounded-none"
        >
          {count} Export Requests
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submission Requests</DialogTitle>
          <DialogDescription>
            View and manage export requests and submissions
          </DialogDescription>
        </DialogHeader>
        <EmployeeExportRequestList />
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeExportRequests
