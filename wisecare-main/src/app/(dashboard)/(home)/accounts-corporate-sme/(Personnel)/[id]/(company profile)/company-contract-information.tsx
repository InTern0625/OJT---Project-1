import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-edit-provider'
import CompanyInformationItem from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-information-item'
import { formatCurrency } from '@/app/(dashboard)/(home)/accounts-corporate-sme/columns/accounts-columns'
import getAccountById from '@/queries/get-account-by-id'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { format } from 'date-fns'
import dynamic from 'next/dynamic'
import { FC, Suspense } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

const ContractInformationFields = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/edit/contract-information-fields'
    ),
  { ssr: false },
)

interface CompanyContractInformationProps {
  id: string
}

const CompanyContractInformation: FC<CompanyContractInformationProps> = ({
  id,
}) => {
  const { editMode } = useCompanyEditContext()
  const supabase = createBrowserClient()
  const { data: account } = useQuery(getAccountById(supabase, id))

  return (
    <>
      {editMode ? (
        <Suspense fallback={<div>Loading...</div>}>
          <ContractInformationFields />
        </Suspense>
      ) : (
        <div className="flex flex-col gap-2 pt-4 md:grid md:grid-cols-2 lg:grid-cols-1">
          <CompanyInformationItem
            label="Initial Contract Value"
            value={formatCurrency(account?.initial_contract_value)}
          />
          <CompanyInformationItem
            label={'Initial Head Count'}
            value={account?.initial_head_count?.toString()}
          />
          <CompanyInformationItem
            label={'Mode of Payment'}
            value={
              account?.mode_of_payment
                ? (account.mode_of_payment as any).name
                : ''
            }
          />
          <CompanyInformationItem
            label={'Expiration Date'}
            value={
              account?.expiration_date
                ? format(new Date(account.expiration_date), 'PPP')
                : undefined
            }
          />
          <CompanyInformationItem
            label={'Effective Date'}
            value={
              account?.effective_date
                ? format(new Date(account.effective_date), 'PPP')
                : undefined
            }
          />
          <CompanyInformationItem
            label={'Original Effective Date'}
            value={
              account?.original_effective_date
                ? format(new Date(account.original_effective_date), 'PPP')
                : undefined
            }
          />
          <CompanyInformationItem
            label={'COC Issue Date'}
            // value={account?.coc_issue_date?.toString()}
            value={
              account?.coc_issue_date
                ? format(new Date(account.coc_issue_date), 'PPP')
                : undefined
            }
          />
          <CompanyInformationItem
            label={'Delivery Date of Membership IDs'}
            value={
              account?.delivery_date_of_membership_ids
                ? format(
                    new Date(account.delivery_date_of_membership_ids),
                    'PPP',
                  )
                : undefined
            }
          />
          <CompanyInformationItem
            label={'Orientation Date'}
            // value={account?.orientation_date?.toString()}
            value={
              account?.orientation_date
                ? format(new Date(account.orientation_date), 'PPP')
                : undefined
            }
          />
          <CompanyInformationItem
            label={'Wellness Lecture Date'}
            value={
              account?.wellness_lecture_date
                ? format(new Date(account.wellness_lecture_date), 'PPP')
                : undefined
            }
          />
          <CompanyInformationItem
            label={'Annual Physical Examination Date'}
            value={
              account?.annual_physical_examination_date
                ? format(
                    new Date(account.annual_physical_examination_date),
                    'PPP',
                  )
                : undefined
            }
          />
        </div>
      )}
    </>
  )
}

export default CompanyContractInformation
