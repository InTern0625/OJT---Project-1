'use client'
import { useCompanyContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-provider'
import {useImportFields} from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/import/fields'
import parseDate from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/import/parseDate'
import parseRow from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/import/parseRow'
import themeOverrides from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/import/themeOverrides'
import { useToast } from '@/components/ui/use-toast'
import { useInsertMutation } from '@supabase-cache-helpers/postgrest-react-query'
import { ReactSpreadsheetImport } from 'react-spreadsheet-import'
import { Result } from 'react-spreadsheet-import/types/types'
import { createBrowserClient } from '@/utils/supabase-client'

interface ImportAffiliatesProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const ImportAffiliates = ({ isOpen, setIsOpen }: ImportAffiliatesProps) => {
  const supabase = createBrowserClient()
  const { toast } = useToast()
  const { accountId } = useCompanyContext()
  const importFields = useImportFields()

  const { mutateAsync } = useInsertMutation(
    // @ts-ignore
    supabase.from('company_affiliates'),
    ['id'],
    null,
    {
      onSuccess: () => {
        toast({
          title: 'Affiliates imported successfully',
          description: 'Affiliates are imported successfully',
        })
      },
      onError: () => {
        toast({
          title: 'Error importing affiliate',
          description: 'Please try again',
        })
      },
    },
  )

  const handleSubmit = async (data: Result<any>) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error('User not found')
    const affiliates = await Promise.all(
      data.validData.map(async (affiliates) => {
        return {
          parent_company_id: accountId,
          affiliate_name: affiliates.affiliate_name,
          affiliate_address: affiliates.affiliate_address,
        }
      })
    )


    await mutateAsync(affiliates)
  }
  return (
    <ReactSpreadsheetImport
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSubmit={handleSubmit}
      fields={importFields}
      rowHook={parseRow}
      uploadStepHook={parseDate}
      customTheme={themeOverrides}
    />
  )
}

export default ImportAffiliates
