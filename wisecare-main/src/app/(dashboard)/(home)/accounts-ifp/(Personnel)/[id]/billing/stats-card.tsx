'use client'

import { formatCurrency } from '@/app/(dashboard)/(home)/accounts-ifp/columns/accounts-columns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import getBillingStatementByCompanyId from '@/queries/get-billing-statement-by-company-id'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { useMemo } from 'react'
import { createBrowserClient } from '@/utils/supabase-client'

const StatsCard = ({ companyId }: { companyId: string }) => {
  const supabase = createBrowserClient()
  const { data } = useQuery(getBillingStatementByCompanyId(supabase, companyId))

  const totalAmountBilled = useMemo(
    () => data?.reduce((acc, curr) => acc + (curr.amount_billed || 0), 0),
    [data],
  )
  const totalCommission = useMemo(
    () => data?.reduce((acc, curr) => acc + (curr.commission_earned || 0), 0),
    [data],
  )

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Total Amount Billed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-bold">
            {formatCurrency(totalAmountBilled)}
          </h3>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Total Commission Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="text-2xl font-bold">
            {formatCurrency(totalCommission)}
          </h3>
        </CardContent>
      </Card>
    </div>
  )
}

export default StatsCard
