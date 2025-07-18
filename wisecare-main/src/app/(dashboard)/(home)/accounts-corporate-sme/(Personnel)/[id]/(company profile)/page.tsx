'use server'
import CompanyAbout from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-about'
import CompanyEditButton from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-edit-button'
import CompanyEditProvider from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-edit-provider'
import CompanyDeleteButton from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/delete/company-delete-button'
import SelectCompanyActive from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/select-company-active'
import { FeatureFlagProvider } from '@/providers/FeatureFlagProvider'
import { accountBenefitUpload } from '@/utils/flags'
import getRole from '@/utils/get-role'
import { ButtonBack } from '@/components/layout/navigation/navigation-back'

const CompanyAboutPage = async (props: { params: Promise<{ id: string }> }) => {
  const params = await props.params
  const role = await getRole()

  // account id
  const accountId = params.id

  // feature flag
  const isAccountBenefitUploadEnabled = await accountBenefitUpload()

  return (
    <CompanyEditProvider>
      <FeatureFlagProvider
        flags={{ 'account-benefit-upload': isAccountBenefitUploadEnabled }}
      >
        <div className="flex w-full flex-row items-center pb-4 sm:justify-between">
          <div>
            <ButtonBack />
          </div>
          <div className="flex flex-row gap-2 items-center">
          <SelectCompanyActive accountId={accountId} role={role} />
          <CompanyEditButton role={role} accountId={accountId} />
          </div>
        </div>
        <CompanyAbout companyId={accountId} />
        <div className="flex w-full justify-end md:justify-start">
          <CompanyDeleteButton accountId={accountId} userRole={role} />
        </div>
      </FeatureFlagProvider>
    </CompanyEditProvider>
  )
}

export default CompanyAboutPage
