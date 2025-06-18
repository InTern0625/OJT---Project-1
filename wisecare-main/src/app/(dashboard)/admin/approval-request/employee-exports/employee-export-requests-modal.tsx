'use client'
import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useEmployeeExportRequestsContext } from '@/app/(dashboard)/admin/approval-request/employee-exports/employee-export-requests-provider'
import { formatDate } from 'date-fns'
import ExportRequestsApprovalButton from '@/app/(dashboard)/admin/approval-request/components/export-requests-approval-button'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

const EmployeeExportRequestsModal = () => {
  const { isModalOpen, setIsModalOpen, selectedData, isLoading } =
    useEmployeeExportRequestsContext()

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Please choose whether to approve or reject this export request.
          </DialogDescription>
        </DialogHeader>
        <div className="text-base">
          Would you like to approve this export request created by
          <span className="font-bold">
            {' '}
            {(selectedData?.created_by as any)?.first_name}{' '}
            {(selectedData?.created_by as any)?.last_name}{' '}
          </span>{' '}
          on
          <span className="font-bold">
            {' '}
            {selectedData?.created_at
              ? formatDate(selectedData.created_at, 'PP')
              : '-'}{' '}
          </span>
          ?
        </div>
        <div className="flex justify-end gap-x-2">
          <ExportRequestsApprovalButton
            action="reject"
            exportId={selectedData?.id as any}
          >
            <Button variant={'destructive'} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Reject'}
            </Button>
          </ExportRequestsApprovalButton>
          <ExportRequestsApprovalButton
            action="approve"
            exportId={selectedData?.id as any}
          >
            <Button variant={'default'} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Approve'}
            </Button>
          </ExportRequestsApprovalButton>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EmployeeExportRequestsModal
