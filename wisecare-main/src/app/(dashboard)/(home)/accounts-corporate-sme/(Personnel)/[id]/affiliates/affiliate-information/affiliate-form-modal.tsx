'use client'

import AffiliateForm from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-information/affiliate-form'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-provider'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tables } from '@/types/database.types'
import { FC, ReactNode, useState } from 'react'

interface AddAffiliateModalProps {
  oldAffiliateData?: Tables<'company_affiliates'>
  button: ReactNode
}

const AffiliatesFormModal: FC<AddAffiliateModalProps> = ({
  oldAffiliateData,
  button,
}) => {
  const { userRole } = useCompanyContext()
  const [isOpen, setIsOpen] = useState(false)

  if (
    !userRole ||
    !['marketing', 'finance', 'under-writing', 'after-sales', 'admin'].includes(
      userRole,
    )
  ) {
    return null
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild={true}>{button}</DialogTrigger>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>
            {oldAffiliateData ? 'Edit Affiliates' : 'Add Affiliates'}
          </DialogTitle>
          <DialogDescription>
            {oldAffiliateData
              ? 'Edit the affiliate details'
              : 'Add a new affiliate to the company'}
          </DialogDescription>
        </DialogHeader>

        {/* Affiliate Form */}
        <AffiliateForm setIsOpen={setIsOpen} oldAffiliateData={oldAffiliateData} />
        {/* End of Affiliate Form */}
      </DialogContent>
    </Dialog>
  )
}

export default AffiliatesFormModal
