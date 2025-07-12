'use client'
import { useApprovalRequestContext } from '@/app/(dashboard)/admin/approval-request/accounts/approval-request-provider'
import OperationBadge from '@/app/(dashboard)/admin/approval-request/components/operation-badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatDate } from 'date-fns'
import ApprovalFormSME from '@/app/(dashboard)/admin/approval-request/accounts/approval-request-form-sme'
import ApprovalFormIFP from '@/app/(dashboard)/admin/approval-request/accounts/approval-request-form-ifp'

const ApprovalRequestInfo = () => {
  const { isModalOpen, setIsModalOpen, selectedData } =
    useApprovalRequestContext()
  const accountType = (selectedData as any)?.account_type ? "SME" : "IFP";
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-x-2">
            Account Approval Request
            <OperationBadge operationType={selectedData?.operation_type} />
          </DialogTitle>
          <DialogDescription>
            Created by {(selectedData?.created_by as any)?.first_name}{' '}
            {(selectedData as any)?.created_by?.last_name} on{' '}
            {selectedData?.created_at
              ? formatDate(selectedData.created_at, 'PP')
              : 'unknown date'}
          </DialogDescription>
        </DialogHeader>
        {accountType === "SME" ? (
          <ApprovalFormSME></ApprovalFormSME>
        ) : (
          <ApprovalFormIFP></ApprovalFormIFP>
        )
        }
      </DialogContent>
    </Dialog>
  )
}

export default ApprovalRequestInfo
