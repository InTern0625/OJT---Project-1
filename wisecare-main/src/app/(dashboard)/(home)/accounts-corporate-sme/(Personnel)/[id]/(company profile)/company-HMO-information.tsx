import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-edit-provider'
import CompanyInformationItem from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-information-item'
import { formatCurrency } from '@/app/(dashboard)/(home)/accounts-corporate-sme/columns/accounts-columns'
import FileInformation from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-file-information'
import { useFeatureFlag } from '@/providers/FeatureFlagProvider'
import getAccountById from '@/queries/get-account-by-id'
import { createBrowserClient } from '@/utils/supabase-client'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FC, Suspense, useEffect, useState } from 'react'

const HmoInformationFields = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/edit/hmo-information-fields'
    ),
  { ssr: false },
)

interface CompanyHmoInformationProps {
  id: string
}

const CompanyHmoInformation: FC<CompanyHmoInformationProps> = ({ id }) => {
  const { editMode } = useCompanyEditContext()
  const supabase = createBrowserClient()
  const { data: account } = useQuery(getAccountById(supabase, id))

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
            label={'HMO Provider'}
            value={
              account?.hmo_provider ? (account.hmo_provider as any).name : ''
            }
          />
          <CompanyInformationItem
            label={'Previous HMO Provider'}
            value={
              account?.previous_hmo_provider
                ? (account.previous_hmo_provider as any).name
                : ''
            }
          />
          <CompanyInformationItem
            label={'Old HMO Provider'}
            value={
              account?.old_hmo_provider
                ? (account.old_hmo_provider as any).name
                : ''
            }
          />
          <CompanyInformationItem
            label={'Principal Plan Type'}
            value={
              account?.principal_plan_type
                ? (account.principal_plan_type as any).name
                : ''
            }
          />
          <CompanyInformationItem
            label={'Dependent Plan Type'}
            value={
              account?.dependent_plan_type
                ? (account.dependent_plan_type as any).name
                : ''
            }
          />
          <CompanyInformationItem
            label={'Total Utilization'}
            value={account?.total_utilization?.toString()}
          />
          <CompanyInformationItem
            label={'Total Premium Paid'}
            value={formatCurrency(account?.total_premium_paid)}
          />
          <span></span>
          {isSpecialBenefitsFilesEnabled && (
            <FileInformation
              label={'Special Benefits'}
              urls={signedSpecialBenefitsUrls}
            />
          )}
          {!isSpecialBenefitsFilesEnabled && (
            <CompanyInformationItem
              label={'Special Benefits'}
              value={
                account?.special_benefits
                  ? account.special_benefits.toString()
                  : 'Special benefits feature is not enabled.'
              }
            />
          )}
          {isSpecialBenefitsFilesEnabled && (
            <FileInformation
              label={'Additional Benefits'}
              urls={signedAdditionalBenefitsUrls}
            />
          )}
          {!isSpecialBenefitsFilesEnabled && (
            <CompanyInformationItem
              label={'Additional Benefits'}
              value={
                account?.special_benefits
                  ? account.special_benefits.toString()
                  : 'Additional benefits feature is not enabled.'
              }
            />
          )}
          {isSpecialBenefitsFilesEnabled && (
            <FileInformation
              label={'Contract and Proposal'}
              urls={signedContractProposalUrls}
            />
          )}
          {!isSpecialBenefitsFilesEnabled && (
            <CompanyInformationItem
              label={'Special Benefits'}
              value={
                account?.special_benefits
                  ? account.special_benefits.toString()
                  : 'Contract and Proposal feature is not enabled.'
              }
            />
          )}
          <CompanyInformationItem
            label={'Remarks'}
            value={account?.remarks ?? '-'}
          />
        </div>
      )}
    </>
  )
}

export default CompanyHmoInformation
