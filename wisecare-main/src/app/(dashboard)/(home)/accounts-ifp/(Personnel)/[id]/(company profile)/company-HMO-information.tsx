import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edit-provider'
import CompanyInformationItem from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-information-item'
import FileInformation from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-file-information'
import { formatCurrency } from '@/app/(dashboard)/(home)/accounts-ifp/columns/accounts-columns'
import { useFeatureFlag } from '@/providers/FeatureFlagProvider'
import getAccountById from '@/queries/get-account-by-id'
import { createBrowserClient } from '@/utils/supabase-client'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { format } from 'date-fns'
import getTypes from '@/queries/get-types'
import { FC, Suspense, useEffect, useState } from 'react'

const HmoInformationFields = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/edit/hmo-information-fields'
    ),
  { ssr: false },
)

interface CompanyHmoInformationProps {
  id: string
  account: any
  refetchAccount: () => void
}

  const CompanyHmoInformation: FC<CompanyHmoInformationProps> = ({ id, account, refetchAccount }) => {
  const { editMode } = useCompanyEditContext()
  const supabase = createBrowserClient()
  const { data: roomPlans } = useQuery(getTypes(supabase, 'room_plans'))

  const [signedContractProposalUrls, setSignedContractProposalUrls] = useState<string[]>([])
  const [signedSpecialBenefitsUrls, setSignedSpecialBenefitsUrls] = useState<string[]>([])
  const [signedAdditionalBenefitsUrls, setSignedAdditionalBenefitsUrls] = useState<string[]>([])
  const [errorOccurred, setErrorOccurred] = useState(false)

  const isSpecialBenefitsFilesEnabled = useFeatureFlag('account-benefit-upload')

  useEffect(() => {
    if (errorOccurred || !isSpecialBenefitsFilesEnabled) return

    const getSignedUrls = async (files: string[]) => {
      const signedUrls = await Promise.all(
        files.map(async (file) => {
          const { data, error } = await supabase.storage
            .from('accounts')
            .createSignedUrl(file.trim(), 3600)
          if (error) {
            console.error('Error creating signed URL:', error)
            setErrorOccurred(true)
            return null
          }
          return data?.signedUrl
        }),
      )
      return signedUrls.filter((url) => url !== null) as string[]
    }
    const contractProposalFiles = account?.contract_proposal_files || []
    const specialBenefitsFiles = account?.special_benefits_files || []
    const additionalBenefitsFiles = account?.additional_benefits_files || []
    if (contractProposalFiles.length > 0) {
      getSignedUrls(contractProposalFiles).then(setSignedContractProposalUrls)
    }
    if (specialBenefitsFiles.length > 0) {
      getSignedUrls(specialBenefitsFiles).then(setSignedSpecialBenefitsUrls)
    }
    if (additionalBenefitsFiles.length > 0) {
      getSignedUrls(additionalBenefitsFiles).then(setSignedAdditionalBenefitsUrls)
    }

  }, [
    account?.contract_proposal_files,
    account?.special_benefits_files,
    account?.additional_benefits_files,
    supabase.storage,
    errorOccurred,
    isSpecialBenefitsFilesEnabled,
  ])
  return (
    <>
      {editMode ? (
        <Suspense fallback={<div>Loading...</div>}>
          <HmoInformationFields id={id}/>
        </Suspense>
      ) : (

        <div className="flex flex-col gap-2 pt-4 md:grid md:grid-cols-2">
          <CompanyInformationItem
            label="Card Number"
            value={account?.card_number || '-'}
        />
        <CompanyInformationItem
            label="Mode of Payment"
            value={account?.mode_of_payment?.name || '-'}
        />
        <CompanyInformationItem
            label="Effective Date"
            value={
              account?.effective_date
                ? format(new Date(account.effective_date), 'PPP')
                : '-'
            }
          />
        <CompanyInformationItem
          label={'Expiration Date'}
          value={
            account?.expiration_date
              ? format(new Date(account.expiration_date), 'PPP')
              : '-'
          }
        />
          <CompanyInformationItem
            label={'HMO Provider'}
            value={
              account?.hmo_provider ? (account.hmo_provider as any).name : '-'
            }
          />
          <CompanyInformationItem
            label="Room Plan"
            value={
              account?.room_plan ? (account.room_plan as any).name : '-'
            }
          />
          <CompanyInformationItem
              label={'MBL'}
              value={formatCurrency(account?.mbl)} 
            />
          <CompanyInformationItem
            label={'Premium'}
            value={formatCurrency(account?.premium)} 
          />
          {isSpecialBenefitsFilesEnabled && (
            <FileInformation
              label={'Contract and Proposal'}
              urls={signedContractProposalUrls}
            />
          )}
          {!isSpecialBenefitsFilesEnabled && (
            <CompanyInformationItem
              label={'Contract and Proposal'}
              value={
                account?.special_benefits
                  ? account.special_benefits.toString()
                  : 'Contract and Proposal feature is not enabled.'
              }
            />
          )}
        </div>
      )}
    </>
  )
}

export default CompanyHmoInformation
