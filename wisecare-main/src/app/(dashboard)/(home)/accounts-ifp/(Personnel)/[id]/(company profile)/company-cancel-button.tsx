'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edit-provider'
import { createBrowserClient } from '@/utils/supabase-client'
import { useUserServer } from '@/providers/UserProvider'

type Props = {
  companyID?: string
}

const CompanyCancelButton = ({ companyID }: Props) => {
  const { setEditMode } = useCompanyEditContext()
  const supabase = createBrowserClient()
  const { user } = useUserServer()
  const handleClick = async () => {
    setEditMode(false)
    if (companyID) {
        const {data} = await supabase
        .from('accounts')
        .update({
          is_editing: false, 
          editing_user: null,
          editing_timestampz: null
        })
        .eq('id', companyID)
      }
  }
  return (
    <Button
      variant="outline"
      className="w-full lg:w-auto"
      type="button"
      onClick={handleClick}
    >
      Cancel
    </Button>
  )
}

export default CompanyCancelButton
