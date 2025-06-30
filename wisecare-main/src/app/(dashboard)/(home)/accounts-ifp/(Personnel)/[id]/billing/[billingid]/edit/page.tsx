import EditBillingForm from '@/app/(dashboard)/(home)/accounts-ifp/(Personnel)/[id]/billing/[billingid]/edit/edit-billing-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
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
          <Link href={`/accounts-ifp/${id}/billing`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Billing Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <EditBillingForm billingid={billingid} />
        </CardContent>
      </Card>
    </>
  )
}

export default BillingStatementEditPage
