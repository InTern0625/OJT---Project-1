import React from 'react'
import { FC, ReactNode } from 'react'
import { useUpdateMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { toast } from '@/components/ui/use-toast'
import { useAccountExportRequestsContext } from '@/app/(dashboard)/admin/approval-request/account-exports/account-export-requests-provider'
import { useEmployeeExportRequestsContext } from '@/app/(dashboard)/admin/approval-request/employee-exports/employee-export-requests-provider'
import { createBrowserClient } from '@/utils/supabase-client'

interface AccountExportRequestsApprovalButtonProps {
  children: ReactNode
  action: 'approve' | 'reject'
  exportId: string
}

const ExportRequestsApprovalButton: FC<
  AccountExportRequestsApprovalButtonProps
> = ({ children, action, exportId }) => {
  const supabase = createBrowserClient()
  const { setIsModalOpen: setAccountModalOpen } =
    useAccountExportRequestsContext()
  const { setIsModalOpen: setEmployeeModalOpen } =
    useEmployeeExportRequestsContext()

  const { mutateAsync } = useUpdateMutation(
    supabase.from('pending_export_requests'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          title: `Request ${action === 'approve' ? 'approved' : 'rejected'}`,
          description: `The request has been ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        })
        setAccountModalOpen(false)
        setEmployeeModalOpen(false)
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'An error occurred while approving the request',
        })
      },
    },
  )

  const handleApproval = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (action === 'approve') {
      await mutateAsync({
        id: exportId,
        is_approved: true,
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
    } else {
      await mutateAsync({ id: exportId, is_approved: false, is_active: false })
    }
  }

  return <div onClick={handleApproval}> {children} </div>
}

export default ExportRequestsApprovalButton
