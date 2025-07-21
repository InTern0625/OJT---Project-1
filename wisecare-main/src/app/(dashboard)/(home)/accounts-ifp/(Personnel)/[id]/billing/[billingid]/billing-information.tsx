'use client'

import {
  formatCurrency,
  formatPercentage,
} from '@/app/(dashboard)/(home)/accounts-ifp/columns/accounts-columns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import getBillingStatementById from '@/queries/get-billing-statement-by-id'
import { useQuery } from '@supabase-cache-helpers/postgrest-react-query'
import { createBrowserClient } from '@/utils/supabase-client'

const BillingInformation = ({ billingId }: { billingId: string }) => {
  const supabase = createBrowserClient()

  const { data } = useQuery(getBillingStatementById(supabase, billingId))
  if (!data) return null

  return (
    <Card className="mx-auto w-full max-w-2xl shadow-lg">
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
          OR: {data.or_number}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Mode of Payment</p>
            <p className="font-medium">{data.mode_of_payments?.name}</p>
          </div>
          <div>
            <p className="text-gray-600">Billing Date</p>
            <p className="font-medium">{data.billing_date}</p>
          </div>
          <div>
            <p className="text-gray-600">SA Number</p>
            <p className="font-medium">{data.sa_number}</p>
          </div>
          <div>
            <p className="text-gray-600">Billing Period</p>
            <p className="font-medium">{data.billing_period}</p>
          </div>
          <div>
            <p className="text-gray-600">Due Date</p>
            <p className="font-medium">{data.due_date}</p>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Amount Billed</p>
            <p className="font-medium">{formatCurrency(data.amount_billed)}</p>
          </div>
          <div>
            <p className="text-gray-600">Amount Paid</p>
            <p className="font-medium">{formatCurrency(data.amount_paid)}</p>
          </div>
          <div>
            <p className="text-gray-600">OR Number</p>
            <p className="font-medium">{data.or_number}</p>
          </div>
          <div>
            <p className="text-gray-600">OR Date</p>
            <p className="font-medium">{data.or_date}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Contract Value</span>
            <span className="font-medium">
              {formatCurrency(data.total_contract_value)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Commission Rate</span>
            <span className="font-medium">
              {formatPercentage(data.commission_rate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Balance</span>
            <span className="font-medium">{formatCurrency(data.balance)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Commission Earned</span>
            <span className="font-medium">
              {formatCurrency(data.commission_earned)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BillingInformation
