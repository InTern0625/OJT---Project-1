'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-edit-provider'

const CompanyCancelButton = () => {
  const { setEditMode } = useCompanyEditContext()
  return (
    <Button
      variant="outline"
      className="w-full lg:w-auto"
      type="button"
      onClick={() => setEditMode(false)}
    >
      Cancel
    </Button>
  )
}

export default CompanyCancelButton
