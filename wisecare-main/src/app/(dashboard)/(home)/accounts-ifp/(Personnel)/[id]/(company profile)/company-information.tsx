import { useCompanyEditContext } from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-edit-provider'
import CompanyInformationItem from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/company-information-item'
import getAccountById from '@/queries/get-account-by-id'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import dynamic from 'next/dynamic'
import { FC, Suspense } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'
import { format } from 'date-fns'

const CompanyInformationFields = dynamic(
  () =>
    import(
      '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/(company profile)/edit/company-information-fields'
    ),
  { ssr: false },
)

interface CompanyInformationProps {
  id: string
}

const CompanyInformation: FC<CompanyInformationProps> = ({ id }) => {
  const { editMode } = useCompanyEditContext()
  const supabase = createBrowserClient()
  const { data: account } = useQuery(getAccountById(supabase, id))
  const age: number | '' = (() => {
    const birthdate = account?.birthdate
    if (!birthdate) return ''
    const birth = new Date(birthdate)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age >= 0 ? age : ''
  })()
  return (
    <>
      {editMode ? (
        <Suspense fallback={<div>Loading...</div>}>
          <CompanyInformationFields />
        </Suspense>
      ) : (
        <div className="flex flex-col gap-2 pt-4 md:grid md:grid-flow-col md:grid-rows-4">
          {/* group 1 */}
          <CompanyInformationItem
            key="complete-name"
            label="Complete Name"
            value={account?.company_name || '-'}
          />
          <CompanyInformationItem
            key="birthdate"
            label="Birthdate"
            value={
               account?.birthdate
                 ? format(new Date(account.birthdate), 'PPP')
                 : '-'
             }
          />
          <CompanyInformationItem
            key="gender"
            label="Gender"
            value={(account as any)?.gender_type?.name || '-'}
          />
          <CompanyInformationItem
            key="contact-number"
            label="Contact Number"
            value={account?.contact_number || '-'}
          />

          {/* group 2 */}
          <CompanyInformationItem
            key="Complete Address"
            label="Complete Address"
            value={account?.company_address || '-'}
          />
          <CompanyInformationItem
            key="Age"
            label="Age"
            value={age || '-'}
          />
          {/* group 3 */}
          <CompanyInformationItem
            key="civil-status"
            label="Civil Status"
            value={(account as any)?.civil_status_type?.name || '-'}
          />
          <CompanyInformationItem
            key="email-address"
            label="Email Address"
            value={account?.email_address_of_contact_person || '-'}
          />
        </div>
      )}
    </>
  )
}

export default CompanyInformation
