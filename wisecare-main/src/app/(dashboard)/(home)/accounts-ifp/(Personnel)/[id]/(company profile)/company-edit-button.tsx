'use client'

import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edit-provider'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-provider'
import EditPendingRequest from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/edit-pending-request'
import { Button } from '@/components/ui/button'
import { Pencil, UserRoundPen } from 'lucide-react'
import { FC, useState, useCallback, useMemo, useEffect } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'
import { useUserServer } from '@/providers/UserProvider'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
  const { user } = useUserServer()
  const [isBeingEdited, setIsBeingEdited] = useState(false)
  const [editingUserName, setEditingUserName] = useState<string | null>(null)

  const supabase = createBrowserClient()
  type EditingUser = {
    first_name: string
    last_name: string
  }

  type AccountRow = {
    is_editing: boolean
    editing: EditingUser | null
  }
  //Get editing user name
  useEffect(() => {
    const fetchEditingStatus = async () => {
      const { data: account } = await supabase
        .from('accounts')
        .select(
          `
          is_editing,
          editing:editing_user(first_name, last_name)
        `
        )
        .eq('id', accountId)
        .maybeSingle()
      const accountName = account as AccountRow | null
      if (account?.is_editing) {
        setIsBeingEdited(true)
        setEditingUserName(`${accountName?.editing?.first_name} ${accountName?.editing?.last_name}`)
      }else{
        setIsBeingEdited(false)
        setEditingUserName(null)
      }
    }

    fetchEditingStatus()
  }, [accountId, supabase, user?.id])

  const handleClick = useCallback(async () => {

    // check if there is already a pending request
    const { data } = await supabase
      .from('pending_accounts')
      .select('id')
      .eq('account_id', accountId)
      .eq('is_approved', false)
      .limit(1)
      .maybeSingle()
      
    // if there is already a pending request, open the edit pending request modal
    if (data) {
      setIsEditPendingRequestOpen(true)
      setPendingRequestId(data.id)
    } else {
      setEditMode(true)
      const {data} = await supabase
      .from('accounts')
      .update({
        is_editing: true, 
        editing_user: user?.id,
        editing_timestampz: new Date().toISOString()
      })
      .eq('id', accountId)
    }
  }, [accountId, setEditMode, supabase, user])

  if (!role || !allowedRole.includes(role)) {
    return null
  }
  return (
    <>
      {!editMode && (
        <Tooltip>
          <TooltipTrigger asChild={true}>
            <div>
              <Button className="w-full gap-2 md:max-w-xs" onClick={handleClick}>
                {isBeingEdited ? <UserRoundPen/> : <Pencil/>}<span> Edit Account Details</span>
              </Button>
            </div>
          </TooltipTrigger>
          {isBeingEdited && (
            <TooltipContent>Currently being edited by {editingUserName}</TooltipContent>
          )}
        </Tooltip>
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
