import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edit-provider'
import CompanyInformationItem from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-information-item'
import { formatCurrency } from '@/app/(dashboard)/(home)/accounts-ifp/columns/accounts-columns'
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
      '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/edit/hmo-information-fields'
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

  const [signedUrls, setSignedUrls] = useState<string[]>([])
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

    const specialBenefitsFiles = account?.special_benefits_files || []

    if (specialBenefitsFiles.length > 0) {
      getSignedUrls(specialBenefitsFiles).then(setSignedUrls)
    }
  }, [
    account?.special_benefits_files,
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
          <CompanyInformationItem
            label={'Additional Benefits'}
            value={account?.additional_benefits?.toString()}
          />
          {isSpecialBenefitsFilesEnabled && (
            <CompanyInformationItem
              label={'Special Benefitsss'}
              value={
                signedUrls.length > 0
                  ? signedUrls.map((url, index) => (
                      <div key={url}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          Document {index + 1}
                        </a>
                        <br />
                      </div>
                    ))
                  : 'No special benefits documents available'
              }
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
        </div>
      )}
    </>
  )
}

export default CompanyHmoInformation
