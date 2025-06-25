'use client'

import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edit-provider'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-provider'
import EditPendingRequest from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/edit-pending-request'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'
import { FC, useState, useCallback, useMemo } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface Props {
  role: string | null
  accountId: string
}

const CompanyEditButton: FC<Props> = ({ role, accountId }) => {
  const { editMode, setEditMode } = useCompanyEditContext()
  const [isEditPendingRequestOpen, setIsEditPendingRequestOpen] =
    useState(false)
  const [pendingRequestId, setPendingRequestId] = useState('')

  const allowedRole = useMemo(
    () => ['admin', 'marketing', 'finance', 'under-writing', 'after-sales'],
    [],
  )

  const supabase = createBrowserClient()

  const handleClick = useCallback(async () => {
    // check if there is already a pending request
    const { data } = await supabase
      .from('pending_accounts')
      .select('id')
      .eq('account_id', accountId)
      .eq('is_active', true)
      .eq('is_approved', false)
      .limit(1)
      .maybeSingle()

    // if there is already a pending request, open the edit pending request modal
    if (data) {
      setIsEditPendingRequestOpen(true)
      setPendingRequestId(data.id)
    } else {
      setEditMode(true)
    }
  }, [accountId, setEditMode, supabase])

  if (!role || !allowedRole.includes(role)) {
    return null
  }

  return (
    <>
      {!editMode && (
        <Button className="w-full gap-2 md:max-w-xs" onClick={handleClick}>
          <Pencil /> <span> Edit Company Details </span>
        </Button>
      )}
      <EditPendingRequest
        isOpen={isEditPendingRequestOpen}
        onClose={() => setIsEditPendingRequestOpen(false)}
        pendingRequestId={pendingRequestId}
      />
    </>
  )
}

export default CompanyEditButton
