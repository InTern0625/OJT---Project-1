'use client'
import affiliateColumns from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-columns'
import AffiliatesDataTable from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/affiliates/affiliate-data-table'
import getAffiliatesByCompanyId from '@/queries/get-affiliates-by-company-id'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { FC } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

interface AffiliatesTabProps {
  companyId: string
}

const AffiliatesTab: FC<AffiliatesTabProps> = ({ companyId }) => {
  const supabase = createBrowserClient()
  const { data: employees } = useQuery(
    getAffiliatesByCompanyId(supabase, companyId),
  )

  return (
    // @ts-expect-error
    <AffiliatesDataTable columns={affiliateColumns} data={employees || []} />
  )
}

export default AffiliatesTab
