'use server'

import BillingInformation from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/billing/[billingid]/billing-information'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Pencil } from 'lucide-react'
import Link from 'next/link'

const BillingStatementEditPage = async (props: {
  params: Promise<{ id: string; billingid: string }>
}) => {
  const params = await props.params
  const { id, billingid } = params

  return (
    <>
      <div className="mb-6 flex flex-row items-center justify-between">
        <Button variant="outline">
          <Link href={`/accounts/${id}/billing`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant={'default'}>
          <Link
            href={`/accounts/${id}/billing/${billingid}/edit`}
            className="flex flex-row items-center"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </Link>
        </Button>
      </div>

      <BillingInformation billingId={billingid} />
    </>
  )
}

export default BillingStatementEditPage
