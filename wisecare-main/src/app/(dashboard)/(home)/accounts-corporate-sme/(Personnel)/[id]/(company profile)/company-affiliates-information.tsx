'use client'

import { useCompanyEditContext } from './company-edit-provider'
import AffiliatesInformationFields from './edit/affiliates-information-fields' // 👈 import this
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import companyEditsSchema from './company-edits-schema'

const CompanyAffiliatesInformation = () => {
  const { editMode } = useCompanyEditContext()
  const form = useFormContext<z.infer<typeof companyEditsSchema>>()

  const name = form.watch('affiliate_name')
  const address = form.watch('affiliate_address')

  return editMode ? (
    <AffiliatesInformationFields /> // 👈 connected here!
  ) : (
    <div className="flex items-center justify-between rounded-md bg-gray-50 px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold uppercase">
          {name?.charAt(0)}
        </div>
        <div>
          <div className="font-semibold text-sm">{name}</div>
          <div className="text-sm text-gray-600">{address}</div>
        </div>
      </div>
    </div>
  )
}

export default CompanyAffiliatesInformation
