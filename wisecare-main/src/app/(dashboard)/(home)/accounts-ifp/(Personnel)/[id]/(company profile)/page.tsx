'use server'
import CompanyAbout from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-about'
import CompanyEditButton from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edit-button'
import CompanyEditProvider from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edit-provider'
import CompanyDeleteButton from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/delete/company-delete-button'
import ToggleCompanyActive from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/toggle-company-active'
import { FeatureFlagProvider } from '@/providers/FeatureFlagProvider'
import { accountBenefitUpload } from '@/utils/flags'
import getRole from '@/utils/get-role'

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
        <div className="flex w-full flex-row items-center gap-2 pb-4 sm:justify-end">
          {role === 'admin' && <ToggleCompanyActive accountId={accountId} />}
          <CompanyEditButton role={role} accountId={accountId} />
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
