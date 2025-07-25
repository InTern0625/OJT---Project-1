import CompanyInformationItem from '@/app/(dashboard)/(home)/accounts-corporate-sme/(Personnel)/[id]/(company profile)/company-information-item'
import getAffiliatesByCompanyId from '@/queries/get-affiliates-by-company-id'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { FC } from 'react'
import Link from 'next/link'
import { createBrowserClient } from '@/utils/supabase-client'

interface CompanyAffiliationInformationProps {
  id: string
}

const CompanyAffiliationInformation: FC<CompanyAffiliationInformationProps> = ({
  id,
}) => {
    const supabase = createBrowserClient()
    const { data: affiliates } = useQuery(getAffiliatesByCompanyId(supabase, id))

    return (
        <div className="flex flex-col gap-4 pt-4">
        {affiliates && affiliates.length > 0 ? (
            affiliates.map((affiliate: any, index: number) => (
            <div
                key={affiliate.id || index}
                className="grid grid-cols-[auto_1fr_1fr] items-start gap-4 border p-4 rounded-lg"
            >
                {/* Index */}
                <div className="font-semibold text-lg text-gray-600">{index + 1}.</div>

                {/* Affiliate Name */}
                <CompanyInformationItem
                label="Affiliate Name"
                value={affiliate.affiliate_name || 'Unnamed Affiliate'}
                />

                {/* Affiliate Address */}
                <CompanyInformationItem
                label="Affiliate Address"
                value={affiliate.affiliate_address || 'N/A'}
                />
            </div>
            ))
        ) : (
            <div className="text-sm text-muted-foreground">
            No affiliates found.{' '}
            <Link href={`/accounts-corporate-sme/${id}/affiliates`} className="text-primary hover:underline">
                Add an affiliate
            </Link>
            </div>
        )}
        </div>
  )
}

export default CompanyAffiliationInformation
