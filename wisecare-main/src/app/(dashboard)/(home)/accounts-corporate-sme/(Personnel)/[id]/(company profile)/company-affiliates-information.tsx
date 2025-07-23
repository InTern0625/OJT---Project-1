'use client'

import { useCompanyEditContext } from './company-edit-provider'
import AffiliatesInformationFields from './edit/affiliates-information-fields'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'
import companyEditsSchema from './company-edits-schema'
import { createBrowserClient } from '@/utils/supabase-client'
import { useEffect, useState } from 'react'

interface Props {
  id: string // parent_company_id (companyId)
}

const CompanyAffiliatesInformation = ({ id }: Props) => {
  const { editMode } = useCompanyEditContext()
  const form = useFormContext<z.infer<typeof companyEditsSchema>>()
  const supabase = createBrowserClient()

  const [affiliates, setAffiliates] = useState<any[]>([])

  useEffect(() => {
    const fetchAffiliates = async () => {
      const { data, error } = await supabase
        .from('company_affiliates')
        .select('id, affiliate_name, affiliate_address')
        .eq('parent_company_id', id)
        .eq('is_active', true)

      if (error) {
        console.error('Error fetching affiliates:', error)
      } else {
        setAffiliates(data)

        if (editMode) {
          form.setValue('affiliate_entries', data)
        }
      }
    }

    fetchAffiliates()
  }, [editMode, id, supabase])


  if (editMode) return <AffiliatesInformationFields companyId={id} />

  return (
    <div className="flex flex-col gap-4">
      {affiliates.length === 0 ? (
        <p className="text-sm text-muted-foreground">No affiliates found.</p>
      ) : (
        affiliates.map((affiliate) => (
          <div
            key={affiliate.id}
            className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white px-5 py-4 shadow-sm"
          >
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-semibold uppercase">
              {affiliate.affiliate_name?.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                {affiliate.affiliate_name}
              </span>
              <span className="text-sm text-gray-600">
                {affiliate.affiliate_address}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default CompanyAffiliatesInformation
