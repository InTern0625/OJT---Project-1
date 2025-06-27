import { formatCurrency } from '@/app/(dashboard)/(home)/accounts-ifp/columns/accounts-columns'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Tables } from '@/types/database.types'
import { Row, Table } from '@tanstack/react-table'
import { Edit, Eye } from 'lucide-react'
import Link from 'next/link'

const BillingItem = ({
  commission,
  row,
}: {
  commission: Tables<'billing_statements'>
  row: Row<Tables<'billing_statements'>>
}) => {
  return (
    <Card key={commission.id} className="overflow-hidden">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label={`Select commission ${commission.or_number}`}
            />
            <div>
              <h3 className="mb-1 text-lg font-semibold text-gray-900">
                OR Number: {commission.or_number}
              </h3>
              <p className="text-sm text-gray-500">
                SA Number: {commission.sa_number}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Amount Billed:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(commission.amount_billed)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Commission Earned:</span>
            <span className="font-medium text-green-600">
              {formatCurrency(commission.commission_earned)}
            </span>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" size="sm">
            <Link
              href={`/accounts-ifp/${commission.account_id}/billing/${commission.id}`}
            >
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            <Link
              href={`/accounts-ifp/${commission.account_id}/billing/${commission.id}/edit`}
            >
              <Edit className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const BillingMobileTable = ({ table }: { table: Table<any> }) => {
  return (
    <div className="space-y-4 lg:hidden">
      {table.getRowModel().rows?.length &&
        table
          .getRowModel()
          .rows.map((row) => (
            <BillingItem key={row.id} commission={row.original} row={row} />
          ))}
    </div>
  )
}
export default BillingMobileTable
